// const express = require('express');
// const router = express.Router();
// const quizController = require('../controllers/quizController');
// const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// // router.get('/questions', getQuestions);
// // router.post('/submit', submitQuiz);
// // router.get('/leaderboard', getLeaderboard);
// // router.post('/question',postQuestion);

// // Route to get quiz questions for a specific event
// router.get('/:eventId', authenticateToken, quizController.getQuestions);

// // Route to submit quiz answers
// router.post('/submit', authenticateToken, quizController.submitQuiz);

// // Route to get event rankings
// router.get('/rankings/:eventId', authenticateToken, quizController.getEventRankings);
//   // Route to post the questions
// router.post(
//     '/post-question', 
//     authenticateToken, 
//     authorizeRole('admin', 'clubAdmin'), 
//     quizController.postQuestion
//   );

  
// // module.exports = router;

// const express = require('express');
// const router = express.Router();
// const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
// const {
//   createQuiz,
//   getQuizzesByEvent,
//   getQuizById,
//   submitQuiz
// } = require('../controllers/quizController');

// router.post('/', authenticateToken, authorizeRole, createQuiz);
// router.get('/event/:eventId', getQuizzesByEvent);
// router.get('/:quizId', getQuizById);
// router.post('/:quizId/submit', authMiddleware, submitQuiz);

// module.exports = router;



// const express = require('express');
// const router = express.Router();
// const {
//   createQuiz,
//   getQuizByEvent,
//   getQuizById,
//   submitQuiz
// } = require('../controllers/quizController');

// const { authenticateToken, authorizeRole, authorizeClubAccess } = require('../middleware/authMiddleware');

// router.post('/', createQuiz);

// // Public endpoints
// router.get('/event/:eventId', getQuizByEvent);
// router.get('/:quizId', getQuizById);
// // Protected endpoints
// router.post('/:quizId/submit', authenticateToken , submitQuiz);

// module.exports = router;
const express = require('express');
const router = express.Router();
const quizController = require('../controllers/quizController');
const {authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

router.post('/create',  authenticateToken , authorizeRole('admin', 'clubAdmin') ,quizController.createQuiz);
router.get('/:quizId', quizController.getQuizById);
router.post('/:quizId/submit', quizController.submitQuiz);
router.get('/:quizId/winners', quizController.getQuizWinners);
router.get('/event/:eventId', quizController.getQuizByEventId);
router.post('/event/:eventId/submit', authenticateToken, quizController.submitQuizByEventId);



module.exports = router;


