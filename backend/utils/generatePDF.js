const PDFDocument = require('pdfkit');

/**
 * Utility functions to generate PDF documents using pdfkit.
 */
class PDFGenerator {
  /**
   * Generates a payment receipt PDF and pipes it to the output stream.
   * @param {Object} fee - Fee record database row
   * @param {Stream} stream - Writable response stream
   */
  static generateFeeReceipt(fee, stream) {
    const doc = new PDFDocument({ margin: 50, size: 'A5' });
    doc.pipe(stream);

    // Header styling
    doc.fillColor('#5B21B6') // Primary Purple
       .fontSize(18)
       .text('FirstCry Intellitots', { align: 'center', bold: true });
    
    doc.fillColor('#6B7280') // Muted gray
       .fontSize(9)
       .text('PRESCHOOL & DAYCARE CENTRE RECEIPT', { align: 'center', letterSpacing: 1 });
    
    doc.moveDown(1.5);

    // Horizontal line
    doc.strokeColor('#E5E7EB').lineWidth(1).moveTo(30, 75).lineTo(390, 75).stroke();

    // Receipt details
    doc.fillColor('#111827') // Text color
       .fontSize(10)
       .text(`Receipt ID: REC-${fee.id || '98732'}`, 30, 90)
       .text(`Date: ${new Date().toLocaleDateString('en-IN')}`, 250, 90);

    doc.moveDown(1.5);

    // Student & Parent details box
    doc.rect(30, 115, 360, 80).fillAndStroke('#EDE9FE', '#C4B5FD'); // Purple background
    
    doc.fillColor('#5B21B6')
       .fontSize(11)
       .text('Admission details:', 40, 125, { bold: true });
    
    doc.fillColor('#111827')
       .fontSize(10)
       .text(`Child Name:  ${fee.child}`, 40, 145)
       .text(`Parent Name: ${fee.parent}`, 40, 160)
       .text(`Program:     ${fee.program}`, 40, 175);

    doc.moveDown(2);

    // Pricing grid
    const tableTop = 215;
    doc.fillColor('#6B7280').fontSize(9).text('Item Description', 40, tableTop);
    doc.text('Amount', 320, tableTop, { align: 'right' });

    doc.strokeColor('#E5E7EB').moveTo(30, 230).lineTo(390, 230).stroke();

    // Item details
    doc.fillColor('#111827').fontSize(10).text('Program Fees & Activity Registration', 40, 240);
    doc.text(`₹${fee.fee.toLocaleString()}`, 320, 240, { align: 'right' });

    doc.strokeColor('#E5E7EB').moveTo(30, 255).lineTo(390, 255).stroke();

    // Paid amount
    doc.fillColor('#059669').fontSize(10).text('Amount Paid:', 40, 270, { bold: true });
    doc.text(`₹${fee.paid.toLocaleString()}`, 320, 270, { align: 'right', bold: true });

    // Pending amount
    const balance = fee.fee - fee.paid;
    doc.fillColor(balance > 0 ? '#DC2626' : '#6B7280').fontSize(10).text('Outstanding Balance:', 40, 295);
    doc.text(`₹${balance.toLocaleString()}`, 320, 295, { align: 'right' });

    doc.strokeColor('#E5E7EB').moveTo(30, 315).lineTo(390, 315).stroke();

    // Status Stamp
    doc.save();
    doc.rect(280, 330, 100, 30).lineWidth(2).stroke(fee.status === 'Paid' ? '#059669' : '#D97706');
    doc.fillColor(fee.status === 'Paid' ? '#059669' : '#D97706')
       .fontSize(11)
       .text(fee.status.toUpperCase(), 280, 340, { align: 'center', bold: true });
    doc.restore();

    // Footer note
    doc.fillColor('#6B7280')
       .fontSize(8)
       .text('This is a computer-generated invoice and requires no signature.', 30, 380, { align: 'center', italic: true });

    doc.end();
  }

  /**
   * Generates a reports summary PDF.
   * @param {string} reportName - Title of the report
   * @param {Array} data - Array of rows to render in a table layout
   * @param {Stream} stream - Writable response stream
   */
  static generateReportPDF(reportName, data, stream) {
    const doc = new PDFDocument({ margin: 50, size: 'A4' });
    doc.pipe(stream);

    // Header
    doc.fillColor('#5B21B6').fontSize(24).text('FirstCry Intellitots', { bold: true });
    doc.fillColor('#6B7280').fontSize(10).text('Management Analytics Report Outflow', { letterSpacing: 1 });
    doc.moveDown();

    doc.fillColor('#111827').fontSize(16).text(reportName, { underline: true });
    doc.fontSize(10).text(`Generated on: ${new Date().toLocaleString('en-IN')}`);
    doc.moveDown(1.5);

    // Simple JSON text representation in PDF
    doc.fontSize(10).fillColor('#1F2937');
    
    // Draw columns headers
    if (data && data.length > 0) {
      const keys = Object.keys(data[0]);
      let y = doc.y;
      
      // Header background
      doc.rect(50, y - 5, 500, 20).fill('#EDE9FE');
      
      doc.fillColor('#5B21B6').fontSize(9);
      keys.forEach((key, idx) => {
        doc.text(key.toUpperCase(), 55 + (idx * 90), y);
      });
      
      doc.moveDown();
      doc.strokeColor('#C4B5FD').moveTo(50, doc.y).lineTo(550, doc.y).stroke();
      doc.moveDown(0.5);
      
      doc.fillColor('#374151').fontSize(9);
      data.forEach(row => {
        const rowY = doc.y;
        keys.forEach((key, idx) => {
          let val = String(row[key]);
          if (val.length > 18) val = val.substring(0, 15) + '...';
          doc.text(val, 55 + (idx * 90), rowY);
        });
        doc.moveDown();
        doc.strokeColor('#F3F4F6').moveTo(50, doc.y).lineTo(550, doc.y).stroke();
        doc.moveDown(0.5);
      });
    } else {
      doc.text('No records found for this analytics period.');
    }

    doc.end();
  }
}

module.exports = PDFGenerator;
