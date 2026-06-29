const express = require('express');
const router = express.Router();
const EnquiryController = require('../controllers/enquiryController');

router.get('/', EnquiryController.getAllEnquiries);
router.post('/', EnquiryController.createEnquiry);
router.put('/:id/status', EnquiryController.updateEnquiryStatus);

// Counsellor leads endpoints
router.get('/leads', EnquiryController.getAllLeads);
router.put('/leads/:id/status', EnquiryController.updateLeadStatus);

module.exports = router;
