// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
// let users = require("../data/users"); // Import hardcoded data
const salt = 10;

const db = require('../config/index')

exports.register = (req, res) => {
    const sql = "INSERT INTO userCredentials (email, password, account_type) VALUES (?)";

    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if(err) return res.json({Error: "Error in hashing password."});

        const values = [req.body.email, hash, req.body.accountType];
        db.query(sql, [values], (err, result) => {
            if(err) {
                if(err.code === 'ER_DUP_ENTRY') {
                    return res.json({ Error: "This email is already registered." });
                }
                else {
                    // ! needs to be handled
                    throw err;
                }
            }

            return res.json({ Status: "Success" });
        })
    })
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    const user = users.find((user) => user[1] === email); // looking for existing email in users array

    if (!user) {
        return res.json({ Error: "Incorrect Email!" });
    }

    bcrypt.compare(password.toString(), user[2], (err, response) => {
        if (err) {
            return res.json({ Error: "Error in bcrypt password comparison!" });
        }
        if (response) {
            // JWT signature
            const token = jwt.sign(
                { username: user[1], accountType: user[0], userId: user[3], isVerified: user[4] },
                `${process.env.JWT_SECRET_KEY}`,
                { expiresIn: '1d' }
            );
            res.cookie('token', token, { httpOnly: true });
            // console.log(users)
            return res.json({ 
                Status: "Success", 
                token,
                isVerified: user[4]
            });
        } else {
            return res.json({ Error: "Incorrect password!" });
        }
    });
};


exports.logout = (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: "Success" });
};

