const eventDetails = require('../data/eventManagement');

// Create a new event
exports.createEventManagement = (req, res) => {
  const { eventName, location, eventDescription, urgency, date } = req.body;
  const newEvent = {
    event_id: eventDetails.length + 1,
    eventName,
    location,
    eventDescription,
    urgency,
    date,
  };
  console.debug("Hello from Event Management!");
  eventDetails.push(newEvent);
  res.status(201).json(newEvent);
};

// Get all events
exports.getEventManagement = (req, res) => {res.status(200).json(eventDetails);};

// Get an event by ID
exports.getEventManagementId = (req, res) => {
  const { id } = req.params;
  const event = eventDetails.find((e) => e.event_id === parseInt(id));
  if (!event) return res.status(404).send("Event not found");
  res.status(200).json(event);
};

// Update an event by ID
exports.updateEventManagementId = (req, res) => {
  const { id } = req.params;
  const index = eventDetails.findIndex((e) => e.event_id === parseInt(id));
  if (index === -1) return res.status(404).send("Event not found");
  const updatedEvent = { ...eventDetails[index], ...req.body };
  eventDetails[index] = updatedEvent;
  res.status(200).json(updatedEvent);
};

// Delete an event by ID
exports.deleteEventManagementId = (req, res) => {
  const { id } = req.params;
  const index = eventDetails.findIndex((e) => e.event_id === parseInt(id));
  if (index === -1) return res.status(404).send("Event not found");
  const deletedEvent = eventDetails.splice(index, 1);
  res.status(200).json(deletedEvent);
};
