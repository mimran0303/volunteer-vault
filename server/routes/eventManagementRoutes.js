const express = require('express');
const router = express.Router();
const eventManagementController = require('../controllers/eventManagementController');

const verifyToken = require("../middleware/verifyToken");

// verifyToken is included to obtain JWT token information, like user id. 
// The Token can be called from the /events, /delete/:id, and /edit/:id as req.user

router.get('/events', verifyToken, eventManagementController.getEvents); // gets all events that are tied to a specific admin
router.post('/create', eventManagementController.createEventManagement); // create a new event that is tied to a specific admin
router.delete('/delete/:id', verifyToken, eventManagementController.deleteEvent); // deletes a selected event
router.put('/edit/:id', verifyToken, eventManagementController.editEvent); // edits a selected event

module.exports = router;