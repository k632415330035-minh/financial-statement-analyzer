const db = require("../config/dbMySQL");
const getResidentStatus = async (userID) => {
  const sql = `
        SELECT 
            hk._type,
            hk.id_ho_khau,
            (SELECT end FROM don_dang_ky 
             WHERE id_ho_khau = hk.id_ho_khau AND state = 'Đã duyệt' AND _type = 'Tạm trú'
             ORDER BY end DESC LIMIT 1) as current_expiry,
            (SELECT COUNT(*) FROM don_dang_ky 
             WHERE id_ho_khau = hk.id_ho_khau AND state = 'Chưa duyệt') as pending_count
        FROM accounts acc
        JOIN cong_dan cd ON acc.userID = cd.cccd
        JOIN nhan_khau nk ON cd.id_cd = nk.id_cd
        JOIN ho_khau hk ON nk.id_ho_khau = hk.id_ho_khau
        WHERE acc.userID = ?;
    `;

  try {
    const [rows] = await db.execute(sql, [userID]);
    if (rows.length === 0) return null;

    const data = rows[0];
    if (data._type !== "Tạm trú") {
      return { isLocked: false, canExtension: false, message: "" };
    }

    const expiryDate = data.current_expiry
      ? new Date(data.current_expiry)
      : null;
    const today = new Date();
    let daysLeft = -999;
    if (expiryDate) {
      daysLeft = Math.ceil((expiryDate - today) / (1000 * 60 * 60 * 24));
    }

    let status = {
      canExtension: false,
      isLocked: false,
      message: "",
      daysLeft: daysLeft,
      pending: data.pending_count > 0,
      currentExpiry: data.current_expiry,
    };

    if (status.pending) {
      status.message = "Bạn đã gia hạn, hãy chờ được duyệt";
      if (daysLeft <= 0) status.isLocked = true;
    } else if (daysLeft <= 0) {
      status.canExtension = true;
      status.isLocked = true;
      status.message = "Hãy gia hạn để sử dụng chức năng";
    } else if (daysLeft <= 15) {
      status.canExtension = true;
      status.message = `Còn ${daysLeft} ngày đến hạn tạm trú`;
    }

    return status;
  } catch (error) {
    throw error;
  }
};
const createExtensionRequest = async (userID, newEndDate) => {
  const connection = await db.getConnection();
  await connection.beginTransaction();

  try {
    // 1. Lấy thông tin từ đơn 'Đã duyệt' gần nhất
    const [latestApproved] = await connection.execute(
      `
            SELECT dk.id_dk, dk.address, dk.id_ho_khau, dk.end as old_end, cd.id_cd as sender_id
            FROM accounts acc
            JOIN cong_dan cd ON acc.userID = cd.cccd
            JOIN nhan_khau nk ON cd.id_cd = nk.id_cd
            JOIN don_dang_ky dk ON nk.id_ho_khau = dk.id_ho_khau
            WHERE acc.userID = ? AND dk.state = 'Đã duyệt' AND dk._type = 'Tạm trú'
            ORDER BY dk.end DESC LIMIT 1
        `,
      [userID]
    );

    if (latestApproved.length === 0)
      throw new Error("Không tìm thấy đơn đã duyệt cũ");
    const {
      id_dk: oldIdDk,
      address,
      id_ho_khau,
      old_end,
      sender_id,
    } = latestApproved[0];

    // 2. Tạo đơn mới vào don_dang_ky
    const [resDK] = await connection.execute(
      `
            INSERT INTO don_dang_ky 
            (date_time, begin, end, _type, address, state, id_cd, id_ho_khau)
            VALUES (NOW(), ?, ?, 'Tạm trú', ?, 'Chưa duyệt', ?, ?)
        `,
      [old_end, newEndDate, address, sender_id, id_ho_khau]
    );

    const newIDDK = resDK.insertId;

    // 3. Sao chép danh sách thành viên từ chi_tiet_don của đơn cũ sang đơn mới
    await connection.execute(
      `
            INSERT INTO chi_tiet_don (id_dk, id_cd, quan_he_voi_chu_ho, thuong_tru_truoc_day)
            SELECT ?, id_cd, quan_he_voi_chu_ho, thuong_tru_truoc_day
            FROM chi_tiet_don
            WHERE id_dk = ?
        `,
      [newIDDK, oldIdDk]
    );

    await connection.commit();
    return { success: true };
  } catch (error) {
    await connection.rollback();
    throw error;
  } finally {
    connection.release();
  }
};
module.exports = {
  getResidentStatus,
  createExtensionRequest,
};
