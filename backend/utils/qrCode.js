const QRCode = require('qrcode');

/**
 * QR Code image generation utility.
 */
class QRCodeGenerator {
  /**
   * Generates a base64 Data URL for a QR Code containing specified text.
   * @param {string} text - Payload to encode in the QR code (e.g. attendance url, class details)
   * @returns {Promise<string>} Base64 image data URI string
   */
  static async generateQRBase64(text) {
    try {
      const qrDataUrl = await QRCode.toDataURL(text, {
        color: {
          dark: '#5B21B6', // Primary Purple theme
          light: '#FFFFFF' // Transparent / White background
        },
        width: 200,
        margin: 2
      });
      return qrDataUrl;
    } catch (err) {
      console.error('Error generating QR code:', err.message);
      throw err;
    }
  }
}

module.exports = QRCodeGenerator;
