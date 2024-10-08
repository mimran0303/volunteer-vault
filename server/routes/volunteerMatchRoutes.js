
const express = require('express');
const { matchVolunteersToEventController } = require('../controllers/volunteerMatchController');
const router = express.Router();

// POST route for volunteer matching
router.post('/match', matchVolunteersToEventController);

module.exports = router;
