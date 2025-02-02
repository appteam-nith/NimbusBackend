const express = require('express');
const router = express.Router();
const eventController = require('../controllers/eventController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');


// Event Routes
// Public routes
router.get('/events', eventController.getAllEvents);
router.get('/events/:id', eventController.getEventById);

// Protected routes
router.post('/events', 
    authenticateToken, 
    authorizeRole('clubAdmin', 'admin', ), 
    eventController.createEvent 
);

router.put('/events/:id', 
    authenticateToken, 
    authorizeRole('clubAdmin', 'admin'), 
    eventController.updateEvent
);

router.delete('/events/:id', 
    authenticateToken, 
    authorizeRole('clubAdmin', 'admin'), 
    eventController.deleteEvent
);


module.exports = router;