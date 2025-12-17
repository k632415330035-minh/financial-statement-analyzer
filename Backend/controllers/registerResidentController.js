const registerModel = require("../models/registerResidentModel");

const handleNewbornRegistration = async (req, res) => {
  const parentUserID = req.user.userID;
  const childData = req.body;

  if (!parentUserID) {
    return res.status(401).json({
      success: false,
      message: "Không tìm thấy ID người dùng đã được xác thực từ Token.",
    });
  }

  if (!childData.ho_ten || !childData.ngay_sinh || !childData.gioi_tinh) {
    return res.status(400).json({
      success: false,
      message:
        "Vui lòng cung cấp đầy đủ Họ tên, Ngày sinh và Giới tính của trẻ.",
    });
  }

  try {
    const parentInfo = await registerModel.getParentInfoForEntry(parentUserID);

    if (!parentInfo || !parentInfo.id_ho_khau) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin hộ khẩu hợp lệ của người đăng ký.",
      });
    }

    const result = await registerModel.registerChildEntry(
      parentInfo,
      childData
    );

    return res.status(200).json({
      success: true,
      message:
        "Đã gửi đơn đăng ký nhân khẩu mới thành công. Đơn đang chờ Tổ trưởng duyệt.",
      id_cong_dan: result.childIdCd,
      idDk: result.idDk,
    });
  } catch (error) {
    console.error(
      "Lỗi tại Controller khi đăng ký nhân khẩu mới sinh:",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Gửi đơn đăng ký thất bại do lỗi hệ thống hoặc database.",
      details: error.message,
    });
  }
};

const getCurrentTempExpiry = async (req, res) => {
  const parentUserID = req.user.userID;

  try {
    const parentInfo = await registerModel.getParentInfoForEntry(parentUserID);

    if (!parentInfo || !parentInfo.id_ho_khau) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy hộ khẩu",
      });
    }

    const expiry = await registerModel.getCurrentTempExpiryByHousehold(
      parentInfo.id_ho_khau
    );

    return res.json({
      success: true,
      temp_expiry: expiry,
    });
  } catch (error) {
    return res.status(500).json({
      success: false,
      message: "Lỗi hệ thống",
    });
  }
};

module.exports = {
  handleNewbornRegistration,
  getCurrentTempExpiry,
};
