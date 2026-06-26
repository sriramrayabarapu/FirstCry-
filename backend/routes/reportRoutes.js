const express = require('express');
const router = express.Router();
const ReportController = require('../controllers/reportController');

router.get('/stats', ReportController.getDashboardStats);
router.get('/charts', ReportController.getChartsData);
router.get('/download/csv/:type', ReportController.downloadCSV);
router.get('/download/pdf/:type', ReportController.downloadPDF);

module.exports = router;
