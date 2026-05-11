"use client";

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useState, useEffect } from 'react';
import { Building2, User, Mail, ShieldAlert, RefreshCcw, ArrowRight, Scan } from 'lucide-react';
import { api } from '@/services/api';
import Link from 'next/link';

export default function AccountSettingsPage() {
  const [userData, setUserData] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [pixKey, setPixKey] = useState('');

  const loadUser = async () => {
    setIsLoading(true);
    try {
      const user = await api.users.me();
      setUserData(user);
      if (user.pix_key) setPixKey(user.pix_key);
    } catch (err) {
      console.error("Erro ao carregar dados do usuário:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadUser();
  }, []);

  if (isLoading) {
    return (
      <DashboardLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '60vh' }}>
          <div style={{ width: '40px', height: '40px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        </div>
        <style jsx>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      </DashboardLayout>
    );
  }

  const name = userData?.name || 'Produtor';
  const email = userData?.email || '—';
  const isProfileComplete = userData?.document !== undefined && userData?.document !== null && userData?.document !== '';
  const isBiometryDone = false; // Simulado

  return (
    <DashboardLayout>
      <div className="account-settings animate-fade-in">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Minha Conta</h1>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Gerencie seus dados cadastrais e informações de acesso</p>
          </div>
          <button className="btn-ghost" onClick={loadUser}>
            <RefreshCcw size={18} /> Atualizar
          </button>
        </div>

        <div className="settings-grid">
          {/* PAINEL 1: DADOS CADASTRAIS */}
          <div className="settings-panel card glass-panel">
            <div className="panel-header" style={{ justifyContent: 'space-between' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <Building2 size={20} className="panel-icon text-primary" />
                <h2>Dados Cadastrais</h2>
              </div>
              {!isProfileComplete && (
                <Link href="/settings/account/validation" className="badge-warning" style={{ textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', padding: '0.4rem 0.8rem', borderRadius: '20px', background: 'rgba(255, 177, 86, 0.1)', color: 'var(--warning)', border: '1px solid rgba(255, 177, 86, 0.2)' }}>
                  Completar Cadastro <ArrowRight size={14} />
                </Link>
              )}
            </div>
            
            <div className="info-list-container animate-fade-in">
              <div className="info-section">
                <div className="info-row">
                  <span className="info-label">Cadastro em</span>
                  <span className="info-value">{userData?.created_at ? new Date(userData.created_at).toLocaleDateString('pt-BR') : '—'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Código (Token)</span>
                  <span className="info-value" style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>{userData?.token || '—'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Tipo de negócio</span>
                  <span className="info-value">{userData?.type || 'Pessoa Física'}</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Documento</span>
                  <span className="info-value">{userData?.document || '—'}</span>
                </div>
              </div>

              <div className="info-divider"></div>

              <div className="info-section">
                <div className="info-row">
                  <span className="info-label">Responsável</span>
                  <span className="info-value">{userData?.name || '—'}</span>
                </div>
                <div className="info-row align-center">
                  <span className="info-label">Chave PIX</span>
                  <div className="info-value">
                    <input 
                      type="text" 
                      className="form-input pix-input" 
                      placeholder="Sua chave PIX" 
                      value={pixKey}
                      onChange={(e) => setPixKey(e.target.value)}
                    />
                  </div>
                </div>
              </div>
            </div>

            <div className="panel-actions" style={{ marginTop: '2rem', borderTop: '1px solid var(--border)', paddingTop: '1.5rem' }}>
              <button className="btn-primary">Salvar Alterações</button>
            </div>
          </div>

          {/* PAINEL 2: PERFIL DE ACESSO */}
          <div className="settings-panel card glass-panel profile-panel">
            <div className="panel-header">
              <User size={20} className="panel-icon text-primary" />
              <h2>Acesso e Perfil</h2>
            </div>

            <div className="profile-display">
              <div className="avatar-large">
                <span className="initial">{name.charAt(0)}</span>
              </div>
              <div className="profile-info-main">
                <h3>{name}</h3>
                <p className="text-muted">{email}</p>
                <div className="badge-pro">Sandbox</div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label>E-mail de Acesso</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input 
                    type="email" 
                    className="form-input" 
                    value={email}
                    readOnly
                    style={{ opacity: 0.7 }}
                  />
                </div>
              </div>
            </div>

            <div className="biometry-section" style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px dashed var(--border)' }}>
               {!isBiometryDone ? (
                 <Link href="/settings/account/biometry" className="btn-ghost" style={{ width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.75rem', padding: '1rem', border: '1px solid var(--border)', borderRadius: '12px', textDecoration: 'none', color: 'var(--text-main)', fontSize: '0.9rem', fontWeight: 600 }}>
                   <Scan size={20} className="text-primary" /> Fazer Biometria
                 </Link>
               ) : (
                 <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', color: 'var(--success)', fontSize: '0.9rem', fontWeight: 600, justifyContent: 'center' }}>
                   <ShieldAlert size={20} /> Biometria Validada
                 </div>
               )}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 1.5rem;
          align-items: start;
        }
        .settings-panel { padding: 2rem; }
        .panel-header { display: flex; align-items: center; gap: 0.75rem; margin-bottom: 1.5rem; padding-bottom: 1rem; border-bottom: 1px solid var(--border); }
        .info-row { display: flex; margin-bottom: 1.25rem; }
        .info-label { width: 200px; color: var(--text-dim); flex-shrink: 0; }
        .info-value { color: var(--text-main); font-weight: 500; flex-grow: 1; }
        .pix-input { max-width: 300px; padding: 0.6rem 0.8rem; background: var(--background); border: 1px solid var(--border); border-radius: 8px; color: white; }
        .profile-display { display: flex; align-items: center; gap: 1.25rem; margin-bottom: 2rem; }
        .avatar-large { width: 64px; height: 64px; border-radius: 16px; background: var(--primary); display: flex; align-items: center; justify-content: center; color: white; font-size: 1.8rem; font-weight: 700; }
        .badge-pro { display: inline-block; background: rgba(234, 179, 8, 0.15); color: #eab308; padding: 0.2rem 0.6rem; border-radius: 4px; font-size: 0.75rem; margin-top: 0.5rem; border: 1px solid rgba(234, 179, 8, 0.3); }
        .input-with-icon { position: relative; }
        .input-with-icon .input-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-dim); }
        .input-with-icon .form-input { width: 100%; padding: 0.85rem 1rem 0.85rem 2.75rem; background: var(--background); border: 1px solid var(--border); border-radius: 8px; color: white; }
        @media (max-width: 1024px) { .settings-grid { grid-template-columns: 1fr; } }
      `}</style>
    </DashboardLayout>
  );
}
