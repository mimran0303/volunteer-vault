const eventDetails = require('../data/eventManagement');

exports.getEvents = (req, res) => {
  try {
    const userId = req.user.userId; 
    const userEvents = eventDetails.filter(event => event.eventAdminId === userId);
    res.status(200).json(userEvents);
  } catch {
    res.status(500).json({ Error: "Failed to retrieve events." });
  }
}

// Create a new event
exports.createEventManagement = (req, res) => {
  const { eventAdminId, eventName, location, eventDescription, urgency, date } = req.body;

  const newEvent = {
    event_id: eventDetails.length + 1,
    eventAdminId,
    eventName,
    location,
    eventDescription,
    urgency,
    date,
  };

  eventDetails.push(newEvent);
  res.status(201).json(newEvent);
};

exports.editEvent = (req, res) => {
  const eventId = parseInt(req.params.id); // Get the event ID from the URL
  const userId = req.user.userId; // Get the user's ID from the token

  const eventIndex = eventDetails.findIndex(event => event.event_id === eventId && event.eventAdminId === userId);

  if (eventIndex !== -1) {
    // Update the event details with the new data from the request body
    const { eventName, location, eventDescription, skills, urgency, date } = req.body;
    
    eventDetails[eventIndex] = {
      ...eventDetails[eventIndex], // Keep the same event ID and admin ID
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

exports.deleteEvent = (req, res) => {
  const eventId = parseInt(req.params.id); // Get the event ID from the request URL
  const userId = req.user.userId; // Get the user's ID from the request
  
  const eventIndex = eventDetails.findIndex(event => event.event_id === eventId && event.eventAdminId === userId);

  if (eventIndex !== -1) {
    // Remove the event from the array
    eventDetails.splice(eventIndex, 1);
    res.status(200).json({ message: "Event deleted successfully." });
  } else {
    res.status(404).json({ Error: "Event not found or unauthorized." });
  }
}
