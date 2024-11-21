// volunteerHistoryController.test.js
const db = require('../config/index');
const { retrieveHistory } = require('../controllers/volunteerHistoryController');

// Mock the database connection
jest.mock('../config/index');

describe('volunteerHistoryController', () => {
  let req, res, dbConnection;

  beforeEach(() => {
    req = {}; 
    res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn(),
    };

    dbConnection = {
      query: jest.fn(),
      end: jest.fn().mockResolvedValue(), 
    };

    db.mockResolvedValue(dbConnection);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  describe('retrieveHistory', () => {
    it('should return volunteer history with event details', async () => {
      const mockData = [
        {
          history_id: 1,
          volunteer_id: 101,
          event_id: 202,
          participation_status: 'Participated',
          volunteer_name: 'John Doe',
          event_name: 'Charity Run',
          event_description: 'Annual charity run event',
          location: 'City Park',
          required_skills: 'Communication Skills',
          urgency: 'High',
          event_date: '2024-11-01',
        },
      ];

      dbConnection.query.mockResolvedValueOnce([mockData]);

      await retrieveHistory(req, res);

      expect(dbConnection.query).toHaveBeenCalledWith(expect.any(String));
      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(mockData);
      expect(dbConnection.end).toHaveBeenCalled(); 
    });

    it('should handle errors gracefully and return 500 status', async () => {
        db.mockRejectedValue(new Error('Database connection error'));

        await retrieveHistory(req, res);

        expect(db).toHaveBeenCalled();
        expect(res.status).toHaveBeenCalledWith(500);
        expect(res.json).toHaveBeenCalledWith({ error: 'Error fetching volunteer history' });
    });
  });
});
