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
    const query = filters ? new URLSearchParams(filters as any).toString() : '';
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
