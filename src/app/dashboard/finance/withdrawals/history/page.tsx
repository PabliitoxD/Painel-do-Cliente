"use client";

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  History, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Download,
  Calendar
} from 'lucide-react';

/**
 * Dados de exemplo para o histórico de saques.
 */
const WITHDRAWAL_HISTORY = [
  { id: 1, date: '24/04/2026 09:00', bank: 'Banco do Brasil', amount: 2500.00, status: 'processado', method: 'PIX' },
  { id: 2, date: '20/04/2026 14:20', bank: 'Nubank', amount: 1200.50, status: 'processado', method: 'TED' },
  { id: 3, date: '15/04/2026 11:10', bank: 'Itaú', amount: 5000.00, status: 'recusado', method: 'PIX', reason: 'Dados bancários incorretos' },
  { id: 4, date: '10/04/2026 16:45', bank: 'Santander', amount: 800.00, status: 'processado', method: 'PIX' },
];

/**
 * Página de Histórico de Saques.
 * Permite visualizar todos os resgates solicitados e seus comprovantes.
 */
export default function WithdrawalHistoryPage() {
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
                <th>Instituição</th>
                <th>Método</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Comprovante</th>
              </tr>
            </thead>
            <tbody>
              {WITHDRAWAL_HISTORY.map((item) => (
                <tr key={item.id}>
                  {/* Data e Hora da transação */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <History size={16} className="text-muted" />
                      {item.date}
                    </div>
                  </td>
                  {/* Banco de destino */}
                  <td>{item.bank}</td>
                  {/* Método de transferência (Badge) */}
                  <td>
                    <span style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem', background: 'var(--surface-hover)', borderRadius: '4px' }}>
                      {item.method}
                    </span>
                  </td>
                  {/* Valor bruto do saque */}
                  <td style={{ fontWeight: 600 }}>
                    {item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  {/* Status do saque com ícone e pill colorida */}
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
                    {/* Exibe o motivo em caso de recusa */}
                    {item.reason && <p style={{ fontSize: '0.7rem', color: 'var(--danger)', marginTop: '0.25rem' }}>{item.reason}</p>}
                  </td>
                  {/* Ação para baixar/ver comprovante se disponível */}
                  <td>
                    {item.status === 'processado' && (
                      <button className="btn-ghost" style={{ fontSize: '0.75rem' }}>Ver PDF</button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
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
      `}</style>
    </DashboardLayout>
  );
}
