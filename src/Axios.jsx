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

// import axios from 'axios';

// // Configurando a instância do Axios dinamicamente
// const api = axios.create({
//   baseURL: import.meta.env.VITE_API_BASE_URL, // Usa a URL definida no .env
//   withCredentials: true,  // Permite o envio de cookies
// });

// export default api;
