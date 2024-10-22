
const initializeDatabaseConnection = require('../config/index');

async function matchVolunteersToEvent({ skills, city, state, zip_code, availability }) {
    let db_con;
    try {
        db_con = await initializeDatabaseConnection(); // Get single connection
        console.log("SQL Query Parameters:", { skills, city, state, zip_code, availability });
        const [volunteers] = await db_con.query(`
            SELECT * FROM userprofile 
            WHERE skills LIKE ? 
            AND city = ? 
            AND state = ? 
            AND zip_code = ? 
            AND availability = ?
        `, [`%${skills}%`, city, state, zip_code, availability]);

        //debugging
        console.log("Database returned volunteers:", volunteers);
        if (volunteers.length === 0) {
            return [];
        }

        return volunteers.map(vol => ({
            full_name: vol.full_name,
            skills: vol.skills,
            city: vol.city,
            state: vol.state,
            zip_code: vol.zip_code,
            availability: vol.availability
        }));
    } catch (error) {
        console.error("Error fetching volunteers:", error);
        throw new Error('Error fetching volunteers');
    } finally {
        if (db_con) await db_con.end(); // Close the connection after the query
    }
}

module.exports = { matchVolunteersToEvent };





// const userProfiles = require('../data/userProfiles');

// // Matching logic that takes event details as input and returns matched volunteers
// function matchVolunteersToEvent({ skills, city, state, zipcode, availability }) {
//     // Filter the volunteers based on the provided event details
//     const suitableVolunteers = userProfiles.filter(user => {
//         const skillsMatch = user.skills.toLowerCase().includes(skills.toLowerCase());  // Match required skills
//         const cityMatch = user.city.toLowerCase() === city.toLowerCase();                      // Match city
//         const stateMatch = user.state.toLowerCase() === state.toLowerCase();                   // Match state
//         const zipcodeMatch = user.zipcode === zipcode;                                         // Match zipcode
//         const availabilityMatch = user.availability === availability;                         // Match availability

//         return skillsMatch && cityMatch && stateMatch && zipcodeMatch && availabilityMatch;
//     });

//     // Return the list of matched volunteers
//     return suitableVolunteers.map(vol => ({
//         fullName: vol.fullName,
//         skills: vol.skills,
//         city: vol.city,
//         state: vol.state,
//         zipcode: vol.zipcode,
//     }));
// }

// module.exports = { matchVolunteersToEvent };
