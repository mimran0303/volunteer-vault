const { matchVolunteersToEvent } = require('../utils/volunteerMatch');

const matchVolunteersToEventController = async (req, res) => {
    const { skills, city, state, zip_code, availability } = req.body;
    
    // Log the incoming request data to help debug
    // console.log("Received match request with:", req.body);

    try {
        const matchedVolunteers = await matchVolunteersToEvent({ skills, city, state, zip_code, availability });
        
        // Log the matched volunteers before sending the response
        // console.log("Matched Volunteers:", matchedVolunteers);
        
        res.status(200).json({ matches: matchedVolunteers });
    } catch (error) {
        // console.error("Error during matching:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

module.exports = { matchVolunteersToEventController };




// const { matchVolunteersToEvent } = require('../utils/volunteerMatch');

// const matchVolunteersToEventController = (req, res) => {
//     const { skills, city, state, zipcode, availability } = req.body;  // Get event details from the request body

//     try {
//         const matchedVolunteers = matchVolunteersToEvent({ skills, city, state, zipcode, availability });
//         res.status(200).json({ matches: matchedVolunteers });
//     } catch (error) {
//         res.status(500).json({ success: false, message: error.message });
//     }
// };

// module.exports = { matchVolunteersToEventController };
