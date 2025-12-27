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

const getTempDetail = async (req, res) => {
    try {
        const { id } = req.params;
        const temp = await tempManagementModel.getTempDetail(id);
        res.status(200).json(temp);
    } catch (error) {
        console.log("Controller error: ", error);
        res.status(500).json(error);
    }
}

const approveTempRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const temp = await tempManagementModel.approveTempRecord(id);
        res.status(200).json(temp);
    } catch (error) {
        console.log("Controller error: ", error);
        res.status(500).json(error);
    }
}

const rejectTempRecord = async (req, res) => {
    try {
        const { id } = req.params;
        const { reason } = req.body;
        console.log(reason);
        console.log(id);
        const temp = await tempManagementModel.rejectTempRecord(id, reason);
        res.status(200).json(temp);
    } catch (error) {
        console.log("Controller error: ", error);
        res.status(500).json(error);
    }
}

const getTamTruTemp = async (req, res) => {
    try {
        const temp = await tempManagementModel.getTamTruTemp();
        res.status(200).json(temp);
    } catch (error) {
        console.log("Controller error: ", error);
        res.status(500).json(error);
    }
}

module.exports = {
    getAllTemp,
    getTempDetail,
    approveTempRecord,
    rejectTempRecord,
    getTamTruTemp
};