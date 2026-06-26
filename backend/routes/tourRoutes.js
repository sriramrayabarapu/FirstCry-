const express = require('express');
const router = express.Router();
const TourController = require('../controllers/tourController');

router.get('/', TourController.getAllTours);
router.post('/', TourController.createTour);

module.exports = router;
