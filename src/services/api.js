import axios from "axios"


const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "https://job-portal-backend-sopc.onrender.com/api/v1",
  timeout: 15000,
})

api.interceptors.request.use(
  (config) => {
    const stored = localStorage.getItem("userInfo")
    if (stored) {
      try {
        const { token } = JSON.parse(stored)
        if (token) config.headers.Authorization = `Bearer ${token}`
      } catch {
        localStorage.removeItem("userInfo")
      }
    }

    return config
  },
  (error) => Promise.reject(error)
)

api.interceptors.response.use(
  (response) => response,
  (error) => {
    const status = error?.response?.status
    const onAuthPage = ["/login", "/register"].includes(window.location.pathname)

    if (status === 401 && !onAuthPage) {
      localStorage.removeItem("userInfo")
      window.location.replace("/login?expired=1")
    }
    return Promise.reject(error)
  }
)

export const getErrorMessage = (error) =>
  error?.response?.data?.message || error?.message || "something went wrong. please try again."

export default api

// Resolve backend-owned uploads when frontend and API use different hosts.
export const assetUrl = (value) => {
  if (!value || /^https?:\/\//i.test(value)) return value;
  const base = import.meta.env.VITE_API_URL;
  return base && /^https?:\/\//i.test(base) ? new URL(value, new URL(base).origin).href : value;
};
