import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL || 'https://nishad-portfolio-vz5v.onrender.com/api';
if (baseURL.startsWith('http') && !baseURL.endsWith('/api') && !baseURL.endsWith('/api/')) {
  baseURL = baseURL.replace(/\/+$/, '') + '/api';
}

const api = axios.create({
  baseURL,
});

export default api;
