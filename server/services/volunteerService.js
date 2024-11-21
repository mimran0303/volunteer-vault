const db = require('../config/index');

const fetchVolunteerData = async (req, startDate, endDate) => {
  let db_con;
  try {
    db_con = await db();

    const [rows] = await db_con.query(`
        SELECT 
          vh.volunteer_id,
          vh.event_id,
          vh.participation_status,
          vh.rating,
          up.full_name AS volunteer_name,
          ed.event_name,
          ed.event_admin_id,
          ed.event_date
        FROM 
            volunteerhistory vh
        JOIN 
            userprofile up ON vh.volunteer_id = up.profile_owner_id
        JOIN 
            eventdetails ed ON vh.event_id = ed.event_id
        WHERE
          ed.event_date BETWEEN ? AND ?
        AND 
          ed.event_admin_id = ?
        ORDER BY 
          vh.volunteer_id
    `, [startDate, endDate, req.user.userId]);

    return rows;
  } catch (error) {
    console.error("Error fetching volunteer history:", error);
    return [];
  } finally {
    if (db_con) {
      await db_con.end(); // Ensure connection is closed
    }
  }
};

module.exports = { fetchVolunteerData };
