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
            nhan_khau_info.bi_danh || '',
            nhan_khau_info.gioi_tinh,
            nhan_khau_info.ngay_sinh,
            nhan_khau_info.noi_sinh,
            nhan_khau_info.que_quan || null,
            nhan_khau_info.dan_toc || null,
            nhan_khau_info.nghe_nghiep || null,
            nhan_khau_info.noi_lam_viec || null,
            nhan_khau_info.cccd || null,
            nhan_khau_info.ngay_cap || null,
            nhan_khau_info.noi_cap || null,
            nhan_khau_info.userID || null,
        ]);
        return result;
    } catch (error) {
        console.log("Error executing query insertPersonalInformation");
        throw error;
    }
};


const createTemporaryHousehold = async (ho_khau_info, id_cd, connection) => {
    let con = db;
    if (connection) {
        con = connection;
    }
    const sql = `INSERT INTO don_dang_ky(begin, end, _type, address, state, id_cd) 
    VALUES (?, ?, ?, ?, default,  ?)`
    try {
        const [result, fields] = await con.execute(sql, [
            ho_khau_info.begin,
            ho_khau_info.end,
            ho_khau_info.type,
            ho_khau_info.address,
            id_cd
        ]);
        return result;
    } catch (error) {
        console.log("Error executing query createTemporaryHousehold");
        throw error;
    }
}
//chuyển thành chỉ tạo đơn thôi
const insertResidentToHousehold = async (nhan_khau_info, ho_khau_info) => {
    // nhan_khau_info: {ho_ten, bi_danh, gioi_tinh, ngay_sinh, noi_sinh, que_quan, dan_toc, nghe_nghiep, noi_lam_viec, quan_he_voi_chu_ho}
    if (!Array.isArray(nhan_khau_info) || nhan_khau_info.length === 0) {
        throw new Error("ids must be a non-empty array");
    }
    // chỗ này sẽ tạo đơn cùng với chi tiết đơn
    const connection = await db.getConnection();
    try {
        await connection.beginTransaction();
        // tạo đơn mới và lấy mã đơn
        // const insertHousehold = await createNewHousehold(ho_khau_info.address, ho_khau_info.type, connection);
        // const householdId = await insertHousehold.insertId;
        let index = 0;
        let tempID = 0;
        for (const resident of nhan_khau_info) {
            // check xem đã có thông tin công dân chưa
            const check = await check_haveInvidualInformation(resident.cccd, connection);
            let residentIdCd;
            if (check.length === 0) {
                // chưa thì tạo công dân mới
                const insertPersonalInfo = await insertPersonalInformation(resident, connection);
                residentIdCd = await insertPersonalInfo.insertId;
                //lưu id công dân vừa tạo
            } else {
                residentIdCd = check[0].id_cd;
                //có rồi thì lấy id công dân

                //kiểm tra xem đã là nhân khẩu chưa, rồi thì báo lỗi
                if (await check_isResident(residentIdCd, connection)) {
                    throw new Error(`Công dân với cccd ${resident.cccd} đã là thành viên hộ khẩu khác`);
                }
            }
            if (index == 0) {
                // tạo đơn
                const insertTemp = await createTemporaryHousehold(ho_khau_info, residentIdCd, connection);
                tempID = await insertTemp.insertId;
            }
            // const insertPersonalInfo = await insertPersonalInformation(resident);
            // const residentIdCd = await insertPersonalInfo.insertId;

            //chỗ này sẽ thêm vào chi tiết đơn
            const insertResidentToHouseholdSql = `INSERT INTO chi_tiet_don (id_dk, id_cd, quan_he_voi_chu_ho, thuong_tru_truoc_day) VALUES (?, ?, ?, ?)`;
            await connection.execute(insertResidentToHouseholdSql, [
                tempID,
                residentIdCd,
                resident.quan_he_voi_chu_ho,
                resident.thuong_tru_truoc_day || null,
            ]);
            const check_Acc = await check_haveAccountInformation(resident.cccd, connection);
            if (check_Acc == 'tam thoi') {
                const sqlUpdateAccountType = `UPDATE accounts SET _type = 'cu dan' WHERE userID = ?`;
                await connection.execute(sqlUpdateAccountType, [resident.cccd]);
            }
            index++;
        }
        await connection.commit();
        return tempID;
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


const deleteHouseholdMember = async (id_cd, connection) => {
    const sql = `DELETE FROM nhan_khau WHERE id_cd = ? AND quan_he_voi_chu_ho <> 'Chủ hộ'`;
    let con = db;
    if (connection) {
        con = connection;
    }
    try {
        const [result, fields] = await con.execute(sql, [id_cd]);
        if (result.affectedRows === 0) {
            throw new Error("Không thể xóa chủ hộ hoặc không tìm thấy thông tin thành viên");
        }
        return result.affectedRows > 0;
        // return result;
    }
    catch (error) {
        console.log("Error executing query deleteHouseholdMember");
        throw error;
    }
}

const deleteMemberFromHousehold = async (bodyData, id_cd) => {
    const sql = `INSERT INTO chuyen_di VALUES (default, ?, ?, CURDATE(), ?, ?)`;
    /*bodyData: {old_id_hk, chuyen_den, ghi_chu} */
    let respone = 0;
    const con = await db.getConnection();
    try {
        await con.beginTransaction();
        const [count] = await con.execute(`SELECT COUNT(*) AS count FROM nhan_khau WHERE id_ho_khau = ?`, [bodyData.old_id_ho_khau]);
        if (count[0].count <= 1) {
            await con.execute(sql, [id_cd, null, bodyData.chuyen_den, bodyData.ghi_chu]);
            await con.execute(`UPDATE chuyen_di SET old_id_hk= null WHERE old_id_hk = ?`, [bodyData.old_id_ho_khau]);
            await con.execute(`DELETE FROM nhan_khau WHERE id_ho_khau = ?`, [bodyData.old_id_ho_khau]);
            await con.execute(`UPDATE don_dang_ky SET id_ho_khau = null WHERE id_ho_khau = ?`, [bodyData.old_id_ho_khau]);
            const sqlDeleteHousehold = `DELETE FROM ho_khau WHERE id_ho_khau = ?`;
            await con.execute(sqlDeleteHousehold, [bodyData.old_id_ho_khau]);
            await con.execute(`UPDATE cong_dan SET userID = NULL WHERE id_cd = ?`, [id_cd]);
            const sqlGetCCCD = 'SELECT cccd FROM cong_dan WHERE id_cd = ?';
            const [cccd] = await con.execute(sqlGetCCCD, [id_cd]);
            const check_Acc = await check_haveAccountInformation(cccd[0].cccd, con);
            if (check_Acc != null) {
                const deleteAccount = `DELETE FROM accounts WHERE userID = ?`;
                await con.execute(deleteAccount, [cccd[0].cccd]);
            }
            await con.commit();
            respone = 2;
        }
        else {
            const [result, fields] = await con.execute(sql, [id_cd, bodyData.old_id_ho_khau, bodyData.chuyen_den, bodyData.ghi_chu]);
            await deleteHouseholdMember(id_cd, con);
            await con.execute(`UPDATE cong_dan SET userID = NULL WHERE id_cd = ?`, [id_cd]);
            const sqlGetCCCD = 'SELECT cccd FROM cong_dan WHERE id_cd = ?';
            const [cccd] = await con.execute(sqlGetCCCD, [id_cd]);
            const check_Acc = await check_haveAccountInformation(cccd[0].cccd, con);
            if (check_Acc != null) {
                const deleteAccount = `DELETE FROM accounts WHERE userID = ?`;
                await con.execute(deleteAccount, [cccd[0].cccd]);
            }
            await con.commit();
            respone = 1;
        }
    }
    catch (error) {
        await con.rollback();
        console.log(error);
        console.log("Error executing query deleteMemberFromHousehold");
        throw error;
    }
    finally {
        con.release();
        return respone;
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
        console.log("householdId", householdId);
        const updateMembersQuery = `UPDATE nhan_khau SET id_ho_khau = ?, quan_he_voi_chu_ho = ? WHERE id_cd = ?`;
        for (let i = 0; i < ids.length; i++) {
            await connection.execute(updateMembersQuery, [householdId, ids[i].quan_he_voi_chu_ho, ids[i].id_cd]);
        }
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

const addNewMember = async (resident) => {
    // nhan_khau_info: {ho_ten, bi_danh, gioi_tinh, ngay_sinh, noi_sinh, que_quan, dan_toc, nghe_nghiep, noi_lam_viec, quan_he_voi_chu_ho}
    const connection = await db.getConnection();
    try {
        // console.log("resident =======", resident)
        await connection.beginTransaction();
        const check = await check_haveInvidualInformation(resident.cccd, connection);
        let residentIdCd;
        if (check.length == 0) {
            const insertPersonalInfo = await insertPersonalInformation(resident, connection);
            residentIdCd = await insertPersonalInfo.insertId;
        } else {
            if (check) {
                residentIdCd = check[0].id_cd;
                if (await check_isResident(residentIdCd, connection)) {
                    throw new Error(`Công dân với cccd ${resident.cccd} đã là thành viên hộ khẩu khác`);
                }
            }
        }
        // const insertPersonalInfo = await insertPersonalInformation(resident);
        // const residentIdCd = await insertPersonalInfo.insertId;
        const insertResidentToHouseholdSql = `INSERT INTO nhan_khau (id_ho_khau, id_cd, quan_he_voi_chu_ho, ngay_dang_ki_thuong_tru, thuong_tru_truoc_day) VALUES (?, ?, ?, ?, ?)`;
        await connection.execute(insertResidentToHouseholdSql, [
            resident.id_ho_khau,
            residentIdCd,
            resident.quan_he_voi_chu_ho,
            resident.ngay_dang_ki_thuong_tru || await new Date(),
            resident.thuong_tru_truoc_day || null,
        ]);
        const check_Acc = await check_haveAccountInformation(resident.cccd, connection);
        if (check_Acc == 'tam thoi') {
            const sqlUpdateAccountType = `UPDATE accounts SET _type = 'cu dan' WHERE userID = ?`;
            await connection.execute(sqlUpdateAccountType, [resident.cccd]);
        }
        await connection.commit();
        return resident.id_ho_khau;
    }
    catch (error) {
        await connection.rollback();
        console.log("Error executing query addNewMember:", error);
        throw error;
    }
    finally {
        connection.release();
    }
};

const updateAddressHousehold = async (id_ho_khau, newAddress) => {
    // write a SQL query sentences to update address of ho_khau
    const sql = `UPDATE ho_khau SET address = ? WHERE id_ho_khau = ?`;
    try {
        const [results] = await db.execute(sql, [newAddress, id_ho_khau]);
        return results.affectedRows > 0;
    } catch (error) {
        console.error(error);
        throw error;
    }
}

const updateHousehold = async (id_ho_khau, changedHousehold) => {
    const address = changedHousehold.address;
    console.log("address", address);
    const members = changedHousehold.nhan_khau;
    console.log("members", members);
    const con = await db.getConnection();
    const updateMembersQuery = `UPDATE nhan_khau SET quan_he_voi_chu_ho = ? WHERE id_cd = ?`;
    try {
        await con.beginTransaction();;
        await updateAddressHousehold(id_ho_khau, address);
        for (let i = 0; i < members.length; i++) {
            await con.execute(updateMembersQuery, [members[i].quan_he_voi_chu_ho, members[i].id_cd]);
        }
        await con.commit();
        return { "ok": true };
    } catch (error) {
        await con.rollback();
        console.error(error);
        throw error;
    }
    finally {
        con.release();
    }
}

const getChangeHistory = async (id_ho_khau) => {
    try {
        const tachHoSQL = `SELECT * FROM historylog h JOIN cong_dan cd ON h.record_id = cd.id_cd 
        WHERE h.table_name = 'nhan_khau' AND 
        h.column_name = 'id_ho_khau' AND 
        h.old_value = ? ORDER BY date_time DESC`;
        const [tachHo] = await db.query(tachHoSQL, [id_ho_khau]);
        const doiChuHoSQL = `SELECT nk.id_ho_khau, h.date_time, cd.ho_ten FROM historylog h 
        JOIN cong_dan cd ON h.record_id = cd.id_cd
        JOIN nhan_khau nk ON cd.id_cd = nk.id_cd
        WHERE h.table_name = 'nhan_khau' AND h.column_name = 'quan_he_voi_chu_ho' AND new_value = 'Chủ hộ' AND nk.id_ho_khau = ?
        ORDER BY date_time DESC`
        const [doiChuHo] = await db.query(doiChuHoSQL, [id_ho_khau]);
        const doiDiaChiSQL = `SELECT * FROM historylog WHERE record_id = ? AND column_name = 'address'`
        const [doiDiaChi] = await db.query(doiDiaChiSQL, [id_ho_khau]);
        const chuyenDiSQL = `SELECT * FROM chuyen_di NATURAL JOIN cong_dan WHERE old_id_hk = ?`;
        const [chuyenDi] = await db.query(chuyenDiSQL, [id_ho_khau]);
        return { tachHo, doiChuHo, doiDiaChi, chuyenDi };

    } catch (error) {
        console.log("Error executing query getChangeHistory:", error);
        throw error;
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
    check_haveAccountInformation,
    check_isResident,
    addNewMember,
    updateAddressHousehold,
    deleteMemberFromHousehold,
    updateHousehold,
    getChangeHistory
};