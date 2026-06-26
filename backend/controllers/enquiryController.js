const EnquiryModel = require('../models/Enquiry');
const WhatsappService = require('../services/whatsappService');
const EmailService = require('../services/emailService');

class EnquiryController {
  static async getAllEnquiries(req, res, next) {
    try {
      const enquiries = await EnquiryModel.getAll();
      res.json({ success: true, data: enquiries });
    } catch (err) {
      next(err);
    }
  }

  static async createEnquiry(req, res, next) {
    try {
      const { parent, child, age, phone, email, program, visit_date, source, notes } = req.body;
      if (!parent || !child || !phone || !program) {
        return res.status(400).json({ success: false, message: 'Missing required parameters' });
      }

      const dateStr = new Date().toLocaleDateString('en-IN');
      const result = await EnquiryModel.create({
        parent, child, age, phone, email, program, visit_date, source, notes, status: 'New', date: dateStr
      });

      // Insert as a Lead automatically in the leads list for counsellor
      await EnquiryModel.createLead({
        name: parent,
        child,
        phone,
        program,
        status: 'New',
        priority: 'cold',
        date: 'Just Now'
      });

      // Send simulated WhatsApp notification to parent
      try {
        await WhatsappService.sendTemplateMessage(phone, 'welcome_enquiry', {
          parentName: parent,
          childName: child
        });
      } catch (err) {
        console.error('WhatsApp service simulator error:', err.message);
      }

      // Send simulated Email notification internally to Centre Head
      try {
        await EmailService.sendMail({
          to: 'aditi@intellitots.in',
          subject: `🌱 New Admission Enquiry: ${child}`,
          templateName: 'new_lead_internal',
          variables: { parentName: parent, childName: child, phone, program }
        });
      } catch (err) {
        console.error('Email service simulator error:', err.message);
      }

      res.status(201).json({ success: true, id: result.id, message: 'Enquiry captured and notification dispatched' });
    } catch (err) {
      next(err);
    }
  }

  // Counsellor leads listing
  static async getAllLeads(req, res, next) {
    try {
      const leads = await EnquiryModel.getAllLeads();
      res.json({ success: true, data: leads });
    } catch (err) {
      next(err);
    }
  }

  static async updateLeadStatus(req, res, next) {
    try {
      const { id } = req.params;
      const { status } = req.body;
      if (!status) {
        return res.status(400).json({ success: false, message: 'Status is required' });
      }

      await EnquiryModel.updateLeadStatus(id, status);
      res.json({ success: true, message: `Lead status set to ${status}` });
    } catch (err) {
      next(err);
    }
  }
}

module.exports = EnquiryController;
