
const { matchVolunteersToEvent } = require('../utils/volunteerMatch');

const matchVolunteersToEventController = (req, res) => {
    const { skills, city, state, zipcode, availability } = req.body;  // Get event details from the request body

    try {
        const matchedVolunteers = matchVolunteersToEvent({ skills, city, state, zipcode, availability });
        res.status(200).json({ matches: matchedVolunteers });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { matchVolunteersToEventController };
