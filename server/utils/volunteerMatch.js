
const userProfiles = require('../data/userProfiles');

// Matching logic that takes event details as input and returns matched volunteers
function matchVolunteersToEvent({ skills, city, state, zipcode, availability }) {
    // Filter the volunteers based on the provided event details
    const suitableVolunteers = userProfiles.filter(user => {
        const skillsMatch = user.skills.toLowerCase().includes(skills.toLowerCase());  // Match required skills
        const cityMatch = user.city.toLowerCase() === city.toLowerCase();                      // Match city
        const stateMatch = user.state.toLowerCase() === state.toLowerCase();                   // Match state
        const zipcodeMatch = user.zipcode === zipcode;                                         // Match zipcode
        const availabilityMatch = user.availability === availability;                         // Match availability

        return skillsMatch && cityMatch && stateMatch && zipcodeMatch && availabilityMatch;
    });

    // Return the list of matched volunteers
    return suitableVolunteers.map(vol => ({
        fullName: vol.fullName,
        skills: vol.skills,
        city: vol.city,
        state: vol.state,
        zipcode: vol.zipcode,
    }));
}

module.exports = { matchVolunteersToEvent };
