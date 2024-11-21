const db = require('../config/index');

const fetchEventData = async (req, startDate, endDate) => {
    let db_con
    console.log('Fetching event data...');
    try {
        db_con = await db();

        const [rows] = await db_con.query(`
            SELECT 
                ed.event_id,
                ed.event_name,
                ed.event_description,
                ed.location,
                ed.city,
                ed.state,
                ed.zip_code,
                ed.required_skills,
                ed.urgency,
                ed.event_date,
                ed.is_concluded,
                vm.volunteer_id,
                up.full_name AS volunteer_name,  -- Assuming full_name is the column with volunteer names
                vm.is_reviewed
            FROM 
                eventdetails ed
            LEFT JOIN 
                volunteermatch vm ON ed.event_id = vm.event_id
            LEFT JOIN 
                userprofile up ON vm.volunteer_id = up.profile_owner_id
            WHERE 
                ed.event_date BETWEEN ? AND ?
                AND ed.event_admin_id = ?
            ORDER BY 
                ed.event_id, up.full_name
        `, [startDate, endDate, req.user.userId]);
        
        return rows;
    } catch (error) {
        console.error("Error fetching event data:", error);
        return [];
    } finally {
        if (db_con) {
          await db_con.end(); // Ensure connection is closed
        }
    }
};

module.exports = { fetchEventData };
