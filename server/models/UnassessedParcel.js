const mongoose = require('mongoose');

const unassessedParcelSchema = new mongoose.Schema(
  {
    parcelId: {
      type: String,
      unique: true,
      required: true,
    },
    surveyNumber: {
      type: String,
      required: true,
    },
    locationName: {
      type: String,
      required: true,
    },
    ward: {
      type: String,
      required: true,
    },
    gisCoordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    estimatedLandAreaSqFt: {
      type: Number,
      required: true,
    },
    estimatedBuiltUpAreaSqFt: {
      type: Number,
      required: true,
    },
    detectedBuildingType: {
      type: String,
      default: 'Commercial/Residential Mix',
    },
    estimatedAnnualTaxLoss: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      enum: ['Uninspected', 'Notice Issued', 'Assessed', 'False Positive'],
      default: 'Uninspected',
    },
    satelliteDetectionDate: {
      type: Date,
      default: Date.now,
    },
    adminActionRemarks: {
      type: String,
      default: '',
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('UnassessedParcel', unassessedParcelSchema);
