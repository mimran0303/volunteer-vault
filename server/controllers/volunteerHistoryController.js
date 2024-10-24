// volunteerHistoryController.js
exports.retrieveHistory = async (req, res) => {
    try {
        const db_con = await initializeDatabaseConnection();
        console.log("Database connected successfully");

        const [rows] = await db_con.execute(`
            SELECT 
                up.full_name AS volunteer_name,
                vh.participation_status,
                ed.event_name,
                ed.event_description,
                ed.location,
                ed.skills_required,
                ed.urgency,
                ed.event_date
            FROM 
                volunteerHistory vh
            JOIN 
                userProfile up ON vh.volunteer_id = up.profile_owner_id
            JOIN 
                eventDetails ed ON vh.event_id = ed.event_id;
        `);

        console.log("Retrieved Rows:", rows); // Log the rows retrieved

        if (rows.length === 0) {
            return res.status(404).json({ message: 'No volunteer history found.' });
        }

        res.status(200).json(rows);
        await db_con.end();
    } catch (err) {
        console.error('Error retrieving volunteer history:', err.message);
        console.error('Full error:', err); // Log full error for more details
        res.status(500).json({ error: 'Internal Server Error', details: err.message }); // Return detailed error message
    }
};
