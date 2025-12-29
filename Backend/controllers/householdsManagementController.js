const householdsManagementModel = require("../models/householdsManagementModel");

const getAllHouseholds = async (req, res) => {
    try {
        const data = await householdsManagementModel.getAllHouseholds();
        if (data) {
            res.status(200).json(data);
        } else {
            res
                .status(404)
                .json({ message: "Dữ liệu bị mất hoặc bạn không có quyền truy cập" });
        }
    } catch (error) {
        console.log("Controller error: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getHouseholdMembers = async (req, res) => {
    try {
        const { householdId } = req.params;
        const data = await householdsManagementModel.getHouseholdMembers(householdId);
        if (data) {
            res.status(200).json(data);
        } else {
            res
                .status(404)
                .json({ message: "Dữ liệu bị mất hoặc bạn không có quyền truy cập" });
        }
    } catch (error) {
        console.log("Controller error: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
const deleteHouseholdMember = async (req, res) => {
    try {
        /*bodyData: {old_id_hk, chuyen_den, ghi_chu} */
        const { id_cd } = req.params;
        const dataBody = req.body;
        console.log(dataBody);
        const result = await householdsManagementModel.deleteMemberFromHousehold(dataBody, id_cd);
        if (result == 1) {
            res.status(200).json({ message: "Xóa thành viên hộ khẩu thành công" });
        } else if (result == 2) {
            res.status(200).json({ message: "Đã xóa hộ khẩu thành công" });
        }
        else {
            res.status(404).json({ message: "Không tìm thấy thành viên hộ khẩu hoặc không thể xóa chủ hộ" });
        }
    } catch (error) {
        console.log("Controller error: ", error.message);
        res.status(500).json({ message: error.message });
    }
};

const createNewHouseholdFromMembers = async (req, res) => {
    // Chức năng tạo hộ khẩu mới sẽ được triển khai ở đây
    try {
        const { ids, address, type } = req.body;
        for (let id of ids) {
            const isHead = await householdsManagementModel.check_hoseholdHead(id.id_cd);
            if (isHead) {
                res.status(400).json({ message: `Không thể chuyển tách chủ hộ sang hộ khẩu mới` });
                throw new Error(`Cannot transfer household head with id_cd ${id.id_cd} to new household`);
                return
            }
        }
        const result = await householdsManagementModel.createNewHouseholdFromMembers(ids, address, type);
        if (result) {
            res.status(201).json({ message: "Tạo hộ khẩu mới thành công" });
        } else {
            res.status(400).json({ message: "Không thể tạo hộ khẩu mới" });
        }
    }
    catch (error) {
        console.log("Controller error: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
}

const createNewHousehold = async (req, res) => {
    // nhan_khau_info: array of resident objects
    // ho_khau_info: object with address and type
    const { nhan_khau, ho_khau } = req.body;
    /*
    {
    "nhan_khau_info":[
        {
            "ho_ten": "Nguyễn Bình Định",
            "bi_danh": "Không có",
            "gioi_tinh":"Nam",
            "ngay_sinh": "1956-05-04",
            "noi_sinh": "Hà Tây",
            "que_quan": "Hà Tây",
            "dan_toc": "Kinh",
            "nghe_nghiep": "Bộ đội",
            "noi_lam_viec": "Sư đoàn 372",
            "cccd": "001234567890",
            "ngay_cap": "2021-02-14",
            "noi_cap": "Hà Nội",
            "quan_he_voi_chu_ho": "Chủ hộ",
            "ngay_dang_ki_thuong_tru" :"2023-10-20",
            "thuong_tru_truoc_day": null,
            "userID" :null
        },
        {
            "ho_ten": "Nguyễn Bình Dương",
            "bi_danh": "Không có",
            "gioi_tinh":"Nam",
            "ngay_sinh": "1956-05-04",
            "noi_sinh": "Hà Tây",
            "que_quan": "Hà Tây",
            "dan_toc": "Kinh",
            "nghe_nghiep": "Bộ đội",
            "noi_lam_viec": "Sư đoàn 372",
            "cccd": "001234567891",
            "ngay_cap": "2021-02-14",
            "noi_cap": "Hà Nội",
            "quan_he_voi_chu_ho": "Em",
            "ngay_dang_ki_thuong_tru" :"2023-10-20",
            "thuong_tru_truoc_day": null,
            "userID" :null
        }
    ],
    "ho_khau_info":{
        "address": "Số 11 ngõ 147 Vĩnh Tuy",
        "type": "Thường trú"
    }
}
    */
    try {
        const result = await householdsManagementModel.insertResidentToHousehold(nhan_khau, ho_khau);
        if (result) {
            res.status(201).json({ message: "Tạo hộ khẩu mới thành công", id: result });
        } else {
            res.status(400).json({ message: "Không thể tạo hộ khẩu mới" });
        }
    }
    catch (error) {
        console.log("Error: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
        throw error
    }
};

const addNewMember = async (req, res) => {
    // nhan_khau_info: array of resident objects
    // ho_khau_info: object with address and type
    /*
    {
    "nhan_khau_info":[
        {
            "ho_ten": "Nguyễn Bình Định",
            "bi_danh": "Không có",
            "gioi_tinh":"Nam",
            "ngay_sinh": "1956-05-04",
            "noi_sinh": "Hà Tây",
            "que_quan": "Hà Tây",
            "dan_toc": "Kinh",
            "nghe_nghiep": "Bộ đội",
            "noi_lam_viec": "Sư đoàn 372",
            "cccd": "001234567890",
            "ngay_cap": "2021-02-14",
            "noi_cap": "Hà Nội",
            "quan_he_voi_chu_ho": "Chủ hộ",
            "ngay_dang_ki_thuong_tru" :"2023-10-20",
            "thuong_tru_truoc_day": null,
            "userID" :null
        },
        {
            "ho_ten": "Nguyễn Bình Dương",
            "bi_danh": "Không có",
            "gioi_tinh":"Nam",
            "ngay_sinh": "1956-05-04",
            "noi_sinh": "Hà Tây",
            "que_quan": "Hà Tây",
            "dan_toc": "Kinh",
            "nghe_nghiep": "Bộ đội",
            "noi_lam_viec": "Sư đoàn 372",
            "cccd": "001234567891",
            "ngay_cap": "2021-02-14",
            "noi_cap": "Hà Nội",
            "quan_he_voi_chu_ho": "Em",
            "ngay_dang_ki_thuong_tru" :"2023-10-20",
            "thuong_tru_truoc_day": null,
            "userID" :null
        }
    ],
    "ho_khau_info":{
        "address": "Số 11 ngõ 147 Vĩnh Tuy",
        "type": "Thường trú"
    }
}
    */
    const resident = await req.body;
    try {
        const result = await householdsManagementModel.addNewMember(resident);
        if (result) {
            res.status(201).json({ message: "Thêm thành viên mới thành công", householdId: result });
        } else {
            res.status(400).json({ message: "Không thể thêm thành viên mới" });
        }
    }
    catch (error) {
        console.log("Error: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};


const updateHousehold = async (req, res) => {
    const { id_ho_khau } = await req.params;
    const { changedHousehold } = await req.body;
    // console.log("id_ho_khau", id_ho_khau, "        newAddress:", dia_chi);
    try {
        const result = await householdsManagementModel.updateHousehold(id_ho_khau, changedHousehold);
        if (result) {
            res.status(201).json({ message: 'Cập nhật thành công thông tin hộ khẩu', oke: true })
        }
        else {
            res.status(400).json({ message: 'Cập nhật thông tin cho hộ khẩu không thành công', oke: false })
        }
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error", oke: false });
        console.error(error);
        throw error
    }
}

const getChangeHistory = async (req, res) => {
    const { id_ho_khau } = await req.params;
    try {
        const { tachHo, doiChuHo, doiDiaChi, chuyenDi } = await householdsManagementModel.getChangeHistory(id_ho_khau);
        let history = [];
        if (tachHo.length > 0) {
            for (let i = 0; i < tachHo.length; i++) {
                history.push({
                    action: `Đã tách nhân khẩu ${tachHo[i].ho_ten} ${tachHo[i].cccd ? `- CCCD ${tachHo[i].cccd}` : ''} sang hộ khẩu số ${tachHo[i].new_value}`,
                    date_time: tachHo[i].date_time
                });
            }
        }
        if (doiChuHo.length > 0) {
            for (let i = 0; i < doiChuHo.length; i++) {
                history.push({
                    action: `Đổi chủ hộ thành ${doiChuHo[i].ho_ten}`,
                    date_time: doiChuHo[i].date_time
                });
            }
        }
        if (doiDiaChi.length > 0) {
            for (let i = 0; i < doiDiaChi.length; i++) {
                history.push({
                    action: `Hộ khẩu chuyển chỗ ở từ ${doiDiaChi[i].old_value} sang ${doiDiaChi[i].new_value}`,
                    date_time: doiDiaChi[i].date_time
                });
            }
        }
        if (chuyenDi.length > 0) {
            for (let i = 0; i < chuyenDi.length; i++) {
                history.push({
                    action: `Nhân khẩu ${chuyenDi[i].ho_ten} ${chuyenDi[i].cccd ? `- CCCD ${chuyenDi[i].cccd}` : ''} đã chuyển ra chuyển khỏi hộ ${chuyenDi[i].ghi_chu ? `[${chuyenDi[i].ghi_chu}]` : ''}`,
                    date_time: chuyenDi[i].ngay_chuyen
                })
            }
        }
        history.sort((a, b) =>
            new Date(b.date_time) - new Date(a.date_time)
        );
        const historyVN = history.map(item => ({
            ...item,
            date: new Date(item.date_time).toLocaleString('vi-VN')
        }));
        res.status(200).json({ "history": historyVN });
    } catch (error) {
        res.status(500).json({ message: "Internal Server Error" });
        console.error(error);
        throw error
    }
}
module.exports = {
    getAllHouseholds,
    getHouseholdMembers,
    deleteHouseholdMember,
    createNewHouseholdFromMembers,
    createNewHousehold,
    addNewMember,
    updateHousehold,
    getChangeHistory
};