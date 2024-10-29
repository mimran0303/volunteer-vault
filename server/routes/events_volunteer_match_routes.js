
const express = require('express');
const { getEventsByAdmin } = require('../controllers/events_volunteer_match_controller');
const authMiddleware = require('../middleware/verifyToken');
const router = express.Router();

router.get('/admin-events',authMiddleware, getEventsByAdmin);

module.exports = router;

