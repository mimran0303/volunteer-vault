
const initializeDatabaseConnection = require('../config/index');

async function matchVolunteersToEvent({ skills, city, state, zip_code, availability }) {
    let db_con;
    try {
        db_con = await initializeDatabaseConnection(); // Get single connection
        // console.log("SQL Query Parameters:", { skills, city, state, zip_code, availability });
        const [volunteers] = await db_con.query(`
            SELECT profile_owner_id AS volunteer_id, full_name, skills, city, state, zip_code, availability 
            FROM userprofile 
            WHERE skills LIKE ? 
            AND city = ? 
            AND state = ? 
            AND zip_code = ? 
            AND availability = ?
        `, [`%${skills}%`, city, state, zip_code, availability]);

        //debugging
        // console.log("Database returned volunteers:", volunteers);
        if (volunteers.length === 0) {
            return [];
        }

        return volunteers.map(vol => ({
            volunteer_id: vol.volunteer_id,
            full_name: vol.full_name,
            skills: vol.skills,
            city: vol.city,
            state: vol.state,
            zip_code: vol.zip_code,
            availability: vol.availability
        }));
    } catch (error) {
        // console.error("Error fetching volunteers:", error);
        throw new Error('Error fetching volunteers');
    } finally {
        if (db_con) await db_con.end(); // Close the connection after the query
    }
}

module.exports = { matchVolunteersToEvent };
