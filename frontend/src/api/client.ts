import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';
import { toast } from 'sonner';
import { useAuthStore } from '@/stores/authStore';
import { ApiErrorResponse } from '@/types/api';
import { getErrorMessage } from '@/lib/errors';

export const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Request Interceptor: Attach Bearer JWT
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = useAuthStore.getState().token;
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor: Centralized Error & Auth Handling
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorResponse>) => {
    if (!error.response) {
      // Network Error
      toast.error('Network connection issue', {
        description: 'Unable to connect to the marketplace gateway. Please verify your connection.',
        id: 'network-error-toast',
      });
      return Promise.reject(error);
    }

    const status = error.response.status;
    const serverMessage = error.response.data?.message;

    switch (status) {
      case 401: {
        const isAuthRoute =
          window.location.pathname === '/login' || window.location.pathname === '/register';
        if (!isAuthRoute) {
          useAuthStore.getState().logout();
          toast.error('Session expired', {
            description: 'Please log in again to continue your session.',
            id: 'auth-session-expired',
          });
          window.location.href = '/login';
        }
        break;
      }

      case 403: {
        toast.error('Permission denied', {
          description: "You don't have permission to perform this action.",
          id: 'auth-403-forbidden',
        });
        break;
      }

      case 400: {
        const msg = serverMessage || getErrorMessage(error);
        toast.error('Action failed', {
          description: msg,
          id: `bad-request-${Date.now()}`,
        });
        break;
      }

      case 500: {
        toast.error('Server error', {
          description: serverMessage || 'An unexpected internal server error occurred.',
          id: 'server-500-error',
        });
        break;
      }

      default:
        break;
    }

    return Promise.reject(error);
  }
);
