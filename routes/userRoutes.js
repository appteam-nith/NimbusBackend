const express = require('express');
const userController = require('../controllers/userController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Users
 *   description: User management API
 */

/**
 * @swagger
 * /users/register:
 *   post:
 *     summary: Register a new user
 *     tags: [Users]
 *     description: Creates a new user account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: "John Doe"
 *               rollNo:
 *                 type: string
 *                 example: "20XXEE001"
 *               email:
 *                 type: string
 *                 example: "johndoe@example.com"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       201:
 *         description: User successfully registered.
 *       400:
 *         description: Validation error.
 *       500:
 *         description: Internal server error.
 */
router.post('/users/register', userController.createUser);

/**
 * @swagger
 * /users/login:
 *   post:
 *     summary: User login
 *     tags: [Users]
 *     description: Authenticates a user and returns a token.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rollNo:
 *                 type: string
 *                 example: "20XXEE001"
 *               password:
 *                 type: string
 *                 example: "password123"
 *     responses:
 *       200:
 *         description: User successfully authenticated.
 *       401:
 *         description: Invalid credentials.
 */
router.post('/users/login', userController.loginUser);
router.get('/balance/:userId', userController.getBalance);
/**
 * @swagger
 * /users/protected-route:
 *   get:
 *     summary: Access a protected route
 *     tags: [Users]
 *     description: Accessible only by users with the "Admin" role.
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Access granted.
 *       403:
 *         description: Forbidden - User lacks required role.
 *       401:
 *         description: Unauthorized or invalid token.
 */
// router.get('/users/protected-route', authenticateToken, authorizeRole('Admin'), (req, res) => {
//   res.status(200).json({ message: 'Access granted to Admin' });
// });

module.exports = router;
