const { fetchVolunteerData } = require('../../services/volunteerService'); // Adjust the path as needed
const db = require('../../config/index'); // Mocked database module

jest.mock('../../config/index'); // Mock the database configuration

describe('fetchVolunteerData', () => {
  let mockDbConnection;

  beforeEach(() => {
    mockDbConnection = {
      query: jest.fn(),
      end: jest.fn(),
    };

    db.mockResolvedValue(mockDbConnection); // Mock the db connection to return the mockDbConnection object
  });

  it('should return volunteer data for the specified date range and admin', async () => {
    const req = { user: { userId: 1 } };
    const startDate = '2024-01-01';
    const endDate = '2024-01-31';
    const mockData = [
      {
        volunteer_id: 1,
        event_id: 1,
        participation_status: 'active',
        rating: 5,
        volunteer_name: 'John Doe',
        event_name: 'Charity Event',
        event_admin_id: 1,
        event_date: '2024-01-15',
      },
    ];

    mockDbConnection.query.mockResolvedValue([mockData]);

    const result = await fetchVolunteerData(req, startDate, endDate);

    expect(db).toHaveBeenCalled(); // Ensure the db connection was created
    expect(mockDbConnection.query).toHaveBeenCalledWith(
      expect.stringContaining('SELECT'), // Check that a query was made
      [startDate, endDate, req.user.userId] // Check that parameters match
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

    const result = await fetchVolunteerData(req, startDate, endDate);

    expect(result).toEqual([]); // Returns an empty array on failure
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching volunteer history:',
      expect.any(Error)
    );
    expect(mockDbConnection.end).toHaveBeenCalled(); // Ensure the connection was closed
    consoleSpy.mockRestore();
  });

  it('should handle db connection failure gracefully', async () => {
    const req = { user: { userId: 1 } };
    const startDate = '2024-01-01';
    const endDate = '2024-01-31';
  
    db.mockRejectedValue(new Error('Connection failed')); // Simulate db connection failure
  
    const consoleSpy = jest.spyOn(console, 'error').mockImplementation(() => {});
  
    const result = await fetchVolunteerData(req, startDate, endDate);
  
    expect(result).toEqual([]); // Expect an empty array since the query couldn't run
    expect(consoleSpy).toHaveBeenCalledWith(
      'Error fetching volunteer history:',
      expect.any(Error)
    );
    expect(mockDbConnection.end).not.toHaveBeenCalled(); // Connection shouldn't be closed as it was never opened
  
    consoleSpy.mockRestore();
  });
});
