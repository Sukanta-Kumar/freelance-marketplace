import { apiClient } from './client';
import {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  UserResponse,
  UpdateUserRequest,
} from '@/types/api';

export const authApi = {
  register: async (payload: RegisterRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse>('/auth/register', payload);
    return data;
  },

  login: async (payload: LoginRequest): Promise<AuthResponse> => {
    const { data } = await apiClient.post<AuthResponse | string>('/auth/login', payload);
    // If backend returns a raw JWT string or an object with token
    if (typeof data === 'string') {
      return { token: data };
    }
    return data;
  },

  getUserById: async (id: number): Promise<UserResponse> => {
    const { data } = await apiClient.get<UserResponse>(`/users/${id}`);
    return data;
  },

  updateUser: async (id: number, payload: UpdateUserRequest): Promise<UserResponse> => {
    const { data } = await apiClient.put<UserResponse>(`/users/${id}`, payload);
    return data;
  },

  getFreelancers: async (): Promise<UserResponse[]> => {
    const { data } = await apiClient.get<UserResponse[]>('/users/freelancers');
    return data;
  },
};
