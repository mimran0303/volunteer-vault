const request = require('supertest');
const eventManagementController = require('../eventManagementController');

let eventDetails = require('../../data/eventManagement');

describe('Event Management Controller', () => {
    let req, res;
    
    beforeEach(() => {
        req = {
            user: { userId: 2 }, // Default mock user
            body: {
                eventAdminId: '',
                eventName: '',
                location: '',
                eventDescription: '',
                urgency: '',
                date: ''
            },
            params: {
                id: 2
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(), 
        };
    });

    // getEvents test
    it('should get an admins events', async () => {
        req.user.userId = 2; // Mock the logged-in user's ID

        eventManagementController.getEvents(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([eventDetails[0]]);
    })

    // createEventManagement test
    it('should create a new event', async () => {
        const req = {
            body: {
              eventAdminId: 2,
              eventName: 'New Event',
              location: 'New Location',
              eventDescription: 'New Description',
              skills: 'Research Skills',
              urgency: 'Urgent',
              date: '2024-02-02',
            },
        };
        
        eventManagementController.createEventManagement(req, res);

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            event_id: eventDetails.length,
            eventAdminId: 2,
            eventName: 'New Event',
            location: 'New Location',
            eventDescription: 'New Description',
            skills: 'Research Skills',
            urgency: 'Urgent',
            date: '2024-02-02',
        });
    });

    // editEvent test
    it('should edit an existing event', async () => {
        req.params.id = 1; // Editing event with ID 1
        req.user.userId = 2; // Admin 2 is the owner of the event

        req.body = {
            eventName: 'Updated Event',
            location: 'Updated Location',
            eventDescription: 'Updated Description',
            skills: "Research Skills",
            urgency: 'Urgent',
            date: '2024-04-04'
        };

        eventManagementController.editEvent(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            ...eventDetails[0],
            eventName: 'Updated Event',
            location: 'Updated Location',
            eventDescription: 'Updated Description',
            skills: "Research Skills",
            urgency: 'Urgent',
            date: '2024-04-04',
        });
    })

    // deleteEvent test
    it('should delete an existing event', async () => {
        req.params.id = 1; // Deleting event with ID 1
        req.user.userId = 2; // Admin 2 is the owner of the event

        eventManagementController.deleteEvent(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({ message: "Event deleted successfully." });
        expect(eventDetails.find(event => event.event_id === 1)).toBeUndefined(); // Ensure event is deleted
    })
})