const express = require("express");
const testRouter = express.Router();
const Controller = require("../controllers/testControoler");

testRouter.get("/v1/get/getAllAcounts", Controller.getAllAccountsInfo);

module.exports = testRouter;