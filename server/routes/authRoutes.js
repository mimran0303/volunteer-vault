// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userManagementController = require("../controllers/userProfileController");
const eventManagementController = require("../controllers/eventManagementController");

// the functionality of these routes are found in controllers. These routes take on the authController
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
router.post("/userProfileManagement/create", userManagementController.createUserProfile);
router.post("/eventManagementForm/create", eventManagementController.createEventManagement);

module.exports = router;