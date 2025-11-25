const express = require("express");
const router = express.Router();
const residentController = require("../controllers/residentController");

router.get("/resident/:cccd", residentController.getResidentDetails);

router.get("/household/:cccd", residentController.getHouseholdDetails);

module.exports = router;
