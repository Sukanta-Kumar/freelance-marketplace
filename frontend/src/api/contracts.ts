import { apiClient } from './client';
import { ContractResponse } from '@/types/api';

export const contractsApi = {
  getContractById: async (id: number): Promise<ContractResponse> => {
    const { data } = await apiClient.get<ContractResponse>(`/contracts/${id}`);
    return data;
  },

  getContractsByClient: async (clientId: number): Promise<ContractResponse[]> => {
    const { data } = await apiClient.get<ContractResponse[]>(`/contracts/client/${clientId}`);
    return data;
  },

  getContractsByFreelancer: async (freelancerId: number): Promise<ContractResponse[]> => {
    const { data } = await apiClient.get<ContractResponse[]>(`/contracts/freelancer/${freelancerId}`);
    return data;
  },

  completeContract: async (id: number): Promise<ContractResponse> => {
    const { data } = await apiClient.patch<ContractResponse>(`/contracts/${id}/complete`);
    return data;
  },

  cancelContract: async (id: number): Promise<ContractResponse> => {
    const { data } = await apiClient.patch<ContractResponse>(`/contracts/${id}/cancel`);
    return data;
  },
};
