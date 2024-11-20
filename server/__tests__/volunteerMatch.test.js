const { matchVolunteersToEvent } = require('../utils/volunteerMatch');
const initializeDatabaseConnection = require('../config/index');

jest.mock('../config/index'); // Mock the database connection

describe('matchVolunteersToEvent', () => {
    let mockDbConnection;

    beforeEach(() => {
        mockDbConnection = { 
            query: jest.fn(),
            end: jest.fn()
        };
        initializeDatabaseConnection.mockResolvedValue(mockDbConnection);
    });

    it('should return matched volunteers based on skills, location, and availability', async () => {
        // Mock database response with correct alias
        const mockVolunteers = [
            { volunteer_id: 1, full_name: 'John Doe', skills: 'Research Skills', city: 'New York', state: 'NY', zip_code: '10001', availability: '2024-11-09' }
        ];
        mockDbConnection.query.mockResolvedValue([mockVolunteers]);

        const params = { skills: 'Research Skills', city: 'New York', state: 'NY', zip_code: '10001', availability: '2024-11-09' };
        const result = await matchVolunteersToEvent(params);

        expect(result).toEqual([
            {
                volunteer_id: 1,
                full_name: 'John Doe',
                skills: 'Research Skills',
                city: 'New York',
                state: 'NY',
                zip_code: '10001',
                availability: '2024-11-09'
            }
        ]);
        expect(mockDbConnection.query).toHaveBeenCalledWith(
            expect.stringContaining('SELECT profile_owner_id AS volunteer_id'), 
            [`%${params.skills}%`, params.city, params.state, params.zip_code, params.availability]
        );
    });

    it('should return an empty array if no volunteers are found', async () => {
        mockDbConnection.query.mockResolvedValue([[]]); // No results

        const result = await matchVolunteersToEvent({
            skills: 'unknown', city: 'Nowhere', state: 'ZZ', zip_code: '00000', availability: '2077-01-01'
        });

        expect(result).toEqual([]);
    });

    it('should handle errors and throw an error', async () => {
        mockDbConnection.query.mockRejectedValue(new Error('Database error'));

        await expect(matchVolunteersToEvent({
            skills: 'Research Skills', city: 'New York', state: 'NY', zip_code: '10001', availability: 'weekends'
        })).rejects.toThrow('Error fetching volunteers');
    });

    it('should handle connection initialization errors and not attempt to close db connection', async () => {
        initializeDatabaseConnection.mockRejectedValue(new Error('Connection error')); // Simulate failure
    
        await expect(matchVolunteersToEvent({
            skills: 'Research Skills', city: 'New York', state: 'NY', zip_code: '10001', availability: 'weekends'
        })).rejects.toThrow('Error fetching volunteers'); // Expect the error to propagate
    
        expect(mockDbConnection.end).not.toHaveBeenCalled(); // Ensure db_con.end is not called
    });
});
