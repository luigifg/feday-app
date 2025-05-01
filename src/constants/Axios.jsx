// constants/Axios.jsx
import axios from 'axios';

// Defina a URL da API diretamente aqui
const apiBaseUrl = import.meta.env.VITE_API_BASE_URL;

// Adicione um log para garantir que a URL está correta
console.log("API base URL configurada:", apiBaseUrl);

const api = axios.create({
  baseURL: apiBaseUrl,  
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

export default api;