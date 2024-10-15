const eventDetails = require('../data/eventManagement');

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
  const { eventAdminId, eventName, location, eventDescription, skills, urgency, date } = req.body;

  const newEvent = {
    event_id: eventDetails.length + 1,
    eventAdminId,
    eventName,
    location,
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
    const { eventName, location, eventDescription, skills, urgency, date } = req.body;
    
    eventDetails[eventIndex] = {
      ...eventDetails[eventIndex], // Keep the same event ID and admin ID, SHOULD NOT CHANGE
      eventName,
      location,
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
}
