"use client";

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Webhook, Plus, Trash2, Edit2, Zap, Activity, CheckCircle2, Clock, X } from 'lucide-react';
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
  
  const [webhookUrl, setWebhookUrl] = useState('');
  const [isTestingUrl, setIsTestingUrl] = useState(false);
  const [urlTestStatus, setUrlTestStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [selectAllEvents, setSelectAllEvents] = useState(false);

  const testWebhookUrl = async (url: string) => {
    if (!url) {
      setUrlTestStatus('idle');
      return;
    }
    setIsTestingUrl(true);
    setUrlTestStatus('idle');
    try {
      // Simulando requisição de teste de integração
      await new Promise(r => setTimeout(r, 1500));
      if (url.includes('http')) {
        setUrlTestStatus('success');
      } else {
        setUrlTestStatus('error');
      }
    } catch (e) {
      setUrlTestStatus('error');
    } finally {
      setIsTestingUrl(false);
    }
  };

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

      {/* Modal Nova Webhook */}
      {isModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel animate-fade-in" style={{ background: 'var(--background)', padding: 0, borderRadius: '12px', maxWidth: '600px', width: '100%', maxHeight: '90vh', display: 'flex', flexDirection: 'column', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            
            <div style={{ padding: '1.5rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h2 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Nova webhook</h2>
              <button onClick={() => setIsModalOpen(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
                <X size={24} />
              </button>
            </div>

            <div style={{ padding: '1.5rem', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
              
              <div className="form-group">
                <label className="modal-label">Identificador</label>
                <input type="text" placeholder="Digite o identificador da configuração" className="modal-input" />
              </div>

              <div className="form-group">
                <label className="modal-label">Produto</label>
                <select className="modal-select">
                  <option>Todos os produtos (somente próprios)</option>
                </select>
              </div>

              <div className="form-group">
                <label className="modal-label">URL para envio dos dados</label>
                <div style={{ position: 'relative' }}>
                  <input 
                    type="url" 
                    placeholder="Digite a URL" 
                    className="modal-input" 
                    value={webhookUrl}
                    onChange={(e) => setWebhookUrl(e.target.value)}
                    onBlur={(e) => testWebhookUrl(e.target.value)}
                  />
                  {isTestingUrl && <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: 'var(--primary)' }}><Activity size={18} className="spin" /></div>}
                  {urlTestStatus === 'success' && <div style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)', color: '#00c1b4' }}><CheckCircle2 size={18} /></div>}
                </div>
                {urlTestStatus === 'success' && <span style={{ fontSize: '0.85rem', color: '#00c1b4', marginTop: '0.5rem', display: 'block' }}>Integração verificada com sucesso!</span>}
                {urlTestStatus === 'error' && <span style={{ fontSize: '0.85rem', color: 'var(--danger)', marginTop: '0.5rem', display: 'block' }}>Falha ao verificar integração. Verifique a URL.</span>}
              </div>

              <div className="form-group">
                <label className="modal-label">Versão</label>
                <select className="modal-select">
                  <option>4.0</option>
                  <option>3.0</option>
                </select>
              </div>

              <div className="form-group" style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                <label className="toggle-switch">
                  <input type="checkbox" defaultChecked />
                  <span className="slider"></span>
                </label>
                <span style={{ fontSize: '0.95rem' }}>Ativa</span>
              </div>

              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '0.5rem 0' }} />

              <div className="form-group">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                  <label className="modal-label" style={{ marginBottom: 0 }}>Eventos acionadores</label>
                  <button onClick={() => setSelectAllEvents(!selectAllEvents)} style={{ background: 'none', border: 'none', color: '#00c1b4', cursor: 'pointer', fontSize: '0.85rem' }}>
                    ({selectAllEvents ? 'desmarcar todos' : 'marcar todos'})
                  </button>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem' }}>
                  {[
                    'Abandono de checkout', 'Em período de testes', 'Aguardando pagamento', 
                    'Venda cancelada', 'Venda não concluída', 'Venda em análise', 
                    'Venda aprovada', 'Venda completada (após a garantia)', 'Venda estornada', 
                    'Venda reembolsada', 'Venda em disputa', 'Chargeback'
                  ].map((event, idx) => {
                    const isChecked = selectAllEvents;
                    return (
                      <div key={event} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <label className="toggle-switch">
                          <input type="checkbox" checked={isChecked ? true : undefined} readOnly={selectAllEvents} />
                          <span className="slider"></span>
                        </label>
                        <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>{event}</span>
                      </div>
                    );
                  })}
                </div>
              </div>

            </div>

            <div style={{ padding: '1.5rem', borderTop: '1px solid var(--border)', display: 'flex', justifyContent: 'flex-end', gap: '1rem', background: 'var(--surface)', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
              <button className="btn-ghost" onClick={() => setIsModalOpen(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', border: '1px solid var(--border)', fontWeight: 600 }}>
                Cancelar
              </button>
              <button className="btn-primary" onClick={() => setIsModalOpen(false)} style={{ padding: '0.75rem 1.5rem', borderRadius: '8px', background: '#00c1b4', border: 'none', color: 'white', fontWeight: 600 }}>
                Salvar
              </button>
            </div>
          </div>
        </div>
      )}

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
