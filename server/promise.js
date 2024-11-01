const mysql = require('mysql2/promise');

// Example of creating a connection
async function connectToDatabase() {
    const connection = await mysql.createConnection({
        host: 'localhost',
        user: 'root',
        password: 'password',
        database: 'test'
    });

    console.log('Connected to the database');
    // Your queries here

    await connection.end();
}

connectToDatabase();
