// assignmentController.js
const db = require('../config/index');  // Assuming you're using a MySQL connection from config

const assignVolunteersToEvent = async (req, res) => {
    const { eventId, volunteerIds } = req.body;

    if (!eventId || !Array.isArray(volunteerIds) || volunteerIds.length === 0) {
        return res.status(400).json({ success: false, message: 'Invalid event ID or volunteer list.' });
    }

    // Filter out duplicate volunteer IDs
    const uniqueVolunteerIds = [...new Set(volunteerIds)];  // Ensures only unique volunteer IDs are processed

    let db_con;
    try {
        db_con = await db();  // Assuming db() initializes and returns the MySQL connection pool

        const errors = [];
        const successes = [];

        // Insert each volunteer assignment into the volunteerMatch table
        const insertPromises = uniqueVolunteerIds.map(async (volunteerId) => {
            if (!volunteerId) {
                errors.push(`Volunteer ID cannot be null or undefined`);
                return;
            }

            try {
                // Insert assignment into volunteerMatch table
                await db_con.query(
                    `INSERT INTO volunteerMatch (volunteer_id, event_id) VALUES (?, ?)`,
                    [volunteerId, eventId]
                );

                // Insert notification for the assigned volunteer
                const message = `You have been assigned to event ID ${eventId}.`;
                await db_con.query(
                   `INSERT INTO notifications (recipient_id, event_id, message, date, is_read) VALUES (?, ?, ?, NOW(), false)`,
                    [volunteerId, eventId, message]
                );

                successes.push(`Volunteer ${volunteerId} assigned successfully`);
            } catch (error) {
                // Handle duplicate entry error
                if (error.code === 'ER_DUP_ENTRY') {
                    console.log(`Volunteer ${volunteerId} is already assigned to event ${eventId}`);
                    errors.push(`Volunteer ${volunteerId} is already assigned to this event.`);
                } else {
                    // Handle other errors
                    console.error(`Error assigning Volunteer ${volunteerId}:`, error);
                    errors.push(`Error assigning Volunteer ${volunteerId}: ${error.message}`);
                }
            }
        });

        await Promise.all(insertPromises);

        // Return a response with both successes and errors
        if (errors.length > 0) {
            return res.status(207).json({  // HTTP 207: Multi-Status to indicate partial success
                success: false,
                message: "Some assignments were successful, but there were errors.",
                successes,
                errors
            });
        }

        return res.status(200).json({ success: true, message: 'All volunteers assigned successfully!', successes });
    } catch (error) {
        console.error('Error assigning volunteers:', error);
        return res.status(500).json({ success: false, message: 'Error assigning volunteers.' });
    }
};

module.exports = { assignVolunteersToEvent };
