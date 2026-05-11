
export const isMockSession = () => {
  if (typeof window === 'undefined') return false;
  return localStorage.getItem('tronnus_mock_session') === 'true';
};

export const mockOrders = [
  {
    id: 'ord_1',
    token: 'token_1',
    customer_name: 'Ana Oliveira',
    amount: 150.00,
    status: 'approved',
    payment_method: 'pix',
    created_at: new Date().toISOString(),
  },
  {
    id: 'ord_2',
    token: 'token_2',
    customer_name: 'Bruno Souza',
    amount: 89.90,
    status: 'pending',
    payment_method: 'credit_card',
    created_at: new Date(Date.now() - 86400000).toISOString(),
  },
  {
    id: 'ord_3',
    token: 'token_3',
    customer_name: 'Carla Dias',
    amount: 2500.00,
    status: 'approved',
    payment_method: 'pix',
    created_at: new Date(Date.now() - 172800000).toISOString(),
  },
  {
    id: 'ord_4',
    token: 'token_4',
    customer_name: 'Daniel Silva',
    amount: 450.00,
    status: 'refunded',
    payment_method: 'credit_card',
    created_at: new Date(Date.now() - 259200000).toISOString(),
  }
];

export const mockCharges = [
  {
    token: 'ch_1',
    code: 'CB001',
    description: 'Consultoria Mensal',
    price: 500.00,
    status: 'PAID',
    expiration_date: '20/05/2026',
  },
  {
    token: 'ch_2',
    code: 'CB002',
    description: 'Venda de Infoproduto',
    price: 97.00,
    status: 'NOT_PAID',
    expiration_date: '25/05/2026',
  }
];

export const mockSubscriptions = [
  {
    token: 'sub_1',
    code: 'SUB001',
    status: 'active',
    customer: { id: 'cust_1', name: 'João Silva', email: 'joao@email.com' },
    next_billing_date: '01/06/2026',
    price: 199.90,
  }
];
