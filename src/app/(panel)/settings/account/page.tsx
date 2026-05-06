"use client";

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useState } from 'react';
import { Building2, User, Mail, ShieldAlert } from 'lucide-react';

export default function AccountSettingsPage() {
  // States for profile update
  const [accountName, setAccountName] = useState('Administrador');
  const [accountEmail, setAccountEmail] = useState('admin@tronnus.com');
  const [pixKey, setPixKey] = useState('');

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
            
            <div className="info-list-container animate-fade-in">
              {/* Section 1 */}
              <div className="info-section">
                <div className="info-row">
                  <span className="info-label">Cadastro em</span>
                  <span className="info-value">12/02/2026 às 12:37</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Ativação em</span>
                  <span className="info-value">13/02/2026 às 16:51</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Código</span>
                  <span className="info-value">47327859</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Tipo de negócio</span>
                  <span className="info-value">Pessoa jurídica</span>
                </div>
                <div className="info-row">
                  <span className="info-label">CNPJ</span>
                  <span className="info-value">18.571.771/0001-02</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Razão social</span>
                  <span className="info-value">Rts Escola Internacional da Mecanica do Exercicio Ltda Epp</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Nome fantasia</span>
                  <span className="info-value">Rts Brazil</span>
                </div>
              </div>

              <div className="info-divider"></div>

              {/* Section 2 */}
              <div className="info-section">
                <div className="info-row">
                  <span className="info-label">Responsável</span>
                  <span className="info-value">Mariane de Macedo Franceschi Malucelli</span>
                </div>
                <div className="info-row">
                  <span className="info-label">CPF</span>
                  <span className="info-value">804.905.499-34</span>
                </div>
                <div className="info-row">
                  <span className="info-label">Nascimento</span>
                  <span className="info-value">14/11/1970</span>
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

              <div className="info-divider"></div>

              {/* Section 3 */}
              <div className="info-section">
                <div className="info-row">
                  <span className="info-label">Endereço</span>
                  <span className="info-value">
                    Rua Petit Carneiro, 1027 32<br />
                    Água Verde - Curitiba/PR<br />
                    CEP 80240-050
                  </span>
                </div>
              </div>
            </div>

            <div className="panel-actions">
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

        /* Info List (Dados Cadastrais) */
        .info-list-container {
          display: flex;
          flex-direction: column;
        }

        .info-section {
          display: flex;
          flex-direction: column;
          gap: 1.25rem;
          padding: 1.5rem 0;
        }

        .info-section:first-child {
          padding-top: 0;
        }

        .info-section:last-child {
          padding-bottom: 0;
        }

        .info-divider {
          height: 1px;
          background: var(--border);
          width: 100%;
        }

        .info-row {
          display: flex;
          align-items: flex-start;
        }

        .info-row.align-center {
          align-items: center;
        }

        .info-label {
          width: 250px;
          color: var(--text-muted);
          font-size: 0.95rem;
          flex-shrink: 0;
        }

        .info-value {
          color: var(--text-main);
          font-size: 0.95rem;
          font-weight: 500;
          flex-grow: 1;
          line-height: 1.5;
        }

        .pix-input {
          max-width: 300px;
          padding: 0.6rem 0.8rem;
        }

        /* Forms */
        .form-section {
          margin-bottom: 2rem;
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
          .info-row {
            flex-direction: column;
            gap: 0.25rem;
          }

          .info-label {
            width: 100%;
            font-size: 0.85rem;
          }

          .pix-input {
            max-width: 100%;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
