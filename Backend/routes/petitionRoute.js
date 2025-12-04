const express = require("express");
const router = express.Router();
const petitionController = require("../controllers/petitionController");

router.get("/petition/:cccd", petitionController.getPetitionDetails);

router.post("/newpetition/:cccd", petitionController.createNewPetition);
module.exports = router;
