import { apiClient } from './client';
import {
  CreateMilestoneRequest,
  MilestoneResponse,
  RejectMilestoneRequest,
  SubmitMilestoneRequest,
  UpdateMilestoneRequest,
} from '@/types/api';

export const milestonesApi = {
  createMilestone: async (payload: CreateMilestoneRequest): Promise<MilestoneResponse> => {
    const { data } = await apiClient.post<MilestoneResponse>('/milestones', payload);
    return data;
  },

  getMilestoneById: async (id: number): Promise<MilestoneResponse> => {
    const { data } = await apiClient.get<MilestoneResponse>(`/milestones/${id}`);
    return data;
  },

  getMilestonesByContract: async (contractId: number): Promise<MilestoneResponse[]> => {
    const { data } = await apiClient.get<MilestoneResponse[]>(`/milestones/contract/${contractId}`);
    return data;
  },

  updateMilestone: async (id: number, payload: UpdateMilestoneRequest): Promise<MilestoneResponse> => {
    const { data } = await apiClient.put<MilestoneResponse>(`/milestones/${id}`, payload);
    return data;
  },

  startMilestone: async (id: number): Promise<MilestoneResponse> => {
    const { data } = await apiClient.patch<MilestoneResponse>(`/milestones/${id}/start`);
    return data;
  },

  submitMilestone: async (id: number, payload: SubmitMilestoneRequest): Promise<MilestoneResponse> => {
    const { data } = await apiClient.post<MilestoneResponse>(`/milestones/${id}/submit`, payload);
    return data;
  },

  approveMilestone: async (id: number): Promise<MilestoneResponse> => {
    const { data } = await apiClient.patch<MilestoneResponse>(`/milestones/${id}/approve`);
    return data;
  },

  rejectMilestone: async (id: number, payload: RejectMilestoneRequest): Promise<MilestoneResponse> => {
    const { data } = await apiClient.patch<MilestoneResponse>(`/milestones/${id}/reject`, payload);
    return data;
  },
};
