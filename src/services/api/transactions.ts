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
    // return fetchApi<any>(`/orders/${token}`);
    return Promise.resolve({ id: '1', token, status: 'PAID', amount: 150 });
  },

  /**
   * List transactions with optional filters
   */
  listOrders: async (filters?: OrderFilters): Promise<any> => {
    // const query = filters ? new URLSearchParams(filters as any).toString() : '';
    // return fetchApi<any>(`/orders${query ? `?${query}` : ''}`);
    return Promise.resolve({
      data: [{ id: '1', token: 'tok_1', status: 'PAID', amount: 150 }],
      meta: { total: 1, current_page: 1, per_page: 10 }
    });
  },

  /**
   * Create a new transaction
   */
  createOrder: async (payload: any): Promise<any> => {
    // return fetchApi<any>('/orders', {
    //   method: 'POST',
    //   body: JSON.stringify(payload),
    // });
    return Promise.resolve({ id: '2', status: 'CREATED', amount: payload?.amount || 100 });
  },
};
