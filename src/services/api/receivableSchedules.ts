import { fetchApi } from './client';

export const receivableSchedulesService = {
  /**
   * List schedule of receivables
   */
  listSchedules: () => {
    return fetchApi<any>('/receivable_schedules');
  },

  /**
   * Get a summary of the receivable schedule
   */
  getSummary: () => {
    return fetchApi<any>('/receivable_schedules/summary');
  },
};
