import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Create an axios instance
const api = axios.create({
  baseURL: '/api', // This will use the same domain as the frontend
  withCredentials: true, // Important for Sanctum cookie-based auth
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Function to fetch CSRF cookie
export const fetchCsrfToken = async () => {
  try {
    await axios.get('/sanctum/csrf-cookie', { withCredentials: true });
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
};

// Add a request interceptor to include CSRF token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Fetch CSRF token before first request
    if (!document.cookie.includes('XSRF-TOKEN')) {
      await fetchCsrfToken();
    }
    
    // Get CSRF token from cookie
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];
      
    if (csrfToken) {
      config.headers['X-CSRF-TOKEN'] = decodeURIComponent(csrfToken);
    }
    
    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// Add a response interceptor to handle auth errors
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error: any) => {
    if (error.response?.status === 401) {
      // Handle unauthorized access
      // You might want to redirect to login page or clear auth state
      console.log('Unauthorized access - possibly redirect to login');
    }
    return Promise.reject(error);
  }
);

export default api;