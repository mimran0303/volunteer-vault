// This file stores the hardcoded volunteer data, which will be fetched when the API is called.

let volunteerHistory = [
    {
        volunteerName: "John Doe",
        participationStatus: "active",
        eventName: "Beach Cleanup",
        eventDescription: "A community event focused on cleaning up the local beach.",
        location: "Santa Monica Beach, CA",
        requiredSkills: ["Teamwork", "Physical Fitness"],
        urgency: "Medium",
        eventDate: "2024-10-20"
    },
    {
        volunteerName: "Jane Smith",
        participationStatus: "active",
        eventName: "Tree Planting",
        eventDescription: "Planting trees to help reforest a local park.",
        location: "Griffith Park, CA",
        requiredSkills: ["Gardening", "Teamwork"],
        urgency: "High",
        eventDate: "2024-11-05"
    }
];

module.exports = volunteerHistory;
