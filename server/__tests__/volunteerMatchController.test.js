// controllers/volunteerMatchController.test.js
const { matchVolunteersToEventController } = require('../controllers/volunteerMatchController');
const { matchVolunteersToEvent } = require('../utils/volunteerMatch');

jest.mock('../utils/volunteerMatch');

describe('matchVolunteersToEventController', () => {
    const mockReq = {
        body: {
            skills: 'Research Skills',
            city: 'New York',
            state: 'NY',
            zip_code: '10001',
            availability: '2024-11-09'
        }
    };
    let mockRes;

    beforeEach(() => {
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn()
        };
    });

    it('should respond with matched volunteers', async () => {
        const mockMatchedVolunteers = [
            { volunteer_id: 1, full_name: 'John Doe', skills: 'Research Skills', city: 'New York', state: 'NY', zip_code: '10001', availability: '2024-11-09' }
        ];
        matchVolunteersToEvent.mockResolvedValue(mockMatchedVolunteers);

        await matchVolunteersToEventController(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(200);
        expect(mockRes.json).toHaveBeenCalledWith({ matches: mockMatchedVolunteers });
    });

    it('should handle errors and respond with 500 status', async () => {
        matchVolunteersToEvent.mockRejectedValue(new Error('Matching error'));

        await matchVolunteersToEventController(mockReq, mockRes);

        expect(mockRes.status).toHaveBeenCalledWith(500);
        expect(mockRes.json).toHaveBeenCalledWith({ success: false, message: 'Matching error' });
    });
});
