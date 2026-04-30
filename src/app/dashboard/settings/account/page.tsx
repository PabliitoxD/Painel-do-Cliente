"use client";

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useState } from 'react';
import { Building2, User, Mail, Copy, CheckCircle2, ShieldAlert } from 'lucide-react';

export default function AccountSettingsPage() {
  const [businessType, setBusinessType] = useState('PJ');
  const [copied, setCopied] = useState(false);

  // States for profile update
  const [accountName, setAccountName] = useState('Administrador');
  const [accountEmail, setAccountEmail] = useState('admin@tronnus.com');

  const accountCode = "TRN-9X2V-5A7M";

  const handleCopyCode = () => {
    navigator.clipboard.writeText(accountCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <DashboardLayout>
      <div className="account-settings animate-fade-in">
        <div className="page-header">
          <div>
            <h1>Minha Conta</h1>
            <p className="text-muted">Gerencie seus dados cadastrais e informações de acesso</p>
          </div>
        </div>

        <div className="settings-grid">
          {/* PAINEL 1: DADOS CADASTRAIS */}
          <div className="settings-panel card glass-panel">
            <div className="panel-header">
              <Building2 size={20} className="panel-icon text-primary" />
              <h2>Dados Cadastrais</h2>
            </div>
            
            {/* Banner de Informações da Conta */}
            <div className="account-info-banner">
              <div className="info-item">
                <span className="label">Cadastro em:</span>
                <span className="value">10/04/2026</span>
              </div>
              <div className="info-item">
                <span className="label">Ativação em:</span>
                <span className="value status-active">12/04/2026</span>
              </div>
              <div className="info-item code-item">
                <span className="label">Código da Conta:</span>
                <div className="code-box" onClick={handleCopyCode} title="Copiar código">
                  <span className="value">{accountCode}</span>
                  {copied ? <CheckCircle2 size={16} className="text-success" /> : <Copy size={16} className="copy-icon" />}
                </div>
              </div>
            </div>

            <div className="form-section">
              <h3 className="section-title">Tipo de Negócio</h3>
              <div className="radio-group">
                <label className={`radio-card ${businessType === 'PJ' ? 'active' : ''}`}>
                  <input 
                    type="radio" 
                    name="businessType" 
                    value="PJ" 
                    checked={businessType === 'PJ'} 
                    onChange={(e) => setBusinessType(e.target.value)} 
                    style={{ display: 'none' }}
                  />
                  <div className="radio-content">
                    <span className="radio-circle"></span>
                    <span>Pessoa Jurídica</span>
                  </div>
                </label>
                <label className={`radio-card ${businessType === 'PF' ? 'active' : ''}`}>
                  <input 
                    type="radio" 
                    name="businessType" 
                    value="PF" 
                    checked={businessType === 'PF'} 
                    onChange={(e) => setBusinessType(e.target.value)} 
                    style={{ display: 'none' }}
                  />
                  <div className="radio-content">
                    <span className="radio-circle"></span>
                    <span>Pessoa Física</span>
                  </div>
                </label>
              </div>

              {businessType === 'PJ' ? (
                <div className="form-grid animate-fade-in">
                  <div className="form-group">
                    <label>CNPJ</label>
                    <input type="text" className="form-input" placeholder="00.000.000/0000-00" defaultValue="12.345.678/0001-90" />
                  </div>
                  <div className="form-group">
                    <label>Razão Social</label>
                    <input type="text" className="form-input" placeholder="Nome da sua empresa LTDA" defaultValue="Tronnus Tecnologia LTDA" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Nome Fantasia</label>
                    <input type="text" className="form-input" placeholder="Nome Fantasia" defaultValue="Tronnus" />
                  </div>
                  
                  <div className="form-divider" style={{ gridColumn: '1 / -1' }}>Dados do Responsável</div>
                  
                  <div className="form-group">
                    <label>Nome do Responsável</label>
                    <input type="text" className="form-input" placeholder="Nome completo" defaultValue="João da Silva" />
                  </div>
                  <div className="form-group">
                    <label>CPF</label>
                    <input type="text" className="form-input" placeholder="000.000.000-00" defaultValue="123.456.789-00" />
                  </div>
                  <div className="form-group">
                    <label>Data de Nascimento</label>
                    <input type="date" className="form-input" defaultValue="1985-06-15" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Endereço Completo</label>
                    <input type="text" className="form-input" placeholder="Rua, Número, Bairro, Cidade - UF" defaultValue="Av. Paulista, 1000, Bela Vista, São Paulo - SP" />
                  </div>
                </div>
              ) : (
                <div className="form-grid animate-fade-in">
                  <div className="form-group">
                    <label>Nome Completo</label>
                    <input type="text" className="form-input" placeholder="Seu nome completo" />
                  </div>
                  <div className="form-group">
                    <label>CPF</label>
                    <input type="text" className="form-input" placeholder="000.000.000-00" />
                  </div>
                  <div className="form-group">
                    <label>Data de Nascimento</label>
                    <input type="date" className="form-input" />
                  </div>
                  <div className="form-group" style={{ gridColumn: '1 / -1' }}>
                    <label>Endereço Completo</label>
                    <input type="text" className="form-input" placeholder="Rua, Número, Bairro, Cidade - UF" />
                  </div>
                </div>
              )}
            </div>

            <div className="panel-actions">
              <button className="btn-primary">Salvar Dados Cadastrais</button>
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
                <span className="initial">{accountName.charAt(0)}</span>
              </div>
              <div className="profile-info-main">
                <h3>{accountName}</h3>
                <p className="text-muted">{accountEmail}</p>
                <div className="badge-pro">Plano Pro</div>
              </div>
            </div>

            <div className="form-section">
              <div className="form-group">
                <label>Nome da Conta</label>
                <div className="input-with-icon">
                  <User size={18} className="input-icon" />
                  <input 
                    type="text" 
                    className="form-input" 
                    value={accountName}
                    onChange={(e) => setAccountName(e.target.value)}
                    placeholder="Seu nome de exibição"
                  />
                </div>
              </div>
              
              <div className="form-group">
                <label>E-mail de Acesso</label>
                <div className="input-with-icon">
                  <Mail size={18} className="input-icon" />
                  <input 
                    type="email" 
                    className="form-input" 
                    value={accountEmail}
                    onChange={(e) => setAccountEmail(e.target.value)}
                    placeholder="seu@email.com"
                  />
                </div>
                <p className="input-help">
                  <ShieldAlert size={14} /> 
                  Será enviado um e-mail de confirmação para o novo endereço.
                </p>
              </div>
            </div>

            <div className="panel-actions">
              <button className="btn-primary w-full">Atualizar Acesso</button>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-header {
          margin-bottom: 2rem;
        }
        .page-header h1 {
          font-size: 1.8rem;
          margin-bottom: 0.25rem;
        }
        .text-muted {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
        .text-success {
          color: var(--success);
        }
        .text-primary {
          color: var(--primary);
        }
        
        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 400px;
          gap: 1.5rem;
          align-items: start;
        }

        .settings-panel {
          padding: 2rem;
          display: flex;
          flex-direction: column;
        }

        .profile-panel {
          position: sticky;
          top: 100px;
        }

        .panel-header {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .panel-header h2 {
          font-size: 1.25rem;
          font-weight: 600;
        }

        /* Banner de Info */
        .account-info-banner {
          display: flex;
          background: rgba(30, 41, 59, 0.4);
          border: 1px solid var(--border);
          border-radius: 12px;
          padding: 1.25rem;
          gap: 2rem;
          margin-bottom: 2rem;
          flex-wrap: wrap;
        }

        .info-item {
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .info-item .label {
          font-size: 0.8rem;
          color: var(--text-muted);
          text-transform: uppercase;
          letter-spacing: 0.5px;
        }

        .info-item .value {
          font-weight: 600;
          font-size: 1.05rem;
          color: var(--text-main);
        }

        .status-active {
          color: var(--success) !important;
        }

        .code-box {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          background: rgba(0, 0, 0, 0.2);
          padding: 0.25rem 0.75rem;
          border-radius: 6px;
          border: 1px dashed var(--border);
          cursor: pointer;
          transition: all 0.2s;
        }

        .code-box:hover {
          background: rgba(0, 0, 0, 0.4);
          border-color: var(--primary);
        }

        .code-box .copy-icon {
          color: var(--text-muted);
        }

        .code-box:hover .copy-icon {
          color: var(--primary);
        }

        /* Forms */
        .form-section {
          margin-bottom: 2rem;
        }

        .section-title {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: var(--text-main);
        }

        .radio-group {
          display: flex;
          gap: 1rem;
          margin-bottom: 1.5rem;
        }

        .radio-card {
          flex: 1;
          background: rgba(30, 41, 59, 0.3);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 1rem;
          cursor: pointer;
          transition: all 0.2s;
        }

        .radio-card:hover {
          background: rgba(30, 41, 59, 0.5);
        }

        .radio-card.active {
          background: rgba(59, 130, 246, 0.1);
          border-color: var(--primary);
        }

        .radio-content {
          display: flex;
          align-items: center;
          gap: 0.75rem;
          font-weight: 500;
        }

        .radio-circle {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          border: 2px solid var(--text-muted);
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .radio-card.active .radio-circle {
          border-color: var(--primary);
        }

        .radio-card.active .radio-circle::after {
          content: '';
          width: 8px;
          height: 8px;
          background: var(--primary);
          border-radius: 50%;
        }

        .form-grid {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1.25rem;
        }

        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .form-group label {
          font-size: 0.85rem;
          font-weight: 500;
          color: var(--text-main);
        }

        .form-input {
          width: 100%;
          padding: 0.85rem 1rem;
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: 8px;
          color: var(--text-main);
          font-size: 0.95rem;
          transition: border-color 0.2s, box-shadow 0.2s;
        }

        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.1);
        }

        .form-divider {
          grid-column: 1 / -1;
          margin: 1rem 0 0.5rem;
          font-size: 0.95rem;
          font-weight: 600;
          color: var(--text-muted);
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .form-divider::after {
          content: '';
          flex: 1;
          height: 1px;
          background: var(--border);
        }

        /* Profile Display */
        .profile-display {
          display: flex;
          align-items: center;
          gap: 1.25rem;
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px dashed var(--border);
        }

        .avatar-large {
          width: 64px;
          height: 64px;
          border-radius: 16px;
          background: linear-gradient(135deg, var(--primary) 0%, #1e3a8a 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-size: 1.8rem;
          font-weight: 700;
          box-shadow: 0 4px 12px rgba(59, 130, 246, 0.3);
        }

        .profile-info-main h3 {
          font-size: 1.2rem;
          margin-bottom: 0.25rem;
        }

        .badge-pro {
          display: inline-block;
          background: rgba(234, 179, 8, 0.15);
          color: #eab308;
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          font-size: 0.75rem;
          font-weight: 600;
          margin-top: 0.5rem;
          border: 1px solid rgba(234, 179, 8, 0.3);
        }

        .input-with-icon {
          position: relative;
        }

        .input-with-icon .input-icon {
          position: absolute;
          left: 1rem;
          top: 50%;
          transform: translateY(-50%);
          color: var(--text-muted);
        }

        .input-with-icon .form-input {
          padding-left: 2.75rem;
        }

        .input-help {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-top: 0.5rem;
        }

        .w-full {
          width: 100%;
        }

        @media (max-width: 1024px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
          
          .profile-panel {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .form-grid {
            grid-template-columns: 1fr;
          }
          
          .radio-group {
            flex-direction: column;
          }

          .account-info-banner {
            flex-direction: column;
            gap: 1rem;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
