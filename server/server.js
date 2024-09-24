const express = require("express");
const app = express();
const PORT = 8080;

const cors = require("cors");
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(express.json());

// Environment
const dotenv = require('dotenv');
dotenv.config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

const cookieParser = require("cookie-parser");
app.use(cookieParser())

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
    ["administrator", "user2@example.com", bcrypt.hashSync('password2', salt)]
]

// * Middleware
const verifyToken = (req, res, next) => {
    const token = req.cookies.token; // Get token from cookies
  
    if (!token) {
      return res.json({Error: "You are not authenticated."});
    }
  
    // Verify the token
    jwt.verify(token, `${process.env.JWT_SECRET_KEY}`, (err, decoded) => {
      if (err) {
        return res.json({Error: "Token is not OK."});
      } else {
        // Token is valid, attach user data to request and proceed
        req.user = decoded;
        next();
      }
    });
  };
  

app.get('/dashboard', verifyToken, (req, res) => {
    res.json({ message: 'This is a protected route!', user: req.user });
})


app.post('/register', (req, res) => {
    bcrypt.hash(req.body.password.toString(), salt, (err, hash) => {
        if(err) return res.json({Error: "Error in hashing password!"});
        const values = [
            req.body.accountType,
            req.body.email,
            hash
        ]

        // TODO: ensure no duplicate emails
        
        users.push(values);
        console.log(users);
        // res.status(200).json({ message: 'Data received successfully!' });
        return res.json({Status: "Success"});
    })
})

app.post("/login", (req, res) => {
    const { email, password } = req.body;

    // Find the user based on the email
    const user = users.find((user) => user[1] === email);

    if(!user) {
        return res.json({ Error: "Incorrect Email!" });
    }
    else {
        bcrypt.compare(password.toString(), user[2], (err, response) => {
            if(err) {
                return res.json({ Error: "Error in bcrypt password comparison!" });
            }    
            if(response) {
                const username = user[1]
                const accountType = user[0]
                const token = jwt.sign({username, accountType}, `${process.env.JWT_SECRET_KEY}`, {expiresIn: '1d'})
                res.cookie('token', token, { httpOnly: true });
                return res.json({Status: "Success"});
            } else {
                return res.json({Error: "Incorrect password!"});
            }
        })
    }
})

app.get('/logout', (req, res) => {
    res.clearCookie('token')
    return res.json({Status: "Success"});
})

app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`)
})