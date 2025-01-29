const Event = require('../models/event');

// Create an event
exports.createEvent = async (req, res) => {
  const { clubId, name, description } = req.body;
  try {
    const event = new Event({ clubId, name, description });
    await event.save();
    res.status(201).json({ message: 'Event created successfully', event });
  } catch (err) {
    res.status(500).json({ message: 'Error creating event', error: err.message });
  }
};


exports.getEventById = async (req, res) => {
    const { id } = req.params;
    try {
      const event = await Event.findById(id).populate('clubId attendees').exec();
      if (!event) return res.status(404).json({ message: 'Event not found' });
      res.status(200).json(event);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching event', error: err.message });
    }
  };
  

  // Get all events
exports.getAllEvents = async (req, res) => {
    try {
      const events = await Event.find().populate('clubId attendees').exec();
      res.status(200).json(events);
    } catch (err) {
      res.status(500).json({ message: 'Error fetching events', error: err.message });
    }
  };