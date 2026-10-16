const mongoose = require('mongoose');

const assessmentSchema = new mongoose.Schema(
  {
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
    financialYear: {
      type: String,
      required: true,
      default: '2025-2026',
    },
    calculationBreakdown: {
      areaEvaluated: { type: Number, required: true },
      areaType: { type: String, default: 'builtUp' },
      zoneBaseRate: { type: Number, required: true },
      baseTax: { type: Number, required: true },
      usageMultiplier: { type: Number, required: true },
      buildingTypeFactor: { type: Number, required: true },
      depreciationRate: { type: Number, required: true },
      depreciationAmount: { type: Number, default: 0 },
      occupancyFactor: { type: Number, required: true },
      grossTaxAmount: { type: Number, required: true },
      exemptions: [
        {
          name: { type: String, required: true },
          percentage: { type: Number, required: true },
          amount: { type: Number, required: true },
        },
      ],
      totalExemptionAmount: { type: Number, default: 0 },
      latePenalty: { type: Number, default: 0 },
      netPayableAmount: { type: Number, required: true },
    },
    status: {
      type: String,
      enum: ['Pending', 'Paid', 'Disputed'],
      default: 'Pending',
    },
    dueDate: {
      type: Date,
      required: true,
    },
    paidDate: {
      type: Date,
      default: null,
    },
    payment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Payment',
      default: null,
    },
    assessmentNumber: {
      type: String,
      unique: true,
      required: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Assessment', assessmentSchema);
