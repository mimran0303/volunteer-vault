// const db = require('../config/index');
//
// const getNotifications = async (req, res) => {
//     const recipientId = req.params.recipientId;
//
//     try {
//         const db_con = await db();
//         const [notifications] = await db_con.query(
//             `SELECT * FROM notifications WHERE recipient_id = ? AND is_read = false ORDER BY date DESC`,
//             [recipientId]
//         );
//
//         await db_con.end();
//         res.status(200).json({ success: true, notifications });
//     } catch (error) {
//         console.error("Error fetching notifications:", error);
//         res.status(500).json({ success: false, message: 'Error fetching notifications.' });
//     }
// };
//
// module.exports = { getNotifications };
//
const initializeDatabaseConnection = require('../config/index');

const getNotifications = async (req, res) => {
    const recipientId = req.params.recipientId;
    console.log("Fetching notifications for recipientId:", recipientId);

    try {
        const db = await initializeDatabaseConnection();
        
        const [rows] = await db.query(
            `SELECT * FROM notifications WHERE recipient_id = ?`, [recipientId]
        );

        console.log("Notifications fetched:", rows);
        
        await db.end();  // Close the connection after querying
        
        if (rows.length > 0) {
            res.status(200).json({ success: true, notifications: rows });
        } else {
            res.status(404).json({ success: false, message: 'No notifications found.' });
        }
    } catch (error) {
        console.error('Error fetching notifications:', error.message);
        res.status(500).json({ success: false, message: 'Error fetching notifications' });
    }
};

module.exports = { getNotifications };









// const notifications = require('../data/notifications');  // Import notifications array
// const jwt = require('jsonwebtoken');
//
// const getUserNotifications = (req, res) => {
//     // console.log("Reached /api/notifications endpoint");  // Log to confirm the route is hit
//
//     const userId = req.user.userId;  // Extract the userId from the decoded token
//     // console.log("Fetching notifications for userId:", userId);
//
//     const token = req.cookies.token;  // Assuming the JWT is stored in cookies
//     if (!token) {
//         return res.status(401).json({ success: false, message: 'Not authenticated' });
//     }
//
//     jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
//         if (err) {
//             return res.status(403).json({ success: false, message: 'Failed to authenticate token' });
//         }
//
//         // console.log("Decoded JWT: ", decoded);  // Log the decoded token
//         const userNotifications = notifications.filter(notification => notification.userId === userId);
//
//         // console.log("User Notifications for userId: ", userId, userNotifications);  // Log the user notifications
//         res.status(200).json({ success: true, notifications: userNotifications });
//     });
// };
//
// module.exports = { getUserNotifications };


