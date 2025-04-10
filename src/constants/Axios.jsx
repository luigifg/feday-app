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

// Interceptor para adicionar token quando necessário
api.interceptors.request.use(
  config => {
    // Verificar se temos um token salvo
    const fallbackToken = localStorage.getItem('authToken');
    
    if (fallbackToken) {
      // Adicionar o token ao header de autorização
      config.headers.Authorization = `Bearer ${fallbackToken}`;
    }
    
    return config;
  },
  error => Promise.reject(error)
);

// Interceptor para salvar o token quando recebido
api.interceptors.response.use(
  response => {
    // Se a resposta inclui um fallbackToken, salvá-lo
    if (response.data && response.data.fallbackToken) {
      localStorage.setItem('authToken', response.data.fallbackToken);
    }
    return response;
  },
  error => {
    // Log detalhado para erros de rede/CORS
    if (!error.response) {
      console.error('Erro de rede ou CORS:', {
        url: error.config?.url,
        method: error.config?.method,
        message: error.message
      });
    }
    return Promise.reject(error);
  }
);

export default api;