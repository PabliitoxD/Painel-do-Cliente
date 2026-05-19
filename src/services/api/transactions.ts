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
      data: [
        { id: 't_1', token: 'tok_1', status: 'PAID', amount: 150, payment_method: 'pix', created_at: new Date().toISOString(), description: 'Venda E-book', type: 'Venda', client: 'Maria Oliveira' },
        { id: 't_2', token: 'tok_2', status: 'PAID', amount: 300, payment_method: 'credit_card', created_at: new Date(Date.now() - 86400000).toISOString(), description: 'Mentoria Premium', type: 'Venda', client: 'Carlos Santos' },
        { id: 't_3', token: 'tok_3', status: 'REFUNDED', amount: 150, payment_method: 'pix', created_at: new Date(Date.now() - 86400000 * 2).toISOString(), description: 'Venda E-book', type: 'Venda', client: 'Ana Costa' },
        { id: 't_4', token: 'tok_4', status: 'CANCELED', amount: 50, payment_method: 'boleto', created_at: new Date(Date.now() - 86400000 * 3).toISOString(), description: 'E-book Básico', type: 'Venda', client: 'Pedro Alves' },
        { id: 't_5', token: 'tok_5', status: 'PAID', amount: 450, payment_method: 'credit_card', created_at: new Date(Date.now() - 86400000 * 4).toISOString(), description: 'Curso Online', type: 'Venda', client: 'Julia Lima' },
        { id: 't_6', token: 'tok_6', status: 'CHARGEBACK', amount: 450, payment_method: 'credit_card', created_at: new Date(Date.now() - 86400000 * 5).toISOString(), description: 'Curso Online', type: 'Venda', client: 'Lucas Ferreira' },
        { id: 't_7', token: 'tok_7', status: 'COMPLETED', amount: -1500, payment_method: 'bank_transfer', created_at: new Date(Date.now() - 86400000 * 2).toISOString(), description: 'Saque para Conta Bancária', type: 'Saque', client: 'João' },
        { id: 't_8', token: 'tok_8', status: 'PAID', amount: 90, payment_method: 'recurrence', created_at: new Date(Date.now() - 86400000 * 6).toISOString(), description: 'Assinatura Mensal', type: 'Venda', client: 'Marcos Silva' },
        { id: 't_9', token: 'tok_9', status: 'PAID', amount: 90, payment_method: 'recurrence', created_at: new Date(Date.now() - 86400000 * 1).toISOString(), description: 'Assinatura Mensal', type: 'Venda', client: 'Fernanda Rocha' },
        { id: 't_10', token: 'tok_10', status: 'PAID', amount: 1200, payment_method: 'pix', created_at: new Date().toISOString(), description: 'Consultoria VIP', type: 'Venda', client: 'Ricardo Mendes' },
        { id: 't_11', token: 'tok_11', status: 'PAID', amount: 150, payment_method: 'credit_card', created_at: new Date(Date.now() - 86400000 * 3).toISOString(), description: 'Venda E-book', type: 'Venda', client: 'Camila Gomes' },
        { id: 't_12', token: 'tok_12', status: 'PAID', amount: -4.50, payment_method: 'system', created_at: new Date().toISOString(), description: 'Taxa de transação', type: 'Taxa', client: 'Sistema' }
      ],
      meta: { total: 12, current_page: 1, per_page: 20 }
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
