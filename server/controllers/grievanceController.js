const Grievance = require('../models/Grievance');
const Assessment = require('../models/Assessment');
const Notification = require('../models/Notification');
const User = require('../models/User');

// @desc    File a new appeal / grievance against an assessment
// @route   POST /api/grievances
// @access  Private
const fileGrievance = async (req, res) => {
  try {
    const { assessmentId, disputeType, description } = req.body;

    const assessment = await Assessment.findById(assessmentId).populate('property');
    if (!assessment) {
      return res.status(404).json({ message: 'Assessment not found' });
    }

    if (assessment.status === 'Paid') {
      return res.status(400).json({ message: 'Cannot dispute an already paid assessment without visiting municipal office' });
    }

    // Check if proof document uploaded
    let proofDocumentUrl = '';
    if (req.file) {
      proofDocumentUrl = `/uploads/${req.file.filename}`;
    }

    const count = await Grievance.countDocuments();
    const grievanceNumber = `GRV-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    const grievance = await Grievance.create({
      grievanceNumber,
      user: req.user._id,
      property: assessment.property._id,
      assessment: assessment._id,
      disputeType: disputeType || 'Incorrect Built-up Area',
      description,
      proofDocumentUrl,
      originalTaxAmount: assessment.calculationBreakdown.netPayableAmount,
      status: 'Under Review',
    });

    // Mark assessment status as Disputed
    assessment.status = 'Disputed';
    await assessment.save();

    // Notify citizen
    await Notification.create({
      user: req.user._id,
      title: 'Dispute Registered',
      message: `Your grievance ${grievanceNumber} for ${assessment.property.propertyIdentifier} is Under Review by Municipal Revenue Assessors.`,
      type: 'grievance_status',
      propertyId: assessment.property._id,
    });

    res.status(201).json(grievance);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get current citizen's grievances
// @route   GET /api/grievances/my
// @access  Private
const getMyGrievances = async (req, res) => {
  try {
    const grievances = await Grievance.find({ user: req.user._id })
      .populate('property')
      .populate('assessment')
      .sort({ createdAt: -1 });

    res.json(grievances);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { fileGrievance, getMyGrievances };
