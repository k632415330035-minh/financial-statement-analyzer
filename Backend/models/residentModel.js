const db = require("../config/dbMySQL");

const getResidentByCCCD = async (userID) => {
  const sql = `
    SELECT
        cd.ho_ten AS 'Họ tên',
        cd.bi_danh AS 'Bí danh',
        cd.gioi_tinh AS 'Giới tính',
        cd.ngay_sinh AS 'Ngày sinh',
        cd.noi_sinh AS 'Nơi sinh',
        cd.que_quan AS 'Nguyên quán',
        cd.dan_toc AS 'Dân tộc',
        nk.ngay_dang_ki_thuong_tru AS 'Ngày đăng ký thường trú',
        nk.thuong_tru_truoc_day AS 'Địa chỉ thường trú trước khi chuyển đến',
        cd.cccd AS CCCD,
        cd.ngay_cap AS 'Ngày cấp CCCD',
        cd.noi_cap AS 'Nơi cấp',
        cd.nghe_nghiep AS 'Nghề nghiệp',
        cd.noi_lam_viec AS 'Nơi làm việc',
        nk.quan_he_voi_chu_ho AS 'Quan hệ với chủ hộ',
        hk.address AS 'Địa chỉ'
    FROM
		nhan_khau nk 
	JOIN
		cong_dan cd ON cd.cccd COLLATE utf8mb4_unicode_ci = nk.cccd
    JOIN
        accounts acc ON cd.userID COLLATE utf8mb4_unicode_ci = acc.userID
    JOIN 
        ho_khau hk ON nk.id_ho_khau COLLATE utf8mb4_unicode_ci = hk.id_ho_khau
    WHERE acc.userID = ?`; // Sử dụng parameterized query để tránh SQL Injection

  try {
    const [rows] = await db.execute(sql, [userID]);
    console.log("Đối tượng Resident được tạo thành công");
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Ném lỗi để controller xử lý
  }
};

const getHousehold = async (userID) => {
  const sql = `
    SELECT
      cda.ho_ten AS 'Họ tên',
      cda.gioi_tinh AS 'Giới tính',
      cda.ngay_sinh AS 'Ngày sinh',
      nka.cccd AS CCCD,
      cda.nghe_nghiep AS 'Nghề nghiệp',
      nka.quan_he_voi_chu_ho AS 'Quan hệ với chủ hộ',
      nka.id_ho_khau AS 'Số hộ khẩu',
      hk.address AS 'Địa chỉ'
FROM
	(SELECT * FROM nhan_khau nkb
      WHERE id_ho_khau COLLATE utf8mb4_unicode_ci = 
      (
      SELECT nk.id_ho_khau 
      FROM 
      nhan_khau nk
      JOIN 
      cong_dan cd ON nk.cccd COLLATE utf8mb4_unicode_ci = cd.cccd WHERE cd.userID = ?
      )
  ) nka
JOIN
  cong_dan cda ON cda.cccd COLLATE utf8mb4_unicode_ci = nka.cccd
JOIN
  ho_khau hk ON hk.id_ho_khau COLLATE utf8mb4_unicode_ci = nka.id_ho_khau; `;
  try {
    const [rows] = await db.execute(sql, [userID]);
    return rows.length > 0 ? rows : [];
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Ném lỗi để controller xử lý
  }
};
module.exports = {
  getResidentByCCCD,
  getHousehold,
};
