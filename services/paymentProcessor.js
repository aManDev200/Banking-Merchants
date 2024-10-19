import fetch from 'node-fetch';

// Mock payment processor API service
const paymentProcessor = {
  updateMerchant: async (merchant) => {
    try {
      const response = await fetch('http://localhost:7000/api/merchants/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantId: merchant.merchantId,
          businessName: merchant.businessName,
          businessType: merchant.businessType,
        }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return { success: false, message: 'Failed to update payment processor' };
    }
  },

  processPayment: async (transactionDetails) => {
    try {
      const response = await fetch('http://localhost:7000/api/payment/process-payment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          merchantId: transactionDetails.merchantId,
          amount: transactionDetails.amount,
          accountNumber: transactionDetails.accountNumber,
          cardType: transactionDetails.cardType,
          cardNumber :transactionDetails.cardNumber,
          expiryDate : transactionDetails.expiryDate,
          cvv : transactionDetails.cvv
        }),
      });

      const result = await response.json();
      return result;
    } catch (error) {
      return { success: false, message: 'Failed to process payment' };
    }
  },
};

export default paymentProcessor;
