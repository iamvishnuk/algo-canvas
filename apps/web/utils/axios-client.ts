import axios from 'axios';
import { redirect } from 'next/navigation';

const options = {
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true,
  timeout: 10000
};

const API = axios.create(options);

export const APIRefresh = axios.create(options);
APIRefresh.interceptors.response.use((response) => response);

export const handleUnauthorized = () => {
  redirect('/auth/sign-in');
};

API.interceptors.response.use(
  (response) => {
    // Return the data directly for successful responses
    return response.data;
  },
  (error) => {
    // Handle case when there's no response (network error)
    if (!error.response) {
      return Promise.reject({
        status: 'error',
        message: 'Network error occurred'
      });
    }

    const { data, status } = error.response;

    // Handle JWT-related authentication errors
    if (status === 401) {
      try {
        // Attempt to refresh the token
        return APIRefresh.get('/auth/refresh').then((response) => {
          // If the token is successfully refreshed, retry the original request
          if (response.status === 200) {
            return API.request(error.config);
          }

          // If the token refresh fails, redirect to the login page
          handleUnauthorized();
          return Promise.reject({
            status: 'error',
            message: 'Unauthorized access',
            statusCode: 401
          });
        });
      } catch {
        handleUnauthorized();
        return Promise.reject({
          status: 'error',
          message: data.message || 'Unauthorized access',
          statusCode: 401
        });
      }
    }

    // For other error responses, return the error data
    // This matches the backend's error response structure
    return Promise.reject({
      status: data.status || 'error',
      message: data.message || 'An unexpected error occurred',
      ...(process.env.NODE_ENV === 'development' &&
        data.stack && { stack: data.stack })
    });
  }
);

export default API;
