"use client";

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Webhook, Plus, Trash2, Edit2, Zap, Activity, CheckCircle2, Clock } from 'lucide-react';
import { useState } from 'react';

const INITIAL_WEBHOOKS = [
  {
    id: 'wh_1a2b3c4d',
    name: 'Planilha de Vendas (Make/Integromat)',
    url: 'https://hook.us1.make.com/xxxxxxxxxxx',
    events: ['Venda Aprovada', 'Pix Gerado'],
    status: 'active',
    lastFired: 'Há 5 minutos'
  },
  {
    id: 'wh_5e6f7g8h',
    name: 'ERP Bling - Sincronização',
    url: 'https://api.bling.com.br/webhook/tronnus',
    events: ['Venda Aprovada', 'Estorno'],
    status: 'active',
    lastFired: 'Há 2 horas'
  },
  {
    id: 'wh_9i0j1k2l',
    name: 'Alerta de Chargeback (Slack)',
    url: 'https://hooks.slack.com/services/xxxxx',
    events: ['Chargeback', 'Disputa'],
    status: 'inactive',
    lastFired: 'Há 3 dias'
  }
];

export default function WebhooksPage() {
  const [webhooks, setWebhooks] = useState(INITIAL_WEBHOOKS);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <DashboardLayout>
      <div className="webhooks-page animate-fade-in">
        <div className="page-header">
          <div>
            <h1>Webhooks</h1>
            <p className="text-muted">Integre com plataformas externas e automatize seus processos</p>
          </div>
          <button className="btn-primary" onClick={() => setIsModalOpen(true)}>
            <Plus size={18} /> Novo Webhook
          </button>
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

        {/* Lista de Webhooks */}
        <div className="webhooks-list">
          {webhooks.map((hook) => (
            <div key={hook.id} className="webhook-card card glass-panel">
              <div className="hook-header">
                <div className="hook-title">
                  <Webhook size={20} className={hook.status === 'active' ? 'text-primary' : 'text-muted'} />
                  <h3>{hook.name}</h3>
                  <span className={`status-pill ${hook.status === 'active' ? 'active' : 'inactive'}`}>
                    {hook.status === 'active' ? 'Ativo' : 'Inativo'}
                  </span>
                </div>
                <div className="hook-actions">
                  <button className="btn-icon" title="Editar"><Edit2 size={16} /></button>
                  <button className="btn-icon text-danger" title="Excluir"><Trash2 size={16} /></button>
                </div>
              </div>
              
              <div className="hook-url">
                <span className="url-label">Endpoint URL</span>
                <div className="url-box">{hook.url}</div>
              </div>

              <div className="hook-footer">
                <div className="events-list">
                  <span className="events-label">Eventos:</span>
                  {hook.events.map(ev => (
                    <span key={ev} className="event-tag">{ev}</span>
                  ))}
                </div>
                <div className="last-fired">
                  <Activity size={14} /> Último envio: <strong>{hook.lastFired}</strong>
                </div>
              </div>
            </div>
          ))}
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
