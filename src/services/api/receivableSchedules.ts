import { fetchApi } from './client';

export const receivableSchedulesService = {
  /**
   * List schedule of receivables
   */
  listSchedules: async (): Promise<any> => {
    // return fetchApi<any>('/receivable_schedules');
    return Promise.resolve({ data: [
      { id: 'rec_1', date: new Date(Date.now() + 86400000).toISOString(), amount: 1500, status: 'pending', description: 'Liberação de saldo' },
      { id: 'rec_2', date: new Date(Date.now() + 86400000 * 2).toISOString(), amount: 800, status: 'pending', description: 'Liberação de saldo' },
      { id: 'rec_3', date: new Date(Date.now() + 86400000 * 3).toISOString(), amount: 2200, status: 'pending', description: 'Liberação de saldo' }
    ] });
  },

  /**
   * Get a summary of the receivable schedule
   */
  getSummary: async (): Promise<any> => {
    // return fetchApi<any>('/receivable_schedules/summary');
    return Promise.resolve({ available: 5000, pending: 2000, total: 7000 });
  },
};
