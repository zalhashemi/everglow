import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:5000/api",
});

api.interceptors.request.use(
  (config) => {
    const path = window.location.pathname;

    const businessToken = localStorage.getItem("businessToken");
    const customerToken = localStorage.getItem("customerToken");

   //business dashboard routes
    if (path.startsWith("/business")) {
      if (businessToken) {
        config.headers = config.headers || {};
        config.headers.Authorization = `Bearer ${businessToken}`;
      }
      return config;
    }

    //customer booking routes
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

    //default to checking both tokens
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
