const tempManagementModel = require("../models/temporaryManagementModel");

const getAllTemp = async (req, res) => {
    try {
        const temp = await tempManagementModel.getAllTemp();
        res.status(200).json(temp);
    } catch (error) {
        console.log("Controller error: ", error);
        res.status(500).json(error);
    }
}

module.exports = {
    getAllTemp
};