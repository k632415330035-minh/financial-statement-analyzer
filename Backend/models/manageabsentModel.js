const db = require('../config/dbMySQL');

const ManageAbsent = {
    // 1. Thống kê số liệu KPI (Tổng, Đang vắng, Hết hạn) dựa trên ngày hiện tại
    getStats: async () => {
        const [rows] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN CURDATE() BETWEEN thoi_gian_tam_vang_begin AND thoi_gian_tam_vang_end THEN 1 ELSE 0 END) as active,
        SUM(CASE WHEN thoi_gian_tam_vang_end < CURDATE() THEN 1 ELSE 0 END) as expired
      FROM tam_vang
    `);
        return rows[0];
    },

    // 2. Lấy danh sách kèm theo số ngày còn lại (daysLeft) tính bằng SQL
    getAll: async () => {
        const [rows] = await db.query(`
      SELECT 
        tv.*, 
        cd.ho_ten as name,
        GREATEST(0, DATEDIFF(tv.thoi_gian_tam_vang_end, CURDATE())) AS daysLeft
      FROM tam_vang tv 
      JOIN cong_dan cd ON tv.id_cd = cd.id_cd
      ORDER BY tv.date_time DESC
    `);
        return rows;
    }
};

module.exports = ManageAbsent;