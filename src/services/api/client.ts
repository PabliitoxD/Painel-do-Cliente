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
      const isMockSession = localStorage.getItem('tronnus_mock_session') === 'true';
      
      if (!isMockSession) {
        localStorage.removeItem('tronnus_token');
        // Só redireciona se não estiver já na página de login
        if (!window.location.pathname.includes('/login')) {
          window.location.href = '/login?session=expired';
        }
      } else {
        // Em sessão mock, apenas logamos o erro sem derrubar a sessão
        console.warn('API returned 401 during mock session. Ignoring logout redirect.');
      }
    }
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

