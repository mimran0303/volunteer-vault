// controllers/__tests__/authController.test.js
const authController = require('../authController');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// Mock bcrypt and jwt methods
jest.mock('bcrypt');
jest.mock('jsonwebtoken');

// Mock users data
let users = require('../../data/users'); 

describe('Auth Controller', () => {


    beforeEach(() => {
        req = {
            body: {
                email: '',
                password: '',
                accountType: ''
            }
        };
        res = {
            json: jest.fn(),
            cookie: jest.fn(),
            clearCookie: jest.fn()
        };
    });

    describe('register', () => {
        it('should return error if email is already registered', () => {
            req.body.email = 'user1@example.com';
            req.body.password = 'password1';
            req.body.accountType = 'volunteer';

            authController.register(req, res);

            expect(res.json).toHaveBeenCalledWith({ Error: "This email is already registered." });
        });

        it('should hash password and register a new user', async () => {
            req.body.email = 'newuser@example.com';
            req.body.password = 'newpassword';
            req.body.accountType = 'volunteer';

            bcrypt.hash.mockImplementation((password, saltRounds, callback) => {
                callback(null, 'hashed_password');
            });

            await authController.register(req, res);

            expect(bcrypt.hash).toHaveBeenCalledWith(req.body.password.toString(), 10, expect.any(Function));
            expect(users[users.length - 1]).toEqual(['volunteer', 'newuser@example.com', 'hashed_password']);
            expect(res.json).toHaveBeenCalledWith({ Status: "Success" });
        });

        it('should return error if bcrypt fails during registration', async () => {
            req.body.email = 'newuser@example.edu';
            req.body.password = 'newpassword';
            req.body.accountType = 'volunteer';

            bcrypt.hash.mockImplementation((password, saltRounds, callback) => {
                callback(new Error('Hash error'), null);
            });

            await authController.register(req, res);

            expect(res.json).toHaveBeenCalledWith({ Error: "Error in hashing password!" });
        });
    });

    describe('login', () => {
        it('should return error if email is not found', () => {
            req.body.email = 'nonexistent@example.com';
            req.body.password = 'somepassword';

            authController.login(req, res);

            expect(res.json).toHaveBeenCalledWith({ Error: "Incorrect Email!" });
        });

        it('should return error if bcrypt comparison fails during login', async () => {
            req.body.email = 'user1@example.com';
            req.body.password = 'password1';

            const mockUser = ['volunteer', 'user1@example.com', '$2b$10$somehashedpassword']; 
            users.find = jest.fn().mockReturnValue(mockUser);

            bcrypt.compare = jest.fn((password, hash, callback) => {
                callback(new Error('Bcrypt compare error'), false);
            });

            await authController.login(req, res);

            expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password.toString(), mockUser[2], expect.any(Function));
            expect(res.json).toHaveBeenCalledWith({ Error: "Error in bcrypt password comparison!" });
        });

        it('should return error if password is incorrect', async () => {
            req.body.email = 'user1@example.com';
            req.body.password = 'wrongpassword';

            bcrypt.compare.mockImplementation((password, hash, callback) => {
                callback(null, false);
            });

            await authController.login(req, res);

            expect(res.json).toHaveBeenCalledWith({ Error: "Incorrect password!" });
        });

        it('should return a success and set JWT token if login is correct', async () => {
            req.body.email = 'user1@example.com';
            req.body.password = 'password1';

            bcrypt.compare.mockImplementation((password, hash, callback) => {
                callback(null, true);
            });

            jwt.sign.mockReturnValue('mocked_jwt_token');

            await authController.login(req, res);

            expect(bcrypt.compare).toHaveBeenCalledWith(req.body.password.toString(), expect.any(String), expect.any(Function));
            expect(jwt.sign).toHaveBeenCalledWith(
                { username: 'user1@example.com', accountType: 'volunteer' },
                expect.any(String),
                { expiresIn: '1d' }
            );
            expect(res.cookie).toHaveBeenCalledWith('token', 'mocked_jwt_token', { httpOnly: true });
            expect(res.json).toHaveBeenCalledWith({ Status: "Success", token: 'mocked_jwt_token' });
        });
    });

    describe('logout', () => {
        it('should clear the token cookie and return success', () => {
            authController.logout(req, res);

            expect(res.clearCookie).toHaveBeenCalledWith('token');
            expect(res.json).toHaveBeenCalledWith({ Status: "Success" });
        });
    });
});
