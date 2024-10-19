// routes/authRoutes.js
const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const userManagementController = require("../controllers/userProfileController");

const verifyToken = require("../middleware/verifyToken");


// the functionality of these routes are found in controllers. These routes take on the authController
router.post("/register", authController.register);
router.post("/login", authController.login);
router.get("/logout", authController.logout);
// router.post("/userProfileManagement/create", verifyToken, userManagementController.createUserProfile);

module.exports = router;