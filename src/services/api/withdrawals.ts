import { fetchApi } from './client';

export interface WithdrawPayload {
  amount: number;
}

export const withdrawalsService = {
  /**
   * Create a new withdrawal request
   */
  createWithdraw: (payload: WithdrawPayload) => {
    return fetchApi<any>('/withdraw', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
  
  /**
   * List all withdrawal requests
   */
  list: () => {
    return fetchApi<any>('/withdrawals');
  },
};

