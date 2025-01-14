import axios from 'axios';

const api = axios.create({
  baseURL: 'https://api.futuredaybrasil.com.br',
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;