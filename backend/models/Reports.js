const { dbQuery } = require('../config/db');

class ReportsModel {
  static async getCentreSummary() {
    const totalCapacity = await dbQuery.get('SELECT SUM(capacity) as total FROM classrooms');
    const totalFilled = await dbQuery.get('SELECT SUM(filled) as total FROM classrooms');
    const totalWaitlist = await dbQuery.get('SELECT SUM(waitlist) as total FROM classrooms');
    const confirmedAdmissions = await dbQuery.get("SELECT COUNT(*) as total FROM admissions WHERE status = 'Confirmed'");
    const pendingEnquiries = await dbQuery.get("SELECT COUNT(*) as total FROM enquiries WHERE status = 'New'");
    const totalRevenue = await dbQuery.get('SELECT SUM(paid) as total FROM fees');
    const pendingFees = await dbQuery.get('SELECT SUM(fee - paid) as total FROM fees');

    return {
      capacity: totalCapacity.total || 0,
      filled: totalFilled.total || 0,
      waitlist: totalWaitlist.total || 0,
      confirmedAdmissions: confirmedAdmissions.total || 0,
      pendingEnquiries: pendingEnquiries.total || 0,
      totalRevenue: totalRevenue.total || 0,
      pendingFees: pendingFees.total || 0
    };
  }

  static getCounsellorPerformance() {
    return dbQuery.all(`
      SELECT counsellor, COUNT(*) as total_leads,
      SUM(CASE WHEN status = 'Confirmed' THEN 1 ELSE 0 END) as converted
      FROM admissions
      GROUP BY counsellor
    `);
  }

  static getLeadSources() {
    return dbQuery.all(`
      SELECT source, COUNT(*) as count 
      FROM enquiries 
      GROUP BY source
    `);
  }

  static getFeedbackAnalytics() {
    return dbQuery.all(`
      SELECT rating, COUNT(*) as count 
      FROM feedback 
      GROUP BY rating
    `);
  }

  static async getPipelineStats() {
    const enquiries = await dbQuery.get('SELECT COUNT(*) as count FROM enquiries');
    const tours = await dbQuery.get('SELECT COUNT(*) as count FROM tours');
    const leads = await dbQuery.get('SELECT COUNT(*) as count FROM leads');
    const admissions = await dbQuery.get('SELECT COUNT(*) as count FROM admissions');
    
    return {
      enquiry: enquiries.count,
      tour: tours.count,
      demo: Math.round(tours.count * 0.8),
      followUp: leads.count,
      seatCheck: Math.round(leads.count * 0.5),
      confirmed: admissions.count
    };
  }

  static getOccupancyChart() {
    return dbQuery.all('SELECT name, capacity, filled FROM classrooms');
  }

  static getRevenueTrend() {
    return dbQuery.all(`
      SELECT 
        substr(admissions.date, instr(admissions.date, ' ') + 1, 3) as month,
        SUM(fees.paid) as revenue
      FROM fees
      JOIN admissions ON fees.child = admissions.child
      GROUP BY month
    `);
  }

  static async getEnquiriesAdmissionsTrend() {
    const enquiries = await dbQuery.all(`
      SELECT substr(date, instr(date, ' ') + 1, 3) as month, COUNT(*) as count
      FROM enquiries
      WHERE date LIKE '%2025%' OR date LIKE '%2026%'
      GROUP BY month
    `);
    const admissions = await dbQuery.all(`
      SELECT substr(date, instr(date, ' ') + 1, 3) as month, COUNT(*) as count
      FROM admissions
      WHERE date LIKE '%2025%' OR date LIKE '%2026%'
      GROUP BY month
    `);
    return { enquiries, admissions };
  }
}

module.exports = ReportsModel;
