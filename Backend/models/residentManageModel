const db = require('../config/dbMySQL');

const ResidentManage = {

    getStats: async () => {
        const [rows] = await db.query(`
      SELECT 
        COUNT(*) as total,
        SUM(CASE WHEN cd.gioi_tinh = 'Nam' THEN 1 ELSE 0 END) as male,
        SUM(CASE WHEN cd.gioi_tinh = 'Nữ' THEN 1 ELSE 0 END) as female,
        ROUND(AVG(YEAR(CURDATE()) - YEAR(cd.ngay_sinh))) as avgAge
      FROM cong_dan cd
      JOIN nhan_khau nk ON cd.id_cd = nk.id_cd
    `);
        return rows[0];
    },

    getAll: async () => {
        const [rows] = await db.query(`
      SELECT 
        cd.id_cd,              /* ID định danh để Edit/Delete */
        cd.ho_ten AS hoTen, 
        cd.bi_danh AS biDanh,
        cd.gioi_tinh AS gioiTinh,
        cd.noi_sinh AS noiSinh,
        cd.que_quan AS nguyenQuan, 
        cd.que_quan AS nguonQuan, 
        cd.dan_toc AS danToc,
        cd.cccd AS cccd,
        cd.noi_cap AS noiCapCCCD,
        cd.nghe_nghiep AS nghePhuong,
        cd.noi_lam_viec AS noiLamViec,
        hk._type AS trangThaiCuTru,
        nk.id_ho_khau AS soHK, 
        nk.quan_he_voi_chu_ho AS quanHe,
        nk.thuong_tru_truoc_day AS diaChiTruocDo,
        YEAR(cd.ngay_sinh) AS namSinh,

        /* Định dạng hiển thị trên bảng (DD/MM/YYYY) */
        DATE_FORMAT(cd.ngay_sinh, '%d/%m/%Y') AS ngaySinh,
        DATE_FORMAT(cd.ngay_cap, '%d/%m/%Y') AS ngayCapCCCD,
        DATE_FORMAT(nk.ngay_dang_ki_thuong_tru, '%d/%m/%Y') AS ngayDangKy,

        /* Định dạng RAW cho ô Input Date (YYYY-MM-DD) */
        DATE_FORMAT(cd.ngay_sinh, '%Y-%m-%d') AS ngaySinhRaw,
        DATE_FORMAT(cd.ngay_cap, '%Y-%m-%d') AS ngayCapRaw,
        DATE_FORMAT(nk.ngay_dang_ki_thuong_tru, '%Y-%m-%d') AS ngayDangKyRaw,

        /* Subquery lấy tên chủ hộ */
        (SELECT ho_ten FROM cong_dan cd2 
         JOIN nhan_khau nk2 ON cd2.id_cd = nk2.id_cd 
         WHERE nk2.id_ho_khau = nk.id_ho_khau AND nk2.quan_he_voi_chu_ho = 'Chủ hộ' LIMIT 1) AS chuHo
      FROM cong_dan cd
      JOIN nhan_khau nk ON cd.id_cd = nk.id_cd
      JOIN ho_khau hk ON nk.id_ho_khau = hk.id_ho_khau
    `);
        return rows;
    },

    update: async (id, data) => {
        const connection = await db.getConnection();
        try {
            await connection.beginTransaction();
            const ngayCap = (data.ngayCapCCCD && data.ngayCapCCCD !== '') ? data.ngayCapCCCD : null;
            const ngayDangKy = (data.ngayDangKy && data.ngayDangKy !== '') ? data.ngayDangKy : null;

            await connection.query(`
        UPDATE cong_dan SET 
          ho_ten = ?, bi_danh = ?, gioi_tinh = ?,ngay_sinh = STR_TO_DATE(CONCAT(?, '-', MONTH(ngay_sinh), '-', DAY(ngay_sinh)), '%Y-%m-%d'), cccd = ?, 
          noi_sinh = ?, que_quan = ?, dan_toc = ?, 
          nghe_nghiep = ?, noi_lam_viec = ?, noi_cap = ?, ngay_cap = ?
        WHERE id_cd = ?`,
                [data.hoTen, data.biDanh, data.gioiTinh, data.namSinh, data.cccd,
                data.noiSinh, data.nguyenQuan, data.danToc,
                data.nghePhuong, data.noiLamViec, data.noiCapCCCD, ngayCap, id]
            );
            if (ngayDangKy) {
                await connection.query(`
          UPDATE nhan_khau SET 
            ngay_dang_ki_thuong_tru = ?, thuong_tru_truoc_day = ?
          WHERE id_cd = ?`,
                    [ngayDangKy, data.diaChiTruocDo, id]
                );
            }

            await connection.commit();
            return true;
        } catch (error) {
            await connection.rollback();
            if (error.code === 'ER_TRUNCATED_WRONG_VALUE') {
                throw new Error("Năm sinh mới không hợp lệ với ngày sinh hiện tại (ví dụ: ngày 29/02 vào năm không nhuận)");
            }
            throw error;
        } finally {
            connection.release();
        }
    }
};

module.exports = ResidentManage;