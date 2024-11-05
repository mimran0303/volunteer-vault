const express = require('express');
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

const reportController = require("../controllers/reportController")

router.post('/generate', verifyToken, reportController.generateReport); 

module.exports = router;