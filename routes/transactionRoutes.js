const express = require('express');
const transactionController = require('../controllers/transactionController');
const { authenticateToken } = require('../middleware/authMiddleware');
const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Transactions
 *   description: Transaction management API
 */

/**
 * @swagger
 * /transactions/transfer-to-club:
 *   post:
 *     summary: Transfer money from user to a club
 *     tags: [Transactions]
 *     description: Transfer a specified amount of money from a user to a club account.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 description: The ID of the user transferring the money.
 *                 example: "63f5dc5f3e42b2d3e4f8b6c5"
 *               clubId:
 *                 type: string
 *                 description: The ID of the club receiving the money.
 *                 example: "63f5dc5f3e42b2d3e4f8b7d2"
 *               amount:
 *                 type: number
 *                 description: The amount of money to transfer.
 *                 example: 50
 *     responses:
 *       200:
 *         description: Money successfully transferred.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Money transferred successfully"
 *                 transaction:
 *                   type: object
 *                   example: {
 *                     "senderId": "63f5dc5f3e42b2d3e4f8b6c5",
 *                     "receiverId": "63f5dc5f3e42b2d3e4f8b7d2",
 *                     "amount": 50,
 *                     "transactionType": "user_to_club"
 *                   }
 *       404:
 *         description: User or club not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User or club not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error transferring money"
 *                 error:
 *                   type: string
 *                   example: "Some error occurred"
 */

router.post('/transactions/transfer-to-club', transactionController.transferMoneyToClub);

// Get user transaction history
router.get('/user/:userId',authenticateToken , transactionController.getUserTransactionHistory);

// Get club transaction history
router.get('/club/:clubId',  transactionController.getClubTransactionHistory);


module.exports = router;
