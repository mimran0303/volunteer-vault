const { assignVolunteersToEvent } = require('../assignmentController');
const db = require('../../config/index');

jest.mock('../../config/index'); // Mock the database connection

describe('assignVolunteersToEvent', () => {
    let mockReq, mockRes, mockDbConnection;

    beforeEach(() => {
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

    it('should return 400 if eventId or volunteerIds are invalid', async () => {
        mockReq = { body: { eventId: null, volunteerIds: [] } };
        
        await assignVolunteersToEvent(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(400);
        expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Invalid event ID or volunteer list.' });
    });

    it('should assign volunteers to an event and create notifications successfully', async () => {
        mockReq = { body: { eventId: 1, volunteerIds: [1, 3] } };
        
        // Mock database responses in the exact sequence the function performs them
        mockDbConnection.query
            .mockResolvedValueOnce([[{ event_name: 'Charity Event' }]]) // Fetch event name
            .mockResolvedValueOnce([]) // Insert for first volunteer in volunteerMatch
            .mockResolvedValueOnce([]) // Insert notification for first volunteer
            .mockResolvedValueOnce([]) // Insert for second volunteer in volunteerMatch
            .mockResolvedValueOnce([]); // Insert notification for second volunteer
    
        await assignVolunteersToEvent(mockReq, mockRes);
    
        expect(mockDbConnection.query).toHaveBeenNthCalledWith(1, expect.stringContaining('SELECT event_name FROM eventdetails WHERE event_id = ?'), [1]);
        expect(mockDbConnection.query).toHaveBeenNthCalledWith(2, expect.stringContaining('INSERT INTO volunteerMatch'), [1, 1]);
        expect(mockDbConnection.query).toHaveBeenNthCalledWith(3, expect.stringContaining('INSERT INTO volunteerMatch'), [3, 1]);
        expect(mockDbConnection.query).toHaveBeenNthCalledWith(4, expect.stringContaining('INSERT INTO notifications'), [1, 1, 'You have been assigned to event "Charity Event" with event ID 1.']);
        expect(mockDbConnection.query).toHaveBeenNthCalledWith(5, expect.stringContaining('INSERT INTO notifications'), [3, 1, 'You have been assigned to event "Charity Event" with event ID 1.']);

        
        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ success: true, message: 'All volunteers assigned successfully!', successes: [
            'Volunteer 1 assigned successfully', 
            'Volunteer 3 assigned successfully'
        ]});
    });
    

    it('should return 207 if some assignments succeed and others fail', async () => {
        mockReq = { body: { eventId: 1, volunteerIds: [1, 3, null] } };

        // Mock database responses in order of execution
        mockDbConnection.query
            .mockResolvedValueOnce([[{ event_name: 'Charity Event' }]]) // Fetch event name
            .mockResolvedValueOnce([]) // Insert for volunteer 3
            .mockResolvedValueOnce([]) // Notification for volunteer 3
            .mockRejectedValueOnce({ code: 'ER_DUP_ENTRY' }) // Duplicate entry error for volunteer 1
            .mockResolvedValueOnce([]); // Skip null/undefined volunteer ID error

        await assignVolunteersToEvent(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(207);
        expect(mockRes.json).toHaveBeenCalledWith({
            success: false,
            message: "Some assignments were successful, but there were errors.",
            successes: ['Volunteer 3 assigned successfully'],
            errors: [
                'Volunteer ID cannot be null or undefined',
                'Volunteer 1 is already assigned to this event.'
            ]
        });
    });

    it('should handle database connection errors and respond with 500 status', async () => {
        mockReq = { body: { eventId: 1, volunteerIds: [1, 3] } };

        mockDbConnection.query.mockRejectedValueOnce(new Error('Database connection error'));

        await assignVolunteersToEvent(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Error assigning volunteers.' });
    });
});
