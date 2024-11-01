// notificationsController.test.js
const { getNotifications } = require('../notificationsController');
const initializeDatabaseConnection = require('../../config/index');

jest.mock('../../config/index'); // Mock the database connection

describe('getNotifications', () => {
    let mockReq, mockRes, mockDbConnection;

    beforeEach(() => {
        mockReq = { params: { recipientId: 1 } };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockDbConnection = {
            query: jest.fn(),
            end: jest.fn()
        };
        initializeDatabaseConnection.mockResolvedValue(mockDbConnection);
    });

    it('should respond with notifications if found', async () => {
        const mockNotifications = [
            { notification_id: 1, recipient_id: 1, event_id: 5, message: 'You have been assigned to "Event 1" with event ID 5.', date: '2024-10-30', is_read: 0 }
        ];
        
        mockDbConnection.query.mockResolvedValue([mockNotifications]);

        await getNotifications(mockReq, mockRes);

        expect(mockDbConnection.query).toHaveBeenCalledWith(
            expect.stringContaining('SELECT * FROM notifications WHERE recipient_id = ?'), 
            [mockReq.params.recipientId]
        );
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ success: true, notifications: mockNotifications });
    });

    it('should respond with 404 if no notifications are found', async () => {
        mockDbConnection.query.mockResolvedValue([[]]); // No notifications found

        await getNotifications(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(404);
        expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'No notifications found.' });
    });

    it('should handle errors and respond with 500 status', async () => {
        mockDbConnection.query.mockRejectedValue(new Error('Database error'));

        await getNotifications(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Error fetching notifications' });
    });
});
