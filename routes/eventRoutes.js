const express = require('express');
const router = express.Router();
const eventController = require('./controllers/eventController');
const { authenticateToken, authorizeRole } = require('./middlewares/auth');


// Event Routes
router.post('/event', authenticateToken, authorizeRole('clubAdmin'), eventController.createEvent);
router.get('/events',  eventController.getAllEvents);
router.get('/event/:id',  eventController.getEventById);
