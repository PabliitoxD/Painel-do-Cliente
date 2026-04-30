"use client";

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { CreditCard, Receipt, Shield, Zap, BadgePercent, ArrowUpRight, ArrowDownToLine, Info, Wallet } from 'lucide-react';

export default function PlanSettingsPage() {
  return (
    <DashboardLayout>
      <div className="plan-settings animate-fade-in">
        <div className="page-header">
          <div>
            <h1>Meu Plano</h1>
            <p className="text-muted">Condições acordadas: Taxa MDR e outros custos</p>
          </div>
          <div className="plan-badge">
            <span className="badge-icon"><Zap size={16} /></span>
            <span>Plano Pagar.me PRO</span>
          </div>
        </div>

        {/* Módulo de Taxas de Cartão de Crédito */}
        <div className="settings-panel card glass-panel" style={{ marginBottom: '2rem' }}>
          <div className="panel-header">
            <div className="header-title">
              <CreditCard size={20} className="panel-icon text-primary" />
              <h2>Taxas de Cartão de Crédito (MDR)</h2>
            </div>
            <div className="release-term text-muted">
              <Info size={14} /> Prazo de liberação: <strong>D+30</strong>
            </div>
          </div>

          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>Bandeiras</th>
                  <th className="text-center">Crédito à vista</th>
                  <th className="text-center">Parcelado 2-6x</th>
                  <th className="text-center">Parcelado 7-12x</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td>
                    <div className="brand-logo">
                      <div className="circle-mc-red"></div>
                      <div className="circle-mc-yellow"></div>
                      <span className="brand-name">Mastercard</span>
                    </div>
                  </td>
                  <td className="text-center value-cell">2,76%</td>
                  <td className="text-center value-cell">3,12%</td>
                  <td className="text-center value-cell">3,38%</td>
                </tr>
                <tr>
                  <td>
                    <div className="brand-logo">
                      <span className="visa-text">VISA</span>
                    </div>
                  </td>
                  <td className="text-center value-cell">2,76%</td>
                  <td className="text-center value-cell">3,12%</td>
                  <td className="text-center value-cell">3,38%</td>
                </tr>
                <tr>
                  <td>
                    <div className="brand-logo">
                      <span className="elo-text">elo</span>
                    </div>
                  </td>
                  <td className="text-center value-cell">2,76%</td>
                  <td className="text-center value-cell">3,12%</td>
                  <td className="text-center value-cell">3,38%</td>
                </tr>
                <tr>
                  <td>
                    <div className="brand-logo">
                      <span className="amex-text">AMERICAN EXPRESS</span>
                    </div>
                  </td>
                  <td className="text-center value-cell">2,76%</td>
                  <td className="text-center value-cell">3,12%</td>
                  <td className="text-center value-cell">3,38%</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        {/* Módulo de Outras Taxas e Custos */}
        <div className="settings-panel card glass-panel">
          <div className="panel-header" style={{ marginBottom: '1.5rem' }}>
            <div className="header-title">
              <BadgePercent size={20} className="panel-icon text-primary" />
              <h2>Outros Custos e Antecipações</h2>
            </div>
          </div>

          <div className="fees-grid">
            {/* PIX */}
            <div className="fee-card">
              <div className="fee-icon-box"><Zap size={20} className="text-primary" /></div>
              <div className="fee-info">
                <span className="fee-label">Pix</span>
                <span className="fee-value">0,98%</span>
              </div>
            </div>

            {/* Boleto */}
            <div className="fee-card">
              <div className="fee-icon-box"><Receipt size={20} className="text-primary" /></div>
              <div className="fee-info">
                <span className="fee-label">Boleto</span>
                <span className="fee-value">R$ 3,19</span>
              </div>
            </div>

            {/* Gateway */}
            <div className="fee-card">
              <div className="fee-icon-box"><ArrowDownToLine size={20} className="text-primary" /></div>
              <div className="fee-info">
                <span className="fee-label">Gateway</span>
                <span className="fee-value">R$ 0,40</span>
              </div>
            </div>

            {/* Antifraude */}
            <div className="fee-card">
              <div className="fee-icon-box"><Shield size={20} className="text-primary" /></div>
              <div className="fee-info">
                <span className="fee-label">Antifraude</span>
                <span className="fee-value">R$ 0,40</span>
              </div>
            </div>

            {/* Taxa de Saque */}
            <div className="fee-card">
              <div className="fee-icon-box"><Wallet size={20} className="text-primary" /></div>
              <div className="fee-info">
                <span className="fee-label">Taxa de Saque</span>
                <span className="fee-value">R$ 3,67</span>
              </div>
            </div>

            {/* Antecipação Automática */}
            <div className="fee-card">
              <div className="fee-icon-box"><ArrowUpRight size={20} className="text-success" /></div>
              <div className="fee-info">
                <span className="fee-label">Antecipação Automática</span>
                <span className="fee-value text-success">1,60%</span>
              </div>
            </div>

            {/* Antecipação Pontual */}
            <div className="fee-card">
              <div className="fee-icon-box"><ArrowUpRight size={20} style={{ color: 'var(--text-muted)' }} /></div>
              <div className="fee-info">
                <span className="fee-label">Antecipação Pontual</span>
                <span className="fee-value text-muted">N/A</span>
              </div>
            </div>
          </div>
          
          <div className="terms-disclaimer">
            <p>* A antecipação pontual só pode ser habilitada mediante solicitação do cliente.</p>
            <p>** Esta Proposta Comercial é confidencial e de caráter sigiloso. A divulgação para terceiros sem autorização prévia é considerada violação.</p>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
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

        .text-primary {
          color: var(--primary);
        }

        .text-success {
          color: var(--success) !important;
        }

        .plan-badge {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(59, 130, 246, 0.15);
          border: 1px solid rgba(59, 130, 246, 0.3);
          padding: 0.6rem 1rem;
          border-radius: 20px;
          color: var(--primary);
          font-weight: 600;
          font-size: 0.95rem;
        }

        .settings-panel {
          padding: 2rem;
          display: flex;
          flex-direction: column;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .header-title h2 {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .release-term {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          background: rgba(0,0,0,0.2);
          padding: 0.4rem 0.8rem;
          border-radius: 6px;
        }

        .release-term strong {
          color: var(--text-main);
        }

        /* Tabela Moderna */
        .table-responsive {
          width: 100%;
          overflow-x: auto;
        }

        .modern-table {
          width: 100%;
          border-collapse: collapse;
        }

        .modern-table th {
          text-align: left;
          padding: 1rem;
          color: var(--text-muted);
          font-weight: 500;
          font-size: 0.9rem;
          border-bottom: 1px solid var(--border);
          background: rgba(0, 0, 0, 0.1);
        }

        .modern-table th.text-center, .modern-table td.text-center {
          text-align: center;
        }

        .modern-table td {
          padding: 1.25rem 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .modern-table tbody tr:last-child td {
          border-bottom: none;
        }

        .modern-table tbody tr:hover td {
          background: rgba(255, 255, 255, 0.02);
        }

        .value-cell {
          font-weight: 600;
          font-size: 1.05rem;
          color: var(--text-main);
        }

        /* Marcas */
        .brand-logo {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          font-weight: 600;
          font-size: 1rem;
        }

        .circle-mc-red {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #eb001b;
          margin-right: -8px;
          z-index: 2;
        }

        .circle-mc-yellow {
          width: 16px;
          height: 16px;
          border-radius: 50%;
          background: #f79e1b;
          z-index: 1;
        }

        .brand-name {
          margin-left: 0.5rem;
        }

        .visa-text {
          color: #1434CB;
          font-style: italic;
          font-weight: 800;
          font-size: 1.2rem;
          text-shadow: 0px 0px 1px rgba(255,255,255,0.8);
        }

        .elo-text {
          font-weight: 700;
          font-size: 1.2rem;
          background: linear-gradient(to right, #00A4E0, #F36E21, #FFC107);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
        }

        .amex-text {
          color: #006FCF;
          font-weight: 700;
          font-size: 0.9rem;
          text-shadow: 0px 0px 1px rgba(255,255,255,0.8);
          max-width: 80px;
          line-height: 1.1;
        }

        /* Grid de Taxas Menores */
        .fees-grid {
          display: grid;
          grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .fee-card {
          display: flex;
          align-items: center;
          gap: 1rem;
          padding: 1.25rem;
          background: rgba(30, 41, 59, 0.3);
          border: 1px solid var(--border);
          border-radius: 12px;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .fee-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .fee-icon-box {
          width: 40px;
          height: 40px;
          border-radius: 10px;
          background: rgba(0,0,0,0.2);
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .fee-info {
          display: flex;
          flex-direction: column;
        }

        .fee-label {
          font-size: 0.85rem;
          color: var(--text-muted);
          margin-bottom: 0.2rem;
        }

        .fee-value {
          font-weight: 700;
          font-size: 1.1rem;
          color: var(--text-main);
        }

        /* Disclaimer */
        .terms-disclaimer {
          margin-top: 1rem;
          padding-top: 1.5rem;
          border-top: 1px dashed var(--border);
        }

        .terms-disclaimer p {
          font-size: 0.75rem;
          color: var(--text-muted);
          margin-bottom: 0.4rem;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .panel-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
