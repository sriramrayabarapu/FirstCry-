const { dbQuery } = require('../config/db');

class AdmissionModel {
  static getAll() {
    return dbQuery.all('SELECT * FROM admissions ORDER BY id DESC');
  }

  static getById(id) {
    return dbQuery.get('SELECT * FROM admissions WHERE id = ?', [id]);
  }

  static create({ child, parent, program, status, date, counsellor }) {
    return dbQuery.run(
      'INSERT INTO admissions (child, parent, program, status, date, counsellor) VALUES (?, ?, ?, ?, ?, ?)',
      [child, parent, program, status || 'Pending', date, counsellor]
    );
  }

  static updateStatus(id, status) {
    return dbQuery.run('UPDATE admissions SET status = ? WHERE id = ?', [status, id]);
  }

  static delete(id) {
    return dbQuery.run('DELETE FROM admissions WHERE id = ?', [id]);
  }
}

module.exports = AdmissionModel;
