"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/services/api';
import { 
  Calendar, 
  Unlock, 
  Lock, 
  Clock,
  TrendingUp,
  AlertTriangle,
  ChevronRight,
  X 
} from 'lucide-react';
import { translateStatus, getStatusPillClass } from '@/utils/formatters';

/**
 * Página de Recebíveis.
 * Refinada para corresponder exatamente ao design premium solicitado.
 */
export default function ReceivablesPage() {
  const [summary, setSummary] = useState({
    total: 0,
    released: 0,
    waiting: 0,
    blocked: 0
  });

  const [schedules, setSchedules] = useState<any[]>([]);


  const [isLoading, setIsLoading] = useState(true);
  const [isSimulationOpen, setIsSimulationOpen] = useState(false);

  useEffect(() => {
    Promise.all([
      api.receivableSchedules.getSummary().catch(() => null),
      api.receivableSchedules.listSchedules().catch(() => null)
    ]).then(([summaryRes, schedulesRes]) => {
      // Trata o Resumo (Pode vir direto ou dentro de .data)
      const summaryData = summaryRes?.data || summaryRes;
      if (summaryData && typeof summaryData === 'object') {
        setSummary({
          total: summaryData.total ?? summaryData.amount ?? 0,
          released: summaryData.released ?? summaryData.available ?? summaryData.amount_released ?? 0,
          waiting: summaryData.waiting ?? summaryData.pending ?? summaryData.amount_waiting ?? 0,
          blocked: summaryData.blocked ?? summaryData.retained ?? summaryData.amount_blocked ?? 0
        });
      }

      // Trata a Agenda
      const schedulesData = schedulesRes?.data || schedulesRes || [];
      if (Array.isArray(schedulesData)) {
        setSchedules(schedulesData.map((s: any) => ({
          date: s.date || (s.scheduled_for ? new Date(s.scheduled_for).toLocaleDateString('pt-BR') : 'N/A'),
          amount: s.amount || s.value || 0,
          count: s.count || s.transactions_count || 1,
          status: s.status || 'PENDENTE'
        })));
      }
    }).catch(err => {
      console.error("Erro ao carregar dados de recebíveis:", err);
    }).finally(() => {
      setIsLoading(false);
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <DashboardLayout>
      <div className="receivables-page animate-fade-in">
        {/* Cabeçalho da Página */}
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Recebíveis</h1>
            <p className="text-muted" style={{ fontSize: '0.95rem' }}>Gestão de valores futuros e liquidez</p>
          </div>
          <button 
            className="btn-ghost" 
            onClick={() => setIsSimulationOpen(true)}
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.7rem 1.2rem', borderRadius: '12px' }}
          >
            <Calendar size={18} /> Antecipar Valores
          </button>
        </div>

        {/* Estatísticas Principais (Valor Total, Liberado, Aguardando, Bloqueado) */}
        <div className="stats-grid grid-2" style={{ marginBottom: '2.5rem' }}>
          {/* Card: Valor Total */}
          <div className="stat-card receivable-card card-blue">
            <div className="stat-top">
              <span className="stat-title">Valor Total</span>
              <TrendingUp size={24} className="stat-icon-dim" />
            </div>
            <div className="stat-value-large">{isLoading ? '...' : formatCurrency(summary.total)}</div>
            <p className="stat-desc">Soma de todos os valores</p>
            <div className="card-indicator"></div>
          </div>

          {/* Card: Valor Liberado */}
          <div className="stat-card receivable-card card-green">
            <div className="stat-top">
              <span className="stat-title">Valor Liberado</span>
              <Unlock size={24} className="stat-icon-dim" />
            </div>
            <div className="stat-value-large">{isLoading ? '...' : formatCurrency(summary.released)}</div>
            <p className="stat-desc" style={{ color: 'var(--success)', opacity: 0.8 }}>Disponível para saque imediato</p>
            <div className="card-indicator"></div>
          </div>

          {/* Card: Aguardando Liberação */}
          <div className="stat-card receivable-card card-yellow">
            <div className="stat-top">
              <span className="stat-title">Aguardando Liberação</span>
              <Clock size={24} className="stat-icon-dim" />
            </div>
            <div className="stat-value-large">{isLoading ? '...' : formatCurrency(summary.waiting)}</div>
            <p className="stat-desc" style={{ color: 'var(--warning)', opacity: 0.8 }}>Em processamento (D+30)</p>
            <div className="card-indicator"></div>
          </div>

          {/* Card: Valor Bloqueado */}
          <div className="stat-card receivable-card card-red">
            <div className="stat-top">
              <span className="stat-title">Valor Bloqueado</span>
              <Lock size={24} className="stat-icon-dim" />
            </div>
            <div className="stat-value-large">{isLoading ? '...' : formatCurrency(summary.blocked)}</div>
            <p className="stat-desc" style={{ color: 'var(--danger)', opacity: 0.8 }}>Retenção de segurança / Chargeback</p>
            <div className="card-indicator"></div>
          </div>
        </div>

        {/* Layout Inferior: Agenda e Dica */}
        <div className="bottom-grid">
          {/* Agenda de Recebimentos */}
          <div className="table-card" style={{ padding: '2rem' }}>
            <h3 style={{ fontSize: '1.2rem', marginBottom: '2rem', fontWeight: 600 }}>Agenda de Recebimentos</h3>
            <div className="agenda-list">
              {isLoading ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Carregando agenda...</div>
              ) : schedules.length === 0 ? (
                <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Nenhum recebível agendado.</div>
              ) : schedules.map((day, i) => (
                <div key={i} className="agenda-item" style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'center',
                  padding: '1.5rem 0',
                  borderBottom: i === 3 ? 'none' : '1px solid var(--border)',
                }}>
                  <div>
                    <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.3rem' }}>{day.date}</p>
                    <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>{day.count} vendas processadas</p>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <p style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                      R$ {day.amount.toLocaleString('pt-BR', { minimumFractionDigits: 2 })}
                    </p>
                    <span style={{ 
                      fontSize: '0.7rem', 
                      letterSpacing: '0.5px',
                      color: getStatusPillClass(day.status) === 'aprovada' ? 'var(--success)' : 'var(--warning)',
                      fontWeight: 800
                    }}>
                      {translateStatus(day.status)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Dica de Liquidez */}
          <div className="card tip-card" style={{ 
            height: 'fit-content', 
            background: 'linear-gradient(135deg, var(--surface) 0%, rgba(26, 41, 50, 0.5) 100%)',
            padding: '2rem',
            border: '1px solid var(--border)',
            position: 'relative'
          }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ color: 'var(--warning)' }}><AlertTriangle size={24} /></div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>Dica de Liquidez</h3>
            </div>
            <p style={{ fontSize: '0.9rem', color: 'var(--text-dim)', lineHeight: 1.7, marginBottom: '2rem' }}>
              Você possui <strong style={{ color: 'var(--text-main)' }}>{formatCurrency(summary.waiting)}</strong> aguardando liberação. Se precisar de fluxo de caixa imediato, você pode antecipar até 80% desse valor com taxas reduzidas.
            </p>
            <button 
              className="btn-simulation" 
              onClick={() => setIsSimulationOpen(true)}
              style={{ 
              width: '100%', 
              display: 'flex', 
              justifyContent: 'space-between', 
              alignItems: 'center',
              padding: '1rem 1.5rem',
              background: 'rgba(101, 131, 154, 0.15)',
              border: '1px solid rgba(101, 131, 154, 0.2)',
              borderRadius: '12px',
              color: 'var(--text-main)',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.2s'
            }}>
              Simular Antecipação <ChevronRight size={18} />
            </button>
          </div>
        </div>
      </div>

      {isSimulationOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel animate-fade-in" style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', maxWidth: '450px', width: '100%', position: 'relative', border: '1px solid var(--border)' }}>
            <button 
              onClick={() => setIsSimulationOpen(false)} 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Simulação de Antecipação</h2>
            
            <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Com base no seu plano atual, você pode antecipar os valores que estão aguardando liberação.
            </p>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem', background: 'rgba(0,0,0,0.2)', padding: '1.5rem', borderRadius: '12px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <span className="text-muted">Aguardando Liberação</span>
                <strong>{formatCurrency(summary.waiting)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <span className="text-muted">Disponível para antecipação (80%)</span>
                <strong style={{ color: 'var(--text-main)' }}>{formatCurrency(summary.waiting * 0.8)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <span className="text-muted">Taxa do Plano (Ex: 5%)</span>
                <strong style={{ color: 'var(--danger)' }}>- {formatCurrency(summary.waiting * 0.8 * 0.05)}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: '0.5rem' }}>
                <span style={{ fontWeight: 600 }}>Total Líquido a Receber</span>
                <strong style={{ color: 'var(--success)', fontSize: '1.3rem' }}>{formatCurrency(summary.waiting * 0.8 * 0.95)}</strong>
              </div>
            </div>
            
            <button className="btn-primary" style={{ width: '100%', padding: '1rem', fontWeight: 600 }} onClick={() => { alert('Solicitação de antecipação enviada para análise!'); setIsSimulationOpen(false); }}>
              Confirmar Antecipação
            </button>
          </div>
        </div>
      )}

      <style jsx>{`
        .receivable-card {
          padding: 2rem 1.5rem;
          min-height: 180px;
          justify-content: space-between;
          border-bottom: none;
        }
        .stat-icon-dim {
          color: var(--text-dim);
          opacity: 0.5;
        }
        .stat-value-large {
          font-size: 2.4rem;
          font-weight: 700;
          color: var(--text-main);
          margin: 0.5rem 0;
          letter-spacing: -1px;
        }
        .stat-desc {
          font-size: 0.8rem;
          color: var(--text-dim);
          margin: 0;
        }
        .card-indicator {
          display: none; /* Hide the old bottom indicator as we now use gradient backgrounds */
        }
        .card-blue { 
          background: linear-gradient(to right, rgba(101, 131, 154, 0.45), var(--surface)); 
          border-color: rgba(101, 131, 154, 0.6);
        }
        .card-green { 
          background: linear-gradient(to right, rgba(49, 120, 44, 0.5), var(--surface)); 
          border-color: rgba(49, 120, 44, 0.6);
        }
        .card-yellow { 
          background: linear-gradient(to right, rgba(255, 177, 86, 0.45), var(--surface)); 
          border-color: rgba(255, 177, 86, 0.6);
        }
        .card-red { 
          background: linear-gradient(to right, rgba(203, 86, 86, 0.45), var(--surface)); 
          border-color: rgba(203, 86, 86, 0.6);
        }
        
        .btn-simulation:hover {
          background: rgba(101, 131, 154, 0.25);
          transform: translateY(-2px);
        }
      `}</style>
    </DashboardLayout>
  );
}
