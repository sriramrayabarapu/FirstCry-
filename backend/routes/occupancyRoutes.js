const express = require('express');
const router = express.Router();
const OccupancyController = require('../controllers/occupancyController');

router.get('/', OccupancyController.getClassroomOccupancy);
router.put('/:id', OccupancyController.updateClassroomOccupancy);

module.exports = router;
