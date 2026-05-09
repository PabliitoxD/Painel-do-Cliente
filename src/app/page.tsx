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
      // Callback do OneID — repassa para /login processar
      window.location.href = `/login?token=${token}&company_token=${company_token}`;
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
