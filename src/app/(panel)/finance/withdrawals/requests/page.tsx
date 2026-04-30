"use client";

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Wallet, 
  ArrowUpCircle, 
  Info,
  AlertCircle,
  Clock
} from 'lucide-react';

const PENDING_REQUESTS = [
  { id: 1, date: '24/04/2026 15:10', bank: 'Nubank', amount: 450.00, status: 'pendente' },
];

export default function WithdrawalRequestsPage() {
  return (
    <DashboardLayout>
      <div className="requests-page animate-fade-in">
        <div className="page-header">
          <div>
            <h1>Solicitações de Saque</h1>
            <p className="text-muted">Gerencie seus pedidos de resgate em aberto</p>
          </div>
        </div>

        <div className="stats-grid" style={{ gridTemplateColumns: '1fr 2fr', gap: '2rem', marginBottom: '2rem' }}>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, var(--surface) 0%, #1a2932 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="stat-title">Disponível para Saque</span>
              <div className="stat-value" style={{ fontSize: '2.5rem' }}>R$ 8.432,10</div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <Info size={14} /> Mínimo: R$ 50,00
              </div>
              <button className="btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                <ArrowUpCircle size={16} /> Novo Saque
              </button>
            </div>
          </div>
          
          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255, 177, 86, 0.05)', borderColor: 'rgba(255, 177, 86, 0.2)' }}>
            <div style={{ width: '50px', height: '50px', borderRadius: '50%', background: 'rgba(255, 177, 86, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)' }}>
              <AlertCircle size={24} />
            </div>
            <div>
              <h3 style={{ fontSize: '1rem', marginBottom: '0.25rem' }}>Informação Importante</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', maxWidth: '500px' }}>
                Os saques via PIX são processados em até 2 horas. Para TED, o prazo é de até 1 dia útil, respeitando o horário bancário.
              </p>
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>Solicitações Pendentes</h2>
        <div className="table-card">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Data da Solicitação</th>
                <th>Instituição Destino</th>
                <th>Valor Solicitado</th>
                <th>Status</th>
                <th>Previsão</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {PENDING_REQUESTS.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Clock size={16} className="text-muted" />
                      {item.date}
                    </div>
                  </td>
                  <td>{item.bank}</td>
                  <td style={{ fontWeight: 600 }}>
                    {item.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td>
                    <span className="status-pill aguardando">
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td className="text-muted">Hoje até 17:30</td>
                  <td>
                    <button className="btn-ghost" style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>Cancelar</button>
                  </td>
                </tr>
              ))}
              {PENDING_REQUESTS.length === 0 && (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Nenhuma solicitação pendente no momento.
                  </td>
                </tr>
              )}
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
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
            gap: 1rem !important;
          }
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .page-header button {
            width: 100%;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
