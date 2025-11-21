// src/api.ts
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

// Automatically attach correct token based on active route
api.interceptors.request.use(
  (config) => {
    const path = window.location.pathname;

    const businessToken = localStorage.getItem("businessToken");
    const customerToken = localStorage.getItem("customerToken");

    // ==============================
    // 1️⃣ BUSINESS DASHBOARD ROUTES
    // ==============================
    if (path.startsWith("/business")) {
      if (businessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${businessToken}`;
      }
      return config;
    }

    // ==============================
    // 2️⃣ CUSTOMER BOOKING ROUTES
    // ==============================
    const customerBookingPaths = [
      "/book",
      "/booking",
      "/select-date",
      "/summary",
      "/review",
    ];

    const isCustomerBookingRoute =
      customerBookingPaths.some((p) => path.startsWith(p)) ||
      path.includes("available-slots");

    if (isCustomerBookingRoute) {
      if (customerToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${customerToken}`;
      }
      return config;
    }

    // ==============================
    // 3️⃣ DEFAULT PRIORITY: CUSTOMER FIRST
    // ==============================
    if (customerToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${customerToken}`;
    } else if (businessToken) {
      config.headers = config.headers || {};
      config.headers.Authorization = `Bearer ${businessToken}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
