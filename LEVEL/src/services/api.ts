import axios from "axios";

const api = axios.create({
  baseURL: "/api",
  headers: {
    "Content-Type": "application/json",
  },
});

// Adjunta automaticamente el JWT a las rutas protegidas.
api.interceptors.request.use((config) => {
  const token = sessionStorage.getItem("level_token");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;