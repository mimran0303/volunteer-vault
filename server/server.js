const express = require("express");
const app = express();
const PORT = 8080;

const cors = require("cors");
app.use(cors());
app.use(express.json());

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const salt = 10;

// Hardcoded data
// let users = [
//     {
//       accountType: 'volunteer',
//       email: 'user1@example.com',
//       password: bcrypt.hashSync('password1', salt), 
//     },
//     {
//       accountType: 'administrator',
//       email: 'user2@example.com',
//       password: bcrypt.hashSync('password2', salt)
//     }
// ];

// let UserCredentials = [
//     {
//       id: '1',
//       passwordHash: bcrypt.hashSync('password1', salt), 
//     },
//     {
//       id: '2',
//       passwordHash: bcrypt.hashSync('password2', salt),
//     }
// ];


// ? [accountType, email, password]
let users = [
    ["volunteer", "user1@example.com", bcrypt.hashSync('password1', salt)],
    ["administrator", "user2@example.com", bcrypt.hashSync('password1', salt)]
]


app.post('/register', (req, res) => {
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if(err) return res.json({Error: "Error in hashing password!"});
        const values = [
            req.body.accountType,
            req.body.email,
            hash
        ]
        
        users.push(values);
        console.log(users);
        res.status(200).json({ message: 'Data received successfully!' });
    })
})


app.get("/login", (req, res) => {
    res.json({ message: "Hello!" })
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})