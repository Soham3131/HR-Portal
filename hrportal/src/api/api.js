// src/api/api.js
import axios from 'axios';

// Create an instance of axios
const api = axios.create({
  // Use the backend URL you have set up.
  // Make sure your backend server is running.
  baseURL: 'http://localhost:5000/api', 
  headers: {
    'Content-Type': 'application/json',
  },
});

/*
  Intercepts every request. If a token exists in localStorage,
  it adds the 'Authorization: Bearer <token>' header to the request.
  This is crucial for accessing protected backend routes.
*/
api.interceptors.request.use(
  (config) => {
    const userInfo = localStorage.getItem('userInfo');
    if (userInfo) {
      const token = JSON.parse(userInfo).token;
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
