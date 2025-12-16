const managerModel = require("../models/managerModel");
const getAllAccountsInfo = async (req, res) => {
    try {
        const data = await managerModel.getAllResidentAccount();

        if (data) {
            res.status(200).json(data);
        } else {
            res
                .status(404)
                .json({ message: "Absent not found with the provided CCCD" });
        }
    } catch (error) {
        console.error("Controller error: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

module.exports = {
    getAllAccountsInfo
};