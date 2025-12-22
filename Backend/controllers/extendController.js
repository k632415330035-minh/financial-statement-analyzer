const extendModel = require("../models/extendModel");

const checkStatus = async (req, res) => {
  try {
    const { cccd } = req.params;
    const status = await extendModel.getResidentStatus(cccd);

    if (!status) {
      return res
        .status(404)
        .json({ message: "Không tìm thấy thông tin cư trú" });
    }

    return res.status(200).json(status);
  } catch (error) {
    return res
      .status(500)
      .json({ message: "Lỗi hệ thống", error: error.message });
  }
};

const extendResident = async (req, res) => {
  try {
    const { cccd } = req.params;
    const { newEndDate } = req.body;

    const status = await extendModel.getResidentStatus(cccd);

    if (status && status.pending) {
      return res
        .status(400)
        .json({ message: "Bạn đã có đơn đang chờ duyệt, không thể gửi thêm." });
    }

    if (!newEndDate) {
      return res
        .status(400)
        .json({ message: "Vui lòng chọn ngày gia hạn mới" });
    }

    const result = await extendModel.createExtensionRequest(cccd, newEndDate);

    return res.status(200).json({
      message: "Gửi yêu cầu gia hạn thành công, vui lòng chờ duyệt",
      data: result,
    });
  } catch (error) {
    return res.status(500).json({
      message: error.message || "Lỗi khi thực hiện gia hạn",
      error: error.message,
    });
  }
};

module.exports = {
  checkStatus,
  extendResident,
};
