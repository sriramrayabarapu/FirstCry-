const AdmissionModel = require('../models/Admission');
const OccupancyModel = require('../models/Occupancy');

class AdmissionController {
  static async getAllAdmissions(req, res, next) {
    try {
      const admissions = await AdmissionModel.getAll();
      res.json({ success: true, data: admissions });
    } catch (err) {
      next(err);
    }
  }

  static async getAdmissionById(req, res, next) {
    try {
      const admission = await AdmissionModel.getById(req.params.id);
      if (!admission) {
        return res.status(404).json({ success: false, message: 'Admission not found' });
      }
      res.json({ success: true, data: admission });
    } catch (err) {
      next(err);
    }
  }

  static async createAdmission(req, res, next) {
    try {
      const { child, parent, program, status, date, counsellor } = req.body;
      if (!child || !parent || !program || !date || !counsellor) {
        return res.status(400).json({ success: false, message: 'Missing required fields' });
      }

      const result = await AdmissionModel.create({ child, parent, program, status, date, counsellor });
      
      // If confirmed, try to increment classroom occupancy
      if (status === 'Confirmed') {
        await OccupancyModel.incrementFilled(program);
      }

      res.status(201).json({ success: true, id: result.id, message: 'Admission recorded successfully' });
    } catch (err) {
      next(err);
    }
  }

  static async updateAdmissionStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required' });
      }

      // Check current state before modifying
      const current = await AdmissionModel.getById(id);
      if (!current) {
        return res.status(404).json({ success: false, message: 'Admission record not found' });
      }

      await AdmissionModel.updateStatus(id, status);

      // If status transitioned to Confirmed and wasn't before, update classroom count
      if (status === 'Confirmed' && current.status !== 'Confirmed') {
        await OccupancyModel.incrementFilled(current.program);
      }

      res.json({ success: true, message: `Admission status updated to ${status}` });
    } catch (err) {
      next(err);
    }
  }

  static async deleteAdmission(req, res, next) {
    try {
      await AdmissionModel.delete(req.params.id);
      res.json({ success: true, message: 'Admission record deleted' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = AdmissionController;
