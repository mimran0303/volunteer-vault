// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const salt = 10;

const db = require('../config/index')

exports.register = async (req, res) => {
    const sql = "INSERT INTO UserCredentials (email, password, account_type) VALUES (?)";

    try {
        // Hash the password
        const hashedPassword = await bcrypt.hash(req.body.password.toString(), salt);
        const values = [req.body.email, hashedPassword, req.body.accountType];

        // Get database connection
        const db_con = await db();

        // Execute the query using the connection
        await db_con.query(sql, [values]);

        // Respond with success
        return res.status(201).json({ Status: "Success" });

    } catch (err) {
        if (err.code === 'ER_DUP_ENTRY') {
            return res.status(409).json({ Error: "This email is already registered." });
        } else {
            return res.status(500).json({ Error: "Database error occurred.", Details: err.message });
        }
    }
};

exports.login = async (req, res) => {
    const sql = 'SELECT * FROM UserCredentials WHERE email = ?';

    try {
        // Get the database connection 
        const db_con = await db();

        // Execute the query using async/await
        const [data] = await db_con.query(sql, [req.body.email]);

        if (data.length > 0) {
            // Compare the password using bcrypt
            const passwordMatch = await bcrypt.compare(req.body.password.toString(), data[0].password);

            if (passwordMatch) {
                // Generate JWT token
                const token = jwt.sign(
                    { userId: data[0].user_id, username: data[0].email, accountType: data[0].account_type },
                    `${process.env.JWT_SECRET_KEY}`,
                    { expiresIn: '1d' }
                );

                // Set the token in an httpOnly cookie
                res.cookie('token', token, { httpOnly: true });

                // Send success response
                return res.status(200).json({
                    Status: "Success",
                    token,
                    isVerified: data[0].is_verified
                });
            } else {
                // The password is incorrect
                return res.status(401).json({ Error: "Incorrect password!" });
            }
        } else {
            // The email is not found
            return res.status(404).json({ Error: "Incorrect email!" });
        }
    } catch (err) {
        // console.error('Login error:', err.message);
        return res.status(500).json({ Error: "Server error." });
    }
};


exports.logout = (req, res) => {
    res.clearCookie('token');
    return res.status(200).json({ Status: "Success" });
};

