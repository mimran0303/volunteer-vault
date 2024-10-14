const notifications = require('../data/notifications');  // Import notifications array
const jwt = require('jsonwebtoken');

const getUserNotifications = (req, res) => {
    console.log("Reached /api/notifications endpoint");  // Log to confirm the route is hit

    const userId = req.user.userId;  // Extract the userId from the decoded token
    console.log("Fetching notifications for userId:", userId);

    const token = req.cookies.token;  // Assuming the JWT is stored in cookies
    if (!token) {
        return res.status(401).json({ success: false, message: 'Not authenticated' });
    }

    jwt.verify(token, process.env.JWT_SECRET_KEY, (err, decoded) => {
        if (err) {
            return res.status(403).json({ success: false, message: 'Failed to authenticate token' });
        }

        console.log("Decoded JWT: ", decoded);  // Log the decoded token
        // const userId = decoded.userId;  // Extract the userId from the decoded token
        const userNotifications = notifications.filter(notification => notification.userId === userId);

        console.log("User Notifications for userId: ", userId, userNotifications);  // Log the user notifications
        res.status(200).json({ success: true, notifications: userNotifications });
    });
};

module.exports = { getUserNotifications };


