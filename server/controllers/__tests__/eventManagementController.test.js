const request = require('supertest');
const eventManagementController = require('../eventManagementController');

let eventDetails = require('../../data/eventManagement');

describe('Event Management Controller', () => {
    beforeEach(() => {
        req = {
            body: {
                event_id: eventDetails.length + 1,
                eventName: '',
                location: '',
                eventDescription: '',
                urgency: '',
                date: ''
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(), 
        }
    });

    it('should create a new event', async () => {
        const req = {
            body: {
              eventName: 'New Event',
              location: 'New Location',
              eventDescription: 'New Description',
              urgency: 'high',
              date: '2024-02-02',
            },
        };
        
        eventManagementController.createEventManagement(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            event_id: eventDetails.length,
            eventName: 'New Event',
            location: 'New Location',
            eventDescription: 'New Description',
            urgency: 'high',
            date: '2024-02-02',
        });
    });
})