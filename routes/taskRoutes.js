const express = require('express');
const taskController = require('../controllers/taskController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Tasks
 *   description: Task management API
 */

/**
 * @swagger
 * /tasks:
 *   post:
 *     summary: Create a new task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     description: Create a new task with a unique QR code (admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *                 example: "Complete registration"
 *               description:
 *                 type: string
 *                 example: "Register at the event desk"
 *               reward:
 *                 type: number
 *                 example: 10
 *     responses:
 *       201:
 *         description: Task created successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User lacks required role
 */
router.post('/tasks', 
  authenticateToken, 
  authorizeRole('admin'), 
  taskController.createTask
);

/**
 * @swagger
 * /tasks/assign:
 *   post:
 *     summary: Assign a task to a user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     description: Assign an existing task to a user (admin only)
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               taskId:
 *                 type: string
 *                 example: "60d21b4667d0d8992e610c85"
 *               userId:
 *                 type: string
 *                 example: "60d21b4667d0d8992e610c86"
 *     responses:
 *       200:
 *         description: Task assigned successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User lacks required role
 *       404:
 *         description: Task or user not found
 */
router.post('/tasks/assign', 
  authenticateToken, 
  authorizeRole('admin'), 
  taskController.assignTaskToUser
);

/**
 * @swagger
 * /tasks/user/{userId}:
 *   get:
 *     summary: Get all tasks for a user
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: userId
 *         required: true
 *         schema:
 *           type: string
 *     description: Get all tasks assigned to a specific user
 *     responses:
 *       200:
 *         description: List of tasks
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User lacks required role
 *       404:
 *         description: User not found
 */
router.get('/tasks/user/:userId', 
  authenticateToken, 
  taskController.getUserTasks
);

/**
 * @swagger
 * /tasks/complete:
 *   post:
 *     summary: Complete a task by scanning QR code
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     description: Mark a task as completed by scanning its QR code
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               qrCode:
 *                 type: string
 *                 example: "abc123def456"
 *     responses:
 *       200:
 *         description: Task completed successfully
 *       400:
 *         description: Task already completed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Task not assigned to this user
 *       404:
 *         description: Invalid QR code
 */
router.post('/tasks/complete', 
  authenticateToken, 
  taskController.completeTaskByQRCode
);

/**
 * @swagger
 * /tasks:
 *   get:
 *     summary: Get all tasks
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     description: Get all tasks (admin only)
 *     responses:
 *       200:
 *         description: List of all tasks
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User lacks required role
 */
router.get('/tasks', 
  authenticateToken, 
  authorizeRole('admin'), 
  taskController.getAllTasks
);

/**
 * @swagger
 * /tasks/{taskId}:
 *   get:
 *     summary: Get task by ID
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     description: Get details of a specific task
 *     responses:
 *       200:
 *         description: Task details
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User lacks required role
 *       404:
 *         description: Task not found
 */
router.get('/tasks/:taskId', 
  authenticateToken, 
  taskController.getTaskById
);

/**
 * @swagger
 * /tasks/{taskId}/qrcode:
 *   get:
 *     summary: Generate QR code for a task
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: taskId
 *         required: true
 *         schema:
 *           type: string
 *     description: Generate a QR code image for a specific task (admin only)
 *     responses:
 *       200:
 *         description: QR code generated successfully
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden - User lacks required role
 *       404:
 *         description: Task not found
 */
router.get('/tasks/:taskId/qrcode', 
  authenticateToken, 
  authorizeRole('admin'), 
  taskController.generateTaskQRCode
);

/**
 * @swagger
 * /tasks/update-task:
 *   post:
 *     summary: Update task status when QR code is scanned
 *     tags: [Tasks]
 *     security:
 *       - bearerAuth: []
 *     description: Mark a task as completed when its QR code is scanned
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "60d21b4667d0d8992e610c86"
 *               message:
 *                 type: string
 *                 example: "abc123def456"
 *     responses:
 *       200:
 *         description: Task completed successfully
 *       400:
 *         description: Task already completed
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Task not assigned to this user
 *       404:
 *         description: Task not found
 */
router.post('/tasks/update-task', 
  authenticateToken, 
  taskController.updateTask
);

module.exports = router; 