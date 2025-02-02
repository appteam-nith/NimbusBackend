const mongoose = require('mongoose');

const questionSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  question: { type: String, required: true },
  options: [{ type: String, required: true }],
  correctAnswer: { type: Number, required: true }
});

const Question = mongoose.model('Question', questionSchema);

module.exports = Question;
