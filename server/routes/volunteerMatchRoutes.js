// routes/volunteerMatch.js

const express = require('express');
const { matchVolunteersToEvents } = require('../utils/volunteerMatch');
const router = express.Router();

router.get('/match', (req, res) => {
    const matches = matchVolunteersToEvents();
    res.json({ success: true, matches });
});

module.exports = router;