const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema(
  {
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    receiptNumber: {
      type: String,
      unique: true,
      required: true,
    },
    transactionId: {
      type: String,
      unique: true,
      required: true,
    },
    amountPaid: {
      type: Number,
      required: true,
    },
    paymentMethod: {
      type: String,
      enum: ['UPI', 'Credit/Debit Card', 'Net Banking', 'Municipal Counter'],
      default: 'UPI',
    },
    paymentDate: {
      type: Date,
      default: Date.now,
    },
    status: {
      type: String,
      enum: ['Success', 'Pending', 'Failed'],
      default: 'Success',
    },
    breakdownSnapshot: {
      grossTax: Number,
      exemptions: Number,
      latePenalty: Number,
      netPaid: Number,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Payment', paymentSchema);
