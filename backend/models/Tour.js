const { dbQuery } = require('../config/db');

class TourModel {
  static getAll() {
    return dbQuery.all('SELECT * FROM tours ORDER BY id DESC');
  }

  static create({ parent, date, time, program, status, counsellor }) {
    return dbQuery.run(
      'INSERT INTO tours (parent, date, time, program, status, counsellor) VALUES (?, ?, ?, ?, ?, ?)',
      [parent, date, time, program, status || 'Pending', counsellor]
    );
  }
}

module.exports = TourModel;
