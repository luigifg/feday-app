import axios from 'axios';

// Configurando a instância do Axios diretamente com o URL
const api = axios.create({
  baseURL: 'https://api.futuredaybrasil.com.br', // Defina diretamente o baseURL
  withCredentials: true,  // Permite o envio de cookies
  headers: {
    'ngrok-skip-browser-warning': 'true',  // Cabeçalho para ignorar o aviso do Ngrok (se necessário)
  }
});

export default api;