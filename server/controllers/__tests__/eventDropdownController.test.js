// eventsController.test.js
const { getEventsByAdmin } = require('../eventsDropdownController');
const db = require('../../config/index');

jest.mock('../../config/index'); // Mock the database connection

describe('getEventsByAdmin', () => {
    let mockReq, mockRes, mockDbConnection;

    beforeEach(() => {
        mockReq = { user: { userId: 2 } }; // Simulate authenticated admin ID
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
        mockDbConnection = {
            query: jest.fn(),
            end: jest.fn()
        };
        db.mockResolvedValue(mockDbConnection);
    });

    it('should respond with events if found', async () => {
        const mockEvents = [
            { event_id: 1, event_admin_id: 2, event_name: 'Charity Run', event_description: "Event description", location: "The Beach", city: "Houston", state: "TX", zip_code: 77073, required_skills: "Research Skills", urgency: "High", event_date: "2024-11-09" },
            { event_id: 2, event_admin_id: 2, event_name: 'Food Drive', event_description: "Event description", location: "The Pier", city: "Houston", state: "TX", zip_code: 77074, required_skills: "Communication Skills", urgency: "Low", event_date: "2024-11-11"}
        ];
        
        mockDbConnection.query.mockResolvedValue([mockEvents]);

        await getEventsByAdmin(mockReq, mockRes);

        expect(mockDbConnection.query).toHaveBeenCalledWith(
            expect.stringContaining('SELECT * FROM eventdetails WHERE event_admin_id = ?'),
            [mockReq.user.userId]
        );
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ success: true, events: mockEvents });
    });

    it('should respond with an empty events array if no events are found', async () => {
        mockDbConnection.query.mockResolvedValue([[]]); // No events found for the admin

        await getEventsByAdmin(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ success: true, events: [] });
    });

    it('should handle errors and respond with 500 status', async () => {
        mockDbConnection.query.mockRejectedValue(new Error('Database error'));

        await getEventsByAdmin(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Error fetching events.' });
    });
});
