// volunteerReviewController.test.js
const db = require('../config/index');
const volunteerReviewController = require('../controllers/volunteerReviewController');

jest.mock('../config/index');

describe('volunteerReviewController', () => {
  let req, res, dbConnection;

  beforeEach(() => {
    req = {};
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };
    dbConnection = {
      query: jest.fn(),
      beginTransaction: jest.fn(),
      commit: jest.fn(),
      rollback: jest.fn(),
    };
    db.mockReturnValue(Promise.resolve(dbConnection));
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('getOverview', () => {
    it('should return a list of matched volunteers for an event', async () => {
      const mockUserId = 1;
      req.user = { userId: mockUserId };

      // Mock query result
      const mockResults = [
        {
          match_id: 1,
          profile_id: 101,
          profile_owner_id: 201,
          full_name: 'John Doe',
          address_1: '123 Main St',
          address_2: '',
          user_city: 'Anytown',
          user_state: 'CA',
          user_zip_code: '12345',
          skills: 'Research Skills',
          preferences: 'Weekends',
          availability: '2024-11-09',
          event_id: 5,
          event_admin_id: mockUserId,
          event_name: 'Charity Run',
          location: 'City Park',
          event_city: 'Anytown',
          event_state: 'CA',
          event_zip_code: '12345',
          event_date: '2024-11-09',
        },
      ];

      dbConnection.query.mockResolvedValueOnce([mockResults]);

      await volunteerReviewController.getOverview(req, res);

      expect(dbConnection.query).toHaveBeenCalledWith(expect.any(String), mockUserId);
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockResults);
    });

    it('should handle database errors gracefully', async () => {
      req.user = { userId: 1 };

      // Mock database error
      dbConnection.query.mockRejectedValueOnce(new Error('Database error'));

      await volunteerReviewController.getOverview(req, res);

      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.json).toHaveBeenCalledWith({ error: 'Internal server error' });
    });
  });

  describe('postReview', () => {
    it('should insert volunteer participation data and update review status', async () => {
      req.body = {
        eventId: 5,
        volunteers: [
          { profile_id: 101, status: 'Participated', match_id: 1 },
          { profile_id: 102, status: 'No Show', match_id: 2 },
        ],
      };

      // Mock transaction methods
      dbConnection.query
        .mockResolvedValueOnce() // Insert VolunteerHistory
        .mockResolvedValueOnce() // Update VolunteerMatch
        .mockResolvedValueOnce() // Insert VolunteerHistory
        .mockResolvedValueOnce(); // Update VolunteerMatch
      dbConnection.beginTransaction.mockResolvedValueOnce();
      dbConnection.commit.mockResolvedValueOnce();

      await volunteerReviewController.postReview(req, res);

      // Check database transaction methods
      expect(dbConnection.beginTransaction).toHaveBeenCalled();
      expect(dbConnection.commit).toHaveBeenCalled();

      // Check queries were called with correct values
      expect(dbConnection.query).toHaveBeenNthCalledWith(1, expect.stringContaining('INSERT INTO VolunteerHistory'), [
        101, // volunteer_id
        5,   // event_id
        'Participated', // participation_status
      ]);
      expect(dbConnection.query).toHaveBeenNthCalledWith(2, expect.stringContaining('UPDATE VolunteerMatch'), [1]);
      expect(dbConnection.query).toHaveBeenNthCalledWith(3, expect.stringContaining('INSERT INTO VolunteerHistory'), [
        102, // volunteer_id
        5,   // event_id
        'No Show', // participation_status
      ]);
      expect(dbConnection.query).toHaveBeenNthCalledWith(4, expect.stringContaining('UPDATE VolunteerMatch'), [2]);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith({ message: 'Data inserted and reviewed status updated successfully!' });
    });
    
    it('should rollback transaction if an error occurs', async () => {
        req.body = {
          eventId: 5,
          volunteers: [{ profile_id: 101, status: 'Participated', match_id: 1 }],
        };
    
        dbConnection.beginTransaction.mockResolvedValueOnce();
        dbConnection.query
          .mockResolvedValueOnce() // Successful insert into VolunteerHistory
          .mockRejectedValueOnce(new Error('Update error')); // Simulate error in update query
        dbConnection.rollback.mockResolvedValueOnce();
    
        await volunteerReviewController.postReview(req, res);
    
        expect(dbConnection.beginTransaction).toHaveBeenCalled();
        expect(dbConnection.rollback).toHaveBeenCalled(); // Verify rollback is called
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ message: 'Internal server error', error: 'Update error' });
    });
  });
});
