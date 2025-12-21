const feedbackModel = require("../models/feedbackModel");
const getCountFeedbackStatus = async (req, res) => {
    try {
        const data = await feedbackModel.getCountFeedbackStatus();
        if (data) {
            res.status(200).json(data);
        } else {
            res
                .status(404)
                .json({ message: "Dữ liệu bị mất hoặc bạn không có quyền truy cập" });
        }
    } catch (error) {
        console.error("Controller error: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const getFeedbackData = async (req, res) => {
    try {
        const data = await feedbackModel.getFeedbackData();
        if (data) {
            res.status(200).json(data);
        } else {
            res
                .status(404)
                .json({ message: "Dữ liệu bị mất hoặc bạn không có quyền truy cập" });
        }
    } catch (error) {
        console.error("Controller error: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};

const updateFeedbackStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { newStatus, note } = req.body;
        const result = await feedbackModel.updateFeedbackStatus(id, newStatus, note);
        if (result.affectedRows > 0) {
            res.status(200).json({ message: "Cập nhật trạng thái phản ánh thành công" });
        } else {
            res.status(404).json({ message: "Phản ánh không tồn tại hoặc không thể cập nhật" });
        }
    } catch (error) {
        console.error("Controller error: ", error);
        res.status(500).json({ message: "Internal Server Error" });
    }
};
module.exports = {
    getCountFeedbackStatus, getFeedbackData, updateFeedbackStatus
};