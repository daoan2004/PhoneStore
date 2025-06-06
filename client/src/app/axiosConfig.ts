import axios from 'axios';

// Set base URL for all axios requests
axios.defaults.baseURL = 'http://localhost:5000';

// Add request interceptor to include credentials
axios.interceptors.request.use((config) => {
  config.withCredentials = true;
  return config;
});

export default axios; 