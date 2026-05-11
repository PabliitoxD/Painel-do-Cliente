import { fetchApi } from './client';
import { isMockSession, mockOrders } from './mockData';

export interface OrderFilters {
  // Add expected filters
  [key: string]: any;
}

export const transactionsService = {
  /**
   * Consult a specific transaction by token
   */
  getOrderByToken: async (token: string) => {
    try {
      return await fetchApi<any>(`/orders/${token}`);
    } catch (error) {
      if (isMockSession()) {
        console.log('Using mock data for getOrderByToken due to API error');
        const order = mockOrders.find(o => o.token === token);
        return order || null;
      }
      throw error;
    }
  },

  /**
   * List transactions with optional filters
   */
  listOrders: async (filters?: OrderFilters) => {
    try {
      return await fetchApi<any>(`/orders${filters ? `?${new URLSearchParams(filters).toString()}` : ''}`);
    } catch (error) {
      if (isMockSession()) {
        console.log('Using mock data for listOrders due to API error');
        return { data: mockOrders };
      }
      throw error;
    }
  },

  /**
   * Create a new transaction
   */
  createOrder: async (payload: any) => {
    try {
      return await fetchApi<any>('/orders', {
        method: 'POST',
        body: JSON.stringify(payload),
      });
    } catch (error) {
      if (isMockSession()) {
        console.log('Using mock data for createOrder due to API error');
        return { ...payload, id: Math.random().toString(36).substr(2, 9), token: 'mock_' + Date.now() };
      }
      throw error;
    }
  },
};


