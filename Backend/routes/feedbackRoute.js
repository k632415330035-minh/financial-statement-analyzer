const express = require("express");
const feedbackRouter = express.Router();
const Controller = require("../controllers/feedbackController");

feedbackRouter.get("/get/CountFeedbackStatus", Controller.getCountFeedbackStatus);
feedbackRouter.get("/get/FeedbackData", Controller.getFeedbackData);
feedbackRouter.put("/update/FeedbackDone/:id", Controller.updateFeedbackStatus);
// feedbackRouter.get("/get/CountFeedbackStatus/test", Controller.getCountFeedbackStatusTest);
module.exports = feedbackRouter;