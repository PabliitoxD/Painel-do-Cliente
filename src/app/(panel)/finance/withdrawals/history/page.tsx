"use client";

import { useState } from 'react';

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  History, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Download,
  Calendar,
  Eye,
  X
} from 'lucide-react';

/**
 * Dados de exemplo para o histórico de saques.
 */
const WITHDRAWAL_HISTORY = [
  { id: 1, date: '24/04/2026 09:00', amount: 2500.00, taxFee: 3.67, status: 'processado', reason: '' },
  { id: 2, date: '20/04/2026 14:20', amount: 1200.50, taxFee: 3.67, status: 'processado', reason: '' },
  { id: 3, date: '15/04/2026 11:10', amount: 5000.00, taxFee: 3.67, status: 'recusado', reason: 'Dados bancários incorretos ou chave PIX inválida' },
  { id: 4, date: '10/04/2026 16:45', amount: 800.00, taxFee: 3.67, status: 'processado', reason: '' },
];

/**
 * Página de Histórico de Saques.
 * Permite visualizar todos os resgates solicitados e seus comprovantes.
 */
export default function WithdrawalHistoryPage() {
  const [selectedDetails, setSelectedDetails] = useState<any>(null);

  return (
    <DashboardLayout>
      <div className="history-page animate-fade-in">
        <div className="page-header">
          <div>
            <h1>Histórico de Saques</h1>
            <p className="text-muted">Consulte todos os seus resgates realizados</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-ghost">
              <Calendar size={18} /> Filtrar Data
            </button>
            <button className="btn-primary">
              <Download size={18} /> Exportar Relatório
            </button>
          </div>
        </div>

        {/* Tabela de Registros de Saque */}
        <div className="table-card">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Data / Hora</th>
                <th>Valor Solicitado</th>
                <th>Taxa do Saque</th>
                <th>Valor a Receber</th>
                <th>Status</th>
                <th>Comprovante</th>
                <th>Detalhes</th>
              </tr>
            </thead>
            <tbody>
              {WITHDRAWAL_HISTORY.map((item) => {
                const valorAReceber = item.amount - item.taxFee;
                return (
                  <tr key={item.id}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <History size={16} className="text-muted" />
                        {item.date}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>
                      {item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td style={{ color: 'var(--danger)' }}>
                      - {item.taxFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td style={{ fontWeight: 600, color: 'var(--success)' }}>
                      {valorAReceber.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        {item.status === 'processado' ? (
                          <CheckCircle2 size={16} style={{ color: 'var(--success)' }} />
                        ) : (
                          <XCircle size={16} style={{ color: 'var(--danger)' }} />
                        )}
                        <span className={`status-pill ${item.status === 'processado' ? 'aprovada' : 'recusada'}`}>
                          {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                        </span>
                      </div>
                    </td>
                    <td>
                      {item.status === 'processado' ? (
                        <button className="btn-ghost" style={{ fontSize: '0.75rem', padding: '0.4rem 0.8rem' }}>Ver PDF</button>
                      ) : (
                        <span className="text-muted" style={{ fontSize: '0.8rem' }}>-</span>
                      )}
                    </td>
                    <td>
                      <button 
                        className="btn-ghost" 
                        onClick={() => setSelectedDetails(item)}
                        style={{ padding: '0.4rem', borderRadius: '8px' }}
                        title="Ver Detalhes"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Modal de Detalhes */}
      {selectedDetails && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel animate-fade-in" style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', maxWidth: '450px', width: '100%', position: 'relative', border: '1px solid var(--border)' }}>
            <button 
              onClick={() => setSelectedDetails(null)} 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Detalhes da Solicitação</h2>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <span className="text-muted">Data/Hora da Solicitação</span>
                <strong>{selectedDetails.date}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <span className="text-muted">Valor Solicitado</span>
                <strong>{selectedDetails.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <span className="text-muted">Taxa do Saque</span>
                <strong style={{ color: 'var(--danger)' }}>- {selectedDetails.taxFee.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <span className="text-muted">Valor a Receber Líquido</span>
                <strong style={{ color: 'var(--success)' }}>{(selectedDetails.amount - selectedDetails.taxFee).toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <span className="text-muted">Método de Envio</span>
                <strong>PIX (Conta Cadastrada)</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <span className="text-muted">Status</span>
                <strong style={{ color: selectedDetails.status === 'processado' ? 'var(--success)' : 'var(--danger)', textTransform: 'capitalize' }}>
                  {selectedDetails.status}
                </strong>
              </div>
              
              {selectedDetails.status === 'recusado' && selectedDetails.reason && (
                <div style={{ background: 'rgba(203, 86, 86, 0.1)', border: '1px solid rgba(203, 86, 86, 0.3)', padding: '1rem', borderRadius: '8px', marginTop: '0.5rem' }}>
                  <span style={{ color: 'var(--danger)', fontWeight: 600, display: 'block', marginBottom: '0.25rem', fontSize: '0.85rem' }}>Motivo da Recusa:</span>
                  <p style={{ color: 'var(--danger)', fontSize: '0.85rem', lineHeight: 1.5 }}>{selectedDetails.reason}</p>
                </div>
              )}
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
          font-size: 0.9rem;
        }
        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .page-header > div:last-child {
            width: 100%;
            flex-direction: column;
          }
          .page-header button {
            width: 100%;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
