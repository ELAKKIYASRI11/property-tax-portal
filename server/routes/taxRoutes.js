const express = require('express');
const router = express.Router();
const {
  previewTax,
  createAssessment,
  getMyAssessments,
  getAssessmentById,
} = require('../controllers/taxController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.post('/preview', previewTax);
router.post('/assess', createAssessment);
router.get('/my-assessments', getMyAssessments);
router.get('/:id', getAssessmentById);

module.exports = router;
