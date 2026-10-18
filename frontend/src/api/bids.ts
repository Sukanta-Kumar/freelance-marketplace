import { apiClient } from './client';
import { BidRequest, BidResponse, UpdateBidRequest } from '@/types/api';

export const bidsApi = {
  createBid: async (payload: BidRequest): Promise<BidResponse> => {
    const { data } = await apiClient.post<BidResponse>('/bids', payload);
    return data;
  },

  getBidById: async (id: number): Promise<BidResponse> => {
    const { data } = await apiClient.get<BidResponse>(`/bids/${id}`);
    return data;
  },

  getBidsByProject: async (projectId: number): Promise<BidResponse[]> => {
    const { data } = await apiClient.get<BidResponse[]>(`/bids/project/${projectId}`);
    return data;
  },

  getBidsByFreelancer: async (freelancerId: number): Promise<BidResponse[]> => {
    const { data } = await apiClient.get<BidResponse[]>(`/bids/freelancer/${freelancerId}`);
    return data;
  },

  updateBid: async (id: number, payload: UpdateBidRequest): Promise<BidResponse> => {
    const { data } = await apiClient.put<BidResponse>(`/bids/${id}`, payload);
    return data;
  },

  deleteBid: async (id: number): Promise<void> => {
    await apiClient.delete(`/bids/${id}`);
  },

  acceptBid: async (id: number): Promise<BidResponse> => {
    const { data } = await apiClient.patch<BidResponse>(`/bids/${id}/accept`);
    return data;
  },

  rejectBid: async (id: number): Promise<BidResponse> => {
    const { data } = await apiClient.patch<BidResponse>(`/bids/${id}/reject`);
    return data;
  },
};
