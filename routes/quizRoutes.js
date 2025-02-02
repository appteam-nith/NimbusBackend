const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// router.get('/questions', getQuestions);
// router.post('/submit', submitQuiz);
// router.get('/leaderboard', getLeaderboard);
// router.post('/question',postQuestion);

// Route to get quiz questions for a specific event
router.get('/:eventId', authenticateToken, quizController.getQuestions);

// Route to submit quiz answers
router.post('/submit', authenticateToken, quizController.submitQuiz);

// Route to get event rankings
router.get('/rankings/:eventId', authenticateToken, quizController.getEventRankings);
  // Route to post the questions
router.post(
    '/post-question', 
    authenticateToken, 
    authorizeRole('admin', 'clubAdmin'), 
    quizController.postQuestion
  );

  
module.exports = router;