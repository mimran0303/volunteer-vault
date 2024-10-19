const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');
const verifyToken = require("../middleware/verifyToken");

// CRUD 
// router.post('/create', userProfileController.createUserProfile);
router.post('/userProfileManagement/create', userProfileController.createUserProfile);
// router.post('/userProfileManagement', userProfileController.createUserProfile);
// router.get('/', userProfileController.getAllUserProfiles);
router.get('/:id', verifyToken, userProfileController.getUserProfileById);
router.put('/:id/update', userProfileController.updateUserProfileById);
// router.get('/profile', verifyToken, userProfileController.getUserProfileByToken);
// router.put('/edit/:id', verifyToken, eventManagementController.editEvent); // edits a selected event


module.exports = router;