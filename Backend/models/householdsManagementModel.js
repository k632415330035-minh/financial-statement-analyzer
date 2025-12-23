const db = require("../config/dbMySQL");

// Hàm lấy thông tin tất cả các hộ khẩu
const getAllHouseholds = async () => {
    const sql = `SELECT hk.id_ho_khau, cd.ho_ten, hk.address, 
    (SELECT COUNT(*) FROM nhan_khau nkx WHERE nkx.id_ho_khau = nk.id_ho_khau)  AS SL
    FROM cong_dan cd 
    JOIN nhan_khau nk ON cd.id_cd = nk.id_cd 
    JOIN ho_khau hk ON nk.id_ho_khau = hk.id_ho_khau
    WHERE nk.quan_he_voi_chu_ho = 'Chủ hộ' ORDER BY hk.id_ho_khau ASC`;
    try {
        const [rows, fields] = await db.query(sql);
        return rows;
    } catch (error) {
        console.log("Error executing query getAllHouseholds:", error);
    }
}

const getHouseholdMembers = async (householdId) => {
    const sql =
        `SELECT nk.id_cd, cd.ho_ten, YEAR(ngay_sinh) AS nam_sinh, cd.gioi_tinh, nk.quan_he_voi_chu_ho, cd.cccd
        FROM nhan_khau nk
        JOIN cong_dan cd
        ON nk.id_cd = cd.id_cd
        WHERE nk.id_ho_khau = ? ORDER BY FIELD(nk.quan_he_voi_chu_ho,'Mẹ','Bố', 'Vợ', 'Chồng', 'Chủ hộ') DESC`;
    try {
        const [rows, fields] = await db.execute(sql, [householdId]);
        return rows;
    } catch (error) {
        console.log("Error executing query getHouseholdMembers:", error);
    }
}

const deleteHouseholdMember = async (id_cd) => {
    const sql = `DELETE FROM nhan_khau WHERE id_cd = ? AND quan_he_voi_chu_ho <> 'Chủ hộ'`;
    try {
        const [result, fields] = await db.execute(sql, [id_cd]);
        if (result.affectedRows === 0) {
            throw new Error("Cannot delete household head or member not found");
        }
        return result.affectedRows > 0;
        // return result;
    }
    catch (error) {
        console.log("Error executing query deleteHouseholdMember");
        throw error;
    }
}
const check_hoseholdHead = async (id_cd) => {
    const sql = `SELECT id_cd FROM nhan_khau WHERE id_cd = ? AND quan_he_voi_chu_ho = 'Chủ hộ'`;
    try {
        const [rows, fields] = await db.execute(sql, [id_cd]);
        return rows.length > 0;
    }
    catch (error) {
        console.log("Error executing query check_hoseholdHead");
        throw error;
    }
}
const createNewHousehold = async (address, type) => {
    const sql = `INSERT INTO ho_khau (address, _type) VALUES (?, ?)`;
    try {
        console.log("Creating new household with address:", address, "and type:", type);
        const [result, fields] = await db.execute(sql, [address, type]);
        if (result.affectedRows === 0) {
            throw new Error("Failed to create new household");
        }
        return result;
    }
    catch (error) {
        console.log("Error executing query createNewHousehold");
        throw error;
    }
}
const createNewHouseholdFromMembers = async (ids, address, type) => {
    // ids: [{id_cd: 1, quan_he_voi_chu_ho: 'Chủ hộ'}, {id_cd: 2, quan_he_voi_chu_ho: 'Vợ'}, ...]
    if (!Array.isArray(ids) || ids.length === 0) {
        throw new Error("ids must be a non-empty array");
    }
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        // const insertHouseholdQuery = await `INSERT INTO ho_khau (address, _type) VALUES (?, ?)`;
        // const [householdResult] = await connection.execute(insertHouseholdQuery, [address, type]);
        const householdResult = await createNewHousehold(address, type);
        const householdId = await householdResult.insertId;
        const updateMembersQuery = `UPDATE nhan_khau SET id_ho_khau = ?, quan_he_voi_chu_ho = ? WHERE id_cd = ?`;
        ids.forEach(async (id) => {
            await connection.execute(updateMembersQuery, [householdId, id.quan_he_voi_chu_ho, id.id_cd]);
        }
        );
        await connection.commit();
        return householdId;
    }
    catch (error) {
        await connection.rollback();
        console.log("Error executing query createNewHousehold:", error);
        throw error;
    }
    finally {
        connection.release();
    }
}

module.exports = {
    getAllHouseholds,
    getHouseholdMembers,
    deleteHouseholdMember,
    createNewHouseholdFromMembers,
    createNewHousehold,
    check_hoseholdHead
};