const express = require('express');
const router = express.Router();
const AdmissionController = require('../controllers/admissionController');

router.get('/', AdmissionController.getAllAdmissions);
router.get('/:id', AdmissionController.getAdmissionById);
router.post('/', AdmissionController.createAdmission);
router.put('/:id/status', AdmissionController.updateAdmissionStatus);
router.delete('/:id', AdmissionController.deleteAdmission);

module.exports = router;
