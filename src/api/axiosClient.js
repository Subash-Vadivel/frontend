import axios from 'axios';

const axiosClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000/api',
});

axiosClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('farm_accounts_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

axiosClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('farm_accounts_token');
    }
    return Promise.reject(error);
  },
);

export default axiosClient;
