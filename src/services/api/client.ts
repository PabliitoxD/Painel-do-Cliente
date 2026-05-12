export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.sandbox.superfin.com.br';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('tronnus_token') : null;
  const sellerId = typeof window !== 'undefined' ? localStorage.getItem('tronnus_seller_token') : null;
  const sellerKey = typeof window !== 'undefined' ? localStorage.getItem('tronnus_seller_key') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: token }),
    ...(sellerId && { 'X-Seller-Token': sellerId }),
    ...(sellerKey && { 'X-Seller-Key': sellerKey }),
    ...(sellerId && { 'seller-token': sellerId }),
    ...(sellerKey && { 'seller-key': sellerKey }),
    ...options.headers,
  };



  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Sessão expirada — apenas lança erro (quem chamou decide se limpa ou não)
  if (response.status === 401) {
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  if (!response.ok) {
    // Tenta parsear o corpo do erro — pode estar vazio
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.error || `Erro na API: ${response.status}`);
  }

  // Resposta sem conteúdo
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

