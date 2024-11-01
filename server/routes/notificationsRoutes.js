const express = require('express');
const { getNotifications } = require('../controllers/notificationsController');
const router = express.Router();

// router.get('/:recipientId', (req,res,next) => {
//     console.log("Route accessed with recipientId:", req.params.recipientId);
//     next();
// }, getNotifications);
router.get('/:recipientId', getNotifications);

module.exports = router;






// const express = require('express');
// const router = express.Router()
// const { getUserNotifications } = require('../controllers/notificationsController');
// const verifyToken = require('../middleware/verifyToken');  // Add your token verification middleware
// const notifications = require('../data/notifications');
//
// // router.get('/notifications', verifyToken, getUserNotifications);  // Use verifyToken middleware here
// router.get('/notifications', (req, res) => {
//     console.log("Notifications before sending to front end: ", notifications);
//     res.json({success: true, notifications})
// })
//
// module.exports = router;
