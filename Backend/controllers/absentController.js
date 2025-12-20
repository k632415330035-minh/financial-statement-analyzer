const absentModel = require("../models/absentModel");

const insertNewAbsentDetails = async (req, res) => {
  const { cccd } = req.params;
  const { li_do, thoi_gian_tam_vang_begin, thoi_gian_tam_vang_end } = req.body;

  if (!li_do || !thoi_gian_tam_vang_begin || !thoi_gian_tam_vang_end || !cccd) {
    return res.status(400).json({
      message: "Thiếu thông tin bắt buộc",
    });
  }

  try {
    const result = await absentModel.insertNewAbsent(
      li_do,
      thoi_gian_tam_vang_begin,
      thoi_gian_tam_vang_end,
      cccd
    );
    return res.status(201).json({
      message: "Đăng ký tạm vắng thành công.",
      id_tv: result.insertId,
      affectedRows: result.affectedRows,
    });
  } catch (error) {
    console.error("Lỗi khi đăng ký tạm vắng:", error);
    return res.status(500).json({
      message: "Lỗi Server nội bộ khi đăng ký tạm vắng.",
      error: error.message,
    });
  }
};

const getAbsentDetails = async (req, res) => {
  try {
    const { cccd } = req.params; // Lấy cccd từ URL parameter

    if (!cccd) {
      return res.status(400).json({ message: "CCCD is required" });
    }

    const AbsentData = await absentModel.getAbsent(cccd);

    if (AbsentData && AbsentData.length > 0) {
      res.status(200).json(AbsentData);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error("Controller error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  insertNewAbsentDetails,
  getAbsentDetails,
};
