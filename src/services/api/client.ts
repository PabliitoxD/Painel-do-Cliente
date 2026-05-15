export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.superfin.com.br';

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
    const errorData = await response.json().catch(() => null);
    let errorMsg = `Erro na API: ${response.status}`;
    
    if (errorData) {
      if (typeof errorData.message === 'string') errorMsg = errorData.message;
      else if (typeof errorData.error === 'string') errorMsg = errorData.error;
      else if (errorData.errors) {
        // Trata erros de validação (comum em 422)
        const details = Object.entries(errorData.errors)
          .map(([key, val]) => `${key}: ${Array.isArray(val) ? val.join(', ') : val}`)
          .join(' | ');
        errorMsg = `Erro de validação: ${details}`;
      }
    }
    throw new Error(errorMsg);
  }

  // Resposta sem conteúdo
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

