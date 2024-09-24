// routes/protectedRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

router.get('/dashboard', verifyToken, (req, res) => {
    res.json({ message: 'This is a protected route!', user: req.user });
});

module.exports = router;
