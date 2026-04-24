"use client";

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Calendar, 
  Unlock, 
  Lock, 
  Clock,
  TrendingUp,
  AlertTriangle,
  ChevronRight
} from 'lucide-react';

/**
 * Página de Recebíveis.
 * Fornece uma visão detalhada do fluxo de caixa futuro e liquidez atual.
 */
export default function ReceivablesPage() {
  return (
    <DashboardLayout>
      <div className="receivables-page animate-fade-in">
        {/* Cabeçalho com ação de antecipação */}
        <div className="page-header">
          <div>
            <h1>Recebíveis</h1>
            <p className="text-muted">Gestão de valores futuros e liquidez</p>
          </div>
          <button className="btn-ghost">
            <Calendar size={18} /> Antecipar Valores
          </button>
        </div>

        {/* Estatísticas Principais (Valor Total, Liberado, Aguardando, Bloqueado) */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '2rem' }}>
          {/* Card: Valor Total Bruto */}
          <div className="stat-card" style={{ borderBottom: '3px solid var(--primary)' }}>
            <div className="stat-top">
              <span className="stat-title">Valor Total</span>
              <TrendingUp size={18} className="text-muted" />
            </div>
            <div className="stat-value" style={{ fontSize: '2rem' }}>R$ 45.230,00</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.5rem' }}>Soma de todos os valores</p>
          </div>

          {/* Card: Valor Liberado (Pronto para Saque) */}
          <div className="stat-card" style={{ borderBottom: '3px solid var(--success)' }}>
            <div className="stat-top">
              <span className="stat-title">Valor Liberado</span>
              <Unlock size={18} style={{ color: 'var(--success)' }} />
            </div>
            <div className="stat-value" style={{ fontSize: '2rem' }}>R$ 18.500,00</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--success)', marginTop: '0.5rem' }}>Disponível para saque imediato</p>
          </div>

          {/* Card: Valor Aguardando Liberação (Processamento Bancário/D+30) */}
          <div className="stat-card" style={{ borderBottom: '3px solid var(--warning)' }}>
            <div className="stat-top">
              <span className="stat-title">Aguardando Liberação</span>
              <Clock size={18} style={{ color: 'var(--warning)' }} />
            </div>
            <div className="stat-value" style={{ fontSize: '2rem' }}>R$ 24.730,00</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--warning)', marginTop: '0.5rem' }}>Em processamento (D+30)</p>
          </div>

          {/* Card: Valor Bloqueado (Segurança/Chargeback) */}
          <div className="stat-card" style={{ borderBottom: '3px solid var(--danger)' }}>
            <div className="stat-top">
              <span className="stat-title">Valor Bloqueado</span>
              <Lock size={18} style={{ color: 'var(--danger)' }} />
            </div>
            <div className="stat-value" style={{ fontSize: '2rem' }}>R$ 2.000,00</div>
            <p style={{ fontSize: '0.75rem', color: 'var(--danger)', marginTop: '0.5rem' }}>Retenção de segurança / Chargeback</p>
          </div>
        </div>

        <div className="bottom-grid" style={{ gridTemplateColumns: '1.5fr 1fr' }}>
          {/* Lista de Agenda de Recebimentos por dia */}
          <div className="table-card">
            <h3 style={{ fontSize: '1.1rem', marginBottom: '1.5rem', fontWeight: 600 }}>Agenda de Recebimentos</h3>
            <div className="agenda-list">
              {[
                { date: 'Amanhã, 25 Abr', amount: 1250.00, count: 12, status: 'confirmado' },
                { date: 'Segunda, 27 Abr', amount: 3420.50, count: 24, status: 'confirmado' },
                { date: 'Terça, 28 Abr', amount: 980.00, count: 8, status: 'pendente' },
                { date: 'Quarta, 29 Abr', amount: 2100.00, count: 15, status: 'pendente' },
              ].map((day, i) => (
                <div key={i} className="agenda-item" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1.25rem',
                  borderBottom: i === 3 ? 'none' : '1px solid var(--border)',
                  transition: 'background 0.2s',
                  cursor: 'pointer'
                }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '0.95rem', marginBottom: '0.2rem' }}>{day.date}</p>
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{day.count} vendas processadas</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700, fontSize: '1.1rem', color: 'var(--text-main)' }}>
                      {day.amount.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                    </p>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      textTransform: 'uppercase', 
                      color: day.status === 'confirmado' ? 'var(--success)' : 'var(--warning)',
                      fontWeight: 700
                    }}>
                      {day.status}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Banner de Antecipação (Upsell/Liquidez) */}
          <div className="card" style={{ height: 'fit-content', background: 'linear-gradient(135deg, var(--surface) 0%, #1a2932 100%)' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem' }}>
              <AlertTriangle size={24} style={{ color: 'var(--warning)' }} />
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Dica de Liquidez</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: 1.6, marginBottom: '1.5rem' }}>
              Você possui <strong>R$ 24.730,00</strong> aguardando liberação. Se precisar de fluxo de caixa imediato, você pode antecipar até 80% desse valor com taxas reduzidas.
            </p>
            <button className="btn-primary" style={{ width: '100%', justifyContent: 'space-between' }}>
              Simular Antecipação <ChevronRight size={18} />
            </button>
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
        .agenda-item:hover {
          background: var(--surface-hover);
        }
      `}</style>
    </DashboardLayout>
  );
}
