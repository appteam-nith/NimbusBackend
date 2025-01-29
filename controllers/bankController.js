const User = require('../models/user');
const Transaction = require('../models/transaction');
const { v4: uuidv4 } = require('uuid'); // Unique IDs for coins

exports.addMoneyToUser = async (req, res) => {
  try {
    const { rollNo, amount } = req.body;

    // Find user
    const user = await User.findOne({ rollNo });
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Update user's balance
    user.balance += amount;
    await user.save();

    // Create transaction log
    const coinsAdded = [];
    for (let i = 0; i < amount; i++) {
      coinsAdded.push({ coinId: uuidv4() });
    }

    const transaction = new Transaction({
      senderId: null, // Bank has no MongoDB entry
      senderModel: 'Bank',
      receiverId: user._id,
      receiverModel: 'User',
      amount,
      coins: coinsAdded,
      transactionType: 'bank_to_user'
    });

    await transaction.save();

    res.status(200).json({ message: 'Money added successfully', transaction });
  } catch (error) {
    res.status(500).json({ message: 'Error adding money', error: error.message });
  }
};
