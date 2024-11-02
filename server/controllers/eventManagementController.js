
//const eventDetails = require('../data/eventManagement');
const db = require('../config/index');

// GET request: Retrieves all events tied to a specific admin
exports.getEvents = async (req, res) => {
  try {
    const userId = req.user.userId;
    const db_con = await db();
    
    const [events] = await db_con.query("SELECT * FROM eventdetails WHERE event_admin_id = ?", [userId]);
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ Error: "Failed to retrieve events." });
  }
};

// POST request: Creates a new event tied to a specific admin
/*exports.createEventManagement = async (req, res) => {
  console.log(req.body);
  //const { eventName, location, city, state, zipcode, eventDescription, skills, urgency, eventDate } = req.body;

  try {
    
    const sql = "INSERT INTO eventdetails (event_admin_id, event_name, event_description, location, city, state, zip_code, required_skills, urgency, event_date) VALUES (?)";
    const values = [req.user.userId, req.body.eventName, req.body.eventDescription, req.body.location,req.body.city,req.body.state,req.body.zipcode,req.body.skills,req.body.urgency,req.body.date] ;
    console.log(values);
    // Get database connection
    const db_con = await db();
    // Insert the values 
    await db_con.query(sql, [values]);
    res.status(201).json({ message: "Event created successfully" });
  } catch (error) {
    res.status(500).json({ Error: "Failed to create event." });
  }
};*/

exports.createEventManagement = async (req, res) => {
  console.log(req.body)

  const  userId  = req.user.userId; // Make sure req.user exists
  const { eventName, eventDescription, location, city, state, zipcode, skills, urgency, date } = req.body;

  try {
    const sql = `INSERT INTO eventdetails 
      (event_admin_id, event_name, event_description, location, city, state, zip_code, required_skills, urgency, event_date) 
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    
    const values = [userId, eventName, eventDescription, location, city, state, zipcode, skills, urgency, date];
    
    console.log("Values to Insert:", values);
    
    const db_con = await db();
    await db_con.query(sql, values);
    
    res.status(201).json({ message: "Event created successfully" });
  } catch (error) {
    console.error("Database Error:", error);
    res.status(500).json({ Error: "Failed to create event." });
  }
};

// PUT request: Edits a selected event
exports.editEvent = async (req, res) => {
  const eventId = parseInt(req.params.id);
  const { eventName, location, city, state, zipcode, eventDescription, skills, urgency, date } = req.body;

  try {
    const db_con = await db();
    
    const sql = "UPDATE eventdetails SET event_name = ?, event_description = ?, location = ?, city = ?, state = ?, zip_code = ?, required_skills = ?, urgency = ?, event_date = ? WHERE event_id = ? AND event_admin_id = ?";
    const values = [eventName, eventDescription, location, city, state, zipcode, skills, urgency, date, eventId, req.user.userId];

    const [result] = await db_con.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ Error: "Event not found or unauthorized." });
    }

    res.status(200).json({ message: "Event updated successfully" });
  } catch (error) {
    res.status(500).json({ Error: "Failed to update event." });
  }
};

// DELETE request: Deletes a selected event
exports.deleteEvent = async (req, res) => {
  const eventId = parseInt(req.params.id);

  try {
    const db_con = await db();

    const sql = "DELETE FROM eventdetails WHERE event_id = ?";
    const values = [eventId];

    const [result] = await db_con.query(sql, values);

    if (result.affectedRows === 0) {
      return res.status(404).json({ Error: "Event not found or unauthorized." });
    }

    res.status(200).json({ message: "Event deleted successfully" });
  } catch (error) {
    res.status(500).json({ Error: "Failed to delete event." });
  }
};

/*
// Gets all events that are tied to a specific admin
// JWT token has a user id field, this can be interpreted as the event admin id
exports.getEvents = (req, res) => {

  try {
    const userId = req.user.userId; 
    const userEvents = eventDetails.filter(event => event.eventAdminId === userId); // filtering for events that match the logged in user's jwt is to eventAdminId in eventDetails
    res.status(200).json(userEvents);
  } catch {
    res.status(500).json({ Error: "Failed to retrieve events." });
  }
}

// Create a new event that is tied to a specific admin
// eventAdminId is taken from the client-side as the 'auth' uses the verifyToken middleware. Thus, we can call the token from the client-side
// This is only an example, it would be easier to simply call verifyToken in the route instead of calling the token it from the client-side 
exports.createEventManagement = (req, res) => {
  const { eventAdminId, eventName, location, city, state, zipcode, eventDescription, skills, urgency, date } = req.body;

  const newEvent = {
    event_id: eventDetails.length + 1,
    eventAdminId,
    eventName,
    location,
    city,
    state,
    zipcode,
    eventDescription,
    skills,
    urgency,
    date,
  };

  eventDetails.push(newEvent);
  res.status(201).json(newEvent);
};

// edits a selected event
// eventId is passed into the URL to edit a selected event, this is a PUT request
exports.editEvent = (req, res) => {
  const eventId = parseInt(req.params.id); // Get the event ID from the URL
  const userId = req.user.userId; 

  const eventIndex = eventDetails.findIndex(event => event.event_id === eventId && event.eventAdminId === userId); // finding the array index associated with eventId and userId

  if (eventIndex !== -1) {
    const { eventName, location, city, state, zipcode, eventDescription, skills, urgency, date } = req.body;
    
    eventDetails[eventIndex] = {
      ...eventDetails[eventIndex], // Keep the same event ID and admin ID, SHOULD NOT CHANGE
      eventName,
      location,
      city, 
      state, 
      zipcode,
      eventDescription,
      skills,
      urgency,
      date
    };

    res.status(200).json(eventDetails[eventIndex]); // Respond with the updated event
  } else {
    res.status(404).json({ Error: "Event not found or unauthorized." });
  }
}

// deletes a selected event
// eventId is passed into the URL to delete a selected event, this is a DELETE request
exports.deleteEvent = (req, res) => {
  const eventId = parseInt(req.params.id); // Get the event ID from the request URL
  const userId = req.user.userId; 
  
  const eventIndex = eventDetails.findIndex(event => event.event_id === eventId && event.eventAdminId === userId);  // finding the array index associated with eventId and userId

  if (eventIndex !== -1) {
    // Remove the event from the array
    eventDetails.splice(eventIndex, 1);
    res.status(200).json({ message: "Event deleted successfully." });
  } else {
    res.status(404).json({ Error: "Event not found or unauthorized." });
  }
}*/
