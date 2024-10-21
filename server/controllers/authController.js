// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const salt = 10;

const db = require('../config/index')

exports.register = (req, res) => {
    const sql = "INSERT INTO UserCredentials (email, password, account_type) VALUES (?)";

    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) return res.status(500).json({ Error: "Error in hashing password." });

        const values = [req.body.email, hash, req.body.accountType];
        db.query(sql, [values], (err, result) => {
            if(err) {
                if(err.code === 'ER_DUP_ENTRY') {
                    return res.status(409).json({ Error: "This email is already registered." }); 
                }
                else {
                    return res.status(500).json({ Error: "Database error occurred." });
                }
            }

            return res.status(201).json({ Status: "Success" }); 
        })
    })
};

exports.login = (req, res) => {
    const sql = 'SELECT * FROM UserCredentials WHERE email = ?';

    db.query(sql, [req.body.email], (err, data) => {
        if (err) return res.status(500).json({ Error: "Database query error." });

        if(data.length > 0) {
            bcrypt.compare(req.body.password.toString(), data[0].password, (err, response) => {
                if (err) return res.status(500).json({ Error: "Error in bcrypt password comparison!" });
                
                if(response) {
                    const token = jwt.sign({ userId: data[0].user_id, username: data[0].email, accountType: data[0].account_type },
                        `${process.env.JWT_SECRET_KEY}`,
                        { expiresIn: '1d' }
                    );
                    res.cookie('token', token, { httpOnly: true });

                    return res.status(200).json({
                        Status: "Success", 
                        token,
                        isVerified: data[0].is_verified
                    });
                } else {
                    return res.status(401).json({ Error: "Incorrect password!" });
                }
            })
        } else {
            return res.status(404).json({ Error: "Incorrect email!" });
        }
    })
};


exports.logout = (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ Status: "Success" });
};

