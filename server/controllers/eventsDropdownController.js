
const db = require('../config/index');

const getEventsByAdmin = async (req, res) => {
    const adminId = req.user.userId; // Assuming `req.user` contains the logged-in admin's info

    try {
        // console.log("Fetching events for admin ID:", adminId); // Log admin ID
        const db_con = await db();
        const [events] = await db_con.query(`SELECT * FROM eventdetails WHERE event_admin_id = ? AND event_date >= CURDATE() AND is_concluded = 0`, [adminId]);
        // console.log("Events fetched from database:", events); // Log events fetched
        await db_con.end();

        res.status(200).json({ success: true, events });
    } catch (error) {
        // console.error("Error fetching events for admin:", error);
        res.status(500).json({ success: false, message: "Error fetching events." });
    }
};

module.exports = { getEventsByAdmin };
