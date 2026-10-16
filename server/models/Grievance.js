const mongoose = require('mongoose');

const grievanceSchema = new mongoose.Schema(
  {
    grievanceNumber: {
      type: String,
      unique: true,
      required: true,
    },
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    property: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Property',
      required: true,
    },
    assessment: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Assessment',
      required: true,
    },
    disputeType: {
      type: String,
      enum: [
        'Incorrect Built-up Area',
        'Wrong Zone Classification',
        'Missing Exemption / Senior Rebate',
        'Depreciation Calculation Error',
        'Double Assessment / Other',
      ],
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    proofDocumentUrl: {
      type: String,
      default: '',
    },
    status: {
      type: String,
      enum: ['Submitted', 'Under Review', 'Approved', 'Rejected'],
      default: 'Under Review',
    },
    adminRemarks: {
      type: String,
      default: '',
    },
    originalTaxAmount: {
      type: Number,
      required: true,
    },
    adjustedTaxAmount: {
      type: Number,
      default: null,
    },
    resolvedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    resolvedAt: {
      type: Date,
      default: null,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Grievance', grievanceSchema);
