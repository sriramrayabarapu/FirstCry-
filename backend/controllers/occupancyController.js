const OccupancyModel = require('../models/Occupancy');

class OccupancyController {
  static async getClassroomOccupancy(req, res, next) {
    try {
      const classrooms = await OccupancyModel.getAllClassrooms();
      res.json({ success: true, data: classrooms });
    } catch (err) {
      next(err);
    }
  }

  static async updateClassroomOccupancy(req, res, next) {
    try {
      const { id } = req.params;
      const { filled, waitlist } = req.body;
      
      if (filled === undefined || waitlist === undefined) {
        return res.status(400).json({ success: false, message: 'Filled count and waitlist are required' });
      }

      await OccupancyModel.updateClassroomCount(id, filled, waitlist);
      res.json({ success: true, message: 'Classroom occupancy metrics updated' });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = OccupancyController;
