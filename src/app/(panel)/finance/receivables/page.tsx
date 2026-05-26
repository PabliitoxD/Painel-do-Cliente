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
  const [isConsultModalOpen, setIsConsultModalOpen] = useState(false);
  const [consultDateRange, setConsultDateRange] = useState({ start: '', end: '' });

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
        setSchedules(schedulesData.map((s: any) => {
          let dateObj = s.scheduled_for || s.date || s.created_at;
          let dateStr = 'N/A';
          if (dateObj) {
            const d = new Date(dateObj);
            if (!isNaN(d.getTime())) {
              dateStr = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' }).replace(',', ' -');
            } else {
              dateStr = dateObj; // fallback to string
            }
          }
          return {
            id: s.id || s.token || s.transaction_id || `TR-${Math.floor(Math.random()*10000)}`,
            date: dateStr,
            rawDate: dateObj,
            amount: s.amount || s.value || s.net_amount || 0,
            count: s.count || s.transactions_count || 1,
            status: s.status || 'PENDENTE'
          };
        }));
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

  const getFilteredWaitingSchedules = () => {
    let list = schedules.filter(s => {
      const isReleased = s.status.toLowerCase() === 'released' || s.status.toLowerCase() === 'paid' || s.status.toLowerCase() === 'liberado' || s.status.toLowerCase() === 'aprovado' || getStatusPillClass(s.status) === 'aprovada';
      return !isReleased;
    });

    if (consultDateRange.start || consultDateRange.end) {
      list = list.filter(s => {
        const sDateStr = s.rawDate || s.date || '';
        let sDate = new Date(sDateStr);
        if (isNaN(sDate.getTime()) && typeof sDateStr === 'string' && sDateStr.includes('/')) {
           const parts = sDateStr.split(' - ')[0].split('/');
           sDate = new Date(`${parts[2]}-${parts[1]}-${parts[0]}T12:00:00`);
        }
        if (isNaN(sDate.getTime())) return true;
        if (consultDateRange.start && sDate < new Date(`${consultDateRange.start}T00:00:00`)) return false;
        if (consultDateRange.end && sDate > new Date(`${consultDateRange.end}T23:59:59`)) return false;
        return true;
      });
    }
    return list;
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
              ) : schedules.slice(0, 5).map((day, i) => {
                const isReleased = day.status.toLowerCase() === 'released' || day.status.toLowerCase() === 'paid' || day.status.toLowerCase() === 'liberado' || day.status.toLowerCase() === 'aprovado' || getStatusPillClass(day.status) === 'aprovada';
                return (
                  <div key={i} className="agenda-item" style={{ 
                    display: 'flex', 
                    justifyContent: 'space-between', 
                    alignItems: 'center',
                    padding: '1.5rem 0',
                    borderBottom: i === Math.min(schedules.length, 5) - 1 ? 'none' : '1px solid var(--border)',
                  }}>
                    <div>
                      <p style={{ fontWeight: 600, fontSize: '1rem', marginBottom: '0.3rem' }}>
                        ID: {day.id}
                      </p>
                      <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Transação</p>
                    </div>
                    <div style={{ textAlign: 'right' }}>
                      <p style={{ fontWeight: 700, fontSize: '1.2rem', color: 'var(--text-main)', marginBottom: '0.2rem' }}>
                        {formatCurrency(day.amount)}
                      </p>
                      <span style={{ 
                        fontSize: '0.75rem', 
                        letterSpacing: '0.5px',
                        color: isReleased ? 'var(--success)' : 'var(--warning)',
                        fontWeight: 800
                      }}>
                        {isReleased ? 'LIBERADO' : day.date}
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            {schedules.length > 0 && (
              <button 
                className="btn-ghost" 
                onClick={() => setIsConsultModalOpen(true)}
                style={{ width: '100%', padding: '1rem', marginTop: '1rem', borderTop: '1px solid var(--border)', fontWeight: 600, color: 'var(--primary)' }}
              >
                Consultar Relatório Completo
              </button>
            )}
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

      {isConsultModalOpen && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel animate-fade-in" style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', maxWidth: '500px', width: '100%', position: 'relative', border: '1px solid var(--border)' }}>
            <button 
              onClick={() => setIsConsultModalOpen(false)} 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Valores Aguardando Liberação</h2>
            
            <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem', lineHeight: 1.5 }}>
              Filtre o período desejado para visualizar e exportar o relatório de valores aguardando liberação.
            </p>

            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem' }}>
              <div style={{ flex: 1 }}>
                <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Data Inicial</label>
                <input 
                  type="date" 
                  value={consultDateRange.start}
                  onChange={e => setConsultDateRange({...consultDateRange, start: e.target.value})}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.8rem', color: 'var(--text-main)', outline: 'none' }} 
                />
              </div>
              <div style={{ flex: 1 }}>
                <label className="text-muted" style={{ display: 'block', marginBottom: '0.5rem', fontSize: '0.85rem' }}>Data Final</label>
                <input 
                  type="date" 
                  value={consultDateRange.end}
                  onChange={e => setConsultDateRange({...consultDateRange, end: e.target.value})}
                  style={{ width: '100%', background: 'rgba(0,0,0,0.2)', border: '1px solid var(--border)', borderRadius: '8px', padding: '0.8rem', color: 'var(--text-main)', outline: 'none' }} 
                />
              </div>
            </div>

            <div style={{ maxHeight: '250px', overflowY: 'auto', marginBottom: '1.5rem', background: 'var(--background)', borderRadius: '8px', border: '1px solid var(--border)' }}>
              {(() => {
                const filtered = getFilteredWaitingSchedules();
                
                if (filtered.length === 0) {
                  return <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-dim)' }}>Nenhum valor aguardando liberação encontrado.</div>;
                }

                return (
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
                    <thead style={{ position: 'sticky', top: 0, background: 'var(--surface)', borderBottom: '1px solid var(--border)' }}>
                      <tr>
                        <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text-dim)' }}>ID</th>
                        <th style={{ padding: '0.75rem', textAlign: 'left', color: 'var(--text-dim)' }}>Previsão</th>
                        <th style={{ padding: '0.75rem', textAlign: 'right', color: 'var(--text-dim)' }}>Valor</th>
                        <th style={{ padding: '0.75rem', textAlign: 'center', color: 'var(--text-dim)' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filtered.map((item, idx) => {
                        return (
                          <tr key={idx} style={{ borderBottom: '1px solid var(--border)' }}>
                            <td style={{ padding: '0.75rem', color: 'var(--text-main)' }}>{item.id}</td>
                            <td style={{ padding: '0.75rem', color: 'var(--text-main)' }}>{item.date}</td>
                            <td style={{ padding: '0.75rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-main)' }}>{formatCurrency(item.amount)}</td>
                            <td style={{ padding: '0.75rem', textAlign: 'center' }}>
                               <span style={{ color: 'var(--warning)', fontWeight: 600, fontSize: '0.75rem' }}>
                                  AGUARDANDO
                               </span>
                            </td>
                          </tr>
                        );
                      })}
                    </tbody>
                  </table>
                );
              })()}
            </div>
            
            <button 
              className="btn-primary" 
              style={{ width: '100%', padding: '1rem', fontWeight: 600 }} 
              onClick={() => {
                const filtered = getFilteredWaitingSchedules();
                
                if (filtered.length === 0) {
                  alert('Nenhum dado encontrado para exportar.');
                  return;
                }

                const headers = ['ID Transacao', 'Previsao Liberacao', 'Valor Total', 'Status'];
                const csvContent = [
                  headers.join(','),
                  ...filtered.map(item => {
                    return `${item.id},${item.date},${item.amount},AGUARDANDO`
                  })
                ].join('\n');
                
                const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
                const url = URL.createObjectURL(blob);
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', `valores_aguardando_${new Date().toISOString().slice(0,10)}.csv`);
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
              }}
            >
              Exportar Relatório (CSV)
            </button>
          </div>
        </div>
      )}

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
