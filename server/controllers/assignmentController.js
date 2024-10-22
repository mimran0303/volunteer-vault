const pool = require('../config/index')

async function assignVolunteersToEvent(req, res) {
    const { eventDetails, newAssignments } = req.body;

    try {
        const promises = newAssignments.map(async (volunteer) => {
            const [userProfile] = await pool.execute(
                'SELECT * FROM userprofile WHERE fullName = ?', [volunteer.fullName]
            );

            if (userProfile.length) {
                const userId = userProfile[0].userId;

                // Insert into the volunteer match table
                await pool.execute(`
                    INSERT INTO volunteermatch (eventId, userId) 
                    VALUES (?, ?)
                `, [eventDetails.eventId, userId]);

                // Create notification
                await pool.execute(`
                    INSERT INTO notifications (message, date, isRead, userId) 
                    VALUES (?, ?, ?, ?)
                `, [
                    `You have been assigned to the ${eventDetails.skills} event on ${eventDetails.availability}.`,
                    new Date().toISOString(),
                    false,
                    userId
                ]);
            }
        });

        await Promise.all(promises);
        res.status(200).json({ success: true, message: 'Volunteers assigned successfully!' });
    } catch (error) {
        console.error(error);
        res.status(500).json({ success: false, message: 'Error assigning volunteers' });
    }
}

module.exports = { assignVolunteersToEvent };










// // server/controllers/assignmentController.js
// let assignedVolunteers = [];
// let notifications = require('../data/notifications');  // Import notifications array
// const userProfiles = require('../data/userProfiles');  // Import user profiles
// const eventInfo = require('../data/eventManagement');
// const assignVolunteersToEvent = (req, res) => {
//     const { eventDetails, volunteers } = req.body;

//     // Filter out volunteers that are already assigned to the same event
//     const newAssignments = volunteers.filter(volunteer => {
//         return !assignedVolunteers.some(
//             assigned => assigned.volunteer.fullName === volunteer.fullName &&
//                         assigned.event.skills === eventDetails.skills &&
//                         assigned.event.city === eventDetails.city &&
//                         assigned.event.state === eventDetails.state &&
//                         assigned.event.zipcode === eventDetails.zipcode &&
//                         assigned.event.availability === eventDetails.availability
//         );
//     });

//     // If there are no new assignments, return a message
//     if (newAssignments.length === 0) {
//         return res.status(400).json({ success: false, message: 'All volunteers are already assigned to this event.' });
//     }

//     // Store the new assignments
//     newAssignments.forEach(volunteer => {
//         // console.log("Volunteer Full Name:", volunteer.fullName);
//         // console.log("User Profiles Full Names:", userProfiles.map(profile => profile.fullName));
//         // Find the user profile by matching `fullName`
//         const userProfile = userProfiles.find(profile => profile.fullName.trim() === volunteer.fullName.trim());

//         if (userProfile) {
//             assignedVolunteers.push({
//                 event: eventDetails,
//                 volunteer: { ...volunteer, userId: userProfile.userId }  // Attach userId to the volunteer object
//             });

//             // console.log("User Profile for Notification:", userProfile);
//             // console.log("User Profile userId for Notification:", userProfile.userId);
//             // console.log("Before Notification Creation - userId:", userProfile.userId);

//             const notification = {
//                 message: `You have been assigned to the ${eventDetails.skills} event on ${eventDetails.availability}.`,
//                 date: new Date().toISOString(),  // Timestamp
//                 isRead: false,  // New notification is unread
//                 userId: userProfile.userId  // Use userId from the profile
//             };

//             notifications.push(notification);  // Push the notification to the array
//         } else {
//             // console.log("User not found for volunteer:", volunteer);  // Log the missing user
//         }
//     });

//     // console.log("Assigned Volunteers Array: ", assignedVolunteers);
//     // console.log("Notifications Array: ", notifications);  // Check the updated notifications array

//     res.status(200).json({ success: true, message: 'Volunteers assigned successfully!', assignedVolunteers });
// };

// module.exports = { assignVolunteersToEvent, assignedVolunteers, notifications, };
