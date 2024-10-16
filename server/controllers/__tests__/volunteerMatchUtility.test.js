// volunteerMatch.test.js
const { matchVolunteersToEvent } = require('../../utils/volunteerMatch');

// Mock user profiles
jest.mock('../../data/userProfiles', () => ([
    { fullName: 'John Doe', address1: "123 Main St", address2: "", city: "Houston", state: "TX", zipcode: "10001", skills: "Communication Skills", preferences: "Volunteering on weekends", availability: "2024-01-01" },
    { fullName: "Tristan Fry", address1: "123 Main St", address2: "", city: "Houston", state: "TX", zipcode: "10001", skills: "Research Skills", preferences: "Volunteering on weekends", availability: "2024-01-01" },
]));

describe('matchVolunteersToEvent', () => {
    test('should return matched volunteers based on event skills, city, state, zipcode, and availability', () => {
        const eventDetails = {
            skills: 'Communication Skills',
            city: 'Houston',
            state: 'TX',
            zipcode: '10001',
            availability: '2024-01-01',
        };

        const result = matchVolunteersToEvent(eventDetails);
        
        expect(result).toHaveLength(1);
        expect(result[0]).toEqual({
            fullName: 'John Doe', 
            address1: "123 Main St", 
            address2: "", 
            city: "Houston", 
            state: "TX", 
            zipcode: "10001", 
            skills: "Communication Skills", 
            preferences: "Volunteering on weekends", 
            availability: "2024-01-01",
        });
    });

    test('should return an empty array if no volunteers match', () => {
        const eventDetails = {
            skills: 'Teamwork',
            city: 'New York',
            state: 'NY',
            zipcode: '20002',
            availability: '2024-02-02',
        };

        const result = matchVolunteersToEvent(eventDetails);
        
        expect(result).toHaveLength(0);
    });
});
