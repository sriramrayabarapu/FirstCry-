const TourModel = require('../models/Tour');
const WhatsappService = require('../services/whatsappService');

class TourController {
  static async getAllTours(req, res, next) {
    try {
      const tours = await TourModel.getAll();
      res.json({ success: true, data: tours });
    } catch (err) {
      next(err);
    }
  }

  static async createTour(req, res, next) {
    try {
      const { parent, date, time, program, counsellor, phone } = req.body;
      if (!parent || !date || !time || !program || !counsellor) {
        return res.status(400).json({ success: false, message: 'Missing required parameters' });
      }

      const result = await TourModel.create({
        parent,
        date,
        time,
        program,
        status: 'Confirmed',
        counsellor
      });

      // Dispatch simulated WhatsApp notification to parent if phone is provided
      if (phone) {
        try {
          await WhatsappService.sendTemplateMessage(phone, 'tour_booked', {
            parentName: parent,
            date,
            time
          });
        } catch (err) {
          console.error('WhatsApp service simulator error for tour:', err.message);
        }
      }

      res.status(201).json({ success: true, id: result.id, message: 'Tour booked and confirmation dispatched' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = TourController;
