const Question = require('../models/questions');
const User = require('../models/user');
const Event = require('../models/event');

// Fetch questions
exports.getQuestions = async (req, res) => {
  try {
    const questions = await Question.find();
    res.json(questions);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching questions' });
  }
};

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


exports.submitQuiz = async (req, res) => {
  try {
    const { eventId, answers } = req.body; // Answers: [{ questionId, selectedOption }]
    const userId = req.user.userId;

    if (!eventId || !answers || answers.length === 0) {
      return res.status(400).json({ message: "Invalid input: eventId and answers are required" });
    }

    const questions = await Question.find({ eventId });
    let correctCount = 0;

    if (!questions.length) {
      return res.status(404).json({ message: "No questions found for this event" });
    }

    answers.forEach(answer => {
      const question = questions.find(q => q._id.toString() === answer.questionId);
      if (question && question.correctAnswer === answer.selectedOption) {
        correctCount++;
      }
    });

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Update correct answers and submission time
    user.correctAnswers += correctCount;
    user.submissionTime = new Date();
    await user.save();

    res.status(200).json({
      message: "Quiz submitted successfully",
      correctAnswers: correctCount,
      submissionTime: user.submissionTime
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error submitting quiz" });
  }
};


// // Leaderboard
// exports.getLeaderboard = async (req, res) => {
//   try {
//     const users = await User.find().sort({ correctAnswers: -1 });
//     res.json(users);
//   } catch (error) {
//     res.status(500).json({ message: 'Error fetching leaderboard' });
//   }
// };

//posting question 
// exports.postQuestion= async(req,res)=>{
//     try{
//         const {question, options, correctAnswer}=req.body;
//         const Newquestions = new Question({
//             question,
//             options,correctAnswer
//         });
//         await Newquestions.save();
//         res.status(201).json({ message: 'Question posted successfully' });


//     }catch(error){
//         res.status(500).json({message:'error in question posting'})
//     }
// }



exports.postQuestion = async (req, res) => {
  try {
    const { eventId, question, options, correctAnswer } = req.body;

    // Ensure all options are provided
    if (!question || options.length !== 4 || correctAnswer === undefined) {
      return res.status(400).json({ message: 'Invalid input: Must provide a question, four options, and a correct answer' });
    }

    // Validate event existence
    const event = await Event.findById(eventId);
    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    const newQuestion = new Question({
      eventId,
      question,
      options,
      correctAnswer
    });

    await newQuestion.save();
    res.status(201).json({ message: 'Question posted successfully', newQuestion });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Error in question posting' });
  }
};


exports.getEventRankings = async (req, res) => {
  try {
    const { eventId } = req.params;

    const users = await User.find({}).sort({ correctAnswers: -1, submissionTime: 1 });

    const rankings = users.map((user, index) => ({
      rank: index + 1,
      name: user.name,
      correctAnswers: user.correctAnswers,
      submissionTime: user.submissionTime
    }));

    return res.status(200).json(rankings);
  } catch (err) {
    return res.status(500).json({ message: err.message });
  }
};



