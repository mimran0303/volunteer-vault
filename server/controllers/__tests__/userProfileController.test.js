// userProfileController.test.js
const { createUserProfile, getUserProfileById, updateUserProfileById } = require('../userProfileController');
const db = require('../../config/index');

jest.mock('../../config/index'); // Mock the database connection

describe('userProfileController', () => {
    let mockReq, mockRes, mockDbConnection;

    beforeEach(() => {
        mockReq = { user: { userId: 1 } };
        mockRes = {
            status: jest.fn().mockReturnThis(),
            json: jest.fn(),
            send: jest.fn()
        };
        mockDbConnection = {
            query: jest.fn(),
            end: jest.fn()
        };
        db.mockResolvedValue(mockDbConnection);
    });

    describe('createUserProfile', () => {
        it('should create a user profile and verify the user', async () => {
            mockReq.body = {
                fullName: 'John Doe',
                address1: '123 Main St',
                address2: 'Apt 4B',
                city: 'New York',
                state: 'NY',
                zipcode: '10001',
                skills: 'Research Skills',
                preferences: 'Weekends',
                availability: '2024-11-09'
            };

            mockDbConnection.query.mockResolvedValueOnce([]).mockResolvedValueOnce([]); // Mock profile insert and user update queries

            await createUserProfile(mockReq, mockRes);

            expect(mockDbConnection.query).toHaveBeenNthCalledWith(1, expect.stringContaining('INSERT INTO UserProfile'), [
                [
                    mockReq.user.userId,
                    mockReq.body.fullName,
                    mockReq.body.address1,
                    mockReq.body.address2,
                    mockReq.body.city,
                    mockReq.body.state,
                    mockReq.body.zipcode,
                    mockReq.body.skills,
                    mockReq.body.preferences,
                    mockReq.body.availability
                ]
            ]);
            expect(mockDbConnection.query).toHaveBeenNthCalledWith(2, expect.stringContaining('UPDATE UserCredentials SET is_verified = 1'), [mockReq.user.userId]);
            expect(mockRes.status).toHaveBeenCalledWith(201);
            expect(mockRes.json).toHaveBeenCalledWith({ message: "Profile created and user verified" });
        });

        it('should handle database errors during profile creation', async () => {
            mockReq.body = {
              fullName: 'John Doe',
              address1: '123 Main St',
              address2: 'Apt 4B',
              city: 'New York',
              state: 'NY',
              zipcode: '10001',
              skills: 'Research Skills',
              preferences: 'Weekends',
              availability: '2024-11-09'
            };

            mockDbConnection.query.mockRejectedValueOnce(new Error('Database error'));

            await createUserProfile(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ error: "Failed to create user profile and verify user" });
        });
    });

    describe('getUserProfileById', () => {
        it('should retrieve the user profile by ID', async () => {
            const mockProfile = [{
                profile_owner_id: 1,
                full_name: 'John Doe',
                address_1: '123 Main St',
                address_2: 'Apt 4B',
                city: 'New York',
                state: 'NY',
                zip_code: '10001',
                skills: 'Research Skills',
                preferences: 'weekends',
                availability: '2024-11-09'
            }];
            mockDbConnection.query.mockResolvedValue([mockProfile]);

            await getUserProfileById(mockReq, mockRes);

            expect(mockDbConnection.query).toHaveBeenCalledWith(expect.stringContaining('SELECT * FROM UserProfile WHERE profile_owner_id = ?'), [mockReq.user.userId]);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith(mockProfile[0]);
        });

        it('should return 404 if the user profile is not found', async () => {
            mockReq.params = { id: 999 };
            mockReq.body = {}; 
      
            mockDbConnection.query.mockResolvedValueOnce([[]]); // No existing profile found
      

            await getUserProfileById(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.send).toHaveBeenCalledWith('User not found while fetching');
        });

        it('should handle database errors during profile retrieval', async () => {
            mockDbConnection.query.mockRejectedValueOnce(new Error('Database error'));

            await getUserProfileById(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.send).toHaveBeenCalledWith('Server error while fetching user profile');
        });
    });

    describe('updateUserProfileById', () => {
        it('should update the user profile successfully', async () => {
            mockReq.params = { id: 2 };
            mockReq.body = {
                fullName: 'Jane Doe',
                address1: '456 Elm St',
                address2: '',
                city: 'Los Angeles',
                state: 'CA',
                zipcode: '90001',
                skills: 'Communication Skills',
                preferences: 'Weekdays',
                availability: '2024-11-11'
            };
            const mockExistingUser = [{ profile_owner_id: 2 }];
            mockDbConnection.query
                .mockResolvedValueOnce([mockExistingUser]) // Check for existing profile
                .mockResolvedValueOnce([{ affectedRows: 1 }]); // Profile update

            await updateUserProfileById(mockReq, mockRes);

            expect(mockDbConnection.query).toHaveBeenNthCalledWith(2, expect.stringContaining('UPDATE UserProfile SET'), [
                mockReq.body.fullName,
                mockReq.body.address1,
                mockReq.body.address2,
                mockReq.body.city,
                mockReq.body.state,
                mockReq.body.zipcode,
                mockReq.body.skills,
                mockReq.body.preferences,
                mockReq.body.availability,
                parseInt(mockReq.params.id)
            ]);
            expect(mockRes.status).toHaveBeenCalledWith(200);
            expect(mockRes.json).toHaveBeenCalledWith({ Message: 'User profile updated successfully' });
        });

        it('should return 404 if the user profile does not exist', async () => {
            mockReq.params = { id: 999 };
            mockReq.body = {};  
        
            mockDbConnection.query.mockResolvedValueOnce([[]]); // No existing profile found
      

            await updateUserProfileById(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(404);
            expect(mockRes.json).toHaveBeenCalledWith({ Error: 'User not found' });
        });

        it('should handle errors during profile update', async () => {
            mockReq.params = { id: 123 };
            mockReq.body = {};

            mockDbConnection.query.mockRejectedValueOnce(new Error('Database error'));

            await updateUserProfileById(mockReq, mockRes);

            expect(mockRes.status).toHaveBeenCalledWith(500);
            expect(mockRes.json).toHaveBeenCalledWith({ Error: 'Server error while updating user profile' });
        });
    });
});
