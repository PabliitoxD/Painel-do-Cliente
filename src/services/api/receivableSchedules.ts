import { fetchApi } from './client';

export const receivableSchedulesService = {
  /**
   * List schedule of receivables
   */
  listSchedules: async () => {
    // return fetchApi<any>('/receivable_schedules');
    return Promise.resolve({ data: [] });
  },

  /**
   * Get a summary of the receivable schedule
   */
  getSummary: async () => {
    // return fetchApi<any>('/receivable_schedules/summary');
    return Promise.resolve({ available: 5000, pending: 2000, total: 7000 });
  },
};
