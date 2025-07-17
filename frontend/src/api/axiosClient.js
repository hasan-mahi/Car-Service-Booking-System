import axios from "axios";

// Create axios instance with your backend base URL
const axiosClient = axios.create({
  baseURL: "http://localhost:3001",
});

// Add a request interceptor to inject the token on every request
axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token"); // Or wherever you store your JWT

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default axiosClient;
