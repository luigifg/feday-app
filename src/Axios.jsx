import axios from 'axios';

// Configurando a instância do Axios dinamicamente
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;
