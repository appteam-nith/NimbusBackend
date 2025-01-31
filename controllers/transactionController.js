const User = require('../models/user');
const Club = require('../models/club');
const Transaction = require('../models/transaction');
const { v4: uuidv4 } = require('uuid'); // For unique coin tracking
const { authenticateToken } = require('../middleware/authMiddleware')

exports.transferMoneyToClub = async (req, res) => {
  try {
    const { rollNo, clubId, amount } = req.body;

    // Find user 
    const user = await User.findOne({ rollNo:rollNo});
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    // Find club
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Check balance
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct money from user & add to club
    user.balance -= amount;
    club.balance += amount;

    await user.save();
    await club.save();

    // Create detailed transaction record
    const coinsTransferred = [];
    for (let i = 0; i < amount; i++) {
      coinsTransferred.push({ coinId: uuidv4() }); // Unique coin ID
    }

    const transaction = new Transaction({
      senderId: user._id,
      senderModel: 'User',
      receiverId: club._id,
      receiverModel: 'Club',
      amount,
      coins: coinsTransferred,
      transactionType: 'user_to_club'
    });

    await transaction.save();

    res.status(200).json({ message: 'Money transferred successfully', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Error transferring money', error: error.message });
  }
};


exports.getUserTransactionHistory = async (req, res) => {
  try {
    const { userId } = req.params;

    if (req.user.userId !== userId && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const userTransactions = await Transaction.find({
      $or: [
        { senderId: userId, senderModel: 'User' },
        { receiverId: userId, receiverModel: 'User' }
      ]
    }).sort({ timestamp: -1 });

    res.status(200).json({ transactions: userTransactions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction history', error: error.message });
  }
};

exports.getClubTransactionHistory = async (req, res) => {
  try {
    const { clubId } = req.params;

    if (req.user.role !== 'admin' && req.user.role !== 'clubAdmin') {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    const clubTransactions = await Transaction.find({
      $or: [
        { senderId: clubId, senderModel: 'Club' },
        { receiverId: clubId, receiverModel: 'Club' }
      ]
    }).sort({ timestamp: -1 });

    res.status(200).json({ transactions: clubTransactions });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching transaction history', error: error.message });
  }
};
