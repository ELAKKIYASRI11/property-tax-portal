const Payment = require('../models/Payment');
const Assessment = require('../models/Assessment');
const Property = require('../models/Property');
const Notification = require('../models/Notification');
const { computeComplianceScore } = require('../services/complianceScoreEngine');

// @desc    Process online payment for a property tax assessment
// @route   POST /api/payments/pay
// @access  Private
const processPayment = async (req, res) => {
  try {
    const { assessmentId, paymentMethod } = req.body;

    const assessment = await Assessment.findById(assessmentId).populate('property');
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment record not found' });
    }

    if (assessment.status === 'Paid') {
      return res.status(400).json({ message: 'This assessment has already been paid in full' });
    }

    // Generate unique transaction and receipt numbers
    const timestamp = Date.now();
    const transactionId = `TXN-${timestamp}-${Math.floor(1000 + Math.random() * 9000)}`;
    const receiptNumber = `RCPT-${new Date().getFullYear()}-${Math.floor(100000 + Math.random() * 900000)}`;

    const amountPaid = assessment.calculationBreakdown.netPayableAmount;

    // Create payment transaction
    const payment = await Payment.create({
      assessment: assessment._id,
      property: assessment.property._id,
      user: req.user._id,
      receiptNumber,
      transactionId,
      amountPaid,
      paymentMethod: paymentMethod || 'UPI',
      paymentDate: new Date(),
      status: 'Success',
      breakdownSnapshot: {
        grossTax: assessment.calculationBreakdown.grossTaxAmount,
        exemptions: assessment.calculationBreakdown.totalExemptionAmount,
        latePenalty: assessment.calculationBreakdown.latePenalty,
        netPaid: amountPaid,
      },
    });

    // Update assessment status
    assessment.status = 'Paid';
    assessment.paidDate = new Date();
    assessment.payment = payment._id;
    await assessment.save();

    // Recompute compliance score for property
    const compliance = await computeComplianceScore(assessment.property._id);
    await Property.findByIdAndUpdate(assessment.property._id, {
      complianceScore: {
        score: compliance.score,
        rating: compliance.rating,
        lastEvaluated: new Date(),
      },
    });

    // Send payment confirmation notification
    await Notification.create({
      user: req.user._id,
      title: 'Payment Successful',
      message: `Tax payment of ₹${amountPaid.toLocaleString()} for ${assessment.property.propertyIdentifier} received. Receipt No: ${receiptNumber}. Compliance Rating: ${compliance.rating}.`,
      type: 'general',
      propertyId: assessment.property._id,
    });

    res.status(200).json({
      message: 'Payment completed successfully',
      payment,
      receiptNumber,
      complianceRating: compliance.rating,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all payments for current user
// @route   GET /api/payments/history
// @access  Private
const getPaymentHistory = async (req, res) => {
  try {
    const payments = await Payment.find({ user: req.user._id })
      .populate('property')
      .populate('assessment')
      .sort({ paymentDate: -1 });

    res.json(payments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get payment receipt by receipt number or payment ID
// @route   GET /api/payments/receipt/:id
// @access  Private
const getPaymentReceipt = async (req, res) => {
  try {
    const payment = await Payment.findById(req.params.id)
      .populate('property')
      .populate('assessment')
      .populate('user', 'name email phone address');

    if (!payment) {
      return res.status(404).json({ message: 'Receipt not found' });
    }

    if (payment.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(payment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { processPayment, getPaymentHistory, getPaymentReceipt };
