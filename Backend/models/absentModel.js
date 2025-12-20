const db = require("../config/dbMySQL");

const insertNewAbsent = async (
  li_do,
  thoi_gian_tam_vang_begin,
  thoi_gian_tam_vang_end,
  cccd
) => {
  const sql = `
      INSERT INTO tam_vang (
          date_time,
          li_do,
          thoi_gian_tam_vang_begin,
          thoi_gian_tam_vang_end,
          id_cd
      )
      VALUES (
          NOW(), ?, ?, ?, 
          (
              SELECT 
                  cd.id_cd
              FROM 
                  cong_dan cd
              JOIN
                  accounts acc ON cd.cccd COLLATE utf8mb4_0900_ai_ci = acc.userID 
              WHERE
                  acc.userID = ? 
          )
      );`.trim();
  try {
    const [rows] = await db.execute(sql, [
      li_do,
      thoi_gian_tam_vang_begin,
      thoi_gian_tam_vang_end,
      cccd,
    ]);
    return rows;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

const getAbsent = async (cccd) => {
  const sql = `
    SELECT 
        tv.li_do,
        tv.thoi_gian_tam_vang_begin,
        tv.thoi_gian_tam_vang_end 
    FROM 
      tam_vang tv
    JOIN 
      cong_dan cd ON cd.id_cd COLLATE utf8mb4_0900_ai_ci = tv.id_cd
    JOIN 
      accounts acc ON acc.userID COLLATE utf8mb4_0900_ai_ci = cd.cccd
    WHERE 
      acc.userID = ?`;
  try {
    const [rows] = await db.execute(sql, [cccd]);
    return rows.length > 0 ? rows : [];
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Ném lỗi để controller xử lý
  }
};

module.exports = {
  insertNewAbsent,
  getAbsent,
};
