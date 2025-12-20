const petitionModel = require("../models/petitionModel");
const residentModel = require("../models/residentModel");

const getPetitionDetails = async (req, res) => {
  try {
    const { cccd } = req.params; // Lấy cccd từ URL parameter

    if (!cccd) {
      return res.status(400).json({ message: "CCCD is required" });
    }

    const PetitionData = await petitionModel.getPetitionInfo(cccd);

    if (PetitionData) {
      res.status(200).json(PetitionData);
    } else {
      res
        .status(404)
        .json({ message: "Petition not found with the provided CCCD" });
    }
  } catch (error) {
    console.error("Controller error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const createNewPetition = async (req, res) => {
  try {
    const { loai_phan_anh, noi_dung, cccd } = req.body;

    if (!cccd || !loai_phan_anh || !noi_dung) {
      return res.status(400).json({
        message: "Thiếu dữ liệu bắt buộc (cccd, loại phản ánh, hoặc nội dung).",
      });
    }

    const resident = await residentModel.getResidentByCCCD(cccd);

    if (!resident || !resident.id_cd) {
      return res.status(404).json({
        message: "Không tìm thấy thông tin công dân hoặc ID công dân",
      });
    }

    const idCd = resident.id_cd; // Lấy id_cd thực tế

    const result = await petitionModel.insertNewPetition(
      loai_phan_anh,
      noi_dung,
      idCd
    );

    res.status(201).json({
      message: "Phản ánh đã được gửi thành công.",
      id: result.insertId, // Trả về ID phản ánh mới
    });
  } catch (error) {
    console.error("Controller error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getPetitionDetails,
  createNewPetition,
};
