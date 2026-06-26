const { dbQuery } = require('../config/db');

class FeesModel {
  static getAll() {
    return dbQuery.all('SELECT * FROM fees ORDER BY id DESC');
  }

  static getById(id) {
    return dbQuery.get('SELECT * FROM fees WHERE id = ?', [id]);
  }

  static create({ child, program, parent, fee, paid, status }) {
    return dbQuery.run(
      'INSERT INTO fees (child, program, parent, fee, paid, status) VALUES (?, ?, ?, ?, ?, ?)',
      [child, program, parent, fee, paid || 0, status || 'Unpaid']
    );
  }

  static recordPayment(id, paidAmount) {
    return dbQuery.get('SELECT * FROM fees WHERE id = ?', [id]).then(fee => {
      if (!fee) throw new Error('Fee record not found');
      
      const newPaid = fee.paid + paidAmount;
      let status = 'Partial';
      if (newPaid >= fee.fee) {
        status = 'Paid';
      }
      
      return dbQuery.run(
        'UPDATE fees SET paid = ?, status = ? WHERE id = ?',
        [newPaid, status, id]
      );
    });
  }

  static updateStatus(id, status) {
    return dbQuery.run('UPDATE fees SET status = ? WHERE id = ?', [status, id]);
  }
}

module.exports = FeesModel;
