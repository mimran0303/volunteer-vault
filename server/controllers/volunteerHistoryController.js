// This file contains the logic for handling requests. 
// In this case, the retrieveHistory function fetches the volunteerHistory data and returns it as a JSON response.

// API Flow: Between the Controller, Route, & Data Files
//	1.	Client makes a POST request to /retrieveHistory.
//	2.	The Express route matches this URL and method (POST), and the request is passed to the controller.
//	3.	The controller retrieves the volunteer history data from the data file.
//	4.	The data is sent as a JSON response to the client.


let volunteerHistory = require("../data/volunteerHistory"); // Import hardcoded data

// Function to retrieve all participation history
exports.retrieveHistory = (req, res) => {
    //console.log("volunteerHistory", volunteerHistory);
    res.status(200).json(volunteerHistory);

};


// Function to update participation status
/* exports.updateParticipationStatus = (req, res) => {
    const { volunteerName, eventName, newStatus } = req.body;

    // Find the matching record based on volunteerName and eventName
    let participationRecord = volunteerHistory.find(record =>
        record.volunteerName === volunteerName && record.eventName === eventName
    );

    // If found, update the participation status
    if (participationRecord) {
        participationRecord.participationStatus = newStatus;
        res.status(200).json({ message: "Status updated successfully", record: participationRecord });
    } else {
        res.status(404).json({ message: "Volunteer or event not found" });
    }
}; */