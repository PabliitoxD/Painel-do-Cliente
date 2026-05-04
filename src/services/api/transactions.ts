import { fetchApi } from './client';

export interface OrderFilters {
  // Add expected filters
  [key: string]: any;
}

export const transactionsService = {
  /**
   * Consult a specific transaction by token
   */
  getOrderByToken: (token: string) => {
    return fetchApi<any>(`/orders/${token}`);
  },

  /**
   * List transactions with optional filters
   */
  listOrders: (filters?: OrderFilters) => {
    const query = filters ? new URLSearchParams(filters).toString() : '';
    return fetchApi<any>(`/orders${query ? `?${query}` : ''}`);
  },

  /**
   * Create a new transaction
   */
  createOrder: (payload: any) => {
    return fetchApi<any>('/orders', {
      method: 'POST',
      body: JSON.stringify(payload),
    });
  },
};
