import { fetchApi } from './client';

export const receivableSchedulesService = {
  /**
   * List balance controls (agenda de recebíveis)
   */
  listSchedules: async (params?: any): Promise<any> => {
    const query = params ? new URLSearchParams(params).toString() : '';
    return fetchApi<any>(`/balance_controls${query ? `?${query}` : ''}`);
  },

  /**
   * Get account resume (saldo e recebíveis futuros)
   */
  getSummary: async (): Promise<any> => {
    return fetchApi<any>('/accounts/resume');
  },
};
