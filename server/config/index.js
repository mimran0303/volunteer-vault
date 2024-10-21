// config/index.js
require('dotenv').config({ path: '../.env' });

const mysql = require('mysql2/promise');

console.log('DB Host:', process.env.DB_HOST);
console.log('DB User:', process.env.DB_USER);
console.log('DB Password:', process.env.DB_PASSWORD);
console.log('DB Database:', process.env.DB_DATABASE);

async function initializeDatabaseConnection() {
    try {
        const db_con = await mysql.createConnection({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });

        console.log('Connected to database'); // ? no idea why this wont show up, shows up in tests ???
        return db_con;
    } catch (err) {
        console.error('Error connecting to the database:', err.message);
        throw err;
    }
}

module.exports = initializeDatabaseConnection;