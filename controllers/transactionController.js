const User = require('../models/user');
const Club = require('../models/club');
const Transaction = require('../models/transaction');
const { v4: uuidv4 } = require('uuid'); // For unique coin tracking
const { authenticateToken } = require('../middleware/authMiddleware')


exports.transferMoneyToClub = async (req, res) => {
  try {
    const userId = req.user?.id || req.body.userId; // Extract user ID from JWT or request body
    const { clubId, amount } = req.body;

    if (!userId) {
      return res.status(400).json({ message: 'User ID is required' });
    }

    // Find user by _id
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Find club by _id
    const club = await Club.findById(clubId);
    if (!club) {
      return res.status(404).json({ message: 'Club not found' });
    }

    // Check if the user has enough balance
    if (user.balance < amount) {
      return res.status(400).json({ message: 'Insufficient balance' });
    }

    // Deduct money from user & add to club
    user.balance -= amount;
    club.balance += amount;

    await user.save();
    await club.save();

    // Create detailed transaction record
    const coinsTransferred = Array.from({ length: amount }, () => ({
      coinId: uuidv4(), // Generate unique coin IDs
    }));

    const transaction = new Transaction({
      senderId: user._id,
      senderModel: 'User',
      receiverId: club._id,
      receiverModel: 'Club',
      amount,
      coins: coinsTransferred,
      transactionType: 'user_to_club',
    });

    await transaction.save();

    res.status(200).json({
      message: 'Money transferred successfully',
      transaction,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error transferring money', error: error.message });
  }
};



// exports.getUserTransactionHistory = async (req, res) => {
//   try {
//     const { userId } = req.params;
//     console.log(userId)
//     console.log("Request User:", req.user.userId);

//     if (req.params.userId !== User.userId ) {
//       return res.status(403).json({ message: 'Unauthorized access' });
//     }

//     const userTransactions = await Transaction.find({
//       $or: [
//         { senderId: userId, senderModel: 'User' },
//         { receiverId: userId, receiverModel: 'User' }
//       ]
//     }).sort({ timestamp: -1 });

//     res.status(200).json({ transactions: userTransactions });
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching transaction history', error: error.message });
//   }
// };

exports.getUserTransactionHistory = async (req, res) => {
  try {
    const { userId } = req.params; // Extract userId from the URL parameters
    console.log("Request User:", req.user);  // Check the decoded user info

    // Compare the userId from token with the userId in the params
    if (req.user.userId !== userId) {
      return res.status(403).json({ message: 'Unauthorized access' });
    }

    // Query the database to find transactions
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

    // Update getClubTransactionHistory
if (req.user.role === 'clubAdmin' && req.user.clubId.toString() !== clubId) {
  return res.status(403).json({ message: 'Unauthorized for this club' });
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
