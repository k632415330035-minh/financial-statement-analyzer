const db = require("../config/dbMySQL");

const getAllTemp = async () => {
    try {
        const [rows] = await db.query(
            "SELECT * FROM don_dang_ky ddk join cong_dan cd on ddk.id_cd = cd.id_cd ORDER BY date_time DESC"
        );
        return rows;
    } catch (error) {
        console.log("Error MODEL executing query getAllTemp");
        throw (error);
    }
}

const getTempDetail = async (id) => {
    try {
        const [rows] = await db.query(
            `SELECT ddk.id_dk, cd.ho_ten, ctd.quan_he_voi_chu_ho, ctd.id_cd, cd.cccd, YEAR(cd.ngay_sinh) AS nam_sinh, cd.gioi_tinh
            FROM chi_tiet_don ctd
            JOIN don_dang_ky ddk ON ddk.id_dk = ctd.id_dk
            JOIN cong_dan cd ON ctd.id_cd = cd.id_cd WHERE ddk.id_dk = 1;`,
            [id]
        );
        return rows;
    } catch (error) {
        console.log("Error MODEL executing query getTempDetail");
        throw (error);
    }
}



module.exports = {
    getAllTemp,
    getTempDetail
}