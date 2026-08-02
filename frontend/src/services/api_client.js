import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL || 'http://localhost:8000',
  timeout: 5000,
});

export default api;

export const getInventory = () => api.get('/inventory');
export const postInventory = (data) => api.post('/inventory', data);
export const getDonations = () => api.get('/donations');
export const postDonation = (data) => api.post('/donations', data);
