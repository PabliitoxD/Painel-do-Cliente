"use client";

import { useState, useEffect, Suspense } from 'react';
import { useAuth } from '@/context/AuthContext';
import { useSearchParams } from 'next/navigation';
import '@/styles/login.css';

function LoginContent() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const { login, loginWithOneId, isLoading } = useAuth();
  const searchParams = useSearchParams();

  useEffect(() => {
    const token = searchParams.get('token');
    const company_token = searchParams.get('company_token');
    
    if (token && company_token) {
      loginWithOneId(token, company_token).catch(err => {
        setError(err.message || 'Falha ao logar com OneID');
      });
    }
  }, [searchParams, loginWithOneId]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    try {
      await login(email, password);
    } catch (err) {
      const error = err as Error;
      setError(error.message || 'Erro ao entrar');
    }
  };

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

          <button type="submit" className="btn-primary login-submit" disabled={isLoading}>
            {isLoading ? 'Entrando...' : 'Entrar no Painel'}
          </button>
        </form>

        <div className="login-divider">
          <span>OU</span>
        </div>

        <button 
          type="button" 
          className="btn-secondary oneid-btn" 
          onClick={() => {
            // Redireciona para o endpoint oficial do OneID no ambiente de sandbox
            window.location.href = `https://app.sandbox.oneid.com.br/auth_provider?id=MSg2ktAPs9JnR5MJAHcQ&company_token=85081a949e63b592cc511566374365b2`;
          }}
          disabled={isLoading}
        >
          <img src="https://app.oneid.com.br/favicon.png" alt="OneID" className="oneid-logo" />
          {isLoading ? 'Autenticando...' : 'Entrar com OneID'}
        </button>

        <div className="login-footer">
          <span>Ainda não é um parceiro?</span>
          <a href="#" className="signup-link">Comece agora</a>
        </div>
      </div>
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
