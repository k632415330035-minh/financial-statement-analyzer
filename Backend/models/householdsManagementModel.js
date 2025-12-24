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

const check_haveInvidualInformation = async (cccd, connection) => {
    const sql = `SELECT id_cd FROM cong_dan WHERE cccd = ?`;
    try {
        let con = db;
        if (connection) {
            con = connection;
        }
        const [rows, fields] = await con.execute(sql, [cccd]);
        return rows;
    } catch (error) {
        console.log("Error executing query check_haveInvidualInformation");
    }
}
const check_haveAccountInformation = async (cccd, connection) => {
    const sql = `SELECT _type FROM accounts WHERE userID = ?`;
    try {
        let con = db;
        if (connection) {
            con = connection;
        }
        const [rows, fields] = await con.execute(sql, [cccd]);
        if (rows.length > 0) {
            return rows[0]._type;
        }
        return null;
    } catch (error) {
        console.log("Error executing query check_haveAccountInformation");
    }
}

const check_isResident = async (id_cd, connection) => {
    const sql = `SELECT id_cd FROM nhan_khau WHERE id_cd = ?`;
    try {
        let con = db;
        if (connection) {
            con = connection;
        }
        const [rows, fields] = await con.execute(sql, [id_cd]);
        return rows.length > 0;
    } catch (error) {
        console.log("Error executing query check_isResident");
    }
}
const insertPersonalInformation = async (nhan_khau_info, connection) => {
    const sql = `INSERT INTO cong_dan 
    (ho_ten, bi_danh, gioi_tinh, ngay_sinh, noi_sinh, que_quan, dan_toc, nghe_nghiep, noi_lam_viec, cccd, ngay_cap, noi_cap, userID)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    try {
        let con = db;
        if (connection) {
            con = connection;
        }
        const check = await check_haveAccountInformation(nhan_khau_info.cccd, con);
        if (check != null) {
            nhan_khau_info.userID = nhan_khau_info.cccd;
        }
        else {
            nhan_khau_info.userID = null;
        }
        const [result, fields] = await db.execute(sql, [
            nhan_khau_info.ho_ten,
            nhan_khau_info.bi_danh || null,
            nhan_khau_info.gioi_tinh,
            nhan_khau_info.ngay_sinh,
            nhan_khau_info.noi_sinh,
            nhan_khau_info.que_quan,
            nhan_khau_info.dan_toc,
            nhan_khau_info.nghe_nghiep || null,
            nhan_khau_info.noi_lam_viec || null,
            nhan_khau_info.cccd,
            nhan_khau_info.ngay_cap || null,
            nhan_khau_info.noi_cap || null,
            nhan_khau_info.userID,
        ]);
        return result;
    } catch (error) {
        console.log("Error executing query insertPersonalInformation");
        throw error;
    }
};
const insertResidentToHousehold = async (nhan_khau_info, ho_khau_info) => {
    // nhan_khau_info: {ho_ten, bi_danh, gioi_tinh, ngay_sinh, noi_sinh, que_quan, dan_toc, nghe_nghiep, noi_lam_viec, quan_he_voi_chu_ho}
    if (!Array.isArray(nhan_khau_info) || nhan_khau_info.length === 0) {
        throw new Error("ids must be a non-empty array");
    }
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        const insertHousehold = await createNewHousehold(ho_khau_info.address, ho_khau_info.type, connection);
        const householdId = await insertHousehold.insertId;
        for (const resident of nhan_khau_info) {
            const check = await check_haveInvidualInformation(resident.cccd, connection);
            let residentIdCd;
            if (check.length === 0) {
                const insertPersonalInfo = await insertPersonalInformation(resident, connection);
                residentIdCd = await insertPersonalInfo.insertId;
            } else {
                residentIdCd = check[0].id_cd;
                if (await check_isResident(residentIdCd, connection)) {
                    throw new Error(`Công dân với cccd ${resident.cccd} đã là thành viên hộ khẩu khác`);
                }
            }
            // const insertPersonalInfo = await insertPersonalInformation(resident);
            // const residentIdCd = await insertPersonalInfo.insertId;
            const insertResidentToHouseholdSql = `INSERT INTO nhan_khau (id_ho_khau, id_cd, quan_he_voi_chu_ho, ngay_dang_ki_thuong_tru, thuong_tru_truoc_day) VALUES (?, ?, ?, ?, ?)`;
            await connection.execute(insertResidentToHouseholdSql, [
                householdId,
                residentIdCd,
                resident.quan_he_voi_chu_ho,
                resident.ngay_dang_ki_thuong_tru || null,
                resident.thuong_tru_truoc_day || null,
            ]);
            const check_Acc = await check_haveAccountInformation(resident.cccd, connection);
            if (check_Acc == 'tam thoi') {
                const sqlUpdateAccountType = `UPDATE accounts SET _type = 'cu dan' WHERE userID = ?`;
                await connection.execute(sqlUpdateAccountType, [resident.cccd]);
            }
        }
        await connection.commit();
        return householdId;
    }
    catch (error) {
        await connection.rollback();
        console.log("Error executing query insertResidentToHousehold:", error);
        throw error;
    }
    finally {
        connection.release();
    }
};


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
const createNewHousehold = async (address, type, connection) => {
    const sql = `INSERT INTO ho_khau (address, _type) VALUES (?, ?)`;
    try {
        // console.log("Creating new household with address:", address, "and type:", type);
        let con = db;
        if (connection) {
            con = connection;
        }
        const [result, fields] = await con.execute(sql, [address, type]);
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
        const householdResult = await createNewHousehold(address, type, connection);
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
    check_hoseholdHead,
    insertResidentToHousehold,
    check_haveInvidualInformation,
    insertPersonalInformation,
    check_haveAccountInformation
};