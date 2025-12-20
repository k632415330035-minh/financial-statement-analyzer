const residentModel = require("../models/residentModel");

const getResidentDetails = async (req, res) => {
  try {
    const { cccd } = req.params;

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
    console.error("Controller error (getResidentDetails): ", error);
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
      const totalMembers = HouseholdData.length;

      // Tìm Chủ hộ: Sử dụng trim() để đảm bảo khớp đúng
      const householder = HouseholdData.find(
        (member) =>
          member["Quan hệ với chủ hộ"] &&
          member["Quan hệ với chủ hộ"].toLowerCase().trim() === "chủ hộ"
      );

      const sourceData = householder || HouseholdData[0];

      const householderName = householder ? sourceData["Họ tên"] : "—";

      const idHoKhau = sourceData["Số hộ khẩu"] || "—";
      const address = sourceData["Địa chỉ"] || "—";

      const response = {
        householderName: householderName,
        totalMembers: totalMembers,
        members: HouseholdData,
        idHoKhau: idHoKhau,
        address: address,
      };

      res.status(200).json(response);
    } else {
      res.status(404).json({ message: "Household of this resident not found" });
    }
  } catch (error) {
    console.error("Controller error (getHouseholdDetails): ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getResidentDetails,
  getHouseholdDetails,
};
