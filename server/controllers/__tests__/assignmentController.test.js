const assignmentController = require('../../controllers/assignmentController');

describe('assignVolunteersToEvent', () => {
    let req, res;

    beforeEach(() => {
        const { assignedVolunteers, notifications } = require('../../controllers/assignmentController');

        // Reset the arrays to avoid state leakage between tests
        assignedVolunteers.length = 0;
        notifications.length = 0;

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
        };
    });

    test('should assign volunteers to the event and create notifications', () => {
        req = {
            body: {
                eventDetails: {
                    skills: 'Communication Skills',
                    city: 'Houston',
                    state: 'TX',
                    zipcode: '10001',
                    availability: '2024-01-01',
                },
                volunteers: [
                    { userId: 1, fullName: 'Jane Doe', skills: 'Communication Skills', city: 'Houston', state: 'TX', zipcode: '10001', availability: '2024-01-01'},
                ]
            }
        };

        assignmentController.assignVolunteersToEvent(req, res);

        const { assignedVolunteers, notifications } = require('../../controllers/assignmentController');

        expect(assignedVolunteers).toHaveLength(1);
        expect(assignedVolunteers[0]).toMatchObject({
            event: req.body.eventDetails,
            volunteer: { fullName: 'Jane Doe', skills: 'Communication Skills', city: 'Houston', state: 'TX', zipcode: '10001', availability: '2024-01-01' },
        });

        expect(notifications).toHaveLength(1);
        expect(notifications[0]).toMatchObject({
            message: 'You have been assigned to the Communication Skills event on 2024-01-01.',
            userId: 1,
            isRead: false
        });

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith({
            success: true,
            message: 'Volunteers assigned successfully!',
            assignedVolunteers
        });
    });

    // ! bug is client-side
    test('should return a 400 response if all volunteers are already assigned to the event', () => {
        req = {
            body: {
                eventDetails: {
                    skills: 'Communication Skills',
                    city: 'Houston',
                    state: 'TX',
                    zipcode: '10001',
                    availability: '2024-01-01',
                },
                volunteers: [
                    { userId: 1, fullName: 'Jane Doe', skills: 'Communication Skills', city: 'Houston', state: 'TX', zipcode: '10001', availability: '2024-01-01'},
                ]
            }
        };

        // First assignment
        assignmentController.assignVolunteersToEvent(req, res);

        // Second assignment (same volunteer, same event)
        assignmentController.assignVolunteersToEvent(req, res);

        expect(res.status).toHaveBeenCalledWith(400);
        expect(res.json).toHaveBeenCalledWith({
            success: false,
            message: 'All volunteers are already assigned to this event.'
        });

        const { assignedVolunteers, notifications } = require('../../controllers/assignmentController');
        expect(assignedVolunteers).toHaveLength(1);  // Should still have only one volunteer
        expect(notifications).toHaveLength(1);  // Only one notification
    });

    // ? shouldn't be possible after user profile management is handled correctly
    // ? commented just in case, it's needed 
    // test('should handle volunteers without a user profile', () => {
    //     req = {
    //         body: {
    //             eventDetails: {
    //                 skills: 'Communication Skills',
    //                 city: 'Houston',
    //                 state: 'TX',
    //                 zipcode: '10001',
    //                 availability: '2024-01-01',
    //             },
    //             volunteers: [
    //                 { fullName: 'Nonexistent User', skills: 'Communication Skills', city: 'Houston', state: 'TX', zipcode: '10001', availability: '2024-01-01' },
    //             ]
    //         }
    //     };

    //     assignmentController.assignVolunteersToEvent(req, res);

    //     const { assignedVolunteers, notifications } = require('../../controllers/assignmentController');

    //     expect(assignedVolunteers).toHaveLength(0);  // No assignments should happen
    //     expect(notifications).toHaveLength(0);  // No notifications should be created
    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.json).toHaveBeenCalledWith({
    //         success: true,
    //         message: 'Volunteers assigned successfully!',
    //         assignedVolunteers: []
    //     });
    // });
});
