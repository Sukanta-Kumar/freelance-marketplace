import axios, { AxiosError } from 'axios';
import { ApiErrorResponse } from '@/types/api';

/**
 * Extracts a user-friendly error message from any caught error,
 * adhering to the Spring Boot microservices error format.
 */
export function getErrorMessage(error: unknown): string {
  if (typeof error === 'string') {
    return error;
  }

  if (axios.isAxiosError(error)) {
    const axiosError = error as AxiosError<ApiErrorResponse>;

    // Network / connection error
    if (!axiosError.response) {
      if (axiosError.code === 'ERR_NETWORK') {
        return 'Unable to reach the server. Please check your internet connection or backend gateway.';
      }
      return axiosError.message || 'A network error occurred. Please try again.';
    }

    const data = axiosError.response.data;

    // Server-provided message
    if (data?.message) {
      // If validation error field details are present, format cleanly
      if (data.errors && typeof data.errors === 'object') {
        const fieldDetails = Object.values(data.errors).join(', ');
        return `${data.message}: ${fieldDetails}`;
      }
      return data.message;
    }

    // Status code fallbacks
    switch (axiosError.response.status) {
      case 400:
        return 'Invalid request. Please check the entered data.';
      case 401:
        return 'Your session has expired. Please log in again.';
      case 403:
        return 'You do not have permission to perform this action.';
      case 404:
        return 'The requested resource was not found.';
      case 409:
        return 'A conflict occurred with an existing resource.';
      case 500:
        return 'An internal server error occurred. Please try again later.';
      default:
        return `Server returned an error (${axiosError.response.status}).`;
    }
  }

  if (error instanceof Error) {
    return error.message;
  }

  return 'An unexpected error occurred.';
}
