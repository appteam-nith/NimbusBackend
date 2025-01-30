const Club = require('../models/club');

// Create a new club
exports.createClub = async (req, res) => {
  try {
    const { name, description } = req.body;

    // Check if club already exists
    const existingClub = await Club.findOne({ name });
    if (existingClub) {
      return res.status(400).json({ message: 'Club already exists' });
    }

    // Create new club
    const club = new Club({ name, description });
    await club.save();

    res.status(201).json({ message: 'Club created successfully', club });
  } catch (error) {
    res.status(500).json({ message: 'Error creating club', error: error.message });
  }
};

// Get all clubs
exports.getAllClubs = async (req, res) => {
  try {
    const clubs = await Club.find();
    res.status(200).json(clubs);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching clubs', error: error.message });
  }
};

// get club by id or name
exports.getClub = async (req, res) => {
    try {
        const club = await Club.find({name: req.params.name});
    }catch{
        res.status(404).json({ message: 'Club not found' });
    }
}



exports.getClubBalance =  async (req, res) => {
  try {
    const clubId = req.params.clubId; // Assuming clubId is passed in the URL

    // Find the club by its unique ID
    const club = await Club.findById(clubId);

    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Send back the balance of the club
    res.status(200).json({ balance: club.balance });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
}