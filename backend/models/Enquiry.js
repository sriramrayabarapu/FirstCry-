const { dbQuery } = require('../config/db');

class EnquiryModel {
  static getAll() {
    return dbQuery.all('SELECT * FROM enquiries ORDER BY id DESC');
  }

  static getById(id) {
    return dbQuery.get('SELECT * FROM enquiries WHERE id = ?', [id]);
  }

  static create({ parent, child, age, phone, email, program, visit_date, source, notes, status, date }) {
    return dbQuery.run(
      'INSERT INTO enquiries (parent, child, age, phone, email, program, visit_date, source, notes, status, date) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
      [parent, child, age || null, phone, email || null, program, visit_date || null, source || 'Walk-in', notes || null, status || 'New', date]
    );
  }

  static updateStatus(id, status) {
    return dbQuery.run('UPDATE enquiries SET status = ? WHERE id = ?', [status, id]);
  }

  // Counsellor leads actions
  static getAllLeads() {
    return dbQuery.all('SELECT * FROM leads ORDER BY id DESC');
  }

  static createLead({ name, child, phone, program, status, priority, date }) {
    return dbQuery.run(
      'INSERT INTO leads (name, child, phone, program, status, priority, date) VALUES (?, ?, ?, ?, ?, ?, ?)',
      [name, child, phone, program, status || 'New', priority || 'cold', date]
    );
  }

  static updateLeadStatus(id, status) {
    return dbQuery.run('UPDATE leads SET status = ? WHERE id = ?', [status, id]);
  }
}

module.exports = EnquiryModel;
