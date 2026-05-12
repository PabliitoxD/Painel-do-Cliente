"use client";

import { useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';

/**
 * Página raiz: captura callback do OneID (?token=...&company_token=...)
 * e redireciona para /login preservando os params, ou vai direto pro login.
 */
function HomeContent() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const company_token = searchParams.get('company_token');

    if (token && company_token) {
      // Callback do OneID
      const account_token = searchParams.get('account_token');

      if (window.opener) {
        // Estamos dentro do popup — envia token de volta para a janela pai
        window.opener.postMessage(
          { token, company_token, ...(account_token && { account_token: Number(account_token) }) },
          window.location.origin
        );
        window.close();
        return;
      }

      // Fallback: não é popup (redirect direto) — repassa para /login processar
      const params = new URLSearchParams({ token, company_token });
      if (account_token) params.set('account_token', account_token);
      window.location.href = `/login?${params.toString()}`;
    } else {
      window.location.href = '/login';
    }
  }, [searchParams]);

  return <div style={{ backgroundColor: '#0B0F19', height: '100vh' }} />;
}

export default function Home() {
  return (
    <Suspense fallback={<div style={{ backgroundColor: '#0B0F19', height: '100vh' }} />}>
      <HomeContent />
    </Suspense>
  );
}
