const residentModel = require("../models/residentModel");

const getResidentDetails = async (req, res) => {
  try {
    const { cccd } = req.params; // Lấy cccd từ URL parameter

    if (!cccd) {
      return res.status(400).json({ message: "CCCD is required" });
    }

    const ResidentData = await residentModel.getResidentByCCCD(cccd);

    if (ResidentData) {
      res.status(200).json(ResidentData);
    } else {
      res
        .status(404)
        .json({ message: "Resident not found with the provided CCCD" });
    }
  } catch (error) {
    console.error("Controller error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getHouseholdDetails = async (req, res) => {
  try {
    const { cccd } = req.params;

    if (!cccd) {
      return res.status(400).json({ message: "CCCD is required" });
    }

    const HouseholdData = await residentModel.getHousehold(cccd);

    if (HouseholdData && HouseholdData.length > 0) {
      // Thực hiện tính toán và số nhân khẩu và tìm tên của chủ hộ
      const totalMembers = HouseholdData.length;
      const householder = HouseholdData.find(
        (member) => member["Quan hệ với chủ hộ"] === "chu ho"
      );
      const householderName = householder ? householder["Họ tên"] : "_";

      const response = {
        householderName: householderName,
        totalMembers: totalMembers,
        members: HouseholdData,
      };

      res.status(200).json(response);
    } else {
      res.status(404).json({ message: "Household of this resident not found" });
    }
  } catch (error) {
    console.error("Controller error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getResidentDetails,
  getHouseholdDetails,
};
