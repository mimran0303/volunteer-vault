const db = require('../config/index')

exports.getOverview = async (req, res) => {
    const sql = `
    SELECT 
        vm.match_id,
        up.profile_id,
        up.profile_owner_id,
        up.full_name,
        up.address_1,
        up.address_2,
        up.city AS user_city,
        up.state AS user_state,
        up.zip_code AS user_zip_code,
        up.skills,
        up.preferences,
        up.availability,
        ed.event_id,
        ed.event_admin_id,
        ed.event_name,
        ed.location,
        ed.city AS event_city,
        ed.state AS event_state,
        ed.zip_code AS event_zip_code,
        ed.event_date
    FROM 
        VolunteerMatch vm
    JOIN 
        userCredentials uc ON vm.volunteer_id = uc.user_id
    JOIN 
        userProfile up ON uc.user_id = up.profile_owner_id
    JOIN 
        eventDetails ed ON vm.event_id = ed.event_id
    WHERE 
        ed.event_admin_id = ?
    AND 
        vm.is_reviewed = 0
    AND ed.event_date <= CURDATE()
  `; 

  try {
    const db_con = await db();
    const [results] = await db_con.query(sql, req.user.userId);
    res.status(200).json(results); 
  } catch (error) {
    // console.error("Database query error:", error);
    res.status(500).json({ error: "Internal server error" }); 
  }
}

exports.postReview = async (req, res) => { 
  const { eventId, volunteers } = req.body;
  let db_con;

  try {
    db_con = await db(); // Create a database connection

    // Start transaction
    await db_con.beginTransaction();

    // SQL queries for insertion and update
    const insertSql = `
      INSERT INTO VolunteerHistory (volunteer_id, event_id, participation_status, rating)
      VALUES (?, ?, ?, ?)
    `;
    const updateSql = `
      UPDATE VolunteerMatch
      SET is_reviewed = 1
      WHERE match_id = ?
    `;

    const updateEventDetailsSql = `
      UPDATE EventDetails
      SET is_concluded = 1
      WHERE event_id = ?
    `;

    // Insert each volunteer's participation data and update is_reviewed status
    for (const volunteer of volunteers) {
      // Insert into VolunteerHistory
      await db_con.query(insertSql, [
        volunteer.profile_id,     // volunteer_id
        eventId,                  // event_id
        volunteer.status,         // participation_status
        volunteer.rating          // rating
      ]);

      // Update VolunteerMatch to set is_reviewed = 1
      await db_con.query(updateSql, [volunteer.match_id]);
    }

    await db_con.query(updateEventDetailsSql, [eventId]);

    // Commit the transaction
    await db_con.commit();

    res.status(200).json({ message: "Data inserted and reviewed status updated successfully!" });
  } catch (error) {
    // Rollback the transaction if any error occurs
    if (db_con && db_con.rollback) await db_con.rollback();
    // console.error("Error processing data:", error);
    res.status(500).json({ message: "Internal server error", error: error.message });
  } 
};

