import express from 'express';
import { registerMerchant, processPayment } from '../controllers/merchantController.js';

const router = express.Router();

// Register merchant endpoint
/**
 * @swagger
 * /api/merchant/register:
 *   post:
 *     summary: Register a new merchant
 *     description: Registers a new merchant and updates the payment processor.
 *     tags: [Merchant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - businessName
 *               - email
 *               - password
 *               - merchantId
 *               - businessType
 *               - accountNumber
 *             properties:
 *               businessName:
 *                 type: string
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               merchantId:
 *                 type: string
 *               businessType:
 *                 type: string
 *               accountNumber:
 *                 type: string
 *               balance:
 *                 type: number
 *     responses:
 *       200:
 *         description: Merchant successfully registered.
 *       500:
 *         description: Server error.
 */
router.post('/register', registerMerchant);

// Swagger documentation for payment processing
/**
 * @swagger
 * /api/merchant/payment:
 *   post:
 *     summary: Process a payment for the merchant
 *     description: Handles the transaction between the merchant and the payment processor, including card details for validation.
 *     tags: [Merchant]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - merchantId
 *               - amount
 *               - cardType
 *               - cardNumber
 *               - expiryDate
 *               - cvv
 *             properties:
 *               merchantId:
 *                 type: string
 *               amount:
 *                 type: number
 *               cardType:
 *                 type: string
 *               cardNumber:
 *                 type: string
 *               expiryDate:
 *                 type: string
 *                 description: Expiry date of the card in MM/YY format.
 *               cvv:
 *                 type: string
 *     responses:
 *       200:
 *         description: Payment processed successfully.
 *       500:
 *         description: Server error.
 */
router.post('/payment', processPayment);

export default router;
