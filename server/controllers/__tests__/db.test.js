const initializeDatabaseConnection = require('../../config/index');
const mysql = require('mysql2/promise');

jest.mock('mysql2/promise');

describe('initializeDatabaseConnection', () => {
    it('should create a database connection successfully', async () => {
        // Mock the mysql.createConnection function
        const mockConnection = { connect: jest.fn() };
        mysql.createConnection.mockResolvedValue(mockConnection);
        
        // Call the function and check if it resolves without errors
        const connection = await initializeDatabaseConnection();
        expect(connection).toBe(mockConnection);
        expect(mysql.createConnection).toHaveBeenCalledWith({
            host: process.env.DB_HOST,
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            database: process.env.DB_DATABASE,
        });
    });

    it('should throw an error if database connection fails', async () => {
        // Mock mysql.createConnection to reject with an error
        mysql.createConnection.mockRejectedValue(new Error('Connection error'));
        
        // Expect the function to throw
        await expect(initializeDatabaseConnection()).rejects.toThrow('Connection error');
    });
});
