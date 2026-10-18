import { apiClient } from './client';
import {
  ProjectRequest,
  ProjectResponse,
  PageResponse,
  PaginationParams,
  UpdateProjectStatusRequest,
} from '@/types/api';

export const projectsApi = {
  createProject: async (payload: ProjectRequest): Promise<ProjectResponse> => {
    const { data } = await apiClient.post<ProjectResponse>('/projects', payload);
    return data;
  },

  getProjects: async (params?: PaginationParams): Promise<PageResponse<ProjectResponse> | ProjectResponse[]> => {
    const { data } = await apiClient.get<PageResponse<ProjectResponse> | ProjectResponse[]>('/projects', {
      params,
    });
    return data;
  },

  getProjectById: async (id: number): Promise<ProjectResponse> => {
    const { data } = await apiClient.get<ProjectResponse>(`/projects/${id}`);
    return data;
  },

  updateProject: async (id: number, payload: ProjectRequest): Promise<ProjectResponse> => {
    const { data } = await apiClient.put<ProjectResponse>(`/projects/${id}`, payload);
    return data;
  },

  deleteProject: async (id: number): Promise<void> => {
    await apiClient.delete(`/projects/${id}`);
  },

  updateProjectStatus: async (id: number, payload: UpdateProjectStatusRequest): Promise<ProjectResponse> => {
    const { data } = await apiClient.patch<ProjectResponse>(`/projects/${id}/status`, payload);
    return data;
  },
};
