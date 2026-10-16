const mongoose = require('mongoose');

const propertySchema = new mongoose.Schema(
  {
    owner: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
    },
    propertyIdentifier: {
      type: String,
      unique: true,
      required: true,
    },
    ownerName: {
      type: String,
      required: [true, 'Owner name is required'],
    },
    propertyType: {
      type: String,
      enum: ['Residential', 'Commercial', 'Industrial', 'Agricultural', 'Vacant Land'],
      required: true,
      default: 'Residential',
    },
    buildingType: {
      type: String,
      enum: ['Pucca/RCC', 'Semi-Pucca', 'Kutcha', 'Vacant Plot'],
      required: true,
      default: 'Pucca/RCC',
    },
    constructionYear: {
      type: Number,
      default: 2015,
    },
    location: {
      district: { type: String, required: true },
      municipality: { type: String, required: true },
      ward: { type: String, required: true },
      street: { type: String, required: true },
      doorNo: { type: String, required: true },
      pincode: { type: String, required: true },
    },
    gisCoordinates: {
      lat: { type: Number, required: true },
      lng: { type: Number, required: true },
    },
    landAreaSqFt: {
      type: Number,
      required: true,
      min: 1,
    },
    builtUpAreaSqFt: {
      type: Number,
      required: true,
      min: 0,
    },
    occupancyStatus: {
      type: String,
      enum: ['Owner Occupied', 'Rented', 'Vacant'],
      default: 'Owner Occupied',
    },
    complianceScore: {
      score: { type: Number, default: 85 },
      rating: {
        type: String,
        enum: ['Good', 'At Risk', 'Defaulter'],
        default: 'Good',
      },
      lastEvaluated: { type: Date, default: Date.now },
    },
    isVerified: {
      type: Boolean,
      default: true,
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model('Property', propertySchema);
