"use client";

import { useState, useEffect, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/services/api';
import { 
  Search, 
  Download, 
  Calendar, 
  ChevronDown, 
  CreditCard, 
  Wallet, 
  Banknote, 
  MoreHorizontal, 
  X,
  Eye
} from 'lucide-react';
import { translateStatus, translateMethod, getStatusPillClass, formatCurrency as fmtBrl } from '@/utils/formatters';

interface SalesListProps {
  title: string;
  description: string;
  statuses: string[];
  apiStatuses?: string[];
  viewType?: 'approved' | 'not-completed' | 'waiting' | 'all';
}

export function SalesList({ title, description, statuses, apiStatuses, viewType = 'all' }: SalesListProps) {
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('Todos');
  const [isTimeMenuOpen, setIsTimeMenuOpen] = useState(false);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const [paymentMethodFilter, setPaymentMethodFilter] = useState('Todos');
  const [isMethodMenuOpen, setIsMethodMenuOpen] = useState(false);
  const methodOptions = ['Todos', 'Cartão de Crédito', 'Pix', 'Boleto'];

  const [page, setPage] = useState(1);
  const [perPage, setPerPage] = useState(50);
  const [hasMore, setHasMore] = useState(true);

  const detailsRouter = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('geral');

  const timeOptions = ['Todos', 'Hoje', 'Últimos 7 dias', 'Últimos 30 dias', 'Esse mês', 'Personalizado'];

  useEffect(() => {
    setPage(1);
  }, [statuses, apiStatuses, viewType, timeRange, paymentMethodFilter, searchQuery, dateRange, perPage]);

  useEffect(() => {
    setIsLoading(true);
    const statusList = apiStatuses || statuses;
    // Faz uma request por status e junta os resultados
    Promise.all(
      statusList.map(status =>
        api.transactions.listOrders({ status: status.toUpperCase(), per_page: 1000 })
          .then(res => {
            const data = res?.orders || res?.data?.orders || (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
            return Array.isArray(data) ? data : [];
          })
          .catch(() => [])
      )
    ).then(results => {
      // Junta tudo e remove duplicatas por token
      const all = results.flat();
      const unique = all.filter((item, idx) => all.findIndex(o => o.token === item.token) === idx);
      setOrdersData(unique);
    })
    .catch(err => {
      console.error("[SalesList] Erro ao buscar vendas:", err);
    })
    .finally(() => {
      setIsLoading(false);
    });
  }, [statuses, apiStatuses, viewType]);

  // Filtragem (Busca + Data)
  const filteredData = useMemo(() => {
    return ordersData.filter(item => {
      const itemDate = item.created_at ? new Date(item.created_at) : new Date(item.date || Date.now());
      const now = new Date();
      
      const matchesSearch = searchQuery === '' ||
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.client && item.client.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.buyer?.name && item.buyer.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.customer?.name && item.customer.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.products?.[0]?.name && item.products[0].name.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.token && item.token.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.id && item.id.toString().includes(searchQuery));

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

      let matchesMethod = true;
      if (paymentMethodFilter !== 'Todos') {
        const lp = item.payments?.length ? item.payments[item.payments.length - 1] : null;
        const methodLow = (lp?.payment_method?.description || lp?.payment_method?.method || item.payment_method || item.method || '').toString().toLowerCase();
        if (paymentMethodFilter === 'Cartão de Crédito') {
          matchesMethod = methodLow.includes('credit') || methodLow.includes('cart');
        } else if (paymentMethodFilter === 'Pix') {
          matchesMethod = methodLow.includes('pix');
        } else if (paymentMethodFilter === 'Boleto') {
          matchesMethod = methodLow.includes('boleto') || methodLow.includes('bank_slip');
        }
      }

      return matchesSearch && matchesTime && matchesMethod;
    });
  }, [ordersData, searchQuery, timeRange, dateRange, paymentMethodFilter]);

  const paginatedData = useMemo(() => {
    const start = (page - 1) * perPage;
    return filteredData.slice(start, start + perPage);
  }, [filteredData, page, perPage]);

  const totalPages = Math.ceil(filteredData.length / perPage) || 1;

  const formatCurrency = (val: number) => fmtBrl(val);


  const exportToCSV = () => {
    if (filteredData.length === 0) return;
    const headers = ['ID', 'Cliente', 'Produto', 'Data', 'Valor', 'Método', 'Status'];
    const csvContent = [
      headers.join(','),
      ...filteredData.map(item => {
        const id = item.token || item.id || '';
        const client = (item.client || item.customer?.name || '').replace(/,/g, ' ');
        const product = (item.product || item.description || '').replace(/,/g, ' ');
        const dateStr = new Date(item.created_at || item.date).toLocaleDateString('pt-BR');
        const val = item.value || item.amount || 0;
        const method = item.payment_method || item.method || '';
        const status = item.status || '';
        return `${id},${client},${product},${dateStr},${val},${method},${status}`;
      })
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', `vendas_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <DashboardLayout>
      <div className="sales-page animate-fade-in">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>{title}</h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{description}</p>
          </div>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }} onClick={exportToCSV}>
            <Download size={18} /> Exportar Relatório
          </button>
        </div>

        {/* Filtros */}
        <div className="table-filters card glass-panel" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem' }}>
          <div className="search-box" style={{ flex: 1, background: 'var(--background)', borderRadius: '12px', padding: '0 1rem', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Buscar por cliente, produto ou ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'none', border: 'none', color: 'white', width: '100%', padding: '0.8rem 0.5rem', outline: 'none' }} 
            />
          </div>

          <div style={{ position: 'relative' }}>
            <button 
              className="btn-ghost" 
              onClick={() => setIsTimeMenuOpen(!isTimeMenuOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.2rem', borderRadius: '12px', background: 'var(--background)' }}
            >
              <Calendar size={18} /> {timeRange} <ChevronDown size={14} />
            </button>
            {isTimeMenuOpen && (
              <div className="filter-menu glass-panel animate-fade-in" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', zIndex: 100, width: '250px', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
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

          <div style={{ position: 'relative' }}>
            <button 
              className="btn-ghost" 
              onClick={() => setIsMethodMenuOpen(!isMethodMenuOpen)}
              style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.8rem 1.2rem', borderRadius: '12px', background: 'var(--background)' }}
            >
              <Wallet size={18} /> {paymentMethodFilter === 'Todos' ? 'Método' : paymentMethodFilter} <ChevronDown size={14} />
            </button>
            {isMethodMenuOpen && (
              <div className="filter-menu glass-panel animate-fade-in" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', zIndex: 100, width: '200px', padding: '0.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                {methodOptions.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { 
                      setPaymentMethodFilter(opt); 
                      setIsMethodMenuOpen(false); 
                    }}
                    className={`filter-item ${paymentMethodFilter === opt ? 'active' : ''}`}
                    style={{ width: '100%', textAlign: 'left', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.9rem' }}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            )}
          </div>

          {(searchQuery !== '' || timeRange !== 'Últimos 30 dias' || paymentMethodFilter !== 'Todos') && (
            <button 
              onClick={() => { setSearchQuery(''); setTimeRange('Todos'); setShowCustomDate(false); setPaymentMethodFilter('Todos'); }}
              style={{ padding: '0.5rem', color: 'var(--danger)', opacity: 0.8, background: 'none', border: 'none', cursor: 'pointer' }}
            >
              <X size={18} />
            </button>
          )}
        </div>

        {/* Tabela de Vendas */}
        <div className="table-card">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Cliente</th>
                <th>Produto</th>
                <th>Data</th>
                <th>Valor</th>
                <th>Método</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    Carregando vendas...
                  </td>
                </tr>
              ) : paginatedData.length > 0 ? (
                paginatedData.map((item, i) => {
                  const lastPayRender = item.payments?.length ? item.payments[item.payments.length - 1] : null;
                  const actualMethod = lastPayRender?.payment_method?.description || lastPayRender?.payment_method?.method || item.payment?.method || item.payment_method || item.method || '';
                  const methodLow = String(actualMethod).toLowerCase();
                  return (
                    <tr key={item.id || i}>
                      <td className="id-text" style={{ fontSize: '0.8rem' }}>
                        <span title={item.token || item.id} style={{ cursor: 'default' }}>{(item.token || item.id || '').slice(0, 12)}...</span>
                        {(item.recurrence || item.subscription || item.is_recurrence || methodLow.includes('recurrence') || methodLow.includes('subscription')) && (
                          <div style={{ marginTop: '4px' }}>
                            <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(0, 193, 180, 0.15)', color: '#00c1b4', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 600, border: '1px solid rgba(0, 193, 180, 0.3)' }}>
                              {(() => {
                                const p = String(item.recurrence?.periodicy || item.recurrence?.periodicity || item.subscription?.plan?.periodicity || '').toLowerCase();
                                if (p === '1' || p === 'monthly' || p === 'mensal') return 'Mensal';
                                if (p === '3' || p === 'quarterly' || p === 'trimestral') return 'Trimestral';
                                if (p === '6' || p === 'semiannual' || p === 'semestral') return 'Semestral';
                                if (p === '12' || p === 'yearly' || p === 'annual' || p === 'anual') return 'Anual';
                                return 'Recorrente';
                              })()}
                            </span>
                          </div>
                        )}
                      </td>
                      <td style={{ fontWeight: 600 }}>{item.client || item.buyer?.name || item.customer?.name || 'Cliente'}</td>
                      <td className="text-muted">{item.product || item.products?.[0]?.name || item.description || 'Produto'}</td>
                      <td className="text-muted">{new Date(item.created_at || item.date || Date.now()).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="valor-text">{formatCurrency(item.amount || item.value || 0)}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                          {methodLow.includes('credit') || methodLow.includes('cart') ? <CreditCard size={14} /> : 
                           methodLow.includes('pix') ? <Wallet size={14} /> : <Banknote size={14} />}
                          {translateMethod(actualMethod)}
                        </div>
                      </td>
                      <td>
                        <span className={`status-pill ${getStatusPillClass(item.status)}`}>
                          {translateStatus(item.status)}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn-ghost"
                          onClick={() => detailsRouter.push(`/sales/${item.token || item.id}`)}
                          style={{ padding: '0.4rem', borderRadius: '8px' }}
                          title="Detalhes da Venda"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  )
                })
              ) : (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    Nenhuma venda encontrada para os filtros aplicados.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginRight: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Itens por página:</span>
            <select 
              value={perPage} 
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
              style={{
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '0.25rem 0.5rem',
                fontSize: '0.8rem',
                color: 'var(--text-main)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {[10, 20, 30, 50, 100].map(val => (
                <option key={val} value={val} style={{ background: 'var(--surface)', color: 'white' }}>{val}</option>
              ))}
            </select>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginRight: '0.5rem' }}>
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

      {/* Modal de Detalhes da Venda (Visão Premium / Completa) */}
      {selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel animate-fade-in" style={{ background: 'var(--background)', padding: '0', borderRadius: '16px', maxWidth: '850px', width: '100%', position: 'relative', border: '1px solid var(--border)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            
            <div style={{ padding: '1.5rem 2rem', borderBottom: '1px solid var(--border)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--surface)', borderTopLeftRadius: '16px', borderTopRightRadius: '16px' }}>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, color: 'var(--text-main)' }}>Detalhes da venda {selectedOrder.token || selectedOrder.id}</h2>
              <button onClick={() => setSelectedOrder(null)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}>
                <X size={24} />
              </button>
            </div>
            
            <div style={{ padding: '2rem', background: 'var(--background)' }}>
              
              <div className="modal-tabs" style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>
                <span onClick={() => setActiveTab('geral')} className={activeTab === 'geral' ? '' : 'text-muted'} style={{ cursor: 'pointer', fontWeight: activeTab === 'geral' ? 600 : 400, color: activeTab === 'geral' ? 'var(--primary)' : 'inherit', borderBottom: activeTab === 'geral' ? '2px solid var(--primary)' : 'none', paddingBottom: '0.6rem', marginBottom: '-0.5rem' }}>Geral</span>
                <span onClick={() => setActiveTab('historico')} className={activeTab === 'historico' ? '' : 'text-muted'} style={{ cursor: 'pointer', fontWeight: activeTab === 'historico' ? 600 : 400, color: activeTab === 'historico' ? 'var(--primary)' : 'inherit', borderBottom: activeTab === 'historico' ? '2px solid var(--primary)' : 'none', paddingBottom: '0.6rem', marginBottom: '-0.5rem' }}>Histórico</span>
                <span onClick={() => setActiveTab('rastreamento')} className={activeTab === 'rastreamento' ? '' : 'text-muted'} style={{ cursor: 'pointer', fontWeight: activeTab === 'rastreamento' ? 600 : 400, color: activeTab === 'rastreamento' ? 'var(--primary)' : 'inherit', borderBottom: activeTab === 'rastreamento' ? '2px solid var(--primary)' : 'none', paddingBottom: '0.6rem', marginBottom: '-0.5rem' }}>Rastreamento</span>
                <span onClick={() => setActiveTab('taxas')} className={activeTab === 'taxas' ? '' : 'text-muted'} style={{ cursor: 'pointer', fontWeight: activeTab === 'taxas' ? 600 : 400, color: activeTab === 'taxas' ? 'var(--primary)' : 'inherit', borderBottom: activeTab === 'taxas' ? '2px solid var(--primary)' : 'none', paddingBottom: '0.6rem', marginBottom: '-0.5rem' }}>Taxas e comissões</span>
              </div>

              {activeTab === 'geral' && (
                <>
                  <div className="modal-grid-150">
                    <div className="text-muted">Cliente</div>
                    <div style={{ fontWeight: 500 }}>{selectedOrder.client || selectedOrder.customer?.name || 'Cliente não informado'}</div>
                    
                    <div className="text-muted">Gênero</div>
                    <div style={{ color: 'var(--text-main)' }}>—</div>

                    <div className="text-muted">Tipo</div>
                    <div style={{ color: 'var(--text-main)' }}>—</div>

                    <div className="text-muted">CPF/Documento</div>
                    <div style={{ color: 'var(--primary)' }}>{selectedOrder.customer?.doc || selectedOrder.customer?.document || '—'}</div>

                    <div className="text-muted">E-mail</div>
                    <div style={{ color: 'var(--primary)' }}>{selectedOrder.customer?.email || '—'}</div>
                    
                    <div className="text-muted">Telefone</div>
                    <div style={{ color: 'var(--primary)' }}>{selectedOrder.customer?.phone || '—'}</div>
                  </div>

                  <div style={{ background: 'var(--surface)', borderRadius: '12px', border: '1px solid var(--border)', overflow: 'hidden', marginBottom: '2.5rem' }}>
                    <table style={{ width: '100%', fontSize: '0.95rem', borderCollapse: 'collapse' }}>
                      <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                        <tr>
                          <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Código</th>
                          <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Produto</th>
                          <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-muted)' }}>Valor</th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          <td style={{ padding: '1rem', borderBottom: 'none' }} className="text-muted">{selectedOrder.token || selectedOrder.id || selectedOrder.transaction?.code}</td>
                          <td style={{ padding: '1rem', fontWeight: 500, borderBottom: 'none' }}>
                            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                              <div style={{ width: '36px', height: '36px', background: 'var(--surface-hover)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                <Banknote size={16} />
                              </div>
                              {(selectedOrder.items && selectedOrder.items[0]?.name) || selectedOrder.product || selectedOrder.description || 'Produto Genérico'}
                            </div>
                          </td>
                          <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, borderBottom: 'none' }}>{formatCurrency(selectedOrder.transaction?.total || selectedOrder.amount || selectedOrder.value || 0)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="modal-grid">
                    <div className="text-muted">Data do pedido</div>
                    <div style={{ color: 'var(--text-main)' }}>{new Date(selectedOrder.transaction?.registration_date || selectedOrder.created_at || selectedOrder.date || Date.now()).toLocaleString('pt-BR')}</div>

                    <div className="text-muted">Total dos itens (+)</div>
                    <div style={{ color: 'var(--text-main)' }}>{formatCurrency((selectedOrder.items && selectedOrder.items[0]?.value) || selectedOrder.transaction?.items || selectedOrder.amount || selectedOrder.value || 0)}</div>

                    <div className="text-muted" style={{ fontWeight: 600 }}>Valor da venda (=)</div>
                    <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{formatCurrency(selectedOrder.transaction?.total || selectedOrder.amount || selectedOrder.value || 0)}</div>

                    <div className="text-muted">Adquirente</div>
                    <div style={{ color: 'var(--text-main)' }}>Superfin</div>

                    <div className="text-muted">Meio de pagamento</div>
                    <div style={{ color: 'var(--text-main)' }}>{translateMethod(selectedOrder.payment?.method || selectedOrder.payment_method || selectedOrder.method)}</div>

                    <div className="text-muted">Condição de pagamento</div>
                    <div style={{ color: 'var(--text-main)' }}>{formatCurrency(selectedOrder.transaction?.total || selectedOrder.amount || selectedOrder.value || 0)} {selectedOrder.payment?.plots > 1 ? `em ${selectedOrder.payment.plots}x` : 'à vista'}</div>
                  </div>

                  <div style={{ 
                    background: getStatusPillClass(selectedOrder.status?.code || selectedOrder.status) === 'aprovada' ? 'var(--success)' : 
                                getStatusPillClass(selectedOrder.status?.code || selectedOrder.status) === 'recusada' ? 'var(--danger)' : 'var(--surface-hover)', 
                    color: 'white', 
                    padding: '1.2rem 1.5rem', 
                    borderRadius: '8px',
                    fontWeight: 600,
                    marginBottom: '2rem',
                    fontSize: '1rem',
                    display: 'flex',
                    alignItems: 'center',
                    boxShadow: '0 4px 15px rgba(0,0,0,0.1)'
                  }}>
                    Pagamento {translateStatus(selectedOrder.status?.code || selectedOrder.status).toUpperCase()} em {new Date(selectedOrder.status?.registration_date || selectedOrder.updated_at || selectedOrder.created_at || selectedOrder.date || Date.now()).toLocaleString('pt-BR')}
                  </div>

                  <div className="modal-grid" style={{ borderBottom: '1px solid var(--border)', paddingBottom: '2rem', marginBottom: '2rem' }}>
                    <div className="text-muted">Prazo para reembolso</div>
                    <div className="text-muted">7 dias após a compra (O comprador pode solicitar reembolso pela plataforma até essa data)</div>
                  </div>
                </>
              )}

              {activeTab === 'historico' && (
                <div className="animate-fade-in" style={{ marginBottom: '2.5rem' }}>
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-main)' }}>Histórico da Transação</h3>
                  <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border)', marginBottom: '2rem' }}>
                    {selectedOrder.status?.log?.length > 0 ? (
                      selectedOrder.status.log.map((logItem: any, idx: number) => (
                        <div key={idx} style={{ display: 'flex', gap: '1rem', marginBottom: idx !== selectedOrder.status.log.length - 1 ? '1rem' : 0 }}>
                          <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: 'var(--primary)', marginTop: '5px' }}></div>
                          <div>
                            <div style={{ fontWeight: 500, fontSize: '0.9rem', color: 'var(--text-main)' }}>{translateStatus(logItem.code)}</div>
                            <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)' }}>{logItem.message}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>{logItem.registration_date}</div>
                          </div>
                        </div>
                      ))
                    ) : (
                      <div className="text-muted" style={{ fontSize: '0.9rem' }}>Nenhum log de transação encontrado.</div>
                    )}
                  </div>
                  
                  <h3 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-main)' }}>Histórico de Transações do Cliente</h3>
                  <div style={{ background: 'var(--surface)', borderRadius: '12px', padding: '1rem', border: '1px solid var(--border)' }}>
                    {(() => {
                      const clientHistory = ordersData.filter(o => {
                        const emailMatch = o.customer?.email && selectedOrder.customer?.email && o.customer.email === selectedOrder.customer.email;
                        const docMatch = (o.customer?.doc || o.customer?.document) && (selectedOrder.customer?.doc || selectedOrder.customer?.document) && (o.customer.doc === selectedOrder.customer.doc || o.customer.document === selectedOrder.customer.document);
                        return emailMatch || docMatch;
                      });
                      return clientHistory.length > 0 ? (
                        <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'collapse' }}>
                          <thead>
                            <tr style={{ color: 'var(--text-muted)', textAlign: 'left', borderBottom: '1px solid var(--border)' }}>
                              <th style={{ paddingBottom: '0.5rem' }}>Data</th>
                              <th style={{ paddingBottom: '0.5rem' }}>ID</th>
                              <th style={{ paddingBottom: '0.5rem' }}>Valor</th>
                              <th style={{ paddingBottom: '0.5rem' }}>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {clientHistory.map((histOrder, idx) => (
                              <tr key={idx} style={{ borderBottom: idx !== clientHistory.length - 1 ? '1px solid var(--border)' : 'none' }}>
                                <td style={{ padding: '0.5rem 0' }}>{new Date(histOrder.transaction?.registration_date || histOrder.created_at || histOrder.date || Date.now()).toLocaleDateString('pt-BR')}</td>
                                <td style={{ padding: '0.5rem 0' }}>{histOrder.transaction?.code || histOrder.token || histOrder.id}</td>
                                <td style={{ padding: '0.5rem 0' }}>{formatCurrency(histOrder.transaction?.total || histOrder.amount || histOrder.value || 0)}</td>
                                <td style={{ padding: '0.5rem 0' }}><span style={{ color: getStatusPillClass(histOrder.status?.code || histOrder.status) === 'aprovada' ? 'var(--success)' : 'inherit' }}>{translateStatus(histOrder.status?.code || histOrder.status)}</span></td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      ) : (
                        <div className="text-muted" style={{ fontSize: '0.9rem' }}>Nenhuma outra compra encontrada para este cliente.</div>
                      );
                    })()}
                  </div>
                </div>
              )}

              {activeTab === 'rastreamento' && (
                <div className="animate-fade-in" style={{ marginBottom: '2.5rem' }}>
                  <table style={{ width: '100%', fontSize: '0.95rem', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                      <tr>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Propriedade</th>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Referência</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 500 }}>—</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>IP de acesso</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 500 }}>{selectedOrder.customer?.ip_address || '—'}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>SRC</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 500 }}>—</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>UTM source</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 500 }}>{selectedOrder.tracking?.utm_source || '—'}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>UTM medium</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 500 }}>{selectedOrder.tracking?.utm_medium || '—'}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>UTM campaign</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 500 }}>{selectedOrder.tracking?.utm_campaign || '—'}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>UTM term</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', fontWeight: 500 }}>{selectedOrder.tracking?.utm_term || '—'}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '1rem', borderBottom: 'none' }}>UTM content</td>
                        <td style={{ padding: '1rem', borderBottom: 'none', fontWeight: 500 }}>{selectedOrder.tracking?.utm_content || '—'}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              {activeTab === 'taxas' && (
                <div className="animate-fade-in" style={{ marginBottom: '2.5rem' }}>
                  <table style={{ width: '100%', fontSize: '0.95rem', borderCollapse: 'collapse' }}>
                    <thead style={{ background: 'rgba(0,0,0,0.2)' }}>
                      <tr>
                        <th style={{ padding: '1rem', textAlign: 'left', fontWeight: 600, color: 'var(--text-muted)' }}>Indicador</th>
                        <th style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, color: 'var(--text-muted)' }}>Valor</th>
                      </tr>
                    </thead>
                    <tbody>
                      <tr>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Total pago pelo comprador</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', textAlign: 'right', fontWeight: 600 }}>{formatCurrency(selectedOrder.transaction?.total || selectedOrder.amount || selectedOrder.value || 0)}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Valor da venda sem taxas e impostos</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', textAlign: 'right', fontWeight: 500 }}>{formatCurrency(selectedOrder.transaction?.subtotal || selectedOrder.amount || selectedOrder.value || 0)}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)' }}>Valor base para cálculo de comissões</td>
                        <td style={{ padding: '1rem', borderBottom: '1px solid var(--border)', textAlign: 'right', fontWeight: 500 }}>{formatCurrency(selectedOrder.transaction?.subtotal || selectedOrder.amount || selectedOrder.value || 0)}</td>
                      </tr>
                      <tr>
                        <td style={{ padding: '1rem', borderBottom: 'none' }}>Sua comissão</td>
                        <td style={{ padding: '1rem', borderBottom: 'none', textAlign: 'right', fontWeight: 600, color: 'var(--success)' }}>{formatCurrency(selectedOrder.transaction?.fee_producer || selectedOrder.amount || selectedOrder.value || 0)}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              )}

              <div className="modal-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div className="modal-actions-left" style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn-primary modal-action-btn" style={{ background: '#d3365b', color: 'white', padding: '0.8rem 1.5rem', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'filter 0.2s' }} onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'} onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}>
                    Estornar venda
                  </button>
                  <button className="btn-ghost modal-action-btn" style={{ background: 'var(--surface)', padding: '0.8rem 1.5rem', borderRadius: '8px', fontWeight: 600, border: '1px solid var(--border)', cursor: 'pointer' }}>
                    Alterar
                  </button>
                </div>
                <button className="btn-ghost modal-action-btn" style={{ background: 'var(--surface)', padding: '0.8rem 1.5rem', borderRadius: '8px', fontWeight: 600, border: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => setSelectedOrder(null)}>
                  Fechar
                </button>
              </div>

            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .page-header h1 {
          color: var(--text-main);
        }
        .filter-item:hover {
          background: var(--surface-hover);
        }
        .filter-item.active {
          background: var(--primary);
          color: white;
        }
        .modal-grid {
          display: grid;
          grid-template-columns: 250px 1fr;
          gap: 1rem;
          margin-bottom: 2.5rem;
          font-size: 0.95rem;
        }
        .modal-grid-150 {
          display: grid;
          grid-template-columns: 150px 1fr;
          gap: 1rem;
          margin-bottom: 2.5rem;
          font-size: 0.95rem;
        }

        @media (max-width: 768px) {
          .table-filters {
            flex-direction: column;
            align-items: stretch !important;
            gap: 0.75rem !important;
          }
          .page-header {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 1.5rem;
          }
          .page-header > div:first-child {
            order: 1;
          }
          .page-header .btn-primary {
            order: 2;
            width: 100%;
          }
          .modal-grid, .modal-grid-150 {
            grid-template-columns: 1fr;
            gap: 0.5rem;
          }
          .modal-tabs {
            flex-wrap: wrap;
            gap: 1rem !important;
          }
          .modal-actions {
            flex-direction: column;
            width: 100%;
            gap: 0.5rem;
          }
          .modal-actions-left {
            flex-direction: column;
            width: 100%;
            gap: 0.5rem !important;
          }
          .modal-action-btn {
            width: 100%;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
