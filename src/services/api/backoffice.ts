import { fetchApi } from './client';

export interface ChargebackFilters {
  reason?: string;
  status?: 'DEBITED' | 'PAID' | 'IN_ANALYSIS';
  nsu_code?: string;
  occurrence_date_gt?: string;
  occurrence_date_lt?: string;
  constestation_deadline_gt?: string;
}

export const backofficeService = {
  /**
   * List chargebacks with specific filters
   */
  listChargebacks: async (filters?: ChargebackFilters): Promise<any> => {
    // const queryParams = new URLSearchParams();
    // 
    // if (filters) {
    //   Object.entries(filters).forEach(([key, value]) => {
    //     if (value !== undefined) queryParams.append(key, String(value));
    //   });
    // }
    //
    // const query = queryParams.toString();
    // return fetchApi<any>(`/backoffice/chargebacks${query ? `?${query}` : ''}`);
    return Promise.resolve({
      data: [
        { id: '1', reason: 'Fraude', status: 'IN_ANALYSIS', amount: 150.00, date: new Date().toISOString() }
      ],
      meta: { total: 1 }
    });
  },
};
