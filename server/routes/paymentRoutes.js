const express = require('express');
const router = express.Router();
const {
  processPayment,
  getPaymentHistory,
  getPaymentReceipt,
} = require('../controllers/paymentController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/pay', processPayment);
router.get('/history', getPaymentHistory);
router.get('/receipt/:id', getPaymentReceipt);

module.exports = router;
