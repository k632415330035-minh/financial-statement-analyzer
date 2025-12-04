const registerModel = require("../models/registerResidentModel"); // Đổi tên file model thành tên chính xác nếu cần

const handleNewbornRegistration = async (req, res) => {
  // 1. Lấy dữ liệu từ Request
  const parentUserID = req.user.userID;
  const childData = req.body;

  // 2. Kiểm tra/Xác thực dữ liệu cơ bản (Controller's responsibility)
  if (!parentUserID) {
    // Trường hợp này xảy ra nếu middleware thất bại hoặc không được thêm vào route
    return res.status(401).json({
      success: false,
      message: "Không tìm thấy ID người dùng đã được xác thực từ Token.",
    });
  }

  // Kiểm tra các trường dữ liệu bắt buộc của trẻ
  if (!childData.ho_ten || !childData.ngay_sinh || !childData.gioi_tinh) {
    return res.status(400).json({
      success: false,
      message:
        "Vui lòng cung cấp đầy đủ Họ tên, Ngày sinh và Giới tính của trẻ.",
    });
  }

  try {
    // 3. BƯỚC 1: Lấy ID Hộ khẩu của cha/mẹ từ Model
    // Sử dụng parentUserID đã được xác thực để tìm thông tin hộ khẩu
    const parentInfo = await registerModel.getParentInfo(parentUserID);

    if (!parentInfo || !parentInfo["Số hộ khẩu"]) {
      return res.status(404).json({
        success: false,
        message: "Không tìm thấy thông tin hộ khẩu hợp lệ của người đăng ký.",
      });
    }

    const parent_id_ho_khau = parentInfo["Số hộ khẩu"];

    // 4. BƯỚC 2: Gọi Model để thực hiện Transaction chèn dữ liệu
    const result = await registerModel.registerNewBornResident(
      parent_id_ho_khau,
      childData
    );

    // 5. Trả về phản hồi thành công (HTTP 201 Created)
    return res.status(201).json(result);
  } catch (error) {
    // Xử lý lỗi từ Model (bao gồm lỗi Transaction rollback)
    console.error(
      "Lỗi tại Controller khi đăng ký nhân khẩu mới sinh:",
      error.message
    );
    return res.status(500).json({
      success: false,
      message: "Đăng ký thất bại do lỗi hệ thống hoặc database.",
      details: error.message,
    });
  }
};

module.exports = {
  handleNewbornRegistration,
};
