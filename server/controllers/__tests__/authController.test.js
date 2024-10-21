//__tests__/authController.test.js

const authController = require('../authController');
const db = require('../../config/index');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

jest.mock('../../config/index')
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

describe('authController', () => {
    let req;
    let res;

    beforeEach(() => {
        req = {
            body: {
                email: 'test@example.com',
                password: 'password123',
                accountType: 'volunteer'
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    describe('register', () => {
        it('should register a new user successfully', async () => {
            // Mock bcrypt hash
            bcrypt.hash.mockResolvedValue('hashedpassword');
    
            // Mock the database query
            const mockQuery = jest.fn().mockResolvedValue([{ affectedRows: 1 }]);
            db.mockResolvedValue({
                query: mockQuery
            });
    
            // Call the register function
            await authController.register(req, res);
    
            // Check that the response is a 201 status with success message
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ Status: 'Success' });
    
            // Check that bcrypt was called with the correct password
            expect(bcrypt.hash).toHaveBeenCalledWith('password123', 10);
    
            // Check that the database query was executed with the correct SQL and values
            expect(mockQuery).toHaveBeenCalledWith(
                "INSERT INTO UserCredentials (email, password, account_type) VALUES (?)",
                [['test@example.com', 'hashedpassword', 'volunteer']]
            );
        });
    
        it('should return a 409 error if the email is already registered', async () => {
            // Mock bcrypt hash
            bcrypt.hash.mockResolvedValue('hashedpassword');
    
            // Mock the database query to throw a duplicate entry error
            const mockQuery = jest.fn().mockRejectedValue({ code: 'ER_DUP_ENTRY' });
            db.mockResolvedValue({
                query: mockQuery
            });
    
            // Call the register function
            await authController.register(req, res);
    
            // Check that the response is a 409 status with an error message
            expect(res.status).toHaveBeenCalledWith(409);
            expect(res.json).toHaveBeenCalledWith({ Error: 'This email is already registered.' });
        });
    
        it('should return a 500 error if a database error occurs', async () => {
            // Mock bcrypt hash
            bcrypt.hash.mockResolvedValue('hashedpassword');
    
            // Mock the database query to throw a generic error
            const mockQuery = jest.fn().mockRejectedValue(new Error('Some DB error'));
            db.mockResolvedValue({
                query: mockQuery
            });
    
            // Call the register function
            await authController.register(req, res);
    
            // Check that the response is a 500 status with an error message
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ Error: 'Database error occurred.', Details: 'Some DB error' });
        });
    });

    describe('logout', () => {
        it('should return 200 and success when logging out', async () => {
            res.clearCookie = jest.fn();

            await authController.logout(req, res);

            expect(res.clearCookie).toHaveBeenCalledWith('token');
            expect(res.status).toHaveBeenCalledWith(200);
            expect(res.json).toHaveBeenCalledWith({ Status: 'Success' });
        });
    });
});
