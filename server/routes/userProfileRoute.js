const express = require('express');
const router = express.Router();
const userProfileController = require('../controllers/userProfileController');
const verifyToken = require("../middleware/verifyToken");

// CRUD 
router.post('/create', userProfileController.createUserProfile);
router.post('/userProfileManagement', userProfileController.createUserProfile);
router.get('/', userProfileController.getAllUserProfiles);
router.get('/:id', userProfileController.getUserProfileById);
router.put('/:id/update', userProfileController.updateUserProfileById);
router.delete('/:id/delete', userProfileController.deleteUserProfileById);

module.exports = router;
