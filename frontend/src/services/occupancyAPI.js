import { fetchAPI } from './api';

export const occupancyAPI = {
  getOccupancy: () => fetchAPI('/occupancy'),
  updateOccupancy: (id, filled, waitlist) => fetchAPI(`/occupancy/${id}`, {
    method: 'PUT',
    body: JSON.stringify({ filled, waitlist })
  }),
  getClassroomQR: (classroomName) => fetchAPI(`/qr/${encodeURIComponent(classroomName)}`)
};
