import { apiClient } from './client';
import { PaymentResponse } from '@/types/api';

export const paymentsApi = {
  getPaymentById: async (id: number): Promise<PaymentResponse> => {
    const { data } = await apiClient.get<PaymentResponse>(`/payments/${id}`);
    return data;
  },

  getPaymentByMilestone: async (milestoneId: number): Promise<PaymentResponse> => {
    const { data } = await apiClient.get<PaymentResponse>(`/payments/milestone/${milestoneId}`);
    return data;
  },
};
