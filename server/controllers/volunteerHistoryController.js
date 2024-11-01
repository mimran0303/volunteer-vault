/// volunteerHistoryController.js
const db = require('../config/index');

const retrieveHistory = async (req, res) => {
    try {
        const db_con = await db();
        console.log("Database connected successfully");

        // Fetch volunteer history details with necessary joins
        const [rows] = await db_con.query(`
            SELECT 
                vh.history_id,
                vh.volunteer_id,
                vh.event_id,
                vh.participation_status,
                up.full_name AS volunteer_name,
                ed.event_name,
                ed.event_description,
                ed.location,
                ed.required_skills,
                ed.urgency,
                ed.event_date
            FROM 
                volunteerhistory vh
            JOIN 
                userprofile up ON vh.volunteer_id = up.profile_owner_id
            JOIN 
                eventdetails ed ON vh.event_id = ed.event_id
        `);

        await db_con.end();
        
        res.status(200).json(rows);
    } catch (error) {
        console.error("Error fetching volunteer history:", error);
        res.status(500).json({ error: "Error fetching volunteer history" });
    }
};

module.exports = { retrieveHistory  };