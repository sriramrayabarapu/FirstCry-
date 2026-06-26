import { fetchAPI } from './api';

export const enquiryAPI = {
  getEnquiries: () => fetchAPI('/enquiries'),
  submitEnquiry: (data) => fetchAPI('/enquiries', {
    method: 'POST',
    body: JSON.stringify(data)
  }),
  getLeads: () => fetchAPI('/enquiries/leads'),
  updateLeadStatus: (id, status) => fetchAPI(`/enquiries/leads/${id}/status`, {
    method: 'PUT',
    body: JSON.stringify({ status })
  })
};
