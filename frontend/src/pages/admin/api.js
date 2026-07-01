import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || '/api';
if (baseURL.startsWith('http') && !baseURL.endsWith('/api') && !baseURL.endsWith('/api/')) {
  baseURL = baseURL.replace(/\/+$/, '') + '/api';
}

const api = axios.create({
  baseURL,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && (error.response.status === 401 || error.response.status === 403)) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      // Redirect to /admin/login inside frontend project
      window.location.href = '/admin/login';
    }
    return Promise.reject(error);
  }
);

export default api;
