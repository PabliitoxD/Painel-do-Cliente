import { fetchApi } from './client';
import { isMockSession } from './mockData';

export interface WithdrawPayload {
  amount: number;
}

export const withdrawalsService = {
  /**
   * Create a new withdrawal request
   */
  createWithdraw: async (payload: WithdrawPayload) => {
    try {
      return await fetchApi<any>('/withdraw', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (error) {
      if (isMockSession()) {
        return { success: true, message: 'Solicitação de saque enviada com sucesso (MOCK).' };
      }
      throw error;
    }
  },
};


