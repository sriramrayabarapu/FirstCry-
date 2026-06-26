const BASE_URL = '/api';

export async function fetchAPI(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    // Check if it's a PDF download request
    const contentType = response.headers.get('Content-Type');
    if (contentType && contentType.includes('application/pdf')) {
      return response.blob();
    }
    if (contentType && contentType.includes('text/csv')) {
      return response.text();
    }

    const json = await response.json();
    if (!response.ok) {
      throw new Error(json.message || 'Something went wrong with the API call.');
    }
    return json;
  } catch (error) {
    console.error('API Error:', error.message);
    throw error;
  }
}
