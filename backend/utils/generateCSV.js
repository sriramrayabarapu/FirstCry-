/**
 * Utility to convert an array of objects into a standard CSV string.
 * @param {Array<Object>} data - Table records from database
 * @returns {string} Comma separated values content string
 */
function generateCSV(data) {
  if (!data || data.length === 0) {
    return 'No records found';
  }

  const headers = Object.keys(data[0]);
  const headerRow = headers.map(h => `"${h.toUpperCase().replace(/"/g, '""')}"`).join(',');
  
  const bodyRows = data.map(row => {
    return headers.map(header => {
      let value = row[header];
      if (value === null || value === undefined) {
        value = '';
      } else {
        value = String(value);
      }
      // Escape double quotes and wrap in quotes if contains comma, quote, or newline
      const cleanValue = value.replace(/"/g, '""');
      return `"${cleanValue}"`;
    }).join(',');
  });

  return [headerRow, ...bodyRows].join('\r\n');
}

module.exports = generateCSV;
