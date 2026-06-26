/**
 * Whatsapp Notification Service
 * Simulated notification router logging template messages to console.
 */
class WhatsappService {
  static async sendTemplateMessage(to, templateName, variables) {
    const formattedPhone = to.replace(/[\s\(\)\-\+]/g, '');
    
    console.log('\n==================================================');
    console.log(`🟢 [SIMULATED WHATSAPP OUTBOX]`);
    console.log(`Recipient: +91 ${formattedPhone}`);
    console.log(`Template: ${templateName}`);
    console.log('Variables:', JSON.stringify(variables, null, 2));
    console.log('--------------------------------------------------');
    
    let messageBody = '';
    switch (templateName) {
      case 'welcome_enquiry':
        messageBody = `Hello ${variables.parentName}! Thank you for your enquiry regarding admission for ${variables.childName} at FirstCry Intellitots. Our counsellor will contact you shortly.`;
        break;
      case 'tour_booked':
        messageBody = `Hello ${variables.parentName}! Your school tour at FirstCry Intellitots is confirmed for ${variables.date} at ${variables.time}. We look forward to meeting you and ${variables.childName || 'your child'}.`;
        break;
      case 'prebook_success':
        messageBody = `Congratulations ${variables.parentName}! You have successfully reserved a seat for ${variables.childName} in the ${variables.program} program. Receipt No: ${variables.receiptId}.`;
        break;
      case 'fee_reminder':
        messageBody = `Dear Parent, this is a reminder that the fees for ${variables.childName} are pending. Amount: ₹${variables.amount}. Please pay online at the portal.`;
        break;
      case 'festival_campaign':
        messageBody = `${variables.message}`;
        break;
      default:
        messageBody = `Notification template: ${templateName}. Data: ${JSON.stringify(variables)}`;
    }
    
    console.log(`Message Content:\n"${messageBody}"`);
    console.log('Status: DELIVERED (SUCCESS)');
    console.log('==================================================\n');
    
    return { success: true, messageId: 'wa_' + Math.random().toString(36).substr(2, 9) };
  }
}

module.exports = WhatsappService;
