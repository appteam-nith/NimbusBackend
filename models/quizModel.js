// const mongoose = require('mongoose');

// const quizSchema = new mongoose.Schema({
//   eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
//   createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
//   questions: [{
//     questionText: { type: String, required: true },
//     options: [{ type: String, required: true }],
//     correctAnswer: { type: Number, required: true }
//   }],
//   createdAt: { type: Date, default: Date.now }
// });

// quizSchema.path('questions').validate(function(questions) {
//     return questions.every(q => 
//       q.correctAnswer >= 0 && 
//       q.correctAnswer < q.options.length
//     );
//   }, 'Correct answer must be a valid option index');
  

// module.exports = mongoose.model('Quiz', quizSchema);


// const quizSchema = new mongoose.Schema({
//   title: {
//     type: String,
//     required: true
//   },
//   questions: [
//     {
//       questionText: { type: String, required: true },
//       options: [{ type: String, required: true }],
//       correctOptionIndex: { type: Number, required: true }
//     }
//   ],
//   createdAt: {
//     type: Date,
//     default: Date.now
//   }
// });

// const Quiz = mongoose.model('Quiz', quizSchema);
// module.exports = Quiz;
const mongoose = require('mongoose');

const quizSchema = new mongoose.Schema({
  eventId: { type: mongoose.Schema.Types.ObjectId, ref: 'Event', required: true },
  title: { type: String, required: true },
  questions: [
    {
      questionText: { type: String, required: true },
      options: [{ type: String, required: true }],
      correctAnswerIndex: { type: Number, required: true }
    }
  ],
  createdBy: { type: String, enum: ['admin', 'clubAdmin'], required: true },
});

module.exports = mongoose.model('Quiz', quizSchema);
