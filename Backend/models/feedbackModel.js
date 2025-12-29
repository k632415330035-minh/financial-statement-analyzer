const connection = require("../config/dbMySQL");

const getCountFeedbackStatus = async () => {
    let queryStatement = `SELECT trang_thai, COUNT(*) AS count FROM phan_anh GROUP BY trang_thai`;
    try {
        const [results, fields] = await connection.query(queryStatement);
        return results;
    } catch (err) {
        console.log(err);
    }
}
const getFeedbackData = async () => {
    //  { id: '6', name: 'Đỗ Văn F', phone: '0967890123', addr: 'Số 42, Đường D', type: 'hạ tầng', 
    // content: 'Hệ thống thoát nước bị tắc', 
    // anonymous: false, date: '13/11/2025', status: 'processing', processingNote: 'Đang sửa chữa', satisfaction: 2 }
    let queryStatement = `SELECT pa.id_pa, cd.ho_ten, hk.address, pa.loai_phan_anh, pa.noi_dung, pa.date_time, pa.trang_thai, pa.phan_hoi
FROM phan_anh pa 
left join cong_dan cd on pa.id_cd = cd.id_cd 
left join nhan_khau nk on nk.id_cd = cd.id_cd  
left join ho_khau hk on nk.id_ho_khau = hk.id_ho_khau order by date_time DESC`;
    try {
        const [results, fields] = await connection.query(queryStatement);
        return results;
    } catch (err) {
        console.log(err);
    }
}

const updateFeedbackStatus = async (id, newStatus, note) => {
    let queryStatement1 = `UPDATE phan_anh SET trang_thai = ?, phan_hoi =  ? WHERE id_pa = ?`;
    try {
        const [results, fields] = await connection.execute(queryStatement1, [newStatus, note, id]);
        return results;
    } catch (err) {
        console.log(err);
    }
};

module.exports = {
    getCountFeedbackStatus, getFeedbackData, updateFeedbackStatus
};