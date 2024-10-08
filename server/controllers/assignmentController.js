/*
This controller is to get the user and their assigned event from the front end 
*/

// server/controllers/assignmentController.js

let assignedVolunteers = [];

const assignVolunteersToEvent = (req, res) => {
    const { eventDetails, volunteers } = req.body;

    // Filter out volunteers that are already assigned to the same event
    const newAssignments = volunteers.filter(volunteer => {
        return !assignedVolunteers.some(
            assigned => assigned.volunteer.fullName === volunteer.fullName &&
                        assigned.event.skillsRequired === eventDetails.skillsRequired &&
                        assigned.event.city === eventDetails.city &&
                        assigned.event.state === eventDetails.state &&
                        assigned.event.zipcode === eventDetails.zipcode &&
                        assigned.event.availability === eventDetails.availability
        );
    });

    // If there are no new assignments, return a message
    if (newAssignments.length === 0) {
        return res.status(400).json({ success: false, message: 'All volunteers are already assigned to this event.' });
    }

    // Store the new assignments
    newAssignments.forEach(volunteer => {
        assignedVolunteers.push({ event: eventDetails, volunteer });
    });

    console.log("Assigned Volunteers Array: ", assignedVolunteers);
    res.status(200).json({ success: true, message: 'Volunteers assigned successfully!', assignedVolunteers });
};

module.exports = { assignVolunteersToEvent };
