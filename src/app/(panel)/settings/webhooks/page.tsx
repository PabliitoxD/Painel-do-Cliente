"use client";

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Webhook, Plus, Trash2, Edit2, Zap, Activity, CheckCircle2, Clock, X } from 'lucide-react';
import { useState } from 'react';

const WEBHOOK_CATEGORIES = [
  { id: 'transactions', name: 'Transações' },
  { id: 'withdrawals', name: 'Saques' },
  { id: 'account', name: 'Conta' },
  { id: 'subscriptions', name: 'Assinaturas' },
  { id: 'invoices', name: 'Faturas' },
];

export default function WebhooksPage() {
  const [webhookUrls, setWebhookUrls] = useState<Record<string, string>>(
    Object.fromEntries(WEBHOOK_CATEGORIES.map(c => [c.id, '']))
  );

  return (
    <DashboardLayout>
      <div className="webhooks-page animate-fade-in">
        <div className="page-header">
          <div>
            <h1>Webhooks</h1>
            <p className="text-muted">Integre com plataformas externas e automatize seus processos</p>
          </div>
          {/* <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Novo Webhook
          </button> */}
        </div>

        {/* Banner Informativo */}
        <div className="info-banner card glass-panel" style={{ marginBottom: '2rem', padding: '1.5rem', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
          <div className="icon-box" style={{ background: 'rgba(59, 130, 246, 0.2)', padding: '1rem', borderRadius: '12px', color: 'var(--primary)' }}>
            <Zap size={24} />
          </div>
          <div>
            <h3 style={{ marginBottom: '0.5rem', fontSize: '1.1rem' }}>Crie automações poderosas</h3>
            <p className="text-muted" style={{ lineHeight: '1.5' }}>
              Utilize Webhooks para enviar dados em tempo real para ferramentas como <strong>Make (Integromat)</strong>, <strong>Zapier</strong>, ou diretamente para seu <strong>ERP</strong> e sistemas de <strong>BI</strong>. Você pode configurar alertas para vendas, chargebacks, e muito mais.
            </p>
          </div>
        </div>

        {/* Lista de Webhooks por Categoria */}
        <div className="webhooks-list">
          {WEBHOOK_CATEGORIES.map((cat) => (
            <div key={cat.id} className="webhook-card card glass-panel">
              <div className="hook-header">
                <div className="hook-title">
                  <Webhook size={20} className="text-primary" />
                  <h3>{cat.name}</h3>
                </div>
              </div>

              <div className="hook-url">
                <span className="url-label">URL do Webhook</span>
                <input
                  type="url"
                  placeholder="https://sua-url.com/webhook"
                  value={webhookUrls[cat.id]}
                  onChange={(e) => setWebhookUrls({ ...webhookUrls, [cat.id]: e.target.value })}
                  style={{
                    width: '100%',
                    background: 'rgba(0,0,0,0.2)',
                    padding: '0.75rem 1rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    fontFamily: 'monospace',
                    color: 'var(--text-main)',
                    fontSize: '0.9rem',
                    outline: 'none',
                  }}
                />
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modal Nova Webhook */}
      {/* Modal removido */}

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
        }

        .text-primary {
          color: var(--primary);
        }

        .text-danger {
          color: var(--danger);
        }

        .webhooks-list {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
        }

        .webhook-card {
          padding: 1.5rem;
          transition: transform 0.2s, box-shadow 0.2s;
        }

        .webhook-card:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(0,0,0,0.2);
          border-color: rgba(59, 130, 246, 0.3);
        }

        .hook-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .hook-title {
          display: flex;
          align-items: center;
          gap: 1rem;
        }

        .hook-title h3 {
          font-size: 1.15rem;
          font-weight: 600;
        }

        .status-pill {
          padding: 0.25rem 0.6rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-pill.active {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .status-pill.inactive {
          background: rgba(148, 163, 184, 0.15);
          color: #94a3b8;
          border: 1px solid rgba(148, 163, 184, 0.3);
        }

        .btn-icon {
          background: transparent;
          border: none;
          color: var(--text-muted);
          padding: 0.5rem;
          border-radius: 8px;
          cursor: pointer;
          transition: all 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-icon:hover {
          background: rgba(255,255,255,0.05);
          color: var(--text-main);
        }

        .btn-icon.text-danger:hover {
          color: var(--danger);
          background: rgba(239, 68, 68, 0.1);
        }

        .hook-url {
          margin-bottom: 1.25rem;
        }

        .url-label {
          display: block;
          font-size: 0.8rem;
          color: var(--text-muted);
          margin-bottom: 0.4rem;
        }

        .url-box {
          background: rgba(0,0,0,0.2);
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid var(--border);
          font-family: monospace;
          color: var(--text-main);
          font-size: 0.9rem;
          word-break: break-all;
        }

        .hook-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding-top: 1rem;
          border-top: 1px dashed var(--border);
        }

        .events-list {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .events-label {
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .event-tag {
          background: rgba(255,255,255,0.05);
          border: 1px solid var(--border);
          padding: 0.2rem 0.6rem;
          border-radius: 4px;
          font-size: 0.8rem;
          color: var(--text-main);
        }

        .last-fired {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          font-size: 0.85rem;
          color: var(--text-muted);
        }

        .last-fired strong {
          color: var(--text-main);
        }

        /* Modal Styles */
        .modal-label {
          display: block;
          font-weight: 600;
          margin-bottom: 0.5rem;
          color: var(--text-main);
          font-size: 0.9rem;
        }
        
        .modal-input, .modal-select {
          width: 100%;
          padding: 0.75rem 1rem;
          border-radius: 8px;
          border: 1px solid var(--border);
          background: var(--surface);
          color: var(--text-main);
          font-size: 0.95rem;
          transition: border-color 0.2s;
        }

        .modal-input:focus, .modal-select:focus {
          outline: none;
          border-color: #00c1b4;
        }

        /* Toggle Switch Styles */
        .toggle-switch {
          position: relative;
          display: inline-block;
          width: 44px;
          height: 24px;
        }

        .toggle-switch input {
          opacity: 0;
          width: 0;
          height: 0;
        }

        .slider {
          position: absolute;
          cursor: pointer;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-color: var(--surface-hover);
          transition: .4s;
          border-radius: 24px;
          border: 1px solid var(--border);
        }

        .slider:before {
          position: absolute;
          content: "";
          height: 18px;
          width: 18px;
          left: 2px;
          bottom: 2px;
          background-color: white;
          transition: .4s;
          border-radius: 50%;
        }

        input:checked + .slider {
          background-color: #00c1b4;
          border-color: #00c1b4;
        }

        input:focus + .slider {
          box-shadow: 0 0 1px #00c1b4;
        }

        input:checked + .slider:before {
          transform: translateX(20px);
        }

        @keyframes spin {
          from { transform: rotate(0deg); }
          to { transform: rotate(360deg); }
        }
        
        :global(.spin) {
          animation: spin 1s linear infinite;
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .hook-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .hook-actions {
            align-self: flex-end;
            margin-top: -2rem;
          }

          .hook-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
