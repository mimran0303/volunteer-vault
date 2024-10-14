
const bcrypt = require("bcrypt");
const salt = 10;

let users = [
    ["volunteer", "user1@example.com", bcrypt.hashSync('password1', salt), 1],
    ["administrator", "user2@example.com", bcrypt.hashSync('password2', salt), 2]
];

module.exports = users;


// let users = [
//     {
//         id: 1,  // Matches with userProfiles id
//         role: "volunteer", 
//         email: "user1@example.com",
//         password: bcrypt.hashSync('password1', salt)  // Hashed password
//     },
//     {
//         id: 2,  // Matches with userProfiles id
//         role: "administrator", 
//         email: "user2@example.com",
//         password: bcrypt.hashSync('password2', salt)
//     }
// ];