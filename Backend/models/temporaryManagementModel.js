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



module.exports = {
    getAllTemp
}