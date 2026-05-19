import { fetchApi } from './client';

export interface WithdrawPayload {
  amount: number;
}

export const withdrawalsService = {
  /**
   * Create a new withdrawal request
   */
  createWithdraw: async (payload: WithdrawPayload): Promise<any> => {
    // return fetchApi<any>('/withdraw', {
    //   method: 'POST',
    //   body: JSON.stringify(payload),
    // });
    return Promise.resolve({ id: 'w_1', amount: payload.amount, status: 'PENDING' });
  },
  
  /**
   * List all withdrawal requests
   */
  list: async (): Promise<any> => {
    // return fetchApi<any>('/withdrawals');
    return Promise.resolve({ data: [
      { id: 'w_1', amount: 1500, status: 'COMPLETED', created_at: new Date(Date.now() - 86400000 * 2).toISOString() },
      { id: 'w_2', amount: 800, status: 'PENDING', created_at: new Date().toISOString() },
      { id: 'w_3', amount: 5000, status: 'COMPLETED', created_at: new Date(Date.now() - 86400000 * 5).toISOString() },
      { id: 'w_4', amount: 350, status: 'FAILED', created_at: new Date(Date.now() - 86400000 * 10).toISOString() }
    ] });
  },
};

