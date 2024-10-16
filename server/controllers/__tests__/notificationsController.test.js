// notificationsController.test.js
const { getUserNotifications } = require('../../controllers/notificationsController');
const jwt = require('jsonwebtoken');

// Mocking notifications array
jest.mock('../../data/notifications', () => [
    { message: 'Notification 1', date: "2024-10-16T12:12:48.457Z", isRead: false,  userId: 1  },
    { message: 'Notification 2', date: "2024-10-16T12:12:48.457Z", isRead: false,  userId: 2  },
    { message: 'Notification 3', date: "2024-10-16T12:12:48.457Z", isRead: false,  userId: 1  },
]);

// Mock jwt module
jest.mock('jsonwebtoken');

describe('getUserNotifications', () => {
    let req, res;

    beforeEach(() => {
        req = {
            cookies: {
                token: 'fakeToken',  // Mock JWT token
            },
            user: {
                userId: 1,  // Mock userId
            }
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test('should return notifications for authenticated user', () => {
        // Mock jwt.verify to return a decoded token with the expected userId
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(null, { userId: 1 });
        });

        getUserNotifications(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            notifications: [
                {message: 'Notification 1', date: "2024-10-16T12:12:48.457Z", isRead: false,  userId: 1 },
                {message: 'Notification 3', date: "2024-10-16T12:12:48.457Z", isRead: false,  userId: 1 },
            ],
        });
    });

    test('should return 401 if token is not present', () => {
        req.cookies.token = null;  // Simulate no token

        getUserNotifications(req, res);

        expect(res.status).toHaveBeenCalledWith(401);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Not authenticated',
        });
    });

    test('should return 403 if token verification fails', () => {
        // Mock jwt.verify to simulate a verification error
        jwt.verify.mockImplementation((token, secret, callback) => {
            callback(new Error('Invalid token'), null);
        });

        getUserNotifications(req, res);

        expect(res.status).toHaveBeenCalledWith(403);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'Failed to authenticate token',
        });
    });
});
