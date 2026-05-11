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
  ChevronLeft,
  Phone,
  Building2,
  ArrowLeft
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    accountType: 'PF',
    password: '',
    confirmPassword: ''
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(step + 1);
    } else {
      handleRegister();
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    // Simulação de registro enviando os dados principais
    console.log("Registrando usuário com os dados:", formData);
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

      <div className="login-card glass-panel animate-fade-in" style={{ maxWidth: '500px', width: '100%' }}>
        <button 
          onClick={() => step === 1 ? router.push('/login') : setStep(step - 1)} 
          className="btn-ghost" 
          style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem' }}
        >
          <ArrowLeft size={18} /> {step === 1 ? 'Voltar ao Login' : 'Voltar'}
        </button>

        <div className="login-header" style={{ marginTop: '2.5rem' }}>
          <img
            src="https://tronnus.com/wp-content/uploads/2026/01/tronnus-png-001.png"
            alt="Tronnus"
            className="login-logo"
          />
          <h1 className="gradient-text">
            {step === 1 && 'Crie sua conta'}
            {step === 2 && 'Tipo de Negócio'}
            {step === 3 && 'Segurança'}
          </h1>
          <p>
            {step === 1 && 'Preencha seus dados básicos para começar'}
            {step === 2 && 'Como você pretende transacionar?'}
            {step === 3 && 'Defina uma senha para proteger seu acesso'}
          </p>
        </div>

        <div className="step-indicator" style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center', marginBottom: '2rem' }}>
          <div style={{ height: '4px', width: '30px', borderRadius: '2px', background: step >= 1 ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }}></div>
          <div style={{ height: '4px', width: '30px', borderRadius: '2px', background: step >= 2 ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }}></div>
          <div style={{ height: '4px', width: '30px', borderRadius: '2px', background: step >= 3 ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }}></div>
        </div>

        <form className="login-form" onSubmit={handleNext}>
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="form-group">
                <label>Nome Completo</label>
                <div className="input-with-icon-login">
                  <User size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="Seu nome completo"
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

              <div className="form-group">
                <label>Celular / WhatsApp</label>
                <div className="input-with-icon-login">
                  <Phone size={18} className="input-icon" />
                  <input
                    type="text"
                    placeholder="(00) 00000-0000"
                    value={formData.phone}
                    onChange={(e) => setFormData({...formData, phone: e.target.value})}
                    required
                  />
                </div>
              </div>

              <button type="submit" className="btn-primary login-submit" style={{ marginTop: '1rem' }}>
                Próximo Passo <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
              </button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
                <div 
                  onClick={() => setFormData({...formData, accountType: 'PF'})}
                  style={{ 
                    padding: '1.25rem', 
                    borderRadius: '12px', 
                    border: '1px solid', 
                    borderColor: formData.accountType === 'PF' ? 'var(--primary)' : 'var(--border)',
                    background: formData.accountType === 'PF' ? 'rgba(101, 131, 154, 0.1)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: formData.accountType === 'PF' ? 'var(--primary)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <User size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Pessoa Física</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Vender como autônomo usando meu CPF</p>
                  </div>
                  {formData.accountType === 'PF' && <CheckCircle2 size={18} className="text-primary" style={{ marginLeft: 'auto' }} />}
                </div>

                <div 
                  onClick={() => setFormData({...formData, accountType: 'PJ'})}
                  style={{ 
                    padding: '1.25rem', 
                    borderRadius: '12px', 
                    border: '1px solid', 
                    borderColor: formData.accountType === 'PJ' ? 'var(--primary)' : 'var(--border)',
                    background: formData.accountType === 'PJ' ? 'rgba(101, 131, 154, 0.1)' : 'rgba(255,255,255,0.02)',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '1rem'
                  }}
                >
                  <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: formData.accountType === 'PJ' ? 'var(--primary)' : 'var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'white' }}>
                    <Building2 size={20} />
                  </div>
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Pessoa Jurídica</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Vender através da minha empresa (CNPJ)</p>
                  </div>
                  {formData.accountType === 'PJ' && <CheckCircle2 size={18} className="text-primary" style={{ marginLeft: 'auto' }} />}
                </div>
              </div>

              <button type="submit" className="btn-primary login-submit">
                Continuar <ArrowRight size={18} style={{ marginLeft: '0.5rem' }} />
              </button>
            </div>
          )}

          {step === 3 && (
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
              </div>

              <button type="submit" className="btn-primary login-submit" disabled={isLoading}>
                {isLoading ? 'Finalizando...' : 'Criar minha Conta'}
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
        .input-with-icon-login { position: relative; }
        .input-with-icon-login .input-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-dim); }
        .input-with-icon-login input { padding-left: 3rem !important; }
        .text-success { color: #10b981; }
        .text-primary { color: var(--primary); }
      `}</style>
    </div>
  );
}
