const Property = require('../models/Property');
const Assessment = require('../models/Assessment');
const Notification = require('../models/Notification');
const { computeComplianceScore } = require('../services/complianceScoreEngine');

// @desc    Get all properties for logged-in user
// @route   GET /api/properties
// @access  Private
const getMyProperties = async (req, res) => {
  try {
    const properties = await Property.find({ owner: req.user._id }).sort({ createdAt: -1 });

    // Ensure compliance scores are up-to-date
    const updatedProperties = await Promise.all(
      properties.map(async (prop) => {
        const compliance = await computeComplianceScore(prop._id);
        if (
          prop.complianceScore.score !== compliance.score ||
          prop.complianceScore.rating !== compliance.rating
        ) {
          prop.complianceScore = {
            score: compliance.score,
            rating: compliance.rating,
            lastEvaluated: new Date(),
          };
          await prop.save();
        }
        return prop;
      })
    );

    res.json(updatedProperties);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single property details
// @route   GET /api/properties/:id
// @access  Private
const getPropertyById = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    // Ensure owner or admin
    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to view this property' });
    }

    const assessments = await Assessment.find({ property: property._id }).sort({ createdAt: -1 });
    res.json({ property, assessments });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Add new property
// @route   POST /api/properties
// @access  Private
const createProperty = async (req, res) => {
  try {
    const {
      ownerName,
      propertyType,
      buildingType,
      constructionYear,
      location,
      gisCoordinates,
      landAreaSqFt,
      builtUpAreaSqFt,
      occupancyStatus,
    } = req.body;

    const count = await Property.countDocuments();
    const propertyIdentifier = `PID-${new Date().getFullYear()}-${String(count + 1).padStart(4, '0')}`;

    // Default coordinates if not provided: Center of Coimbatore (11.0168, 76.9558)
    const coords = {
      lat: gisCoordinates?.lat ? Number(gisCoordinates.lat) : 11.0168 + (Math.random() - 0.5) * 0.05,
      lng: gisCoordinates?.lng ? Number(gisCoordinates.lng) : 76.9558 + (Math.random() - 0.5) * 0.05,
    };

    const property = await Property.create({
      owner: req.user._id,
      propertyIdentifier,
      ownerName: ownerName || req.user.name,
      propertyType: propertyType || 'Residential',
      buildingType: buildingType || 'Pucca/RCC',
      constructionYear: Number(constructionYear) || 2018,
      location: {
        district: location?.district || 'Coimbatore',
        municipality: location?.municipality || 'Coimbatore Corporation',
        ward: location?.ward || 'Ward 12',
        street: location?.street || 'Gandhi Road',
        doorNo: location?.doorNo || '12-A',
        pincode: location?.pincode || '641001',
      },
      gisCoordinates: coords,
      landAreaSqFt: Number(landAreaSqFt) || 1200,
      builtUpAreaSqFt: Number(builtUpAreaSqFt) || 950,
      occupancyStatus: occupancyStatus || 'Owner Occupied',
      complianceScore: {
        score: 95,
        rating: 'Good',
        lastEvaluated: new Date(),
      },
    });

    // Create system notification for new property registration
    await Notification.create({
      user: req.user._id,
      title: 'Property Successfully Registered',
      message: `Property ${propertyIdentifier} at Ward ${property.location.ward} has been verified and registered for tax assessment.`,
      type: 'general',
      propertyId: property._id,
    });

    res.status(201).json(property);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update property
// @route   PUT /api/properties/:id
// @access  Private
const updateProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to edit this property' });
    }

    Object.assign(property, req.body);
    const updated = await property.save();

    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete property
// @route   DELETE /api/properties/:id
// @access  Private
const deleteProperty = async (req, res) => {
  try {
    const property = await Property.findById(req.params.id);
    if (!property) {
      return res.status(404).json({ message: 'Property not found' });
    }

    if (property.owner.toString() !== req.user._id.toString() && req.user.role !== 'admin') {
      return res.status(403).json({ message: 'Not authorized to delete this property' });
    }

    await Property.findByIdAndDelete(req.params.id);
    res.json({ message: 'Property removed successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getMyProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
};
