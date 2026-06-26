const ReportsModel = require('../models/Reports');
const AdmissionModel = require('../models/Admission');
const EnquiryModel = require('../models/Enquiry');
const OccupancyModel = require('../models/Occupancy');
const FeesModel = require('../models/Fees');
const generateCSV = require('../utils/generateCSV');
const PDFGenerator = require('../utils/generatePDF');

class ReportController {
  static async getDashboardStats(req, res, next) {
    try {
      const summary = await ReportsModel.getCentreSummary();
      res.json({ success: true, data: summary });
    } catch (err) {
      next(err);
    }
  }

  static async getChartsData(req, res, next) {
    try {
      const counsellorPerf = await ReportsModel.getCounsellorPerformance();
      const leadSources = await ReportsModel.getLeadSources();
      const feedbackStats = await ReportsModel.getFeedbackAnalytics();

      res.json({
        success: true,
        data: {
          counsellorPerformance: counsellorPerf,
          leadSources: leadSources,
          feedbackStats: feedbackStats
        }
      });
    } catch (err) {
      next(err);
    }
  }

  static async downloadCSV(req, res, next) {
    try {
      const { type } = req.params;
      let data = [];
      let filename = 'report.csv';

      if (type === 'admissions') {
        data = await AdmissionModel.getAll();
        filename = 'intellitots_admissions.csv';
      } else if (type === 'enquiries') {
        data = await EnquiryModel.getAll();
        filename = 'intellitots_enquiries.csv';
      } else if (type === 'occupancy') {
        data = await OccupancyModel.getAllClassrooms();
        filename = 'intellitots_occupancy.csv';
      } else if (type === 'fees') {
        data = await FeesModel.getAll();
        filename = 'intellitots_fees.csv';
      } else {
        return res.status(400).json({ success: false, message: 'Invalid report type' });
      }

      const csvContent = generateCSV(data);
      res.setHeader('Content-Type', 'text/csv');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);
      res.status(200).send(csvContent);
    } catch (err) {
      next(err);
    }
  }

  static async downloadPDF(req, res, next) {
    try {
      const { type } = req.params;
      let data = [];
      let reportName = 'General Operational Report';
      let filename = 'intellitots_report.pdf';

      if (type === 'admissions') {
        data = await AdmissionModel.getAll();
        reportName = 'Active Admissions Register';
        filename = 'intellitots_admissions_report.pdf';
      } else if (type === 'enquiries') {
        data = await EnquiryModel.getAll();
        reportName = 'Prospective Leads and Enquiries';
        filename = 'intellitots_enquiries_report.pdf';
      } else if (type === 'occupancy') {
        data = await OccupancyModel.getAllClassrooms();
        reportName = 'Live Classroom Occupancy Report';
        filename = 'intellitots_occupancy_report.pdf';
      } else if (type === 'fees') {
        data = await FeesModel.getAll();
        reportName = 'Revenue & Fee Collection Report';
        filename = 'intellitots_fees_report.pdf';
      } else {
        return res.status(400).json({ success: false, message: 'Invalid report type' });
      }

      res.setHeader('Content-Type', 'application/pdf');
      res.setHeader('Content-Disposition', `attachment; filename=${filename}`);

      PDFGenerator.generateReportPDF(reportName, data, res);
    } catch (err) {
      next(err);
    }
  }
}

module.exports = ReportController;
