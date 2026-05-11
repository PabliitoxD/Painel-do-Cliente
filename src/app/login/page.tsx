"use client";

import { useState, useEffect, useRef, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import '@/styles/login.css';

// ─── Config OneID ─────────────────────────────────────────────────────────────
const ONEID_URL = 'https://app.sandbox.oneid.com.br/auth_provider';
const ONEID_ID = 'MSg2ktAPs9JnR5MJAHcQ';
const ONEID_COMPANY_TOKEN = '85081a949e63b592cc511566374365b2';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [oneIdLoading, setOneIdLoading] = useState(false);
  const [oneIdModal, setOneIdModal] = useState(false);
  const { login, loginWithOneId, isLoading } = useAuth();
  const searchParams = useSearchParams();
  const popupRef = useRef<Window | null>(null);
  const pollRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Captura callback OneID via query params (fallback para redirect)
  useEffect(() => {
    const token = searchParams.get('token');
    const company_token = searchParams.get('company_token');
    if (token && company_token) {
      loginWithOneId(token, company_token).catch(err => {
        setError(err.message || 'Falha ao logar com OneID');
      });
    }
    // Mensagem de sessão expirada
    if (searchParams.get('session') === 'expired') {
      setError('Sua sessão expirou. Faça login novamente.');
    }
  }, [searchParams, loginWithOneId]);

  // Listener para receber postMessage do popup OneID
  useEffect(() => {
    const handleMessage = (event: MessageEvent) => {
      // Aceita mensagens do domínio OneID
      if (!event.origin.includes('oneid.com.br') && !event.origin.includes('localhost')) return;
      const { token, company_token, account_token } = event.data || {};
      if (token && company_token) {
        closePopup();
        setOneIdLoading(true);
        loginWithOneId(token, company_token, account_token)
          .catch(err => setError(err.message || 'Falha ao logar com OneID'))
          .finally(() => setOneIdLoading(false));
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [loginWithOneId]);

  const closePopup = () => {
    if (pollRef.current) clearInterval(pollRef.current);
    if (popupRef.current && !popupRef.current.closed) popupRef.current.close();
    setOneIdModal(false);
    setOneIdLoading(false);
  };

  const handleOneIdClick = () => {
    setError('');
    // redirect_uri aponta para a raiz — onde o Superfin faz o callback
    const callbackUrl = `${window.location.origin}/`;
    const params = new URLSearchParams({
      id: ONEID_ID,
      company_token: ONEID_COMPANY_TOKEN,
      redirect_uri: callbackUrl,
    });
    const url = `${ONEID_URL}?${params.toString()}`;

    // Abre popup centralizado
    const w = 500, h = 650;
    const left = window.screenX + (window.outerWidth - w) / 2;
    const top = window.screenY + (window.outerHeight - h) / 2;
    const popup = window.open(url, 'oneid_auth', `width=${w},height=${h},left=${left},top=${top},scrollbars=yes,resizable=yes`);

    if (!popup) {
      // Bloqueado pelo browser — cai no modal embutido
      setOneIdModal(true);
      return;
    }

    popupRef.current = popup;
    setOneIdLoading(true);

    // Polling: detecta quando o popup fecha ou redireciona para o callback
    pollRef.current = setInterval(() => {
      try {
        if (popup.closed) {
          closePopup();
          return;
        }
        // Tenta ler a URL do popup (só funciona na mesma origem)
        const popupUrl = popup.location.href;
        if (popupUrl.includes('/login')) {
          const url = new URL(popupUrl);
          const token = url.searchParams.get('token');
          const company_token = url.searchParams.get('company_token');
          const account_token = url.searchParams.get('account_token');
          if (token && company_token) {
            popup.close();
            closePopup();
            setOneIdLoading(true);
            loginWithOneId(token, company_token, account_token ? parseInt(account_token) : undefined)
              .catch(err => setError(err.message || 'Falha ao logar com OneID'))
              .finally(() => setOneIdLoading(false));
          }
        }
      } catch {
        // Cross-origin — ainda aguardando callback
      }
    }, 500);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    try {
      await login(email, password);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erro ao entrar');
    }
  };

  const busy = isLoading || oneIdLoading;

  return (
    <div className="login-container">
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <div className="login-card glass-panel animate-fade-in">
        <div className="login-header">
          <img
            src="https://tronnus.com/wp-content/uploads/2026/01/tronnus-png-001.png"
            alt="Tronnus"
            className="login-logo"
          />
          <h1 className="gradient-text">Painel do Produtor</h1>
          <p>Acesse sua conta para gerenciar seus negócios</p>
          {error && <div className="login-error animate-fade-in">{error}</div>}
        </div>

        <form className="login-form" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              placeholder="seu@email.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={busy}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              disabled={busy}
            />
          </div>

          <div className="form-options">
            <label className="checkbox-container">
              <input type="checkbox" />
              <span className="checkmark"></span>
              Lembrar-me
            </label>
            <a href="#" className="forgot-password">Esqueceu a senha?</a>
          </div>

          <button type="submit" className="btn-primary login-submit" disabled={busy}>
            {isLoading ? 'Entrando...' : 'Entrar no Painel'}
          </button>
        </form>

        <div className="login-divider"><span>OU</span></div>

        <button
          type="button"
          className="btn-secondary oneid-btn"
          onClick={handleOneIdClick}
          disabled={busy}
        >
          {oneIdLoading ? (
            <>
              <div style={{ width: '18px', height: '18px', border: '2px solid rgba(255,255,255,0.3)', borderTopColor: 'white', borderRadius: '50%', animation: 'spin 1s linear infinite', flexShrink: 0 }} />
              Autenticando com OneID...
            </>
          ) : (
            <>
              <img src="https://app.oneid.com.br/favicon.png" alt="OneID" className="oneid-logo" />
              Entrar com OneID
            </>
          )}
        </button>

        <div className="login-footer">
          <span>Ainda não é um parceiro?</span>
          <a href="/register" className="signup-link">Comece agora</a>

        </div>
      </div>

      {/* Modal fallback (popup bloqueado pelo browser) */}
      {oneIdModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(6px)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 9999, padding: '1rem' }}>
          <div style={{ background: 'var(--surface)', borderRadius: '20px', padding: '2rem', width: '100%', maxWidth: '560px', border: '1px solid var(--border)', boxShadow: '0 25px 50px rgba(0,0,0,0.5)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
              <h3 style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>Autenticação OneID</h3>
              <button onClick={closePopup} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-dim)', fontSize: '1.4rem', lineHeight: 1 }}>✕</button>
            </div>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '1.25rem' }}>
              Seu navegador bloqueou o popup. Clique no link abaixo para autenticar:
            </p>
            <a
              href={`${ONEID_URL}?id=${ONEID_ID}&company_token=${ONEID_COMPANY_TOKEN}&redirect_uri=${encodeURIComponent(window.location.origin + '/login')}`}
              target="_blank"
              rel="noopener noreferrer"
              className="btn-primary"
              style={{ display: 'block', textAlign: 'center', padding: '0.85rem', borderRadius: '10px', textDecoration: 'none' }}
            >
              Abrir página de autenticação OneID
            </a>
            <button onClick={closePopup} style={{ marginTop: '0.75rem', width: '100%', background: 'none', border: '1px solid var(--border)', borderRadius: '10px', padding: '0.75rem', color: 'var(--text-dim)', cursor: 'pointer', fontSize: '0.9rem' }}>
              Cancelar
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .oneid-btn { display: flex; align-items: center; justify-content: center; gap: 0.75rem; }
      `}</style>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={<div className="login-container" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', color: '#fff' }}>Carregando...</div>}>
      <LoginContent />
    </Suspense>
  );
}
