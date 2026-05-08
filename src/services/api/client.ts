export const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'https://api.sandbox.superfin.com.br';

export async function fetchApi<T>(
  endpoint: string,
  options: RequestInit = {}
): Promise<T> {
  const token = typeof window !== 'undefined' ? localStorage.getItem('tronnus_token') : null;

  const headers: HeadersInit = {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
    ...options.headers,
  };

  const response = await fetch(`${API_BASE_URL}${endpoint}`, {
    ...options,
    headers,
  });

  // Sessão expirada — limpa token e redireciona para login
  if (response.status === 401) {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('tronnus_token');
      window.location.href = '/login?session=expired';
    }
    throw new Error('Sessão expirada. Faça login novamente.');
  }

  if (!response.ok) {
    const errorData = await response.json().catch(() => null);
    throw new Error(errorData?.message || errorData?.error || `Erro na API: ${response.status}`);
  }

  // Resposta sem conteúdo
  if (response.status === 204) {
    return {} as T;
  }

  return response.json();
}

