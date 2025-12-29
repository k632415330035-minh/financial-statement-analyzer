const db = require("../config/dbMySQL");

const statisticModel = {
  // 1. Lấy tổng quan số liệu hiện tại (Current Status)
  getOverview: async () => {
    try {
      // 1. Tổng số hộ khẩu trong hệ thống (bao gồm cả Thường trú và Tạm trú)
      const [hk] = await db.query("SELECT COUNT(*) AS total FROM ho_khau");

      // 2. Tổng số nhân khẩu đã đăng ký trong các hộ khẩu
      const [nk] = await db.query("SELECT COUNT(*) AS total FROM nhan_khau");

      // 3. Đếm những người đang trong hạn tạm trú (Đã duyệt và chưa hết hạn)
      const [tt] = await db.query(`
      SELECT COUNT(*) AS total 
      FROM nhan_khau nk 
      JOIN ho_khau hk ON nk.id_ho_khau = hk.id_ho_khau 
      WHERE hk._type = 'Tạm trú'
    `);

      // 4. Đếm số lượng nhân khẩu Thường trú (Dựa trên liên kết bảng nhan_khau và ho_khau)
      const [tht] = await db.query(
        "SELECT COUNT(*) AS total FROM nhan_khau nk JOIN ho_khau hk ON nk.id_ho_khau = hk.id_ho_khau WHERE hk._type = 'Thường trú'"
      );

      // 5. Tổng số người đang khai báo tạm vắng
      const [tv] = await db.query(`
        SELECT COUNT(DISTINCT id_cd) AS total 
      FROM tam_vang 
      WHERE CURDATE()
      BETWEEN thoi_gian_tam_vang_begin AND thoi_gian_tam_vang_end`);

      return {
        hokhau: hk[0]?.total || 0,
        nhankhau: nk[0]?.total || 0,
        tamtru: tt[0]?.total || 0,
        tamvang: tv[0]?.total || 0,
        thuongtru: tht[0]?.total || 0, // Kết quả từ biến tht
      };
    } catch (error) {
      console.error("Lỗi Model getOverview:", error);
      throw error;
    }
  },

  // 2. Thống kê giới tính
  getResidentStatsByGender: async () => {
    try {
      const query = `
        SELECT c.gioi_tinh, COUNT(*) AS count 
        FROM cong_dan c
        JOIN nhan_khau n ON c.id_cd = n.id_cd
        GROUP BY c.gioi_tinh`;
      const [rows] = await db.query(query);

      let male = 0, female = 0;
      rows.forEach(row => {
        if (row.gioi_tinh === 'Nam') male = row.count;
        else if (row.gioi_tinh === 'Nữ') female = row.count;
      });

      return { male, female, total: male + female };
    } catch (error) { throw error; }
  },

  // 3. Thống kê nhóm tuổi
  getResidentStatsByAge: async () => {
    try {
      const query = `
        SELECT 
            CASE 
                WHEN tuoi <= 2 THEN 'mamNon'
                WHEN tuoi BETWEEN 3 AND 5 THEN 'mauGiao'
                WHEN tuoi BETWEEN 6 AND 10 THEN 'cap1'
                WHEN tuoi BETWEEN 11 AND 14 THEN 'cap2'
                WHEN tuoi BETWEEN 15 AND 17 THEN 'cap3'
                WHEN tuoi BETWEEN 18 AND 59 THEN 'laoDong'
                ELSE 'nghiHuu'
            END AS nhom_tuoi,
            COUNT(*) AS so_luong
        FROM (
            SELECT TIMESTAMPDIFF(YEAR, c.ngay_sinh, CURDATE()) AS tuoi
            FROM cong_dan c
            JOIN nhan_khau n ON c.id_cd = n.id_cd
        ) AS subquery
        GROUP BY nhom_tuoi`;

      const [rows] = await db.query(query);
      const stats = { mamNon: 0, mauGiao: 0, cap1: 0, cap2: 0, cap3: 0, laoDong: 0, nghiHuu: 0 };

      rows.forEach(row => {
        if (row.nhom_tuoi) stats[row.nhom_tuoi] = row.so_luong;
      });
      return stats;
    } catch (error) { throw error; }
  },

  // 4. Biểu đồ xu hướng hàng tháng (Tính toán dân số thực tế qua từng tháng)
  getMonthlyTrend: async (year) => {
    try {
      const targetYear = year || 2025;
      const query = `
    SELECT 
        months.m AS month,
        
        -- Thường trú = (Người đang ở hiện tại) + (Người đã chuyển đi SAU tháng m)
        ((SELECT COUNT(*) FROM nhan_khau nk
          JOIN ho_khau hk ON nk.id_ho_khau = hk.id_ho_khau
          WHERE hk._type = 'Thường trú' 
          AND nk.ngay_dang_ki_thuong_tru <= LAST_DAY(CONCAT(?, '-', months.m, '-01'))) +
         (SELECT COUNT(*) FROM chuyen_di 
          WHERE ngay_chuyen > LAST_DAY(CONCAT(?, '-', months.m, '-01')))) AS count_thuong_tru,

        -- Tạm trú (Giữ nguyên logic đếm người thực tế trong nhan_khau)
        (SELECT COUNT(*) FROM nhan_khau nk
         JOIN ho_khau hk ON nk.id_ho_khau = hk.id_ho_khau
         WHERE hk._type = 'Tạm trú' 
         AND nk.ngay_dang_ki_thuong_tru <= LAST_DAY(CONCAT(?, '-', months.m, '-01'))) AS count_tam_tru,

        -- Tạm vắng (Giữ nguyên)
        (SELECT COUNT(*) FROM tam_vang 
         WHERE thoi_gian_tam_vang_begin <= LAST_DAY(CONCAT(?, '-', months.m, '-01')) 
         AND (thoi_gian_tam_vang_end >= CONCAT(?, '-', months.m, '-01') OR thoi_gian_tam_vang_end IS NULL)) AS count_tam_vang
    FROM 
        (SELECT 1 AS m UNION SELECT 2 UNION SELECT 3 UNION SELECT 4 UNION SELECT 5 UNION SELECT 6 
         UNION SELECT 7 UNION SELECT 8 UNION SELECT 9 UNION SELECT 10 UNION SELECT 11 UNION SELECT 12) AS months`;

      const params = [targetYear, targetYear, targetYear, targetYear, targetYear];
      const [rows] = await db.query(query, params);

      return rows.map(row => ({
        month: row.month,
        count_thuong_tru: row.count_thuong_tru || 0,
        count_tam_tru: row.count_tam_tru || 0,
        count_tam_vang: row.count_tam_vang || 0,
        count: (row.count_thuong_tru || 0) + (row.count_tam_tru || 0) - (row.count_tam_vang || 0)
      }));
    } catch (error) {
      throw error;
    }
  },

  // 5. Thống kê biến động (Lưu lượng hồ sơ mới trong kỳ)
  getMovementStats: async (startDate, endDate) => {
    try {
      const today = new Date();
      const formatDate = (d) => {
        const date = new Date(d);
        return date.getFullYear() + '-' +
          String(date.getMonth() + 1).padStart(2, '0') + '-' +
          String(date.getDate()).padStart(2, '0');
      };

      const finalStart = startDate ? formatDate(startDate) : formatDate(new Date(today.getFullYear(), today.getMonth(), today.getDate() - 29));
      const finalEnd = endDate ? formatDate(endDate) : formatDate(today);

      /**
       * LOGIC CHUẨN: Để tính % và Tổng trong một giai đoạn, ta chỉ đếm các hồ sơ
       * có NGÀY BẮT ĐẦU nằm trong khoảng [startDate, endDate].
       */

      // 1. Tạm trú Đếm những người bắt đầu tạm trú trong kỳ
      const [tt] = await db.query(
        "SELECT COUNT(*) AS count FROM don_dang_ky WHERE _type = 'Tạm trú' AND state = 'Đã duyệt' AND `begin` BETWEEN ? AND ?",
        [finalStart, finalEnd]
      );

      // 2. Tạm vắng Đếm những người bắt đầu tạm vắng trong kỳ
      const [tv] = await db.query(
        "SELECT COUNT(*) AS count FROM tam_vang WHERE thoi_gian_tam_vang_begin BETWEEN ? AND ?",
        [finalStart, finalEnd]
      );

      // 3. Chuyển đi: Đếm những người cắt khẩu trong kỳ
      const [cd] = await db.query(
        "SELECT COUNT(*) AS count FROM chuyen_di WHERE ngay_chuyen BETWEEN ? AND ?",
        [finalStart, finalEnd]
      );

      return {
        tamTru: tt[0]?.count || 0,
        tamVang: tv[0]?.count || 0,
        chuyenDi: cd[0]?.count || 0,
        period: {
          from: finalStart,
          to: finalEnd
        }
      };
    } catch (error) {
      console.error("Lỗi getMovementStats Backend:", error);
      throw error;
    }
  }
};

module.exports = statisticModel;