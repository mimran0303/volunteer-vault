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
    methods: ["POST", "GET"],
    credentials: true
}));
app.use(express.json());
app.use(cookieParser());


/*
Routes
boilerplate:

const someRoutes = require ("./routes/someRoutes")
app.use("/some", someRoutes)

axios.post('http://localhost:8080/some/page)
axios.get('http://localhost:8080/some/page)
*/
const authRoutes = require("./routes/authRoutes");
const protectedRoutes = require("./routes/protectedRoutes");

const volunteerMatchRoute = require('./routes/volunteerMatchRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');

app.use("/auth", authRoutes);
app.use("/protected", protectedRoutes);

app.use("/api/volunteers", volunteerMatchRoute);
app.use("/api/assignments", assignmentRoutes);



app.listen(PORT, () => {
    console.log(`Server started on port ${PORT}`);
});