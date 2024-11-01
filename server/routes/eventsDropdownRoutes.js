
const express = require('express');
const { getEventsByAdmin } = require('../controllers/eventsDropdownController');
const authMiddleware = require('../middleware/verifyToken');
const router = express.Router();

router.get('/admin-events',authMiddleware, getEventsByAdmin);

module.exports = router;

