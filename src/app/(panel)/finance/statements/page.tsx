"use client";

import { useState, useMemo, useEffect } from 'react';
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
import { translateStatus, formatCurrency, getStatusPillClass } from '@/utils/formatters';



export default function StatementsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('Últimos 7 dias');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [isTimeMenuOpen, setIsTimeMenuOpen] = useState(false);
  const [isStatusMenuOpen, setIsStatusMenuOpen] = useState(false);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  
  const [statementsData, setStatementsData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);

  const timeOptions = ['Hoje', 'Últimos 7 dias', 'Últimos 30 dias', 'Esse mês', 'Personalizado'];
  const statusOptions = ['Todos', 'entrada', 'saída'];

  useEffect(() => {
    import('@/services/api/client').then(({ fetchApi }) => {
      setIsLoading(true);
      fetchApi('/account_statements')
        .then((res: any) => {
          const items = res?.account_statements || res?.data?.account_statements || (Array.isArray(res) ? res : []);
          setStatementsData(items);
        })
        .catch(err => {
          console.error("[Statements] Erro ao buscar extrato:", err);
        })
        .finally(() => {
          setIsLoading(false);
        });
    });
  }, []);

  useEffect(() => {
    setPage(1);
  }, [searchQuery, timeRange, statusFilter]);

  // Lógica de filtragem
  const filteredData = useMemo(() => {
    return statementsData.filter(item => {
      const itemDate = new Date(item.created_at || Date.now());
      const now = new Date();

      // Filtro de Texto
      const type = item.transaction_type === 'INPUT' ? 'Entrada' : 'Saída';
      const orderId = item.order_id || item.id || '';
      const matchesSearch = searchQuery === '' ||
        type.toLowerCase().includes(searchQuery.toLowerCase()) ||
        orderId.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (item.account?.name || '').toLowerCase().includes(searchQuery.toLowerCase());

      // Filtro de Status (tipo)
      const matchesStatus = statusFilter === 'Todos' ||
        (statusFilter === 'entrada' && item.transaction_type === 'INPUT') ||
        (statusFilter === 'saída' && item.transaction_type === 'OUTPUT');

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
      } else if (timeRange.startsWith('De ')) {
        const s = dateRange.start ? new Date(`${dateRange.start}T00:00:00`) : new Date(0);
        const e = dateRange.end ? new Date(`${dateRange.end}T23:59:59`) : new Date(8640000000000000);
        matchesTime = itemDate >= s && itemDate <= e;
      }

      return matchesSearch && matchesStatus && matchesTime;
    });
  }, [statementsData, searchQuery, timeRange, statusFilter]);

  const perPage = 50;
  const paginatedData = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredData.slice(start, start + perPage);
  }, [filteredData, page]);

  const hasMore = filteredData.length > page * perPage;
  const totalPages = Math.ceil(filteredData.length / perPage) || 1;

  // Cálculos de métricas baseados nos dados filtrados
  const metrics = useMemo(() => {
    const inflows = filteredData
      .filter(item => item.transaction_type === 'INPUT')
      .reduce((acc, item) => acc + parseFloat(item.amount || 0), 0);
    const outflows = filteredData
      .filter(item => item.transaction_type === 'OUTPUT')
      .reduce((acc, item) => acc + parseFloat(item.amount || 0), 0);
    // Último saldo disponível (account_amount do item mais recente)
    const lastBalance = filteredData.length > 0 ? parseFloat(filteredData[0].account_amount || 0) : 0;

    return { inflows, outflows, balance: lastBalance };
  }, [filteredData]);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const exportToCSV = () => {
    if (filteredData.length === 0) return;
    const headers = ['Tipo', 'Data', 'Descrição', 'Valor', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => {
        const dateStr = new Date(item.date || item.created_at || item.transaction?.registration_date || Date.now()).toLocaleDateString('pt-BR');
        const desc = (item.description || item.product || item.items?.[0]?.name || item.token || 'Transação').replace(/,/g, ' ');
        const val = parseFloat(item.value || item.amount || item.transaction?.total || 0);
        const status = item.status?.code || item.status || 'aprovado';
        const type = item.type || 'Venda';
        return `${type},${dateStr},${desc},${val},${status}`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `extrato_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="statements-page animate-fade-in">
        <div className="page-header">
          <div>
            <h1>Extratos</h1>
            <p className="text-muted">Acompanhe sua movimentação financeira detalhada</p>
          </div>
          <button className="btn-primary" onClick={exportToCSV}>
            <Download size={18} /> Exportar CSV
          </button>
        </div>

        {/* Métricas Dinâmicas */}
        <div className="stats-grid grid-3" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Saldo Atual</span>
              <Wallet size={20} style={{ color: 'var(--success)' }} />
            </div>
            <div className="stat-value" style={{ fontSize: '2.2rem', color: 'var(--success)' }}>
              {isLoading ? '...' : formatCurrency(metrics.balance)}
            </div>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Último saldo registrado</p>
          </div>
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Total Entradas</span>
              <ArrowUpRight size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div className="stat-value" style={{ fontSize: '2.2rem', color: 'var(--primary)' }}>
              {isLoading ? '...' : formatCurrency(metrics.inflows)}
            </div>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>No período selecionado</p>
          </div>
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Total Saídas</span>
              <ArrowDownLeft size={20} style={{ color: 'var(--danger)' }} />
            </div>
            <div className="stat-value" style={{ fontSize: '2.2rem', color: 'var(--danger)' }}>
              {isLoading ? '...' : formatCurrency(metrics.outflows)}
            </div>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>No período selecionado</p>
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
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.2rem', borderRadius: '12px', background: isTimeMenuOpen ? 'var(--surface-hover)' : 'var(--background)' }}
            >
              <Calendar size={18} /> {timeRange} <ChevronDown size={14} />
            </button>
            {isTimeMenuOpen && (
              <div className="filter-menu animate-fade-in" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', zIndex: 100, width: '250px', padding: '0.5rem', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--primary)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                {timeOptions.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { 
                      if (opt === 'Personalizado') {
                        setShowCustomDate(true);
                      } else {
                        setTimeRange(opt); 
                        setIsTimeMenuOpen(false); 
                        setShowCustomDate(false);
                      }
                    }}
                    className={`filter-item ${timeRange === opt && !showCustomDate ? 'active' : ''}`}
                    style={{ width: '100%', textAlign: 'left', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}
                  >
                    {opt}
                  </button>
                ))}
                
                {showCustomDate && (
                  <div className="custom-date-picker animate-fade-in" style={{ padding: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem', marginTop: '0.5rem' }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                      <input 
                        type="date" 
                        value={dateRange.start} 
                        onChange={e => setDateRange({...dateRange, start: e.target.value})} 
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.5rem', color: 'var(--text-main)', fontSize: '0.8rem', width: '100%' }} 
                      />
                      <input 
                        type="date" 
                        value={dateRange.end} 
                        onChange={e => setDateRange({...dateRange, end: e.target.value})} 
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.5rem', color: 'var(--text-main)', fontSize: '0.8rem', width: '100%' }} 
                      />
                    </div>
                    <button 
                      className="btn-primary"
                      style={{ padding: '0.5rem', fontSize: '0.85rem', width: '100%' }}
                      onClick={() => {
                        const startFormatted = dateRange.start ? new Date(dateRange.start).toLocaleDateString('pt-BR') : '?';
                        const endFormatted = dateRange.end ? new Date(dateRange.end).toLocaleDateString('pt-BR') : '?';
                        setTimeRange(`De ${startFormatted} até ${endFormatted}`);
                        setIsTimeMenuOpen(false);
                      }}
                    >
                      Aplicar Período
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>

          {/* Filtro Avançado (Status) */}
          <div style={{ position: 'relative' }}>
            <button 
              className="btn-ghost" 
              onClick={() => setIsStatusMenuOpen(!isStatusMenuOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.2rem', borderRadius: '12px', background: isStatusMenuOpen ? 'var(--surface-hover)' : 'var(--background)' }}
            >
              <Filter size={18} /> {statusFilter === 'Todos' ? 'Status' : statusFilter} <ChevronDown size={14} />
            </button>
            {isStatusMenuOpen && (
              <div className="filter-menu animate-fade-in" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', zIndex: 100, width: '200px', padding: '0.5rem', borderRadius: '12px', background: 'var(--surface)', border: '1px solid var(--primary)', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
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

          {(statusFilter !== 'Todos' || searchQuery !== '' || timeRange !== 'Últimos 7 dias') && (
            <button 
              onClick={() => { setStatusFilter('Todos'); setSearchQuery(''); setTimeRange('Últimos 7 dias'); }}
              style={{ padding: '0.5rem', color: 'var(--danger)', opacity: 0.8, cursor: 'pointer', background: 'transparent', border: 'none' }}
              title="Limpar filtros"
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
                <th>Saldo</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    Carregando extrato...
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? paginatedData.map((item) => {
                const isInput = item.transaction_type === 'INPUT';
                return (
                  <tr key={item.id || Math.random()}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <div style={{
                          width: '32px',
                          height: '32px',
                          borderRadius: '8px',
                          background: isInput ? 'rgba(49, 120, 44, 0.1)' : 'rgba(203, 86, 86, 0.1)',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          color: isInput ? 'var(--success)' : 'var(--danger)'
                        }}>
                          {isInput ? <ArrowUpRight size={16} /> : <ArrowDownLeft size={16} />}
                        </div>
                        <span style={{ fontWeight: 500 }}>{isInput ? 'Entrada' : 'Saída'}</span>
                      </div>
                    </td>
                    <td className="text-muted">{new Date(item.created_at).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                    <td>{item.order_id || item.id}</td>
                    <td style={{ fontWeight: 600, color: isInput ? 'var(--success)' : 'var(--danger)' }}>
                      {isInput ? '+ ' : '- '}{formatCurrency(parseFloat(item.amount || 0))}
                    </td>
                    <td style={{ fontWeight: 500 }}>
                      {item.account_amount != null ? formatCurrency(parseFloat(item.account_amount)) : '—'}
                    </td>
                  </tr>
                );
              }) : (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    Nenhuma movimentação encontrada para os filtros selecionados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Página <strong>{page}</strong> de <strong>{totalPages}</strong>
          </span>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button 
              disabled={page === 1 || isLoading} 
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              style={{ 
                opacity: page === 1 ? 0.3 : 1, 
                cursor: page === 1 ? 'not-allowed' : 'pointer', 
                background: 'rgba(255,255,255,0.02)', 
                padding: '0.35rem 0.6rem', 
                borderRadius: '6px', 
                border: '1px solid var(--border)', 
                fontSize: '0.8rem', 
                color: 'var(--text-main)', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '28px',
                height: '28px',
                transition: 'all 0.2s'
              }}
            >
              &lt;
            </button>
            <button 
              disabled={page >= totalPages || isLoading} 
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              style={{ 
                opacity: page >= totalPages ? 0.3 : 1, 
                cursor: page >= totalPages ? 'not-allowed' : 'pointer', 
                background: 'rgba(255,255,255,0.02)', 
                padding: '0.35rem 0.6rem', 
                borderRadius: '6px', 
                border: '1px solid var(--border)', 
                fontSize: '0.8rem', 
                color: 'var(--text-main)', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '28px',
                height: '28px',
                transition: 'all 0.2s'
              }}
            >
              &gt;
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
        .filter-item:hover {
          background: var(--surface-hover);
        }
        .filter-item.active {
          background: var(--primary);
          color: white;
        }
      `}</style>
      <style jsx>{`
        @media (max-width: 768px) {
          .table-filters {
            flex-direction: column;
            align-items: stretch !important;
            gap: 0.75rem !important;
          }
          .page-header {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 1rem;
          }
          .page-header .btn-primary {
            width: 100%;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
