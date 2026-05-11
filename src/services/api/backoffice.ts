import { fetchApi } from './client';
import { isMockSession } from './mockData';

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
  listChargebacks: async (filters?: ChargebackFilters) => {
    try {
      const queryParams = new URLSearchParams();
      if (filters) {
        Object.entries(filters).forEach(([key, value]) => {
          if (value !== undefined) queryParams.append(key, String(value));
        });
      }
      const query = queryParams.toString();
      return await fetchApi<any>(`/backoffice/chargebacks${query ? `?${query}` : ''}`);
    } catch (error) {
      if (isMockSession()) {
        return { data: [] };
      }
      throw error;
    }
  },
};

