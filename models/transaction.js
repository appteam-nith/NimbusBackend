const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  senderId: { type: mongoose.Schema.Types.ObjectId, refPath: 'senderModel' }, // User or Bank
  senderModel: { type: String, enum: ['User', 'Bank'] }, // To support bank transactions
  receiverId: { type: mongoose.Schema.Types.ObjectId, refPath: 'receiverModel' }, // User or Club
  receiverModel: { type: String, enum: ['User', 'Club'] },
  amount: { type: Number, required: true },
  coins: [
    {
      coinId: { type: String, required: true }, // Unique ID for each coin
      transferredAt: { type: Date, default: Date.now }
    }
  ],
  transactionType: { type: String, enum: ['user_to_club', 'bank_to_user'], required: true },
  timestamp: { type: Date, default: Date.now }
});

const Transaction = mongoose.model('Transaction', transactionSchema);

module.exports = Transaction;
