// data/users.js
const bcrypt = require("bcrypt");
const salt = 10;

let users = [
    ["volunteer", "user1@example.com", bcrypt.hashSync('password1', salt)],
    ["administrator", "user2@example.com", bcrypt.hashSync('password2', salt)]
];

module.exports = users;
