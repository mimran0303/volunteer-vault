const userProfiles = require('../data/userProfiles');
const events = require('../data/eventManagement');

function matchVolunteersToEvents() {
    const matchedVolunteers = [];

    events.forEach(event => {
        console.log(`Matching for event: ${event.eventName}`);

        const suitableVolunteers = userProfiles.filter(user => {
            const skillsMatch = user.skills.toLowerCase() === event.skillsRequired.toLowerCase();

            // Check if event location contains the volunteer's city
            const locationMatch = event.location.toLowerCase().includes(user.city.toLowerCase());

            const availabilityMatch = user.availability === event.date;


            //For testing
            // console.log(`Volunteer: ${user.fullName}`);
            // console.log(`Skills Match: ${skillsMatch}`);
            // console.log(`Location Match: ${locationMatch}`);
            // console.log(`Availability Match: ${availabilityMatch}`);

            return skillsMatch && locationMatch && availabilityMatch;
        });

        matchedVolunteers.push({
            event: event.eventName,
            volunteers: suitableVolunteers.map(vol => vol.fullName),
        });
    });

    return matchedVolunteers;
}


module.exports = { matchVolunteersToEvents };
