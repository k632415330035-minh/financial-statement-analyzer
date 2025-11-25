const db = require("../config/dbMySQL");

const getResidentByCCCD = async (userID) => {
  const sql = `
    SELECT
        nk.ho_ten AS 'Họ tên',
        nk.bi_danh AS 'Bí danh',
        nk.gioi_tinh AS 'Giới tính',
        nk.ngay_sinh AS 'Ngày sinh',
        nk.noi_sinh AS 'Nơi sinh',
        nk.que_quan AS 'Nguyên quán',
        nk.dan_toc AS 'Dân tộc',
        nk.ngay_dang_ki_thuong_tru AS 'Ngày đăng ký thường trú',
        nk.thuong_tru_truoc_day AS 'Địa chỉ thường trú trước khi chuyển đến',
        nk.cccd AS CCCD,
        nk.ngay_cap AS 'Ngày cấp CCCD',
        nk.noi_cap AS 'Nơi cấp',
        nk.nghe_nghiep AS 'Nghề nghiệp',
        nk.noi_lam_viec AS 'Nơi làm việc',
        nk.quan_he_voi_chu_ho AS 'Quan hệ với chủ hộ',
        hk.address AS 'Địa chỉ'
    FROM
        nhan_khau nk
    JOIN
        accounts acc ON nk.cccd COLLATE utf8mb4_unicode_ci = acc.userID
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
      nk_all.ho_ten AS 'Họ tên',
      nk_all.gioi_tinh AS 'Giới tính',
      nk_all.ngay_sinh AS 'Ngày sinh',
      nk_all.cccd AS CCCD,
      nk_all.nghe_nghiep AS 'Nghề nghiệp',
      nk_all.quan_he_voi_chu_ho AS 'Quan hệ với chủ hộ',
      nk_all.id_ho_khau AS 'Số hộ khẩu',
      hk.address AS 'Địa chỉ'
    FROM
      nhan_khau nk_all 
    JOIN 
      ho_khau hk ON nk_all.id_ho_khau COLLATE utf8mb4_unicode_ci = hk.id_ho_khau
    WHERE 
      nk_all.id_ho_khau = (
          SELECT 
              nk_current.id_ho_khau 
          FROM 
              nhan_khau nk_current
          JOIN
              accounts acc ON nk_current.cccd COLLATE utf8mb4_unicode_ci = acc.userID
          WHERE 
              acc.userID = ?
        )`;
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
