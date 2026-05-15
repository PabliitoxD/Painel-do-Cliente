"use client";

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import '@/styles/login.css';

// ─── Config OneID ─────────────────────────────────────────────────────────────
const ONEID_SDK_URL = 'https://auth.oneid.com.br/auth.js';
const ONEID_COMPANY_TOKEN = '85081a949e63b592cc511566374365b2';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [oneIdLoading, setOneIdLoading] = useState(false);
  const [sdkReady, setSdkReady] = useState(false);
  const { login, loginWithOneId, isLoading } = useAuth();
  const searchParams = useSearchParams();

  // Carrega Socket.IO (dependência do SDK OneID) e depois o próprio SDK
  useEffect(() => {
    if (document.getElementById('oneid-sdk-script')) {
      setSdkReady(true);
      return;
    }

    const loadScript = (id: string, src: string, attrs?: Record<string, string>): Promise<void> => {
      return new Promise((resolve, reject) => {
        if (document.getElementById(id)) { resolve(); return; }
        const el = document.createElement('script');
        el.id = id;
        el.src = src;
        el.type = 'text/javascript';
        if (attrs) Object.entries(attrs).forEach(([k, v]) => el.setAttribute(k, v));
        el.onload = () => resolve();
        el.onerror = () => reject(new Error(`Falha ao carregar ${src}`));
        document.head.appendChild(el);
      });
    };

    // 1) Socket.IO (exigido pelo auth.js do OneID)  →  2) SDK OneID
    loadScript('socketio-script', 'https://cdnjs.cloudflare.com/ajax/libs/socket.io/3.1.0/socket.io.js')
      .then(() => loadScript('oneid-sdk-script', ONEID_SDK_URL, {
        name: 'leavening_login_with',
        'data-name': 'env',
        env: 'production',
      }))
      .then(() => {
        console.log('OneID SDK carregado, getTokenAuth =', typeof (window as any).getTokenAuth);
        setSdkReady(true);
      })
      .catch((err) => console.error('Erro ao carregar dependências OneID:', err));
  }, []);

  // Captura callback OneID via query params (fallback para redirect direto)
  useEffect(() => {
    const token = searchParams.get('token');
    const company_token = searchParams.get('company_token');
    if (token && company_token) {
      loginWithOneId(token, company_token).catch(err => {
        setError(err.message || 'Falha ao logar com OneID');
      });
    }
    if (searchParams.get('session') === 'expired') {
      setError('Sua sessão expirou. Faça login novamente.');
    }
  }, [searchParams, loginWithOneId]);

  const handleOneIdClick = async () => {
    setError('');

    // Verifica se o SDK carregou corretamente
    const getTokenAuth = (window as any).getTokenAuth;
    if (typeof getTokenAuth !== 'function') {
      console.error('OneID SDK: window.getTokenAuth não está disponível');
      setError('SDK OneID não carregou. Recarregue a página.');
      return;
    }

    setOneIdLoading(true);
    try {
      console.log('OneID: chamando getTokenAuth()...');
      const response = await getTokenAuth();
      console.log('OneID: resposta recebida', response);

      if (response?.token) {
        await loginWithOneId(response.token, ONEID_COMPANY_TOKEN);
      } else {
        setError('Token não recebido do OneID.');
      }
    } catch (err) {
      console.error('OneID auth error:', err);
      setError('Erro ao realizar o login com OneID.');
    } finally {
      setOneIdLoading(false);
    }
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

        {/* Hidden input exigido pelo SDK OneID (mesmo da web-2) */}
        <input type="hidden" id="leavening_company_token" value={ONEID_COMPANY_TOKEN} />

        <button
          type="button"
          className="btn-secondary oneid-btn"
          onClick={handleOneIdClick}
          disabled={busy || !sdkReady}
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
      </div>
    </div>
  );
}

export default function LoginPage() {
  return (
    <Suspense fallback={null}>
      <LoginContent />
    </Suspense>
  );
}