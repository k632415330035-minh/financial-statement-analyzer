const db = require("../config/dbMySQL");

const getHistoryResTem = async (cccd) => {
  const sql = `
        SELECT 
            ddk.date_time,
            ddk.begin,
            ddk.end,
            ddk._type,
            ddk.state,
            ctd.thuong_tru_truoc_day,
            cd.ho_ten
        FROM 
            don_dang_ky ddk
        JOIN 
            chi_tiet_don ctd 
                ON ddk.id_dk = ctd.id_dk
        JOIN 
            cong_dan cd 
                ON ctd.id_cd = cd.id_cd
        WHERE 
            ddk.id_ho_khau = (
                SELECT 
                    nk_current.id_ho_khau
                FROM 
                    accounts acc
                JOIN 
                    cong_dan cd_current 
                        ON acc.userID = cd_current.cccd
                JOIN 
                    nhan_khau nk_current 
                        ON cd_current.id_cd = nk_current.id_cd
                WHERE 
                    acc.userID = ?
                LIMIT 1
            )
        ORDER BY 
            ddk.date_time DESC;`;
  try {
    const [rows] = await db.execute(sql, [cccd]);
    return rows.length > 0 ? rows : [];
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};

const getHistoryAbsent = async (cccd) => {
  const sql = `
        SELECT
            cd.ho_ten AS 'Họ tên',
            tv.li_do AS 'Lý do',
            tv.date_time,
            tv.thoi_gian_tam_vang_begin AS 'Ngày bắt đầu',
            tv.thoi_gian_tam_vang_end AS 'Ngày kết thúc'
        FROM
            tam_vang tv
        JOIN
            cong_dan cd ON tv.id_cd = cd.id_cd
        WHERE
            tv.id_cd IN (
                SELECT
                    nk_all.id_cd
                FROM
                    nhan_khau nk_all
                WHERE
                    nk_all.id_ho_khau = (
                        SELECT 
                            nk_current.id_ho_khau 
                        FROM 
                            cong_dan cd_current 
                        JOIN
                            nhan_khau nk_current ON cd_current.id_cd = nk_current.id_cd
                        JOIN 
                            accounts acc ON cd_current.cccd = acc.userID
                        WHERE 
                            acc.userID = ?
                )
              )
          ORDER BY
            'Ngày bắt đầu' DESC;`;

  try {
    const [rows] = await db.execute(sql, [cccd]);
    return rows.length > 0 ? rows : [];
  } catch (error) {
    console.error("Error executing query getHistoryAbsent:", error);
    throw error;
  }
};

const getHistoryMove = async (cccd) => {
  const sql = `
        SELECT
            cd.ho_ten,
            cd_i.ngay_chuyen,
            cd_i.ghi_chu
        FROM
            chuyen_di cd_i
        JOIN
            cong_dan cd ON cd_i.id_cd = cd.id_cd
        WHERE
            cd_i.old_id_hk = (
                SELECT
                    nk_current.id_ho_khau
                FROM
                    cong_dan cd_current
                JOIN
                    nhan_khau nk_current ON cd_current.id_cd = nk_current.id_cd
                JOIN
                    accounts acc ON cd_current.cccd = acc.userID
                WHERE
                    acc.userID = ?
                LIMIT 1 
            )
          ORDER BY
            cd_i.ngay_chuyen DESC;`;

  try {
    const [rows] = await db.execute(sql, [cccd]);
    return rows.length > 0 ? rows : [];
  } catch (error) {
    console.error("Error executing query getHistoryMove:", error);
    throw error;
  }
};

module.exports = {
  getHistoryResTem,
  getHistoryAbsent,
  getHistoryMove,
};
