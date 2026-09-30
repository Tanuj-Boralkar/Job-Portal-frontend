import axios from "axios";

// ==========================================
// API BASE URL
// ==========================================

const API_URL =
  import.meta.env.VITE_API_URL ||
  "https://job-portal-backend-sopc.onrender.com/api/v1";

const api = axios.create({
  baseURL: API_URL,
  timeout: 15000,
});

// ==========================================
// REQUEST INTERCEPTOR
// Add JWT token automatically
// ==========================================

api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem("userInfo");

    if (stored) {
      try {
        const { token } = JSON.parse(stored);

        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
      } catch {
        localStorage.removeItem("userInfo");
      }
    }

    return config;
  },
  (error) => Promise.reject(error)
);

// ==========================================
// RESPONSE INTERCEPTOR
// Logout when token expires
// ==========================================

api.interceptors.response.use(
  (response) => response,

  (error) => {
    const status = error?.response?.status;

    const onAuthPage = ["/login", "/register"].includes(
      window.location.pathname
    );

    if (status === 401 && !onAuthPage) {
      localStorage.removeItem("userInfo");

      window.location.replace("/login?expired=1");
    }

    return Promise.reject(error);
  }
);

// ==========================================
// ERROR MESSAGE
// ==========================================

export const getErrorMessage = (error) =>
  error?.response?.data?.message ||
  error?.message ||
  "Something went wrong. Please try again.";

// ==========================================
// FILE / CLOUDINARY URL
// ==========================================

export const assetUrl = (value) => {
  if (!value) {
    return "";
  }

  // Cloudinary or any complete URL
  // Use directly without modifying it
  if (
    value.startsWith("https://") ||
    value.startsWith("http://")
  ) {
    return value;
  }

  // Support old local /uploads/... URLs
  const backendOrigin = new URL(API_URL).origin;

  const path = value.startsWith("/")
    ? value
    : `/${value}`;

  return `${backendOrigin}${path}`;
};

export default api;