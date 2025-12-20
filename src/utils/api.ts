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
    await axios.get('/sanctum/csrf-cookie', { 
      withCredentials: true,
      baseURL: '' // Use absolute path
    });
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
  }
};

// Add a request interceptor to include CSRF token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Always fetch CSRF token before each request to ensure it's fresh
    await fetchCsrfToken();
    
    // Get CSRF token from cookie and send it in the header Laravel Sanctum expects
    const csrfToken = document.cookie
      .split('; ')
      .find(row => row.startsWith('XSRF-TOKEN='))
      ?.split('=')[1];

    if (csrfToken) {
      // Sanctum expects the XSRF-TOKEN cookie value (URL-decoded) in the X-XSRF-TOKEN header
      config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
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
      console.log('Unauthorized access - redirecting to login');
      // Optionally redirect to login page
      // window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;