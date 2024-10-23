// middleware/verifyToken.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    const token = req.cookies.token;
    //console.log("JWT Token from cookie: ", token);

    if (!token) {
        return res.json({ Error: "You are not authenticated." });
    }

    jwt.verify(token, `${process.env.JWT_SECRET_KEY}`, (err, decoded) => {
        if (err) {
            console.error("Token verification error: ", err);
            return res.json({ Error: "Token is not OK." });
        } else {
            req.user = decoded;
            //console.log("Token is valid, user: ", decoded);
            next();
        }
    });
};

module.exports = verifyToken;

