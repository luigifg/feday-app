import axios from "axios";

const api = axios.create({
  baseURL: "https://feday-api.onrender.com", // URL base da API
  withCredentials: true, // Necessário para cookies
});

export default api;
