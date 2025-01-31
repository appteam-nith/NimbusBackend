const express = require('express');
const router = express.Router();
const { getQuestions, submitQuiz, getLeaderboard, postQuestion } = require('../controllers/quizController');

router.get('/questions', getQuestions);
router.post('/submit', submitQuiz);
router.get('/leaderboard', getLeaderboard);
router.post('/question',postQuestion);

module.exports = router;