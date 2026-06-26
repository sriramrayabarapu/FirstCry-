const { dbQuery } = require('../config/db');

class OccupancyModel {
  static getAllClassrooms() {
    return dbQuery.all('SELECT * FROM classrooms');
  }

  static getClassroomByName(name) {
    return dbQuery.get('SELECT * FROM classrooms WHERE name = ?', [name]);
  }

  static updateClassroomCount(id, filled, waitlist) {
    return dbQuery.run(
      'UPDATE classrooms SET filled = ?, waitlist = ? WHERE id = ?',
      [filled, waitlist, id]
    );
  }

  static incrementFilled(name) {
    return dbQuery.run(
      'UPDATE classrooms SET filled = MIN(capacity, filled + 1) WHERE name = ?',
      [name]
    );
  }
}

module.exports = OccupancyModel;
