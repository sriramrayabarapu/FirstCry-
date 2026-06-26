const express = require('express');
const router = express.Router();
const FeeController = require('../controllers/feeController');

router.get('/', FeeController.getAllFees);
router.post('/:id/payment', FeeController.recordPayment);
router.get('/:id/receipt', FeeController.downloadReceipt);
router.post('/:id/remind', FeeController.sendReminder);

module.exports = router;
