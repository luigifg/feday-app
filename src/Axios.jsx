import axios from 'axios';

// Configurando a instância do Axios dinamicamente
const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL, // Usa a URL definida no .env
  withCredentials: true,  // Permite o envio de cookies
  headers: {
    'ngrok-skip-browser-warning': 'true',  // Adiciona o cabeçalho para ignorar a página de aviso do ngrok

  }
});

export default api;
