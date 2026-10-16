const express = require('express');
const router = express.Router();
const {
  getMyProperties,
  getPropertyById,
  createProperty,
  updateProperty,
  deleteProperty,
} = require('../controllers/propertyController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.route('/')
  .get(getMyProperties)
  .post(createProperty);

router.route('/:id')
  .get(getPropertyById)
  .put(updateProperty)
  .delete(deleteProperty);

module.exports = router;
