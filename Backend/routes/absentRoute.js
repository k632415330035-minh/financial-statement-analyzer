const express = require("express");
const router = express.Router();
const absentController = require("../controllers/absentController");

router.post("/newabsent/:cccd", absentController.insertNewAbsentDetails);

router.get("/absent/:cccd", absentController.getAbsentDetails);
module.exports = router;
