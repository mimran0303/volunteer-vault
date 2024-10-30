const volunteerMatchController = require('../volunteerMatchController')
const db = require('../../config/index');

jest.mock('../../config/index')

describe('volunteerMatchController', () => {
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
            json: jest.fn(),
            cookie: jest.fn()
        };

        jest.clearAllMocks();
    });
})