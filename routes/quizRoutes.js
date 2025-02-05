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

  
// module.exports = router;


const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

// Event Routes
router.get('/events', eventController.getAllEvents);
router.get('/events/:id', eventController.getEventById);

// Protected routes
router.post(
  '/events',
  authenticateToken,
  authorizeRole('clubAdmin', 'admin'),
  eventController.createEvent
);

router.put(
  '/events/:id',
  authenticateToken,
  authorizeRole('clubAdmin', 'admin'),
  eventController.updateEvent
);

router.delete(
  '/events/:id',
  authenticateToken,
  authorizeRole('clubAdmin', 'admin'),
  eventController.deleteEvent
);

module.exports = router;
