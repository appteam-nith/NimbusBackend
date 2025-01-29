const express = require('express');
const bankController = require('../controllers/bankController');
const router = express.Router();

/**
 * @swagger
 * /bank/add-money:
 *   post:
 *     summary: Add money to a user's account by rollNo
 *     tags:
 *       - Bank
 *     description: Adds a specified amount of money to a user's account based on their roll number.
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               rollNo:
 *                 type: string
 *                 description: The roll number of the user.
 *                 example: "B12345"
 *               amount:
 *                 type: number
 *                 description: The amount of money to add to the user's account.
 *                 example: 100
 *     responses:
 *       200:
 *         description: Money successfully added to the user's account.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Money added successfully"
 *                 transaction:
 *                   type: object
 *                   example: {
 *                     "senderId": null,
 *                     "senderModel": "Bank",
 *                     "receiverId": "63f5dc5f3e42b2d3e4f8b6c5",
 *                     "receiverModel": "User",
 *                     "amount": 100,
 *                     "coins": [{"coinId": "4a7f5ef1-42fd-4b4c-a5df-34d2b47c70f9"}],
 *                     "transactionType": "bank_to_user"
 *                   }
 *       404:
 *         description: User not found.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "User not found"
 *       500:
 *         description: Internal server error.
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Error adding money"
 *                 error:
 *                   type: string
 *                   example: "Some error occurred"
 */

router.post('/bank/add-money', bankController.addMoneyToUser);

module.exports = router;
