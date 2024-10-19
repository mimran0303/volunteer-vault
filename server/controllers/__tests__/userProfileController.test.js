const userProfileController = require('../userProfileController');

let userProfiles = require('../../data/userProfiles');
let users = require('../../data/users'); 


describe('Profile Management Controller', () => {
    let req, res;
    
    beforeEach(() => {
        req = {
            user: { userId: 1 }, // Default mock user
            body: {
                userId: '',
                fullName: '',
                address1: '',
                address2: '',
                city: '',
                state: '',
                zipcode: '',
                skills: '',
                preferences: '',
                availability: '',
            },
            params: {
                id: 1
            }
        };

        res = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(), 
        };

        userProfiles = [];
        users = [
            ["volunteer", "user1@example.com", "password1", 1, true],
            ["administrator", "user2@example.com", "password2", 2, true],
            ["volunteer", "user3@example.com", "password3", 3, false],
        ];
    });

    // get profile test
    it('should get users profile', async () => {
        req.user.userId = 1; // Mock the logged-in user's ID

        userProfileController.getUserProfileById(req, res);

        expect(res.status).toHaveBeenCalledWith(200);
        expect(res.json).toHaveBeenCalledWith([{
                address1: "123 Main St",
                 address2: "",
                availability: "2024-01-01",
               city: "Houston",
                fullName: "Jane Doe",
               preferences: "Volunteering on weekends",
                skills: "Communication Skills",
                state: "TX",
               userId: 1,
                zipcode: "10001",
             }]);
    })

    // create profile test
    it('should create a new profile', async () => {
        const req = {
            body: {
                userId: 3,
                fullName: 'New Name',
                address1: 'New Address 1',
                address2: 'New Address 2',
                city: 'New City',
                state: 'New State',
                zipcode: 'New Zipcode',
                skills: 'New Skill',
                preferences: 'New Preference',
                availability: '2024-03-03',
            },
        };
        
        userProfileController.createUserProfile(req, res);

        // const updatedUser = users.find(user => user[3] === 3); // Check for userId = 3 (newUserProfile.userId)

        // console.log("EEEEEEEEEEE", updatedUser)

        // expect(updatedUser).toBeDefined();  // Ensure user exists
        // expect(updatedUser[4]).toBe(true);  // Check if the boolean field was updated to true

        expect(res.status).toHaveBeenCalledWith(201);
        expect(res.json).toHaveBeenCalledWith({
            userId: 3,
            fullName: 'New Name',
            address1: 'New Address 1',
            address2: 'New Address 2',
            city: 'New City',
            state: 'New State',
            zipcode: 'New Zipcode',
            skills: 'New Skill',
            preferences: 'New Preference',
            availability: '2024-03-03',
        });
    });

    // editEvent test
    // it('should edit an existing event', async () => {
    //     req.params.id = 1; // Editing event with ID 1
    //     req.user.userId = 2; // Admin 2 is the owner of the event

    //     req.body = {
    //         eventName: 'Updated Event',
    //         location: 'Updated Location',
    //         city: 'Updated City',
    //         state: 'Updated State',
    //         zipcode: 'Updated Zipcode',
    //         eventDescription: 'Updated Description',
    //         skills: "Research Skills",
    //         urgency: 'Urgent',
    //         date: '2024-04-04'
    //     };

    //     eventManagementController.editEvent(req, res);

    //     expect(res.status).toHaveBeenCalledWith(200);
    //     expect(res.json).toHaveBeenCalledWith({
    //         ...eventDetails[0],
    //         eventName: 'Updated Event',
    //         location: 'Updated Location',
    //         city: 'Updated City',
    //         state: 'Updated State',
    //         zipcode: 'Updated Zipcode',
    //         eventDescription: 'Updated Description',
    //         skills: "Research Skills",
    //         urgency: 'Urgent',
    //         date: '2024-04-04',
    //     });
    // })
})