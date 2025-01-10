// api.js ou axios.js
import axios from 'axios';

const api = axios.create({
  baseURL: 'https://feday-api.onrender.com',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;