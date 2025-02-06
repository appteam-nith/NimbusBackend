const express = require('express');
const { createClub, getAllClubs, getClub, getClubBalance } = require('../controllers/clubController');
const { authenticateToken, authorizeRole } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Clubs
 *   description: Club management API
 */

/**
 * @swagger
 * /clubs:
 *   post:
 *     summary: Create a new club
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     description: Only authenticated users with the role "user" can create a club.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 description: The name of the club.
 *                 example: "Tech Club"
 *               description:
 *                 type: string
 *                 description: Description of the club.
 *                 example: "A club focused on technology and innovation."
 *     responses:
 *       201:
 *         description: Club created successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Club created successfully"
 *       401:
 *         description: Unauthorized or invalid token.
 *       403:
 *         description: Forbidden - user lacks required role.
 */
router.post('/clubs', authenticateToken, authorizeRole('admin', 'clubAdmin'), createClub);

/**
 * @swagger
 * /clubs:
 *   get:
 *     summary: Get all clubs
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     description: Fetch all clubs. Requires authentication.
 *     responses:
 *       200:
 *         description: Successfully fetched clubs.
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 type: object
 *                 properties:
 *                   name:
 *                     type: string
 *                     example: "Tech Club"
 *                   description:
 *                     type: string
 *                     example: "A club focused on technology and innovation."
 */
router.get('/clubs', 
    authenticateToken, 
    authorizeRole('user', 'clubAdmin', 'admin'), 
    getAllClubs
);

/**
 * @swagger
 * /clubs/{name}:
 *   get:
 *     summary: Get details of a specific club by name
 *     tags: [Clubs]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: name
 *         required: true
 *         description: Name of the club
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Club details fetched successfully.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 name:
 *                   type: string
 *                   example: "Tech Club"
 *                 description:
 *                   type: string
 *                   example: "A club focused on technology and innovation."
 *       404:
 *         description: Club not found.
 */
router.get('/clubs/:clubId', 
    authenticateToken, 
    authorizeRole('user', 'clubAdmin', 'admin'), 
    getClub
);

router.get('/balance/:clubId', getClubBalance);

module.exports = router;
