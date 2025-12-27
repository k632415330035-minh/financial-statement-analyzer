const db = require("../config/dbMySQL");
const helpModel = require("./householdsManagementModel");

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
            `SELECT ddk.id_dk, cd.ho_ten, ctd.quan_he_voi_chu_ho, ctd.thuong_tru_truoc_day, ctd.id_cd, cd.cccd, YEAR(cd.ngay_sinh) AS nam_sinh, cd.gioi_tinh, ddk.address, ddk._type, ddk.begin
            FROM chi_tiet_don ctd
            JOIN don_dang_ky ddk ON ddk.id_dk = ctd.id_dk
            JOIN cong_dan cd ON ctd.id_cd = cd.id_cd WHERE ddk.id_dk = ?
            ORDER BY FIELD(ctd.quan_he_voi_chu_ho,'Mẹ','Bố', 'Vợ', 'Chồng', 'Chủ hộ') DESC`,
            [id]
        );
        return rows;
    } catch (error) {
        console.log("Error MODEL executing query getTempDetail");
        throw (error);
    }
}

const approveTempRecord = async (id) => {
    // update state của đơn, thêm mới hộ khẩu -> thêm các thông tin nhân khẩu -> update _type của tài khoản của nhân khẩu
    const con = await db.getConnection();
    const updateStateSQL = `UPDATE don_dang_ky SET state = 'Đã duyệt', ngay_duyet = DATE(NOW()), id_ho_khau = ? WHERE id_dk = ?`;
    const insertResidentSQL = `INSERT INTO nhan_khau (id_cd, id_ho_khau, quan_he_voi_chu_ho, ngay_dang_ki_thuong_tru, thuong_tru_truoc_day) VALUES (?, ?, ?, ?, ?)`;
    const updateAccountTypeSQL = `UPDATE accounts SET _type = ? WHERE userID = ?`;
    try {
        await con.beginTransaction();
        const members = await getTempDetail(id);
        const newHousehold = await helpModel.createNewHousehold(members[0].address, members[0]._type, con);
        const householdId = newHousehold.insertId;
        for (let i = 0; i < members.length; i++) {
            await con.execute(insertResidentSQL, [members[i].id_cd, householdId, members[i].quan_he_voi_chu_ho, members[i].begin, members[i].thuong_tru_truoc_day]);
            const check_Acc = await helpModel.check_haveAccountInformation(members[i].cccd, con);
            if (check_Acc === 'tam thoi') {
                await con.execute(updateAccountTypeSQL, ['cu dan', members[i].cccd]);
            }
        }
        await con.execute(updateStateSQL, [householdId, id]);
        await con.commit();
        return { oke: true };
    }
    catch (error) {
        await con.rollback();
        console.log("Error MODEL executing query approveTempRecord");
        throw (error);
    }
    finally {
        con.release();
    }
}

const rejectTempRecord = async (id, reason) => {
    const con = await db.getConnection();
    const updateStateSQL = `UPDATE don_dang_ky SET state = 'Bị từ chối', ly_do_tu_choi = ? WHERE id_dk = ?`;
    try {
        await con.beginTransaction();
        await con.execute(updateStateSQL, [reason, id]);
        await con.commit();
        // console.log("MODEL executing query rejectTempRecord");
        return { oke: true };
    }
    catch (error) {
        await con.rollback();
        console.log("Error MODEL executing query rejectTempRecord");
        throw (error);
    }
    finally {
        con.release();
    }
}

const getTamTruTemp = async () => {
    try {
        const [rows] = await db.query(
            `SELECT ctd.id_cd, cd.ho_ten, cd.cccd, ddk.begin, ddk.end, DATEDIFF(ddk.end , DATE(NOW())) AS con_lai FROM chi_tiet_don ctd 
            JOIN cong_dan cd ON ctd.id_cd = cd.id_cd
            JOIN don_dang_ky ddk ON ctd.id_dk = ddk.id_dk
            WHERE ddk.state = 'Đã duyệt' AND _type = 'Tạm trú' ORDER BY con_lai`
        );
        return rows;
    } catch (error) {
        console.log("Error MODEL executing query getTamTruTemp");
        throw (error);
    }
}

module.exports = {
    getAllTemp,
    getTempDetail,
    approveTempRecord,
    rejectTempRecord,
    getTamTruTemp
}