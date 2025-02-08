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

// exports.getAllEvents = async (req, res) => {
//     try {
//       const events = await Event.find().populate('clubId attendees').exec();
//       res.status(200).json(events);
//     } catch (err) {
//       res.status(500).json({ message: 'Error fetching events', error: err.message });
//     }
//   };

exports.getAllEventDetails = async (req, res) => {
  try {
    const events = await Event.find()
      .populate({
        path: 'clubId',
        select: 'name _id',
      })
      .select('name _id description clubId')
      .exec();

    const eventDetails = events.map(event => ({
      eventId: event._id,
      eventName: event.name,
      eventDescription: event.description,
      club: event.clubId?.name || event.clubId?._id
    }));

    res.status(200).json(eventDetails);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching event details', error: err.message });
  }
};


exports.updateEvent = async (req, res) => {
  const { id } = req.params;
  const { clubId, name, description } = req.body;
  
  try {
    // Find the event by ID and update it
    const event = await Event.findByIdAndUpdate(
      id, 
      { clubId, name, description },
      { new: true, runValidators: true } // new: returns the updated document, runValidators: apply schema validation
    );
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json({ message: 'Event updated successfully', event });
  } catch (err) {
    res.status(500).json({ message: 'Error updating event', error: err.message });
  }
};
exports.deleteEvent = async (req, res) => {
  const { id } = req.params;
  
  try {
    // Find the event by ID and delete it
    const event = await Event.findByIdAndDelete(id);
    
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }
    
    res.status(200).json({ message: 'Event deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting event', error: err.message });
  }
};
