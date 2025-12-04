const db = require("../config/dbMySQL");

const getPetitionInfo = async (cccd) => {
  const sql = `
        SELECT 
            pa.id_pa AS 'Mã phản ánh',
            pa.date_time AS 'Thời gian gửi phản ánh',
            pa.loai_phan_anh AS 'Loại phản ánh',
            pa.noi_dung AS 'Nội dung phản ánh',
            pa.trang_thai AS 'Trạng thái',
            pa.phan_hoi AS 'Phản hồi'
        FROM 
            phan_anh pa
        JOIN 
            cong_dan cd ON pa.id_cd COLLATE utf8mb4_0900_ai_ci = cd.id_cd 
        JOIN 
            accounts acc ON acc.userID COLLATE utf8mb4_0900_ai_ci = cd.cccd
        WHERE 
            acc.userID = ?`;
  try {
    const [rows] = await db.execute(sql, [cccd]);
    return rows.length > 0 ? rows : [];
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

const insertNewPetition = async (loaiPhanAnh, noiDung, id_cd) => {
  const sql = `
        INSERT INTO phan_anh (
            date_time, loai_phan_anh, noi_dung, trang_thai, phan_hoi, id_cd
        )
        VALUES(
            NOW(), ?, ?, 'Đang xử lý', NULL, ? 
        )`;
  const values = [loaiPhanAnh, noiDung, id_cd];
  try {
    const [rows] = await db.execute(sql, values);
    return rows;
  } catch (error) {
    console.error("Error executing insert query:", error);
    throw error;
  }
};

module.exports = {
  getPetitionInfo,
  insertNewPetition,
};
