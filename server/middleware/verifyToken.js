// middleware/verifyToken.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
  
    if (!token) {
        return res.json({ Error: "You are not authenticated." });
    }

    jwt.verify(token, `${process.env.JWT_SECRET_KEY}`, (err, decoded) => {
        if (err) {
            return res.json({ Error: "Token is not OK." });
        } else {
            req.user = decoded;
            next();
        }
    });
};

module.exports = verifyToken;