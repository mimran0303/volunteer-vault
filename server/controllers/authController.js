// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let users = require("../data/users"); // Import hardcoded data
const salt = 10;

exports.register = (req, res) => {
    const userExists = users.find(user => user[1] === req.body.email);
    if (userExists) {
        return res.json({ Error: "This email is already registered." });
    }

    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) return res.json({ Error: "Error in hashing password!" });
        const values = [
            req.body.accountType,
            req.body.email,
            hash
        ];

        users.push(values);
        return res.json({ Status: "Success" });
    });
};

exports.login = (req, res) => {
    const { email, password } = req.body;
    const user = users.find((user) => user[1] === email);

    if (!user) {
        return res.json({ Error: "Incorrect Email!" });
    }

    bcrypt.compare(password.toString(), user[2], (err, response) => {
        if (err) {
            return res.json({ Error: "Error in bcrypt password comparison!" });
        }
        if (response) {
            const token = jwt.sign(
                { username: user[1], accountType: user[0] },
                `${process.env.JWT_SECRET_KEY}`,
                { expiresIn: '1d' }
            );
            res.cookie('token', token, { httpOnly: true });
            return res.json({ Status: "Success" });
        } else {
            return res.json({ Error: "Incorrect password!" });
        }
    });
};

exports.logout = (req, res) => {
    res.clearCookie('token');
    return res.json({ Status: "Success" });
};