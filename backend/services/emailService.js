/**
 * Email Notification Service
 * Simulated outbox logger for transactional emails.
 */
class EmailService {
  static async sendMail({ to, subject, templateName, variables }) {
    console.log('\n==================================================');
    console.log(`✉️ [SIMULATED EMAIL OUTBOX]`);
    console.log(`To: ${to}`);
    console.log(`Subject: ${subject}`);
    console.log(`Template: ${templateName}`);
    console.log('Variables:', JSON.stringify(variables, null, 2));
    console.log('--------------------------------------------------');
    
    let htmlContent = '';
    switch (templateName) {
      case 'new_lead_internal':
        htmlContent = `
          <h3>New Enquiry captured!</h3>
          <p><strong>Parent:</strong> ${variables.parentName}</p>
          <p><strong>Child:</strong> ${variables.childName}</p>
          <p><strong>Phone:</strong> ${variables.phone}</p>
          <p><strong>Program:</strong> ${variables.program}</p>
          <p>Please log in to the counsellor dashboard to call this lead.</p>
        `;
        break;
      default:
        htmlContent = `<p>Message body template: ${templateName}. Params: ${JSON.stringify(variables)}</p>`;
    }
    
    console.log('HTML Body preview:\n' + htmlContent.trim());
    console.log('Status: SENT (SUCCESS)');
    console.log('==================================================\n');
    
    return { success: true, emailId: 'em_' + Math.random().toString(36).substr(2, 9) };
  }
}

module.exports = EmailService;
