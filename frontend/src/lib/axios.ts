/**
 * Configured Axios instance for GameHub API requests.
 *
 * Features:
 * - JSON content-type headers
 * - Configurable timeout via environment variables
 * - Request/response logging in development mode
 * - Centralized error handling and logging
 *
 * @module
 */

import axios from 'axios';
import { API_BASE_URL, API_TIMEOUT_MS, IS_DEV } from './constants';

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: API_TIMEOUT_MS,
});

// Request interceptor for logging
axiosInstance.interceptors.request.use(
  (config) => {
    if (IS_DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`);
    }
    return config;
  },
  (error) => {
    console.error('[API Request Error]', error);
    return Promise.reject(error);
  }
);

// Response interceptor for logging and error handling
axiosInstance.interceptors.response.use(
  (response) => {
    if (IS_DEV) {
      console.log(`[API Response] ${response.config.url}`, response.data);
    }
    return response;
  },
  (error) => {
    if (error.response) {
      console.error('[API Error]', {
        status: error.response.status,
        message: error.response.data?.error || error.message,
        url: error.config?.url,
      });
    } else if (error.request) {
      console.error('[Network Error] No response from server', error.message);
    } else {
      console.error('[Request Setup Error]', error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
