import Merchant from '../model/merchantModel.js';
import paymentProcessor from '../services/paymentProcessor.js';

// Register a new merchant
export const registerMerchant = async (req, res) => {
  const { businessName, email, password, businessType, accountNumber } = req.body;

  try {
    const merchant = await Merchant.create({
      businessName,
      email,
      password,
      businessType,
      accountNumber,
      merchantId: `MER-${Date.now()}`, // Generate a unique merchant ID
    });

    // Update merchant details in the payment processor
    const processorResponse = await paymentProcessor.updateMerchant(merchant);

    if (processorResponse.success) {
      res.status(201).json({
        message: 'Merchant registered successfully',
        merchant,
      });
    } else {
      res.status(500).json({ error: 'Failed to register merchant in payment processor' });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error registering merchant', details: error.message });
  }
};

// Process merchant payment
export const processPayment = async (req, res) => {
  const { merchantId, amount, cardType ,cardNumber, expiryDate, cvv } = req.body;

  try {
    // Fetch the merchant details using merchantId
    const merchant = await Merchant.findOne({ where: { merchantId } });

    if (!merchant) {
      return res.status(404).json({ error: 'Merchant not found' });
    }

    // Retrieve the merchant's linked bank account number automatically
    const merchantAccountNumber = merchant.accountNumber;

    if (!merchantAccountNumber) {
      return res.status(404).json({ error: 'Merchant bank account not found' });
    }

    // Process payment via payment processor with card details
    const transaction = await paymentProcessor.processPayment({
      merchantId,
      amount,
      accountNumber: merchantAccountNumber,
      cardType,
      cardNumber,
      expiryDate,
      cvv
    });

    if (transaction.success) {
      // Update merchant balance after successful payment
      merchant.balance = parseFloat(merchant.balance) + amount;
      await merchant.save();
      res.json({ message: 'Payment processed successfully', transaction });
    } else {
      res.status(500).json({ error: 'Payment failed', details: transaction.message });
    }
  } catch (error) {
    res.status(500).json({ error: 'Error processing payment', details: error.message });
  }
};