const Question = require('../models/questions');
const User = require('../models/user');

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
exports.submitQuiz = async (req, res) => {
  const { username, answers } = req.body; // answers: [{questionId, selectedOption}]
  try {
    const questions = await Question.find();
    let correctCount = 0;

    questions.forEach((q, index) => {
      if (q.correctAnswer === answers[index].selectedOption) {
        correctCount++;
      }
    });

    const user = new User({
      username,
      correctAnswers: correctCount
    });
    await user.save();

    res.json({ correctCount, submissionTime: user.submissionTime });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting quiz' });
  }
};

// Leaderboard
exports.getLeaderboard = async (req, res) => {
  try {
    const users = await User.find().sort({ correctAnswers: -1 });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching leaderboard' });
  }
};

//posting question 
exports.postQuestion= async(req,res)=>{
    try{
        const {question, options, correctAnswer}=req.body;
        const Newquestions = new Question({
            question,
            options,correctAnswer
        });
        await Newquestions.save();
        res.status(201).json({ message: 'Question posted successfully' });


    }catch(error){
        res.status(500).json({message:'error in question posting'})
    }
}