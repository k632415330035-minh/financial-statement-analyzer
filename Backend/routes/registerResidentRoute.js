const express = require("express");
const router = express.Router();
const registerController = require("../controllers/registerResidentController");

router.post("/register/children", registerController.handleNewbornRegistration);

module.exports = router;
