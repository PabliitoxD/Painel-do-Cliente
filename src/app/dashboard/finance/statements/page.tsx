"use client";

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  Download,
  Calendar,
  Wallet,
  ArrowRightLeft,
  ChevronDown,
  X
} from 'lucide-react';

/**
 * Dados fictícios expandidos para demonstração.
 */
const INITIAL_DATA = [
  { id: 1, type: 'Venda', date: '2026-04-24T14:32:00', description: 'Venda #YXFQVFTFFX', value: 97.00, status: 'aprovado' },
  { id: 2, type: 'Saque', date: '2026-04-23T10:15:00', description: 'Saque realizado - Bradesco', value: -1500.00, status: 'processado' },
  { id: 3, type: 'Estorno', date: '2026-04-22T16:45:00', description: 'Estorno cliente Maria Rosa', value: -55.90, status: 'estornado' },
  { id: 4, type: 'Chargeback', date: '2026-04-21T09:20:00', description: 'Contestação de venda #45G53571E', value: -497.00, status: 'bloqueado' },
  { id: 5, type: 'Venda', date: '2026-04-21T08:12:00', description: 'Venda #45G53571E', value: 497.00, status: 'aprovado' },
  { id: 6, type: 'Venda', date: '2026-04-20T11:00:00', description: 'Venda #ABC123XYZ', value: 150.00, status: 'aprovado' },
  { id: 7, type: 'Venda', date: '2026-03-15T15:00:00', description: 'Venda Mês Passado', value: 200.00, status: 'aprovado' },
  { id: 8, type: 'Venda', date: new Date().toISOString(), description: 'Venda de Hoje', value: 350.00, status: 'aprovado' },
];

export default function StatementsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('Últimos 30 dias');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [isTimeMenuOpen, setIsTimeMenuOpen] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);

  const timeOptions = ['Hoje', 'Últimos 7 dias', 'Últimos 30 dias', 'Esse mês', 'Personalizado'];
  const statusOptions = ['Todos', 'aprovado', 'processado', 'estornado', 'bloqueado'];

  // Lógica de filtragem
  const filteredData = useMemo(() => {
    return INITIAL_DATA.filter(item => {
      const itemDate = new Date(item.date);
      const now = new Date();
      
      // Filtro de Texto
      const matchesSearch = item.description.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.id.toString().includes(searchQuery);

      // Filtro de Status
      const matchesStatus = statusFilter === 'Todos' || item.status === statusFilter;

      // Filtro de Tempo
      let matchesTime = true;
      if (timeRange === 'Hoje') {
        matchesTime = itemDate.toDateString() === now.toDateString();
      } else if (timeRange === 'Últimos 7 dias') {
        const sevenDaysAgo = new Date();
        sevenDaysAgo.setDate(now.getDate() - 7);
        matchesTime = itemDate >= sevenDaysAgo;
      } else if (timeRange === 'Últimos 30 dias') {
        const thirtyDaysAgo = new Date();
        thirtyDaysAgo.setDate(now.getDate() - 30);
        matchesTime = itemDate >= thirtyDaysAgo;
      } else if (timeRange === 'Esse mês') {
        matchesTime = itemDate.getMonth() === now.getMonth() && itemDate.getFullYear() === now.getFullYear();
      }

      return matchesSearch && matchesStatus && matchesTime;
    });
  }, [searchQuery, timeRange, statusFilter]);

  // Cálculos de métricas baseados nos dados filtrados
  const metrics = useMemo(() => {
    const inflows = filteredData.reduce((acc, item) => item.value > 0 ? acc + item.value : acc, 0);
    const outflows = filteredData.reduce((acc, item) => item.value < 0 ? acc + item.value : acc, 0);
    const balance = inflows + outflows;

    return { inflows, outflows, balance };
  }, [filteredData]);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  return (
    <DashboardLayout>
      <div className="statements-page animate-fade-in">
        <div className="page-header">
          <div>
            <h1>Extratos</h1>
            <p className="text-muted">Acompanhe sua movimentação financeira detalhada</p>
          </div>
          <button className="btn-primary">
            <Download size={18} /> Exportar CSV
          </button>
        </div>

        {/* Métricas Dinâmicas */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Saldo Acumulado</span>
              <Wallet size={20} className="text-muted" />
            </div>
            <div className="stat-value" style={{ fontSize: '2.2rem' }}>{formatCurrency(metrics.balance)}</div>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Total líquido no período</p>
          </div>
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Entradas (+)</span>
              <ArrowUpRight size={20} style={{ color: 'var(--success)' }} />
            </div>
            <div className="stat-value" style={{ fontSize: '2.2rem', color: 'var(--success)' }}>{formatCurrency(metrics.inflows)}</div>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Soma de todos os ganhos</p>
          </div>
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Saídas (-)</span>
              <ArrowDownLeft size={20} style={{ color: 'var(--danger)' }} />
            </div>
            <div className="stat-value" style={{ fontSize: '2.2rem', color: 'var(--danger)' }}>{formatCurrency(Math.abs(metrics.outflows))}</div>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Soma de todos os débitos</p>
          </div>
        </div>

        {/* Filtros Funcionais */}
        <div className="table-filters card glass-panel" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem' }}>
          <div className="search-box" style={{ flex: 1, background: 'var(--background)', borderRadius: '12px', padding: '0 1rem' }}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Buscar por descrição ou ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'none', border: 'none', color: 'white', width: '100%', padding: '0.8rem 0.5rem', outline: 'none' }} 
            />
          </div>

          {/* Filtro de Tempo */}
          <div style={{ position: 'relative' }}>
            <button 
              className="btn-ghost" 
              onClick={() => setIsTimeMenuOpen(!isTimeMenuOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.2rem', borderRadius: '12px', background: 'var(--background)' }}
            >
              <Calendar size={18} /> {timeRange} <ChevronDown size={14} />
            </button>
            {isTimeMenuOpen && (
              <div className="filter-menu glass-panel animate-fade-in" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', zIndex: 100, width: '200px', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                {timeOptions.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { setTimeRange(opt); setIsTimeMenuOpen(false); }}
                    className={`filter-item ${timeRange === opt ? 'active' : ''}`}
                    style={{ width: '100%', textAlign: 'left', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Filtro Avançado (Status) */}
          <div style={{ position: 'relative' }}>
            <button 
              className="btn-ghost" 
              onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.2rem', borderRadius: '12px', background: 'var(--background)' }}
            >
              <Filter size={18} /> {statusFilter === 'Todos' ? 'Status' : statusFilter} <ChevronDown size={14} />
            </button>
            {isStatusMenuOpen && (
              <div className="filter-menu glass-panel animate-fade-in" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', zIndex: 100, width: '200px', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                {statusOptions.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { setStatusFilter(opt); setIsStatusMenuOpen(false); }}
                    className={`filter-item ${statusFilter === opt ? 'active' : ''}`}
                    style={{ width: '100%', textAlign: 'left', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.9rem', textTransform: 'capitalize' }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {(statusFilter !== 'Todos' || searchQuery !== '' || timeRange !== 'Últimos 30 dias') && (
            <button 
              onClick={() => { setStatusFilter('Todos'); setSearchQuery(''); setTimeRange('Últimos 30 dias'); }}
              style={{ padding: '0.5rem', color: var(--danger), opacity: 0.8 }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Tabela de Extratos */}
        <div className="table-card">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Data</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? filteredData.map((item) => (
                <tr key={item.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '8px', 
                        background: item.value > 0 ? 'rgba(49, 120, 44, 0.1)' : 'rgba(203, 86, 86, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.value > 0 ? 'var(--success)' : 'var(--danger)'
                      }}>
                        {item.type === 'Venda' ? <ArrowUpRight size={16} /> : 
                         item.type === 'Saque' ? <Wallet size={16} /> : <ArrowDownLeft size={16} />}
                      </div>
                      <span style={{ fontWeight: 500 }}>{item.type}</span>
                    </div>
                  </td>
                  <td className="text-muted">{new Date(item.date).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                  <td>{item.description}</td>
                  <td style={{ fontWeight: 600, color: item.value > 0 ? 'var(--text-main)' : 'var(--danger)' }}>
                    {formatCurrency(item.value)}
                  </td>
                  <td>
                    <span className={`status-pill ${item.status}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button className="btn-ghost" style={{ padding: '0.25rem' }}>
                      <ArrowRightLeft size={16} />
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    Nenhuma movimentação encontrada para os filtros selecionados.
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
        .filter-item:hover {
          background: var(--surface-hover);
        }
        .filter-item.active {
          background: var(--primary);
          color: white;
        }
      `}</style>
    </DashboardLayout>
  );
}
