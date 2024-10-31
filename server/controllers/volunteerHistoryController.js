// volunteerHistoryController.js
const initializeDatabaseConnection = require('../config/index');

exports.retrieveHistory = async (req, res) => {
    try {
        const db_con = await initializeDatabaseConnection();
        console.log("Database connected successfully");

        const [result] = await db_con.execute(`
            INSERT INTO volunteerHistory (volunteer_id, event_id, participation_status)
            SELECT 
                vm.volunteer_id, 
                ed.event_id, 
                FALSE
            FROM 
                volunteerMatch vm
            JOIN 
                eventDetails ed ON vm.event_id = ed.event_id;
        `);

        console.log("Inserted Rows:", result.affectedRows);

        // Only send a single response
        res.status(200).json({ message: 'Volunteer history populated successfully', insertedRows: result.affectedRows });
        await db_con.end();
    } catch (err) {
        console.error('Error populating volunteer history:', err.message);
        res.status(500).json({ error: 'Internal Server Error', details: err.message });
    }
};
