const Assessment = require('../models/Assessment');
const Property = require('../models/Property');
const Notification = require('../models/Notification');
const User = require('../models/User');
const { calculatePropertyTax } = require('../services/taxEngine');

// @desc    Preview tax calculation in real-time (What-If / Self Assessment simulator)
// @route   POST /api/tax/preview
// @access  Private
const previewTax = async (req, res) => {
  try {
    const { propertyId, propertyData } = req.body;
    const user = await User.findById(req.user._id);

    let property = propertyData;
    if (propertyId) {
      property = await Property.findById(propertyId);
      if (!property) {
        return res.status(404).json({ message: 'Property not found' });
      }
    }

    if (!property) {
      return res.status(400).json({ message: 'Please provide property details or property ID' });
    }

    const calculation = calculatePropertyTax(property, user);
    res.json({ calculation, property, user });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create/Submit an official Self-Assessment
// @route   POST /api/tax/assess
// @access  Private
const createAssessment = async (req, res) => {
  try {
    const { propertyId, financialYear } = req.body;
    const user = await User.findById(req.user._id);
    const property = await Property.findById(propertyId);

    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized for this property' });
    }

    const year = financialYear || '2025-2026';

    // Check if an assessment already exists for this financial year
    const existing = await Assessment.findOne({
      property: propertyId,
      financialYear: year,
    });

    if (existing && existing.status !== 'Disputed') {
      return res.status(400).json({
        message: `An assessment for financial year ${year} already exists with status: ${existing.status}`,
        assessment: existing,
      });
    }

    // Run tax calculation engine
    const calculation = calculatePropertyTax(property, user);

    const count = await Assessment.countDocuments();
    const assessmentNumber = `ASM-${year.split('-')[0]}-${String(count + 1).padStart(5, '0')}`;

    // Due date: 30 days from now
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + 30);

    const assessment = await Assessment.create({
      property: property._id,
      user: req.user._id,
      financialYear: year,
      calculationBreakdown: {
        areaEvaluated: calculation.areaEvaluated,
        areaType: calculation.areaType,
        zoneBaseRate: calculation.zoneBaseRate,
        baseTax: calculation.baseTax,
        usageMultiplier: calculation.usageMultiplier,
        buildingTypeFactor: calculation.buildingTypeFactor,
        depreciationRate: calculation.depreciationRate,
        depreciationAmount: calculation.depreciationAmount,
        occupancyFactor: calculation.occupancyFactor,
        grossTaxAmount: calculation.grossTaxAmount,
        exemptions: calculation.exemptions,
        totalExemptionAmount: calculation.totalExemptionAmount,
        latePenalty: calculation.latePenalty,
        netPayableAmount: calculation.netPayableAmount,
      },
      status: 'Pending',
      dueDate,
      assessmentNumber,
    });

    // Send auto notification for assessment due
    await Notification.create({
      user: req.user._id,
      title: 'Tax Assessment Generated',
      message: `Tax assessment ${assessmentNumber} for ${property.propertyIdentifier} has been calculated: ₹${calculation.netPayableAmount}. Due date: ${dueDate.toLocaleDateString()}.`,
      type: 'assessment_due',
      propertyId: property._id,
    });

    res.status(201).json(assessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get assessments for current user
// @route   GET /api/tax/my-assessments
// @access  Private
const getMyAssessments = async (req, res) => {
  try {
    const assessments = await Assessment.find({ user: req.user._id })
      .populate('property')
      .populate('payment')
      .sort({ createdAt: -1 });

    res.json(assessments);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get assessment by ID
// @route   GET /api/tax/:id
// @access  Private
const getAssessmentById = async (req, res) => {
  try {
    const assessment = await Assessment.findById(req.params.id)
      .populate('property')
      .populate('payment')
      .populate('user', 'name email phone');

    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    if (assessment.user._id.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Unauthorized' });
    }

    res.json(assessment);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { previewTax, createAssessment, getMyAssessments, getAssessmentById };
