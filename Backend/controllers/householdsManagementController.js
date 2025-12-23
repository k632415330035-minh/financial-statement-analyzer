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
        const { id_cd } = req.params;
        const result = await householdsManagementModel.deleteHouseholdMember(id_cd);
        if (result) {
            res.status(200).json({ message: "Xóa thành viên hộ khẩu thành công" });
        } else {
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
            }
            // console.log("Received data for new household:", ids, address, type);
            const result = await householdsManagementModel.createNewHouseholdFromMembers(ids, address, type);
            if (result) {
                res.status(201).json({ message: "Tạo hộ khẩu mới thành công" });
            } else {
                res.status(400).json({ message: "Không thể tạo hộ khẩu mới" });
            }
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
    const { nhan_khau_info, ho_khau_info } = req.body;
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
        const result = await householdsManagementModel.insertResidentToHousehold(nhan_khau_info, ho_khau_info);
        if (result) {
            res.status(201).json({ message: "Tạo hộ khẩu mới thành công", householdId: result });
        } else {
            res.status(400).json({ message: "Không thể tạo hộ khẩu mới" });
        }
    }
    catch (error) {
        console.log("Error: ", error.message);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
module.exports = {
    getAllHouseholds,
    getHouseholdMembers,
    deleteHouseholdMember,
    createNewHouseholdFromMembers,
    createNewHousehold
};