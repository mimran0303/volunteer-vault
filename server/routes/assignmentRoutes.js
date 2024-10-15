
const express = require('express');
const { assignVolunteersToEvent } = require('../controllers/assignmentController');
const router = express.Router();

// POST route for assigning volunteers
router.post('/assign', assignVolunteersToEvent);

module.exports = router;
