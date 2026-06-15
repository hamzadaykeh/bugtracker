import axios from 'axios';

const BASE = 'http://localhost/bugtracker/backend';

export const API = {
  auth: (data) => axios.post(`${BASE}/auth.php`, data),
  getStaff: () => axios.get(`${BASE}/users.php?action=staff`),
  getCustomers: () => axios.get(`${BASE}/users.php?action=customers`),
  createStaff: (data) => axios.post(`${BASE}/users.php`, { ...data, action: 'create_staff' }),
  deleteUser: (id) => axios.post(`${BASE}/users.php`, { id, action: 'delete' }),
  getProjects: () => axios.get(`${BASE}/projects.php`),
  createProject: (data) => axios.post(`${BASE}/projects.php`, { ...data, action: 'create' }),
  deleteProject: (id) => axios.post(`${BASE}/projects.php`, { id, action: 'delete' }),
  getAllBugs: () => axios.get(`${BASE}/bugs.php?action=all`),
  getBugsByCustomer: (id) => axios.get(`${BASE}/bugs.php?action=by_customer&id=${id}`),
  getBugsByStaff: (id) => axios.get(`${BASE}/bugs.php?action=by_staff&id=${id}`),
  getBugByTicket: (ticket) => axios.get(`${BASE}/bugs.php?action=by_ticket&ticket=${ticket}`),
  createBug: (data) => axios.post(`${BASE}/bugs.php`, { ...data, action: 'create' }),
  assignBug: (data) => axios.post(`${BASE}/bugs.php`, { ...data, action: 'assign' }),
  updateStatus: (data) => axios.post(`${BASE}/bugs.php`, { ...data, action: 'update_status' }),
  getBugFlow: (bug_id) => axios.get(`${BASE}/bugs.php?action=flow&bug_id=${bug_id}`),
  getMessages: (bug_id) => axios.get(`${BASE}/bugs.php?action=messages&bug_id=${bug_id}`),
  sendMessage: (data) => axios.post(`${BASE}/bugs.php`, { ...data, action: 'send_message' }),
  uploadScreenshot: (formData) => axios.post(`${BASE}/upload.php`, formData),
};