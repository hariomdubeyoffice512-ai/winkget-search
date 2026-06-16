import axios from 'axios';

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'https://winkget-search-backend.onrender.com/api',
});

API.interceptors.request.use((req) => {
  const token = localStorage.getItem('winkget_token');
  if (token) req.headers.Authorization = `Bearer ${token}`;
  return req;
});

// Auth
export const registerUser = (data) => API.post('/auth/register', data);
export const verifyOTP = (data) => API.post('/auth/verify-otp', data);
export const loginUser = (data) => API.post('/auth/login', data);

// User
export const getMe = () => API.get('/users/me');
export const updatePersonalInfo = (data) => API.put('/users/update', data);

export default API;