import { fetchAPI } from './api';

export const feesAPI = {
  getFees: () => fetchAPI('/fees'),
  payFees: (id, amount) => fetchAPI(`/fees/${id}/payment`, {
    method: 'POST',
    body: JSON.stringify({ amount })
  }),
  sendReminder: (id) => fetchAPI(`/fees/${id}/remind`, {
    method: 'POST'
  }),
  getReceiptUrl: (id) => `/api/fees/${id}/receipt` // Used as href link
};
