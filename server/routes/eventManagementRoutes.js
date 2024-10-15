const express = require('express');
const router = express.Router();
const eventManagementController = require('../controllers/eventManagementController');

const verifyToken = require("../middleware/verifyToken");

router.get('/events', verifyToken, eventManagementController.getEvents);
router.post('/create', eventManagementController.createEventManagement);
router.delete('/delete/:id', verifyToken, eventManagementController.deleteEvent);
router.put('/edit/:id', verifyToken, eventManagementController.editEvent);

module.exports = router;