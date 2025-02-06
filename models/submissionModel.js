// const mongoose = require('mongoose');

// const submissionSchema = new mongoose.Schema({
//   userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
//   eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
//   correctAnswersCount: { type: Number, required: true },
//   submittedAt: { type: Date, default: Date.now }
// });

// module.exports = mongoose.model('Submission', submissionSchema);
// const submissionSchema = new mongoose.Schema({
//   quizId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'Quiz',
//     required: true
//   },
//   userId: {
//     type: mongoose.Schema.Types.ObjectId,
//     ref: 'User',
//     required: true
//   },
//   score: {
//     type: Number,
//     required: true,
//     default: 0
//   },
//   submissionTime: {
//     type: Date,
//     default: Date.now
//   }
// });

// const Submission = mongoose.model('Submission', submissionSchema);
// module.exports = Submission;


const mongoose = require('mongoose');

const submissionSchema = new mongoose.Schema({
  quizId: { type: mongoose.Schema.Types.ObjectId, ref: 'Quiz', required: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  answers: [{ type: Number, required: true }], // Array of answer indexes
  submittedAt: { type: Date, default: Date.now },
  score: { type: Number, default: 0 },
});

module.exports = mongoose.model('Submission', submissionSchema);
