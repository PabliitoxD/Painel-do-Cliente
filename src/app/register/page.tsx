"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/login.css';
import { 
  User, 
  Mail, 
  Lock, 
  ArrowRight, 
  CheckCircle2,
  ChevronLeft
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step === 1) {
      setStep(2);
    } else {
      handleRegister();
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    // Simulação de registro
    setTimeout(() => {
      setIsLoading(false);
      router.push('/login?registered=success');
    }, 2000);
  };

  return (
    <div className="login-container">
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <div className="login-card glass-panel animate-fade-in" style={{ maxWidth: '500px' }}>
        <button 
          onClick={() => step === 1 ? router.push('/login') : setStep(1)} 
          className="btn-ghost" 
          style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
        >
          <ChevronLeft size={18} /> {step === 1 ? 'Voltar ao Login' : 'Voltar'}
        </button>

        <div className="login-header" style={{ marginTop: '2.5rem' }}>
          <img
            src="https://tronnus.com/wp-content/uploads/2026/01/tronnus-png-001.png"
            alt="Tronnus"
            className="login-logo"
          />
          <h1 className="gradient-text">{step === 1 ? 'Criar sua conta' : 'Defina sua senha'}</h1>
          <p>{step === 1 ? 'Comece a vender e gerenciar seus negócios hoje' : 'Proteja seu acesso com uma senha forte'}</p>
        </div>

        <div className="step-indicator" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ height: '4px', width: '40px', borderRadius: '2px', background: step === 1 ? 'var(--primary)' : 'var(--success)' }}></div>
          <div style={{ height: '4px', width: '40px', borderRadius: '2px', background: step === 2 ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }}></div>
        </div>

        <form className="login-form" onSubmit={handleNext}>
          {step === 1 ? (
            <div className="animate-fade-in">
              <div className="form-group">
                <label>Nome Completo</label>
                <div className="input-with-icon-login">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="Como deseja ser chamado?"
                    value={formData.name}
                    onChange={(e) => setFormData({...formData, name: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>E-mail Profissional</label>
                <div className="input-with-icon-login">
                  <Mail size={18} className="input-icon" />
                  <input
                    type="email"
                    placeholder="seu@email.com"
                    value={formData.email}
                    onChange={(e) => setFormData({...formData, email: e.target.value})}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary login-submit" style={{ marginTop: '1rem' }}>
                Continuar <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
              </button>
            </div>
          ) : (
            <div className="animate-fade-in">
              <div className="form-group">
                <label>Senha</label>
                <div className="input-with-icon-login">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.password}
                    onChange={(e) => setFormData({...formData, password: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label>Confirmar Senha</label>
                <div className="input-with-icon-login">
                  <Lock size={18} className="input-icon" />
                  <input
                    type="password"
                    placeholder="••••••••"
                    value={formData.confirmPassword}
                    onChange={(e) => setFormData({...formData, confirmPassword: e.target.value})}
                    required
                  />
                </div>
              </div>

              <div className="password-requirements" style={{ marginBottom: '1.5rem' }}>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.4rem', marginBottom: '0.3rem' }}>
                  <CheckCircle2 size={12} className={formData.password.length >= 8 ? 'text-success' : ''} /> Mínimo de 8 caracteres
                </p>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                  <CheckCircle2 size={12} className={formData.password === formData.confirmPassword && formData.password !== '' ? 'text-success' : ''} /> Senhas coincidem
                </p>
              </div>

              <button type="submit" className="btn-primary login-submit" disabled={isLoading}>
                {isLoading ? 'Criando conta...' : 'Finalizar Cadastro'}
              </button>
            </div>
          )}
        </form>

        <div className="login-footer">
          <span>Já possui uma conta?</span>
          <a href="/login" className="signup-link">Fazer Login</a>
        </div>
      </div>

      <style jsx>{`
        .input-with-icon-login {
          position: relative;
        }
        .input-with-icon-login .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-dim);
        }
        .input-with-icon-login input {
          padding-left: 3rem !important;
        }
        .text-success { color: #10b981; }
      `}</style>
    </div>
  );
}
