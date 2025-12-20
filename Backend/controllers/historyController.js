const HistoryModel = require("../models/historyModel");

const getResTemDetails = async (req, res) => {
  try {
    const { cccd } = req.params; // Lấy cccd từ URL parameter

    if (!cccd) {
      return res.status(400).json({ message: "CCCD is required" });
    }

    const ResTem = await HistoryModel.getHistoryResTem(cccd);

    if (ResTem) {
      res.status(200).json(ResTem);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error("Controller error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getAbsentHistory = async (req, res) => {
  try {
    const { cccd } = req.params; // Lấy cccd từ URL parameter

    if (!cccd) {
      return res.status(400).json({ message: "CCCD is required" });
    }

    const AbHis = await HistoryModel.getHistoryAbsent(cccd);

    if (AbHis) {
      res.status(200).json(AbHis);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error("Controller error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

const getMoveDetails = async (req, res) => {
  try {
    const { cccd } = req.params; // Lấy cccd từ URL parameter

    if (!cccd) {
      return res.status(400).json({ message: "CCCD is required" });
    }

    const Move = await HistoryModel.getHistoryMove(cccd);

    if (Move) {
      res.status(200).json(Move);
    } else {
      res.status(200).json([]);
    }
  } catch (error) {
    console.error("Controller error: ", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

module.exports = {
  getResTemDetails,
  getAbsentHistory,
  getMoveDetails,
};
