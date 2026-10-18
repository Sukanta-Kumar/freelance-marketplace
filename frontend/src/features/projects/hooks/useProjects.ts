import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { projectsApi } from '@/api/projects';
import { queryKeys } from '@/lib/queryKeys';
import { useAuthStore } from '@/stores/authStore';
import {
  ProjectRequest,
  ProjectResponse,
  PaginationParams,
  UpdateProjectStatusRequest,
} from '@/types/api';
import { toast } from 'sonner';
import { getErrorMessage } from '@/lib/errors';

/**
 * Fetches all marketplace projects (with optional pagination).
 */
export function useProjects(params?: PaginationParams) {
  return useQuery({
    queryKey: queryKeys.projects.list(params),
    queryFn: async () => {
      const data = await projectsApi.getProjects(params);
      if (Array.isArray(data)) {
        return data;
      }
      return data.content || [];
    },
  });
}

/**
 * BACKEND GAP WORKAROUND (BCR-001):
 * Since there is no dedicated "GET /projects/my" or "GET /projects/client/{id}" endpoint,
 * we fetch marketplace projects via GET /projects and filter by clientId === currentUserId on the client.
 * Once BCR-001 is approved and implemented on the backend, update only this queryFn.
 */
export function useMyProjects() {
  const userId = useAuthStore((state) => state.userId);

  return useQuery({
    queryKey: queryKeys.projects.myProjects(userId || undefined),
    queryFn: async () => {
      const data = await projectsApi.getProjects();
      const allProjects = Array.isArray(data) ? data : data.content || [];
      if (!userId) return [];
      return allProjects.filter((p: ProjectResponse) => p.clientId === userId);
    },
    enabled: typeof userId === 'number' && userId > 0,
  });
}

/**
 * Fetches single project detail by ID.
 */
export function useProject(id?: number | string | null) {
  const numericId = Number(id);

  return useQuery({
    queryKey: queryKeys.projects.detail(numericId),
    queryFn: () => projectsApi.getProjectById(numericId),
    enabled: !isNaN(numericId) && numericId > 0,
  });
}

/**
 * Mutation to create a new project.
 */
export function useCreateProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProjectRequest) => projectsApi.createProject(payload),
    onSuccess: (newProject) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      toast.success('Project posted successfully', {
        description: `"${newProject.title}" is now open for bids.`,
      });
    },
    onError: (err) => {
      toast.error('Failed to create project', {
        description: getErrorMessage(err),
      });
    },
  });
}

/**
 * Mutation to update an existing project.
 */
export function useUpdateProject(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: ProjectRequest) => projectsApi.updateProject(projectId, payload),
    onSuccess: (updated) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
      toast.success('Project updated', {
        description: `"${updated.title}" has been modified.`,
      });
    },
    onError: (err) => {
      toast.error('Failed to update project', {
        description: getErrorMessage(err),
      });
    },
  });
}

/**
 * Mutation to delete a project.
 */
export function useDeleteProject() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (id: number) => projectsApi.deleteProject(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      toast.success('Project deleted', {
        description: 'The project and any associated open bids have been removed.',
      });
    },
    onError: (err) => {
      toast.error('Failed to delete project', {
        description: getErrorMessage(err),
      });
    },
  });
}

/**
 * Mutation to update project status.
 */
export function useUpdateProjectStatus(projectId: number) {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (payload: UpdateProjectStatusRequest) =>
      projectsApi.updateProjectStatus(projectId, payload),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.projects.detail(projectId) });
      toast.success('Project status updated');
    },
    onError: (err) => {
      toast.error('Failed to update project status', {
        description: getErrorMessage(err),
      });
    },
  });
}
