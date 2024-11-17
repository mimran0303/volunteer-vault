const db = require('../../config/index');
const { fetchEventData } = require('../../services/eventService'); // Adjust the path as needed

jest.mock('../../config/index'); // Mock the database configuration

describe('fetchEventData', () => {
  let mockDbConnection;

  beforeEach(() => {
    mockDbConnection = {
      query: jest.fn(),
      end: jest.fn(),
    };

    db.mockResolvedValue(mockDbConnection); // Mock the db connection to return the mockDbConnection object
  });

  afterEach(() => {
    jest.clearAllMocks(); // Clear mocks after each test
  });

  it('should return event data for the specified date range and admin', async () => {
    const req = { user: { userId: 1 } };
    const startDate = '2024-01-01';
    const endDate = '2024-01-31';
    const mockData = [
      {
        event_id: 1,
        event_name: 'Charity Run',
        event_description: 'Annual charity run for local causes',
        location: 'Central Park',
        city: 'New York',
        state: 'NY',
        zip_code: '10001',
        required_skills: 'Organizing, Fundraising',
        urgency: 'High',
        event_date: '2024-01-15',
        is_concluded: 0,
        volunteer_id: 2,
        volunteer_name: 'Jane Doe',
        is_reviewed: 1,
      },
    ];

    mockDbConnection.query.mockResolvedValue([mockData]);

    const result = await fetchEventData(req, startDate, endDate);

    expect(db).toHaveBeenCalled(); // Ensure the db connection was created
    expect(mockDbConnection.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT'), // Ensure a query was made
      [startDate, endDate, req.user.userId] // Check that the correct parameters were used
    );
    expect(result).toEqual(mockData);
    expect(mockDbConnection.end).toHaveBeenCalled(); // Ensure the connection was closed
  });

  it('should return an empty array and log an error if the query fails', async () => {
    const req = { user: { userId: 1 } };
    const startDate = '2024-01-01';
    const endDate = '2024-01-31';

    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});

    mockDbConnection.query.mockRejectedValue(new Error('Query failed'));

    const result = await fetchEventData(req, startDate, endDate);

    expect(result).toEqual([]); // Expect an empty array on failure
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching event data:',
      expect.any(Error)
    );
    expect(mockDbConnection.end).toHaveBeenCalled(); // Ensure the connection was closed
    consoleSpy.mockRestore();
  });
});
