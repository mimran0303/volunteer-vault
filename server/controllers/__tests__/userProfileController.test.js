// const { userProfileController } = require('../userProfileController');
const { createUserProfile } = require('../userProfileController.js');

const db = require('../../config/index'); // Mock the database config

jest.mock('../../config/index'); // Mock the db connection

describe('userProfileController', () => {
  let req;
  let res;

    beforeEach(() => {
        // Mock request object with JWT token and body fields
        req = {
            user: {
                userId: 1 // From the JWT token
            },
            body: {
                fullName: 'John Doe',
                address1: '123 Main St',
                address2: 'Apt 4B',
                city: 'New York',
                state: 'NY',
                zipcode: '10001',
                skills: 'Communication Skills',
                preferences: 'Weekends',
                availability: '2024-01-01'
            }
        };

        // Mock response object with status and json methods
        res = {
            status: jest.fn().mockReturnThis(), 
            json: jest.fn()
        };
    });

    describe('create user profile', () => {
        it('should create a user profile and verify the user', async () => {
            // Mock the database connection and queries
            const mockQuery = jest.fn()
              .mockResolvedValueOnce({ affectedRows: 1 }) // For the INSERT INTO UserProfile
              .mockResolvedValueOnce({ affectedRows: 1 }); // For the UPDATE UserCredentials
            
            db.mockResolvedValue({
              query: mockQuery
            });
        
            // Call the createUserProfile function
            await createUserProfile(req, res);
        
            // Check that the response was a 201 status with success message
            expect(res.status).toHaveBeenCalledWith(201);
            expect(res.json).toHaveBeenCalledWith({ message: "Profile created and user verified" });
        
            // Check that the correct SQL queries were executed
            expect(mockQuery).toHaveBeenCalledWith(
              "INSERT INTO UserProfile (profile_owner_id, full_name, address_1, address_2, city, state, zip_code, skills, preferences, availability) VALUES (?)",
              [[
                req.user.userId,
                req.body.fullName,
                req.body.address1,
                req.body.address2,
                req.body.city,
                req.body.state,
                req.body.zipcode,
                req.body.skills,
                req.body.preferences,
                req.body.availability
              ]]
            );
        
            expect(mockQuery).toHaveBeenCalledWith(
              "UPDATE UserCredentials SET is_verified = 1 WHERE user_id = ?",
              [req.user.userId]
            );
        });
        
        it('should return a 500 error if there is a database error', async () => {
            // Mock the database query to reject with an error
            const mockQuery = jest.fn().mockRejectedValue(new Error('DB error'));
            db.mockResolvedValue({
            query: mockQuery
            });
        
            // Call the createUserProfile function
            await createUserProfile(req, res);
        
            // Check that the response was a 500 status with an error message
            expect(res.status).toHaveBeenCalledWith(500);
            expect(res.json).toHaveBeenCalledWith({ error: "Failed to create user profile and verify user" });
        });
    });
});
