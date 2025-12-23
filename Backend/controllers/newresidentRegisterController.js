const newresidentRegisterModel = require("../models/newresidentRegisterModel");

// Hàm phụ trợ để đảm bảo không có giá trị 'undefined' gửi xuống Database
const sanitizePeopleData = (people) => {
  return people.map((p) => ({
    cccd: p.cccd || null,
    ho_ten: p.ho_ten || null,
    bi_danh: p.bi_danh || null,
    gioi_tinh: p.gioi_tinh || null,
    ngay_sinh: p.ngay_sinh || null,
    noi_sinh: p.noi_sinh || null,
    que_quan: p.que_quan || null,
    dan_toc: p.dan_toc || null,
    nghe_nghiep: p.nghe_nghiep || null,
    noi_lam_viec: p.noi_lam_viec || null,
    noi_cap: p.noi_cap || null,
    ngay_cap: p.ngay_cap || null,
    isApplicant: p.isApplicant || false,
    quan_he_voi_chu_ho: p.quan_he_voi_chu_ho || null,
    thuong_tru_truoc_day: p.thuong_tru_truoc_day || null,
  }));
};

const getHouseInfoByCCCD = async (req, res) => {
  try {
    const { cccd } = req.params;
    if (!cccd) {
      return res
        .status(400)
        .json({ success: false, message: "Thiếu CCCD chủ hộ" });
    }

    const house = await newresidentRegisterModel.getHouseByHouseholderCCCD(
      cccd
    );

    if (!house) {
      return res
        .status(404)
        .json({ success: false, message: "Không tìm thấy chủ hộ hợp lệ" });
    }

    res.json({
      success: true,
      data: {
        id_ho_khau: house.id_ho_khau,
        address: house.address,
        type: house._type,
        latest_end: house.latest_end || null,
      },
    });
  } catch (err) {
    res.status(500).json({ success: false, message: err.message });
  }
};

const registerToExistingHouse = async (req, res) => {
  try {
    const { cccdChuHo, donDangKy, people } = req.body;

    if (
      !cccdChuHo ||
      !donDangKy ||
      !Array.isArray(people) ||
      people.length === 0
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Dữ liệu gửi lên không hợp lệ" });
    }

    // Chuẩn hóa dữ liệu để tránh lỗi 'undefined'
    const sanitizedPeople = sanitizePeopleData(people);

    const result = await newresidentRegisterModel.registerExistingHouse(
      cccdChuHo,
      donDangKy,
      sanitizedPeople
    );

    res.status(200).json({ success: true, id_dk: result.id_dk });
  } catch (err) {
    res.status(400).json({ success: false, message: err.message });
  }
};

const registerToNewHouse = async (req, res) => {
  try {
    const { donDangKy, people } = req.body;

    if (!donDangKy || !Array.isArray(people) || people.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Dữ liệu đăng ký không đầy đủ hoặc không hợp lệ.",
      });
    }

    // Kiểm tra và chuẩn hóa dữ liệu
    const sanitizedPeople = sanitizePeopleData(people);
    const applicant = sanitizedPeople.find((p) => p.isApplicant === true);

    if (!applicant) {
      return res.status(400).json({
        success: false,
        message: "Phải xác định một người là người điền đơn (Chủ hộ).",
      });
    }

    if (!donDangKy.address || donDangKy.address.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "Địa chỉ đăng ký hộ mới không được để trống.",
      });
    }

    const formattedDon = {
      ...donDangKy,
      begin: donDangKy.begin ? new Date(donDangKy.begin) : null,
      end: donDangKy.end ? new Date(donDangKy.end) : null,
    };

    const result = await newresidentRegisterModel.registerNewHouse(
      formattedDon,
      sanitizedPeople
    );

    return res.status(201).json({
      success: true,
      message:
        "Đơn đăng ký hộ mới đã được gửi thành công. Vui lòng đợi Ban Quản lý phê duyệt.",
      id_dk: result.id_dk,
    });
  } catch (error) {
    console.error("Lỗi Controller registerToNewHouse:", error);
    if (error.code === "ER_DUP_ENTRY") {
      return res.status(409).json({
        success: false,
        message:
          "Một trong số các số CCCD này đã tồn tại trong hệ thống hoặc đang có đơn xử lý.",
      });
    }
    return res.status(500).json({
      success: false,
      message: "Đã xảy ra lỗi hệ thống.",
      error: error.message,
    });
  }
};

module.exports = {
  getHouseInfoByCCCD,
  registerToExistingHouse,
  registerToNewHouse,
};
