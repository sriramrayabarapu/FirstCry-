const FeesModel = require('../models/Fees');
const PDFGenerator = require('../utils/generatePDF');
const WhatsappService = require('../services/whatsappService');

class FeeController {
  static async getAllFees(req, res, next) {
    try {
      const records = await FeesModel.getAll();
      res.json({ success: true, data: records });
    } catch (err) {
      next(err);
    }
  }

  static async recordPayment(req, res, next) {
    try {
      const { id } = req.params;
      const { amount } = req.body;
      if (!amount || amount <= 0) {
        return res.status(400).json({ success: false, message: 'Invalid payment amount' });
      }

      await FeesModel.recordPayment(id, amount);
      const updatedRecord = await FeesModel.getById(id);

      // Send payment confirmation message
      try {
        await WhatsappService.sendTemplateMessage('9876543210', 'prebook_success', {
          parentName: updatedRecord.parent,
          childName: updatedRecord.child,
          program: updatedRecord.program,
          receiptId: updatedRecord.id
        });
      } catch (e) {
        console.error('Failed to dispatch payment text notification:', e.message);
      }

      res.json({ success: true, data: updatedRecord, message: 'Payment recorded successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async downloadReceipt(req, res, next) {
    try {
      const { id } = req.params;
      const fee = await FeesModel.getById(id);
      if (!fee) {
        return res.status(404).json({ success: false, message: 'Fee record not found' });
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=receipt_${fee.child.replace(/\s+/g, '_')}_${fee.id}.pdf`);

      PDFGenerator.generateFeeReceipt(fee, res);
    } catch (err) {
      next(err);
    }
  }

  static async sendReminder(req, res, next) {
    try {
      const { id } = req.params;
      const fee = await FeesModel.getById(id);
      if (!fee) {
        return res.status(404).json({ success: false, message: 'Fee record not found' });
      }

      const balance = fee.fee - fee.paid;
      await WhatsappService.sendTemplateMessage('9876543210', 'fee_reminder', {
        childName: fee.child,
        amount: balance
      });

      res.json({ success: true, message: `Fee reminder sent successfully for ${fee.child}` });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = FeeController;
