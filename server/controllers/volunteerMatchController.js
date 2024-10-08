
const { matchVolunteersToEvents } = require('../utils/volunteerMatch');

const getMatchedVolunteers = (req, res) => {
    try {
        const matches = matchVolunteersToEvents();
        res.status(200).json({ success: true, data: matches });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { getMatchedVolunteers };