import { fetchApi } from './client';

export interface OrderFilters {
  // Add expected filters
  status?: string;
  payment_method?: string;
  created_at_gt?: string;
  created_at_lt?: string;
  page?: number;
  per_page?: number;
}

export const transactionsService = {
  /**
   * Consult a specific transaction by token
   */
  getOrderByToken: async (token: string): Promise<any> => {
    return fetchApi<any>(`/payments/${token}`);
  },

  /**
   * List transactions with optional filters
   */
  listOrders: async (filters?: OrderFilters): Promise<any> => {
    const q = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([k, v]) => {
        if (v !== undefined && v !== null && v !== '') {
          q.append(k, String(v));
        }
      });
    }
    const query = q.toString();
    return fetchApi<any>(`/orders${query ? `?${query}` : ''}`);
  },

  /**
   * Create a new transaction
   */
  createOrder: async (payload: any): Promise<any> => {
    return fetchApi<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
