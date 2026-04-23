"use client";

import { useState } from 'react';
import './login.css';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic for login will go here
    window.location.href = '/dashboard';
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

          <button type="submit" className="btn-primary login-submit">
            Entrar no Painel
          </button>
        </form>

        <div className="login-footer">
          <span>Ainda não é um parceiro?</span>
          <a href="#" className="signup-link">Comece agora</a>
        </div>
      </div>
    </div>
  );
}
