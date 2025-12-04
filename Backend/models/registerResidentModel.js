const db = require("../config/dbMySQL");

// Đăng ký thường trú cho con
// Lấy thông tin của cha mẹ từ tài khoản đã đăng nhập
const getParentInfo = async (parentUserID) => {
  const get_parent_info_sql = `
        SELECT 
            nk.id_ho_khau AS 'Số hộ khẩu'
        FROM 
            accounts acc
        JOIN
            cong_dan cd ON acc.userID COLLATE utf8mb4_0900_ai_ci = cd.userID
        JOIN
            nhan_khau nk ON cd.id_cd COLLATE utf8mb4_0900_ai_ci = nk.id_cd
        WHERE 
            acc.userID = ?`;
  try {
    const [rows] = await db.execute(get_parent_info_sql, [parentUserID]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Lỗi khi thực hiện truy vấn lấy thông tin cha/mẹ:", error);
    throw error;
  }
};

// Điền thông tin đăng ký thường trú vào cho con
const registerNewBornResident = async (parent_id_ho_khau, childData) => {
  let connection;
  try {
    // 1. Bắt đầu kết nối và giao dịch
    connection = await db.getConnection();
    await connection.beginTransaction();

    // --- B. CHÈN VÀO BẢNG CONG_DAN ---
    const cd_insert_sql = `
            INSERT INTO cong_dan (
                cccd, ho_ten, bi_danh, gioi_tinh, ngay_sinh, noi_sinh, 
                que_quan, dan_toc, nghe_nghiep, noi_lam_viec, noi_cap, ngay_cap, userID
            )
            VALUES (
                "Mới sinh", ?, ?, ?, ?, ?, ?, 
                ?, 'Mới sinh', 'Mới sinh', 'Mới sinh', NULL, NULL
            )`;

    const [cd_result] = await connection.execute(cd_insert_sql, [
      childData.ho_ten,
      childData.bi_danh || null,
      childData.gioi_tinh,
      childData.ngay_sinh,
      childData.noi_sinh,
      childData.que_quan,
      childData.dan_toc,
    ]);

    const new_id_cd = cd_result.insertId; // Lấy ID_CD vừa chèn

    // --- C. CHÈN VÀO BẢNG NHAN_KHAU ---
    const nk_insert_sql = `
            INSERT INTO nhan_khau (
                id_cd, id_ho_khau, quan_he_voi_chu_ho, ngay_dang_ki_thuong_tru, thuong_tru_truoc_day
            )
            VALUES (
                ?, ?, 'Con ruột', CURDATE(), 'Mới sinh'
            )`;

    // Ghi id_cd và id_ho_khau vào nhan_khau
    await connection.execute(nk_insert_sql, [new_id_cd, parent_id_ho_khau]);

    // 4. Commit giao dịch nếu không có lỗi xảy ra
    await connection.commit();

    return {
      success: true,
      message: "Đăng ký thường trú cho trẻ mới sinh thành công.",
      id_cong_dan: new_id_cd,
    };
  } catch (error) {
    // 5. Rollback giao dịch nếu có lỗi
    if (connection) {
      await connection.rollback();
    }
    console.error("Lỗi khi thực hiện giao dịch đăng ký trẻ mới sinh:", error);
    throw error; // Ném lỗi để Controller xử lý
  } finally {
    // 6. Luôn giải phóng kết nối
    if (connection) {
      connection.release();
    }
  }
};

module.exports = {
  getParentInfo,
  registerNewBornResident,
};
