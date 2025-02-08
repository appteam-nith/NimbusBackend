const Quiz = require('../models/quizModel');
const Submission = require('../models/submissionModel');
// // Create quiz
// // exports.createQuiz = async (req, res) => {
// //   try {
// //     const { eventId, questions } = req.body;
// //     const userId = req.user._id;

// //     // Authorization check
// //     if (req.user.role !== 'admin' && req.user.role !== 'clubAdmin') {
// //       return res.status(403).json({ message: 'Unauthorized to create quiz' });
// //     }

// //     // Club admin validation
// //     if (req.user.role === 'clubAdmin') {
// //       const event = await Event.findById(eventId);
// //       if (!event) return res.status(404).json({ message: 'Event not found' });
// //       if (event.clubId.toString() !== req.user.clubId.toString()) {
// //         return res.status(403).json({ message: 'Unauthorized for this club' });
// //       }
// //     }

// //     const quiz = new Quiz({ eventId, createdBy: userId, questions });
// //     await quiz.save();
// //     res.status(201).json(quiz);
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // };

// // exports.createQuiz = async (req, res) => {
// //   try {

// //     console.log('User role:', req.user.role);
// //     const { eventId, questions } = req.body;
// //     const userId = req.user._id;

// //     // Validate request body
// //     if (!eventId || !questions || !Array.isArray(questions)) {
// //       return res.status(400).json({ message: 'Invalid request format' });
// //     }

// //     // Authorization check for users (only admin and clubAdmin can create quizzes)
// //     if (req.user.role === 'user') {
// //       return res.status(403).json({ message: 'Unauthorized to create quiz' });
// //     }

// //     // If role is clubAdmin or admin, proceed with quiz creation
// //     if (req.user.role === 'clubAdmin' || req.user.role === 'admin') {
// //       // 1. Verify event exists (no need to check club association for clubAdmins)
// //       const event = await Event.findById(eventId);

// //       if (!event) {
// //         return res.status(404).json({ message: 'Event not found' });
// //       }
// //     }

// //     // Additional question validation
// //     const isValidQuiz = questions.every(question => 
// //       question.questionText?.trim() &&
// //       Array.isArray(question.options) &&
// //       question.options.length >= 2 &&
// //       typeof question.correctAnswer === 'number' &&
// //       question.correctAnswer >= 0 &&
// //       question.correctAnswer < question.options.length
// //     );

// //     if (!isValidQuiz) {
// //       return res.status(400).json({ message: 'Invalid quiz structure' });
// //     }

// //     // Create and save quiz
// //     const quiz = new Quiz({ 
// //       eventId, 
// //       createdBy: userId, 
// //       questions 
// //     });
    
// //     await quiz.save();
    
// //     res.status(201).json({
// //       message: 'Quiz created successfully',
// //       quiz: {
// //         _id: quiz._id,
// //         eventId: quiz.eventId,
// //         questionCount: quiz.questions.length,
// //         createdAt: quiz.createdAt
// //       }
// //     });
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // };
// exports.createQuiz = async (req, res) => {
//   try {
//     console.log('User:', req.user);  // Log user details
//     console.log('User role:', req.user.role);
//     const { eventId, questions } = req.body;
//     const userId = req.user.userId; // Make sure you're using userId here, not _id, if it's decoded that way

//     // Validate request body
//     if (!eventId || !questions || !Array.isArray(questions)) {
//       return res.status(400).json({ message: 'Invalid request format' });
//     }

//     // Authorization check for users (only admin and clubAdmin can create quizzes)
//     if (req.user.role === 'user') {
//       return res.status(403).json({ message: 'Unauthorized to create quiz' });
//     }

//     // If role is clubAdmin or admin, proceed with quiz creation
//     if (req.user.role === 'clubAdmin' || req.user.role === 'admin') {
//       const event = await Event.findById(eventId);

//       if (!event) {
//         return res.status(404).json({ message: 'Event not found' });
//       }
//     }

//     // Additional question validation
//     const isValidQuiz = questions.every(question => 
//       question.questionText?.trim() &&
//       Array.isArray(question.options) &&
//       question.options.length >= 2 &&
//       typeof question.correctAnswer === 'number' &&
//       question.correctAnswer >= 0 &&
//       question.correctAnswer < question.options.length
//     );

//     if (!isValidQuiz) {
//       return res.status(400).json({ message: 'Invalid quiz structure' });
//     }

//     // Create and save quiz
//     const quiz = new Quiz({ 
//       eventId, 
//       createdBy: userId, 
//       questions 
//     });

//     await quiz.save();
    
//     res.status(201).json({
//       message: 'Quiz created successfully',
//       quiz: {
//         _id: quiz._id,
//         eventId: quiz.eventId,
//         questionCount: quiz.questions.length,
//         createdAt: quiz.createdAt
//       }
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// // exports.createQuiz = async (req, res) => {
// //   try {
// //     const { eventId, questions } = req.body;
// //     const userId = req.user._id;

// //     // Validate request body
// //     if (!eventId || !questions || !Array.isArray(questions)) {
// //       return res.status(400).json({ message: 'Invalid request format' });
// //     }

// //     // Authorization check
// //     if (req.user.role == 'user') {
// //       return res.status(403).json({ message: 'Unauthorized to create quiz' });
// //     }

// //     // For clubAdmins - comprehensive validation
// //     if (req.user.role === 'clubAdmin') {
// //       // 1. Verify admin has valid club association
      

// //       // 2. Verify event exists and belongs to admin's club
// //       const event = await Event.findById(eventId)
        

// //       if (!event) {
// //         return res.status(404).json({ message: 'Event not found' });
// //       }

// //       // if (event.clubId.toString() !== req.user.clubId.toString()) {
// //       //   return res.status(403).json({ 
// //       //     message: 'Event does not belong to your club',
// //       //     yourClub: req.user.clubId,
// //       //     eventClub: event.clubId
// //       //   });
// //       }
    

// //     // Additional question validation
// //     const isValidQuiz = questions.every(question => 
// //       question.questionText?.trim() &&
// //       Array.isArray(question.options) &&
// //       question.options.length >= 2 &&
// //       typeof question.correctAnswer === 'number' &&
// //       question.correctAnswer >= 0 &&
// //       question.correctAnswer < question.options.length
// //     );

// //     if (!isValidQuiz) {
// //       return res.status(400).json({ message: 'Invalid quiz structure' });
// //     }

// //     // Create and save quiz
// //     const quiz = new Quiz({ 
// //       eventId, 
// //       createdBy: userId, 
// //       questions 
// //     });
    
// //     await quiz.save();
    
// //     res.status(201).json({
// //       message: 'Quiz created successfully',
// //       quiz: {
// //         _id: quiz._id,
// //         eventId: quiz.eventId,
// //         questionCount: quiz.questions.length,
// //         createdAt: quiz.createdAt
// //       }
// //     });
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // };

// // Get quizzes by event
// // exports.getQuizzesByEvent = async (req, res) => {
// //   try {
// //     const quizzes = await Quiz.find({ eventId: req.params.eventId })
// //       .populate('createdBy', 'name');
// //     res.json(quizzes);
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // };

// // Get single quiz
// exports.getQuizById = async (req, res) => {
//   try {
//     const quiz = await Quiz.findById(req.params.quizId)
//       .populate('createdBy', 'name');
//     if (!quiz) return res.status(404).json({ message: 'Quiz not found' });
//     res.json(quiz);
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Submit Quiz with Per-Event Scoring
// // exports.submitQuiz = async (req, res) => {
// //   try {
// //     const { correctAnswersCount } = req.body;
// //     const userId = req.user._id;
// //     const quizId = req.params.quizId;

// //     // Check existing submission
// //     const existingSubmission = await Submission.findOne({ userId, quizId });
// //     if (existingSubmission) {
// //       return res.status(400).json({ message: 'Quiz already submitted' });
// //     }

// //     // Get quiz and event
// //     const quiz = await Quiz.findById(quizId).populate('eventId');
// //     if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

// //     // Create submission
// //     const submission = new Submission({
// //       userId,
// //       quizId,
// //       eventId: quiz.eventId,
// //       correctAnswersCount
// //     });
// //     await submission.save();

// //     // Update user's per-event score
// //     const user = await User.findById(userId);
// //     const eventId = quiz.eventId._id.toString();
// //     const currentScore = user.correctAnswers.get(eventId) || 0;
// //     user.correctAnswers.set(eventId, currentScore + correctAnswersCount);
// //     await user.save();

// //     res.status(201).json({
// //       submission,
// //       eventScore: user.correctAnswers.get(eventId)
// //     });
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // };

// // Get Quiz with Questions (for frontend)
// // exports.getQuizByEvent = async (req, res) => {
// //   try {
// //     const quizzes = await Quiz.find({ eventId: req.params.eventId })
// //       .populate('createdBy', 'name')
// //       .select('questions createdAt');

// //     res.json({
// //       eventId: req.params.eventId,
// //       quizzes: quizzes.map(quiz => ({
// //         _id: quiz._id,
// //         questions: quiz.questions,
// //         createdAt: quiz.createdAt
// //       }))
// //     });
// //   } catch (error) {
// //     res.status(500).json({ message: error.message });
// //   }
// // };

// // Get Quiz for Frontend (without answers)
// exports.getQuizByEvent = async (req, res) => {
//   try {
//     const quizzes = await Quiz.find({ eventId: req.params.eventId })
//       .select('questions.questionText questions.options createdAt');

//     res.json({
//       eventId: req.params.eventId,
//       quizzes: quizzes.map(quiz => ({
//         _id: quiz._id,
//         questions: quiz.questions.map(q => ({
//           questionText: q.questionText,
//           options: q.options
//         })),
//         createdAt: quiz.createdAt
//       }))
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };

// // Submit Quiz with Server-Side Validation
// exports.submitQuiz = async (req, res) => {
//   try {
//     const { answers } = req.body; // Array of { questionIndex, selectedOptionIndex }
//     const userId = req.user._id;
//     const quizId = req.params.quizId;

//     // Check existing submission
//     const existingSubmission = await Submission.findOne({ userId, quizId });
//     if (existingSubmission) {
//       return res.status(400).json({ message: 'Quiz already submitted' });
//     }

//     // Get quiz with answers
//     const quiz = await Quiz.findById(quizId).populate('eventId');
//     if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

//     // Calculate score
//     let correctCount = 0;
//     answers.forEach(({ questionIndex, selectedOptionIndex }) => {
//       const question = quiz.questions[questionIndex];
//       if (question && selectedOptionIndex === question.correctAnswer) {
//         correctCount++;
//       }
//     });

//     // Create submission
//     const submission = new Submission({
//       userId,
//       quizId,
//       eventId: quiz.eventId,
//       correctAnswersCount: correctCount
//     });
//     await submission.save();

//     // Update user's per-event score
//     const user = await User.findById(userId);
//     const eventId = quiz.eventId._id.toString();
//     const currentScore = user.correctAnswers.get(eventId) || 0;
//     user.correctAnswers.set(eventId, currentScore + correctCount);
//     await user.save();

//     res.status(201).json({
//       submission,
//       eventScore: user.correctAnswers.get(eventId),
//       totalQuestions: quiz.questions.length,
//       correctCount
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };


// Create a quiz
exports.createQuiz = async (req, res) => {
  try {
    const { eventId, title, questions } = req.body;

    // Use the role from the authenticated token
    const { role } = req.user;
    console.log(role)
    if (!['admin', 'clubAdmin'].includes(role)) {
      return res.status(403).json({ message: 'Unauthorized role to create a quiz' });
    }

    const quiz = new Quiz({
      eventId,
      title,
      questions,
      createdBy: role,
    });

    await quiz.save();

    res.status(201).json({ message: 'Quiz created successfully', quizId: quiz._id });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Fetch quiz and questions
exports.getQuizById = async (req, res) => {
  try {
    const { quizId } = req.params;
    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    res.status(200).json({ quiz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit quiz answers
exports.submitQuiz = async (req, res) => {
  try {
    const { quizId } = req.params;
    const { userId, answers } = req.body;

    const quiz = await Quiz.findById(quizId);

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found' });
    }

    let score = 0;

    // Evaluate the answers
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswerIndex) {
        score++;
      }
    });

    const submission = new Submission({ quizId, userId, answers, score });
    await submission.save();

    res.status(201).json({ message: 'Quiz submitted successfully', score });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Fetch winners based on correct answers and submission time
exports.getQuizWinners = async (req, res) => {
  try {
    const { quizId } = req.params;

    const submissions = await Submission.find({ quizId })
      .sort({ score: -1, submittedAt: 1 })
      .limit(3);

    res.status(200).json({ winners: submissions });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Fetch quiz by event ID
exports.getQuizByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;
    const quiz = await Quiz.findOne({ eventId });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found for this event' });
    }

    res.status(200).json({ quiz });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

// Submit quiz by event ID
exports.submitQuizByEventId = async (req, res) => {
  try {
    const { eventId } = req.params;
    const { userId, answers } = req.body;

    const quiz = await Quiz.findOne({ eventId });

    if (!quiz) {
      return res.status(404).json({ message: 'Quiz not found for this event' });
    }

    let score = 0;

    // Evaluate the answers
    quiz.questions.forEach((question, index) => {
      if (answers[index] === question.correctAnswerIndex) {
        score++;
      }
    });

    const submission = new Submission({ quizId: quiz._id, userId, answers, score });
    await submission.save();

    res.status(201).json({ message: 'Quiz submitted successfully', score });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};


// Fetch questions
// exports.getQuestions = async (req, res) => {
//   try {
//     const questions = await Question.find();
//     res.json(questions);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching questions' });
//   }
// };
// // Submit Quiz with Per-Event Scoring
// exports.submitQuiz = async (req, res) => {
//   try {
//     const { correctAnswersCount } = req.body;
//     const userId = req.user._id;
//     const quizId = req.params.quizId;

//     // Check existing submission
//     const existingSubmission = await Submission.findOne({ userId, quizId });
//     if (existingSubmission) {
//       return res.status(400).json({ message: 'Quiz already submitted' });
//     }

//     // Get quiz and event
//     const quiz = await Quiz.findById(quizId).populate('eventId');
//     if (!quiz) return res.status(404).json({ message: 'Quiz not found' });

//     // Create submission
//     const submission = new Submission({
//       userId,
//       quizId,
//       eventId: quiz.eventId,
//       correctAnswersCount
//     });
//     await submission.save();

//     // Update user's per-event score
//     const user = await User.findById(userId);
//     const eventId = quiz.eventId._id.toString();
//     const currentScore = user.correctAnswers.get(eventId) || 0;
//     user.correctAnswers.set(eventId, currentScore + correctAnswersCount);
//     await user.save();

//     res.status(201).json({
//       submission,
//       eventScore: user.correctAnswers.get(eventId)
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// // Get Quiz with Questions (for frontend)
// exports.getQuizByEvent = async (req, res) => {
//   try {
//     const quizzes = await Quiz.find({ eventId: req.params.eventId })
//       .populate('createdBy', 'name')
//       .select('questions createdAt');

//     res.json({
//       eventId: req.params.eventId,
//       quizzes: quizzes.map(quiz => ({
//         _id: quiz._id,
//         questions: quiz.questions,
//         createdAt: quiz.createdAt
//       }))
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };
// // exports.submitQuiz = async (req, res) => {
// //   try {
// //     const { eventId, answers } = req.body; // Answers: [{ questionId, selectedOption }]
// //     const userId = req.user.userId;

// //     if (!eventId || !answers || answers.length === 0) {
// //       return res.status(400).json({ message: "Invalid input: eventId and answers are required" });
// //     }

// //     const questions = await Question.find({ eventId });
// //     let correctCount = 0;

// //     if (!questions.length) {
// //       return res.status(404).json({ message: "No questions found for this event" });
// //     }

// //     answers.forEach(answer => {
// //       const question = questions.find(q => q._id.toString() === answer.questionId);
// //       if (question && question.correctAnswer === answer.selectedOption) {
// //         correctCount++;
// //       }
// //     });

// //     const user = await User.findById(userId);
// //     if (!user) {
// //       return res.status(404).json({ message: "User not found" });
// //     }

// //     // Update correct answers and submission time
// //     user.correctAnswers += correctCount;
// //     user.submissionTime = new Date();
// //     await user.save();

// //     res.status(200).json({
// //       message: "Quiz submitted successfully",
// //       correctAnswers: correctCount,
// //       submissionTime: user.submissionTime
// //     });

// //   } catch (error) {
// //     console.error(error);
// //     res.status(500).json({ message: "Error submitting quiz" });
// //   }
// // };


// // // // Leaderboard
// exports.getLeaderboard = async (req, res) => {
//   try {
//     const users = await User.find().sort({ correctAnswers: -1 });
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching leaderboard' });
//   }
// };

// exports.postQuestion = async (req, res) => {
//   try {
//     const { eventId, question, options, correctAnswer } = req.body;

//     // Ensure all options are provided
//     if (!question || options.length !== 4 || correctAnswer === undefined) {
//       return res.status(400).json({ message: 'Invalid input: Must provide a question, four options, and a correct answer' });
//     }

//     // Validate event existence
//     const event = await Event.findById(eventId);
//     if (!event) {
//       return res.status(404).json({ message: 'Event not found' });
//     }

//     const newQuestion = new Question({
//       eventId,
//       question,
//       options,
//       correctAnswer
//     });

//     await newQuestion.save();
//     res.status(201).json({ message: 'Question posted successfully', newQuestion });

//   } catch (error) {
//     console.error(error);
//     res.status(500).json({ message: 'Error in question posting' });
//   }
// };


// exports.getEventRankings = async (req, res) => {
//   try {
//     const { eventId } = req.params;

//     const users = await User.find({}).sort({ correctAnswers: -1, submissionTime: 1 });

//     const rankings = users.map((user, index) => ({
//       rank: index + 1,
//       name: user.name,
//       correctAnswers: user.correctAnswers,
//       submissionTime: user.submissionTime
//     }));

//     return res.status(200).json(rankings);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };


// const Question = require('../models/questions');
// const User = require('../models/user');
// const Event = require('../models/event');

// // Fetch questions by event
// exports.getQuestions = async (req, res) => {
//   try {
//     const { eventId } = req.params;
//     const questions = await Question.find({ eventId });
//     if (!questions.length) {
//       return res.status(404).json({ message: 'No questions found for this event' });
//     }
//     res.json(questions);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching questions' });
//   }
// };

// // Submit answers and calculate score
// exports.submitQuiz = async (req, res) => {
//   try {
//     const { eventId, answers } = req.body;
//     const userId = req.user.userId;

//     if (!eventId || !answers || answers.length === 0) {
//       return res.status(400).json({ message: "Invalid input: eventId and answers are required" });
//     }

//     const questions = await Question.find({ eventId });

//     if (!questions.length) {
//       return res.status(404).json({ message: "No questions found for this event" });
//     }

//     let correctCount = 0;
//     for (const answer of answers) {
//       const question = questions.find(q => q._id.toString() === answer.questionId);
//       if (question && question.correctAnswer === answer.selectedOption) {
//         correctCount++;
//       }
//     }

//     const user = await User.findById(userId);
//     if (!user) {
//       return res.status(404).json({ message: "User not found" });
//     }

//     // Update correct answers and submission time
//     user.correctAnswers += correctCount;
//     user.submissionTime = new Date();
//     await user.save();

//     res.status(200).json({
//       message: "Quiz submitted successfully",
//       correctAnswers: correctCount,
//       submissionTime: user.submissionTime
//     });

//   } catch (error) {
//     res.status(500).json({ message: "Error submitting quiz" });
//   }
// };

// // Post new question for a specific event
// exports.postQuestion = async (req, res) => {
//   try {
//     const { eventId, question, options, correctAnswer } = req.body;

//     if (!eventId || !question || options.length !== 4 || correctAnswer === undefined) {
//       return res.status(400).json({ message: 'Invalid input: Must provide an eventId, question, four options, and a correct answer' });
//     }

//     // Ensure the event exists
//     const event = await Event.findById(eventId);
//     if (!event) {
//       return res.status(404).json({ message: 'Event not found' });
//     }

//     const newQuestion = new Question({
//       eventId,
//       question,
//       options,
//       correctAnswer
//     });

//     await newQuestion.save();
//     res.status(201).json({ message: 'Question posted successfully', newQuestion });

//   } catch (error) {
//     res.status(500).json({ message: 'Error in question posting' });
//   }
// };

// // Get event-specific rankings
// exports.getEventRankings = async (req, res) => {
//   try {
//     const { eventId } = req.params;

//     const users = await User.find({}).sort({ correctAnswers: -1, submissionTime: 1 });

//     const rankings = users.map((user, index) => ({
//       rank: index + 1,
//       name: user.name,
//       correctAnswers: user.correctAnswers,
//       submissionTime: user.submissionTime
//     }));

//     return res.status(200).json(rankings);
//   } catch (err) {
//     return res.status(500).json({ message: err.message });
//   }
// };

// Submit answers and calculate score
// exports.submitQuiz = async (req, res) => {
//   const { username, answers } = req.body; // answers: [{questionId, selectedOption}]
//   try {
//     const questions = await Question.find();
//     let correctCount = 0;

//     questions.forEach((q, index) => {
//       if (q.correctAnswer === answers[index].selectedOption) {
//         correctCount++;
//       }
//     });

//     const user = new User({
//       username,
//       correctAnswers: correctCount
//     });
//     await user.save();

//     res.json({ correctCount, submissionTime: user.submissionTime });
//   } catch (error) {
//     res.status(500).json({ message: 'Error submitting quiz' });
//   }
// };