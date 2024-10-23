const express = require("express");
const router = express.Router();
const volunteerHistoryController = require("../controllers/volunteerHistoryController");

// This file defines a specific endpoint (/retrieveHistory) that handles HTTP requests (in the controller file).
// This file and controller file can be combined, but this project is structured to keep them separately.
// ** API endpoint is POST /retrieveHistory **

router.get("/retrieveHistory", volunteerHistoryController.retrieveHistory);
// router.get("/updateStatus", volunteerHistoryController.updateParticipationStatus);

module.exports = router;