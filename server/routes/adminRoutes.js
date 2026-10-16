const express = require('express');
const router = express.Router();
const {
  getAdminStats,
  getGisLayer,
  issueComplianceNotice,
  getRevenueForecast,
  getAllGrievances,
  reviewGrievance,
} = require('../controllers/adminController');
const { protect, adminOnly } = require('../middleware/auth');

router.use(protect);
router.use(adminOnly);

router.get('/stats', getAdminStats);
router.get('/gis-layer', getGisLayer);
router.post('/unassessed/:id/notice', issueComplianceNotice);
router.get('/revenue-forecast', getRevenueForecast);
router.get('/grievances', getAllGrievances);
router.put('/grievances/:id', reviewGrievance);

module.exports = router;
