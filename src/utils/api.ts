import axios from 'axios';
import type { AxiosResponse, InternalAxiosRequestConfig } from 'axios';

// Base URL for Laravel API (can be overridden via VITE_API_BASE_URL)
const API_BASE_URL = (import.meta.env.VITE_API_BASE_URL as string | undefined) ?? 'http://localhost:8000/api';

// Derive backend origin (without /api) for Sanctum CSRF cookie
const BACKEND_URL = API_BASE_URL.replace(/\/api$/, '');

// Create an axios instance for API calls
const api = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true, // Important for Sanctum cookie-based auth
  headers: {
    'Accept': 'application/json',
    'Content-Type': 'application/json',
  },
});

// Function to fetch CSRF cookie from Laravel backend
export const fetchCsrfToken = async () => {
  try {
    await axios.get(`${BACKEND_URL}/sanctum/csrf-cookie`, {
      withCredentials: true,
    });
  } catch (error) {
    console.error('Failed to fetch CSRF token:', error);
    throw error;
  }
};

// Add a request interceptor to include CSRF token
api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    // Only fetch CSRF token if it's not already set or if we're making a mutating request
    const needsCsrfToken = ['post', 'put', 'patch', 'delete'].includes(config.method?.toLowerCase() || '');
    
    if (needsCsrfToken) {
      await fetchCsrfToken();
      
      // Get CSRF token from cookie and send it in the header Laravel Sanctum expects
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('XSRF-TOKEN='))
        ?.split('=')[1];
        
      if (csrfToken) {
        // Sanctum expects the XSRF-TOKEN cookie value (URL-decoded) in the X-XSRF-TOKEN header
        config.headers['X-XSRF-TOKEN'] = decodeURIComponent(csrfToken);
      } else {
        console.warn('CSRF token not found in cookies');
      }
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
    } else if (error.response?.status === 419) {
      // CSRF token mismatch - retry the request
      console.log('CSRF token mismatch - retrying request');
      return api.request(error.config);
    }
    return Promise.reject(error);
  }
);

export default api;