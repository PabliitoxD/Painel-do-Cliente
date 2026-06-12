import { fetchApi } from './client';

export interface WithdrawPayload {
  amount: number;
}

export const withdrawalsService = {
  /**
   * Create a new withdrawal request
   */
  createWithdraw: async (payload: WithdrawPayload): Promise<any> => {
    return fetchApi<any>('/withdraw', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },

  /**
   * List all withdrawal requests
   */
  list: async (params?: any): Promise<any> => {
    const query = params ? new URLSearchParams(params).toString() : '';
    return fetchApi<any>(`/withdraws${query ? `?${query}` : ''}`);
  },

  /**
   * Cancel a withdrawal request
   */
  cancelWithdraw: (id: string) => {
    return fetchApi<any>(`/withdraws/${id}/cancel`, {
      method: 'POST',
    });
  },
};

