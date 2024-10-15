const express = require('express');
const router = express.Router();
const eventManagementController = require('../controllers/eventManagementController');

const verifyToken = require("../middleware/verifyToken");

router.get('/events', verifyToken, eventManagementController.getEvents);
router.post('/create', eventManagementController.createEventManagement);

// router.post('/eventManagementForm', eventManagementController.createEventManagement);
// router.get('/', eventManagementController.getEventManagement);
// router.get('/:id', eventManagementController.getEventManagementId);
// router.put('/:id/update', eventManagementController.updateEventManagementId);
// router.delete('/:id/delete', eventManagementController.deleteEventManagementId);

module.exports = router;