// routes/protectedRoutes.js
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/verifyToken");

router.get('/dashboard', verifyToken, (req, res) => {
    /*
    user object is created on registration under a jwt token signature 
    'user' details such as username, account type, can be retrieved from middleware verifyToken
    see http://localhost:8080/protected/dashboard to see the response json message, if authenticated
    */
     
    res.json({ message: 'This is a protected route!', user: req.user });
});

module.exports = router;
