const db = require("../config/dbMySQL");

const getCurrentTempExpiryByHousehold = async (id_ho_khau) => {
  const sql = `
    SELECT MAX(ddk.end) AS temp_expiry
    FROM don_dang_ky ddk
    WHERE 
      ddk.id_ho_khau = ?
      AND ddk._type = 'Tạm trú'
      AND ddk.state = 'Đã duyệt'
      AND ddk.end IS NOT NULL
  `;
  try {
    const [rows] = await db.execute(sql, [id_ho_khau]);
    return rows[0]?.temp_expiry || null;
  } catch (error) {
    throw error;
  }
};

const getParentInfoForEntry = async (parentUserID) => {
  const get_parent_info_sql = `
        SELECT 
            cd.id_cd,
            nk.id_ho_khau,
            hk.address
        FROM 
            accounts acc
        JOIN
            cong_dan cd ON acc.userID COLLATE utf8mb4_0900_ai_ci = cd.cccd 
        JOIN
            nhan_khau nk ON cd.id_cd COLLATE utf8mb4_0900_ai_ci = nk.id_cd
        JOIN
            ho_khau hk ON nk.id_ho_khau COLLATE utf8mb4_0900_ai_ci = hk.id_ho_khau
        WHERE 
            acc.userID = ?`;
  try {
    const [rows] = await db.execute(get_parent_info_sql, [parentUserID]);
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    throw error;
  }
};

const registerChildEntry = async (parentInfo, childData) => {
  let connection;
  try {
    connection = await db.getConnection();
    await connection.beginTransaction();

    const isTamTru = childData.loai_dang_ky === "Tạm trú";

    const sqlInsertCD = `
            INSERT INTO cong_dan 
            (ho_ten, bi_danh, gioi_tinh, ngay_sinh, noi_sinh, que_quan, dan_toc, nghe_nghiep, noi_lam_viec, cccd, ngay_cap, noi_cap, userID)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, NULL, NULL, NULL, NULL)`;

    const [childResult] = await connection.execute(sqlInsertCD, [
      childData.ho_ten,
      childData.bi_danh || null,
      childData.gioi_tinh,
      childData.ngay_sinh,
      childData.noi_sinh,
      childData.nguyen_quan,
      childData.dan_toc,
      childData.nghe_nghiep || null,
      childData.noi_lam_viec || null,
    ]);
    const childIdCd = childResult.insertId;

    let dateBegin, dateEnd;

    if (isTamTru) {
      dateBegin = childData.begin_date;
      dateEnd = childData.end_date;
    } else {
      dateBegin = "NOW()";
      dateEnd = null;
    }

    let sqlInsertDon = `
            INSERT INTO don_dang_ky 
            (_type, address, state, date_time, begin, end, id_cd, id_ho_khau, ngay_duyet, ly_do_tu_choi)
            VALUES (?, ?, ?, NOW(), ${dateBegin === "NOW()" ? "NOW()" : "?"
      }, ?, ?, ?, NULL, NULL)`;

    const params = [
      childData.loai_dang_ky || "Thường trú",
      parentInfo.address,
      "Chưa duyệt",
      dateBegin !== "NOW()" ? dateBegin : undefined,
      dateEnd,
      childIdCd,
      parentInfo.id_ho_khau,
    ].filter((p) => p !== undefined);

    const [donResult] = await connection.execute(sqlInsertDon, params);

    const idDk = donResult.insertId;

    const sqlInsertChiTiet = `
            INSERT INTO chi_tiet_don 
            (id_dk, id_cd, quan_he_voi_chu_ho, thuong_tru_truoc_day)
            VALUES (?, ?, ?, ?)`;

    await connection.execute(sqlInsertChiTiet, [
      idDk,
      childIdCd,
      childData.quan_he_voi_chu_ho,
      childData.thuong_tru_truoc_day || null,
    ]);

    await connection.commit();
    return { success: true, idDk: idDk, childIdCd: childIdCd };
  } catch (error) {
    if (connection) {
      await connection.rollback();
    }
    throw error;
  } finally {
    if (connection) {
      connection.release();
    }
  }
};

module.exports = {
  getParentInfoForEntry,
  getCurrentTempExpiryByHousehold,
  registerChildEntry,
};
