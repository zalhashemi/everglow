// src/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach right token depending on which user is logged in
api.interceptors.request.use(
  (config) => {
    let token = null;

    // Priority: Customer token for customer pages
    const customerToken = localStorage.getItem("customerToken");
    if (customerToken) token = customerToken;

    // Business token only for business dashboard
    const businessToken = localStorage.getItem("businessToken");
    if (!token && businessToken) token = businessToken;

    if (token) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
