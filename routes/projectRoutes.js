const express = require('express');
const { 
    createProject, 
    getClubProjects, 
    getProjectById, 
    updateProject, 
    deleteProject, 
    getAllProjects 
} = require('../controllers/projectController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Projects
 *   description: Project management API
 */

/**
 * @swagger
 * /projects:
 *   post:
 *     summary: Create a new project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     description: Create a new project for a club. Only admins and club admins can create projects.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - title
 *               - description
 *               - clubId
 *             properties:
 *               title:
 *                 type: string
 *                 description: Project title
 *               description:
 *                 type: string
 *                 description: Project description
 *               clubId:
 *                 type: string
 *                 description: ID of the club the project belongs to
 *               status:
 *                 type: string
 *                 enum: [pending, ongoing, completed]
 *                 description: Project status
 *               startDate:
 *                 type: string
 *                 format: date
 *                 description: Project start date
 *               endDate:
 *                 type: string
 *                 format: date
 *                 description: Project end date
 *               collaborators:
 *                 type: array
 *                 items:
 *                   type: string
 *                 description: Array of user IDs who are collaborating on the project
 *               imageUrl:
 *                 type: string
 *                 description: URL to project image
 *     responses:
 *       201:
 *         description: Project created successfully
 *       400:
 *         description: Invalid request data
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Club not found
 *       500:
 *         description: Server error
 */
router.post('/projects', authenticateToken, authorizeRole('admin', 'clubAdmin'), createProject);

/**
 * @swagger
 * /projects/club/{clubId}:
 *   get:
 *     summary: Get all projects for a specific club
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: clubId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the club
 *     responses:
 *       200:
 *         description: List of projects for the club
 *       404:
 *         description: Club not found
 *       500:
 *         description: Server error
 */
router.get('/projects/club/:clubId', authenticateToken, getClubProjects);

/**
 * @swagger
 * /projects/{projectId}:
 *   get:
 *     summary: Get a specific project by ID
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the project
 *     responses:
 *       200:
 *         description: Project details
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.get('/projects/:projectId', authenticateToken, getProjectById);

/**
 * @swagger
 * /projects/{projectId}:
 *   put:
 *     summary: Update a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the project
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               status:
 *                 type: string
 *                 enum: [pending, ongoing, completed]
 *               startDate:
 *                 type: string
 *                 format: date
 *               endDate:
 *                 type: string
 *                 format: date
 *               collaborators:
 *                 type: array
 *                 items:
 *                   type: string
 *               imageUrl:
 *                 type: string
 *     responses:
 *       200:
 *         description: Project updated successfully
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.put('/projects/:projectId', authenticateToken, authorizeRole('admin', 'clubAdmin'), updateProject);

/**
 * @swagger
 * /projects/{projectId}:
 *   delete:
 *     summary: Delete a project
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: projectId
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the project
 *     responses:
 *       200:
 *         description: Project deleted successfully
 *       403:
 *         description: Unauthorized access
 *       404:
 *         description: Project not found
 *       500:
 *         description: Server error
 */
router.delete('/projects/:projectId', authenticateToken, authorizeRole('admin', 'clubAdmin'), deleteProject);

/**
 * @swagger
 * /projects:
 *   get:
 *     summary: Get all projects (admin only)
 *     tags: [Projects]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of all projects
 *       403:
 *         description: Unauthorized access
 *       500:
 *         description: Server error
 */
router.get('/projects', authenticateToken, authorizeRole('admin'), getAllProjects);

module.exports = router; 