import { fetchApi } from './client';

export interface ReportOrderFilters {
  buyer_name?: string;
  status?: string;
  created_at_gt?: string;
  created_at_lt?: string;
  // additional filters...
}

export const reportsService = {
  /**
   * Generate/fetch transaction reports
   */
  orderReport: async (filters?: ReportOrderFilters): Promise<any> => {
    // const queryParams = new URLSearchParams();
    // 
    // if (filters) {
    //   Object.entries(filters).forEach(([key, value]) => {
    //     if (value !== undefined) queryParams.append(key, String(value));
    //   });
    // }
    //
    // const query = queryParams.toString();
    // return fetchApi<any>(`/reports/order${query ? `?${query}` : ''}`);
    return Promise.resolve({ url: 'https://example.com/mock-report.pdf' });
  },
};
