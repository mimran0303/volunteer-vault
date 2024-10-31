const express = require('express');
const router = express.Router();
const volunteerReviewController = require("../controllers/volunteerReviewController");

const verifyToken = require("../middleware/verifyToken");

router.get("/overview", verifyToken, volunteerReviewController.getOverview);
router.post("/review", volunteerReviewController.postReview)

module.exports = router;