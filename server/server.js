// server.js
const express = require("express");
const app = express();
const PORT = 8080;
const cookieParser = require("cookie-parser");
const cors = require("cors");

// Environment variables
require('./config');

// Middleware
app.use(cors({
    origin: ["http://localhost:3000"],
    methods: ["POST", "GET","PUT","DELETE"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());

const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");
const eventManagementRoutes = require("./routes/eventManagementRoutes")
const userProfileRoute = require("./routes/userProfileRoute");


const volunteerMatchRoute = require('./routes/volunteerMatchRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');
const notificationRoutes = require('./routes/notificationsRoutes');
const eventsDropdownRoutes = require('./routes/eventsDropdownRoutes');

const volunteerHistoryRoutes = require("./routes/volunteerHistoryRoutes");

const volunteerReviewRoutes = require("./routes/volunteerReviewRoutes")

const reportRoutes = require("./routes/reportRoutes")


app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);
app.use("/eventManagement", eventManagementRoutes)
app.use("/userProfile",userProfileRoute)

app.use("/api/volunteers", volunteerMatchRoute);
app.use("/api/assignments", assignmentRoutes);
app.use('/api/notifications', notificationRoutes);
app.use('/api/events', eventsDropdownRoutes);

app.use("/", volunteerHistoryRoutes);
app.use("/volunteerReview", volunteerReviewRoutes)

app.use("/reports", reportRoutes)

app._router.stack.forEach(function(r) {
  if (r.route && r.route.path) {
    console.log(r.route.path);
  }
});


app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});
