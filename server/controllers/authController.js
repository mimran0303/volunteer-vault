// controllers/authController.js
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
let users = require("../data/users"); // Import hardcoded data
const salt = 10;

/*
The client side expects a response and is checking for either and Error or Status
see /register/page.js in the client side to see how these responses are handled under axios
try to display all the errors when logging in or registering (i.e. try registering under an existing email, log in with the wrong email/password)
*/
exports.register = (req, res) => {
    const userExists = users.find(user => user[1] === req.body.email); // looking for existing email in users array
    if (userExists) {
        return res.json({ Error: "This email is already registered." });
    }

    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if (err) return res.json({ Error: "Error in hashing password!" });
        const values = [
            req.body.accountType,
            req.body.email,
            hash, 
            users[users.length - 1][3] + 1,
            false
        ]; 

        users.push(values); // adding new user to users array
        console.log(users)
        return res.json({ Status: "Success" });
    });
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
            console.log(users)
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

