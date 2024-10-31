const db = require('../config/index')

exports.getOverview = async (req, res) => {
    const sql = `
    SELECT 
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
  `;

  try {
    const db_con = await db();
    const [results] = await db_con.query(sql, req.user.userId);
    res.status(200).json(results); 
  } catch (error) {
    console.error("Database query error:", error);
    res.status(500).json({ error: "Internal server error" }); 
  }
}

exports.postReview = (req, res) => {
    try {
        console.log("Received data:", req.body); // Logs the data sent from the frontend
        // Perform necessary processing, e.g., saving data to the database.
        res.status(200).json({ message: "Data received successfully!" });
    } catch (error) {
        console.error("Error processing data:", error);
        res.status(500).json({ message: "Internal server error", error: error.message });
    }
};  
