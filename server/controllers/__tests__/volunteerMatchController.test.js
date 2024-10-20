// volunteerMatchController.test.js
const { matchVolunteersToEventController } = require('../../controllers/volunteerMatchController');
const { matchVolunteersToEvent } = require('../../utils/volunteerMatch');

// Mocking the utility function
jest.mock('../../utils/volunteerMatch');

describe('matchVolunteersToEventController', () => {
    let req, res;

    beforeEach(() => {
        req = {
            body: {
                skills: 'Communication Skills',
                city: 'Houston',
                state: 'TX',
                zipcode: '10001',
                availability: '2024-01-01',
            },
        };
        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test('should return 200 and matched volunteers', () => {
        const mockMatches = [{
            fullName: 'John Doe',
            skills: 'Cooking',
            city: 'New York',
            state: 'NY',
            zipcode: '10001',
        }];
        
        matchVolunteersToEvent.mockReturnValue(mockMatches);

        matchVolunteersToEventController(req, res);
        
        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ matches: mockMatches });
    });

    test('should return 500 if there is an error', () => {
        matchVolunteersToEvent.mockImplementation(() => { throw new Error('Something went wrong'); });

        matchVolunteersToEventController(req, res);
        
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ success: false, message: 'Something went wrong' });
    });
});
