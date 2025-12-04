const db = require("../config/dbMySQL");

const getResidentByCCCD = async (userID) => {
  const sql = `
      SELECT
          cd.id_cd AS id_cd,
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
          hk.address AS 'Địa chỉ',
          
          COALESCE(
              ttt._type,       -- Lấy giá trị _type từ tam_thuong_tru nếu hk.id_tt khác NULL
              'Thường trú'     -- Nếu hk.id_tt là NULL, mặc định là 'Thường trú'
          ) AS 'Trạng thái cư trú',
          
          hk.id_ho_khau AS 'Số hộ khẩu'
      FROM
          cong_dan cd
      JOIN
          accounts acc ON cd.cccd COLLATE utf8mb4_0900_ai_ci = acc.userID
      JOIN
          nhan_khau nk ON cd.id_cd COLLATE utf8mb4_0900_ai_ci = nk.id_cd
      JOIN 
          ho_khau hk ON nk.id_ho_khau COLLATE utf8mb4_0900_ai_ci = hk.id_ho_khau
      
      -- LEFT JOIN với bảng tam_thuong_tru
      -- Chỉ JOIN khi id_tt trong ho_khau có giá trị (khác NULL)
      LEFT JOIN
          tam_thuong_tru ttt ON hk.id_tt = ttt.id_tt
      
      WHERE acc.userID = ?`; // Sử dụng parameterized query để tránh SQL Injection
  try {
    const [rows] = await db.execute(sql, [userID]);
    // console.log("Đối tượng Resident được tạo thành công");
    return rows.length > 0 ? rows[0] : null;
  } catch (error) {
    console.error("Error executing query:", error);
    throw error; // Ném lỗi để controller xử lý
  }
};

const getHousehold = async (userID) => {
  const sql = `
        SELECT
            cd_all.ho_ten AS 'Họ tên',
            cd_all.gioi_tinh AS 'Giới tính',
            cd_all.ngay_sinh AS 'Ngày sinh',
            cd_all.cccd AS CCCD,
            cd_all.nghe_nghiep AS 'Nghề nghiệp',
            nk_all.quan_he_voi_chu_ho AS 'Quan hệ với chủ hộ',
            nk_all.id_ho_khau AS 'Số hộ khẩu',
            hk.address AS 'Địa chỉ',
            
            -- Bổ sung Trạng thái cư trú cho các thành viên trong hộ --
            COALESCE(
                ttt._type,
                'Thường trú'
            ) AS 'Trạng thái cư trú'
            
        FROM
            nhan_khau nk_all
        JOIN
            cong_dan cd_all ON nk_all.id_cd COLLATE utf8mb4_0900_ai_ci = cd_all.id_cd 
        JOIN 
            ho_khau hk ON nk_all.id_ho_khau COLLATE utf8mb4_0900_ai_ci = hk.id_ho_khau 
            
        LEFT JOIN
            tam_thuong_tru ttt ON hk.id_tt = ttt.id_tt 

        WHERE 
            nk_all.id_ho_khau = (
                SELECT 
                    nk_current.id_ho_khau 
                FROM 
                    accounts acc
                JOIN
                    cong_dan cd_current ON acc.userID COLLATE utf8mb4_0900_ai_ci = cd_current.userID 
                JOIN
                    nhan_khau nk_current ON cd_current.id_cd COLLATE utf8mb4_0900_ai_ci = nk_current.id_cd 
                WHERE 
                    acc.userID = ?
            )`;
  try {
    const [rows] = await db.execute(sql, [userID]);
    return rows.length > 0 ? rows : [];
  } catch (error) {
    console.error("Error executing query:", error);
    throw error;
  }
};
module.exports = {
  getResidentByCCCD,
  getHousehold,
};
