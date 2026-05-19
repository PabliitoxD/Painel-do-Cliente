import { fetchApi } from './client';

export interface WithdrawPayload {
  amount: number;
}

export const withdrawalsService = {
  /**
   * Create a new withdrawal request
   */
  createWithdraw: async (payload: WithdrawPayload) => {
    // return fetchApi<any>('/withdraw', {
    //   method: 'POST',
    //   body: JSON.stringify(payload),
    // });
    return Promise.resolve({ id: 'w_1', amount: payload.amount, status: 'PENDING' });
  },
  
  /**
   * List all withdrawal requests
   */
  list: async () => {
    // return fetchApi<any>('/withdrawals');
    return Promise.resolve({ data: [{ id: 'w_1', amount: 1000, status: 'COMPLETED' }] });
  },
};

