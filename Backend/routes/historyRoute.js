const express = require("express");
const router = express.Router();
const historyController = require("../controllers/historyController");

router.get("/history/restem/:cccd", historyController.getResTemDetails);
router.get("/history/absent/:cccd", historyController.getAbsentHistory);
router.get("/history/move/:cccd", historyController.getMoveDetails);

module.exports = router;
