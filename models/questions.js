const mongoose = require('mongoose');

const quizSubmissionSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  answers: [
    {
      questionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Question', required: true },
      selectedOption: { type: Number, required: true },
      isCorrect: { type: Boolean, required: true }
    }
  ],
  correctAnswers: { type: Number, required: true },
  totalQuestions: { type: Number, required: true },
  submissionTime: { type: Date, default: Date.now }
});

const QuizSubmission = mongoose.model('QuizSubmission', quizSubmissionSchema);

module.exports = QuizSubmission;
