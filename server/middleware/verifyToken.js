// middleware/verifyToken.js
const jwt = require("jsonwebtoken");

const verifyToken = (req, res, next) => {
    // Check for token in headers first, then cookies
    const token = req.headers.authorization?.split(' ')[1] || req.cookies.token;

    if (!token) {
        return res.status(401).json({ Error: "You are not authenticated" });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            console.error("Token verification error:", err);
            return res.status(403).json({ Error: "Token is not valid" });
        } else {
            req.user = decoded; // Attach decoded token data to req.user
            console.log("Token is valid, user:", req.user); // Log the user data
            next();
        }
    });
};

module.exports = verifyToken;



// const jwt = require("jsonwebtoken");
//
// const verifyToken = (req, res, next) => {
//     const token = req.cookies.token;
//     //console.log("JWT Token from cookie: ", token);
//
//     if (!token) {
//         return res.json({ Error: "You are not authenticated." });
//     }
//
//     jwt.verify(token, `${process.env.JWT_SECRET_KEY}`, (err, decoded) => {
//         if (err) {
//             console.error("Token verification error: ", err);
//             return res.json({ Error: "Token is not OK." });
//         } else {
//             req.user = decoded;
//             //console.log("Token is valid, user: ", decoded);
//             next();
//         }
//     });
// };
//
// module.exports = verifyToken;
//
