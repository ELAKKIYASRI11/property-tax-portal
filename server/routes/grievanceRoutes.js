const express = require('express');
const router = express.Router();
const { fileGrievance, getMyGrievances } = require('../controllers/grievanceController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

router.use(protect);

router.post('/', upload.single('proofDocument'), fileGrievance);
router.get('/my', getMyGrievances);

module.exports = router;
