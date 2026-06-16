import axios from 'axios';

const API = axios.create({
  baseURL: 'http://localhost:5000/api',
});

// Token auto attach karo har request mein
API.interceptors.request.use((req) => {
  const token = localStorage.getItem('winkget_token');
  if (token) {
    req.headers.Authorization = `Bearer ${token}`;
  }
  return req;
});

// Auth APIs
export const registerUser = (data) => API.post('/auth/register', data);
export const verifyOTP = (data) => API.post('/auth/verify-otp', data);
export const loginUser = (data) => API.post('/auth/login', data);