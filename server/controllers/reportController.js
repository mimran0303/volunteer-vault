const db = require('../config/index');

exports.generateReport = (req, res) => {
    console.log(req.body)
    res.status(200).json({ success: true});
};
