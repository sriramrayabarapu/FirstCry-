import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './styles/style.css';
import './styles/dashboard.css';
import './styles/responsive.css';
import './styles/tourCinematic.css';

// Patch global fetch to support custom backend API URL when deployed (e.g. Vercel)
const originalFetch = window.fetch;
window.fetch = function (url, options) {
  if (typeof url === 'string' && url.startsWith('/api')) {
    const baseUrl = import.meta.env.VITE_API_URL || '';
    url = `${baseUrl}${url}`;
    
    // Add bypass header for localtunnel
    options = options || {};
    options.headers = {
      ...options.headers,
      'Bypass-Tunnel-Reminder': 'true'
    };
  }
  return originalFetch(url, options);
};

// Intercept all <a> link clicks targeting /api to support dynamic backend redirects
document.addEventListener('click', (e) => {
  const originLink = e.target.closest('a');
  if (originLink && originLink.href) {
    try {
      const url = new URL(originLink.href);
      if (url.pathname.startsWith('/api')) {
        const baseUrl = import.meta.env.VITE_API_URL;
        if (baseUrl) {
          originLink.href = `${baseUrl}${url.pathname}${url.search}`;
        }
      }
    } catch (err) {
      // Ignore invalid URL clicks
    }
  }
});

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
