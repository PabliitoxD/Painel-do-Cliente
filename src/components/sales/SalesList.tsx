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
import { TransactionDetails } from './TransactionDetails';

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

  const detailsRouter = useRouter();
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('geral');

  const timeOptions = ['Todos', 'Hoje', 'Últimos 7 dias', 'Últimos 30 dias', 'Esse mês', 'Personalizado'];

  useEffect(() => {
    setIsLoading(true);
    const statusList = apiStatuses || statuses;
    // Faz uma request por status e junta os resultados
    Promise.all(
      statusList.map(status =>
        api.transactions.listOrders({ status: status.toUpperCase() })
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
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                padding: '0.8rem 1.2rem', 
                borderRadius: '12px', 
                background: (timeRange !== 'Todos' || showCustomDate) ? 'rgba(101, 131, 154, 0.15)' : 'var(--surface)',
                border: (timeRange !== 'Todos' || showCustomDate) ? '1px solid var(--primary)' : '1px solid var(--border)',
                color: (timeRange !== 'Todos' || showCustomDate) ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: (timeRange !== 'Todos' || showCustomDate) ? 600 : 400,
                transition: 'all 0.2s'
              }}
            >
              <Calendar size={18} /> {timeRange} <ChevronDown size={14} />
            </button>
            {isTimeMenuOpen && (
              <div className="filter-menu glass-panel animate-fade-in" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', zIndex: 100, width: '250px', padding: '0.5rem', borderRadius: '12px', background: '#17242d', border: '1px solid var(--primary)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
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
                    style={{ width: '100%', textAlign: 'left', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-main)', background: 'transparent', border: 'none', cursor: 'pointer' }}
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
                        style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--primary)', borderRadius: '8px', padding: '0.6rem', color: 'white', colorScheme: 'dark', fontSize: '0.85rem', width: '100%', outline: 'none' }} 
                      />
                      <input 
                        type="date" 
                        value={dateRange.end} 
                        onChange={e => setDateRange({...dateRange, end: e.target.value})} 
                        style={{ background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--primary)', borderRadius: '8px', padding: '0.6rem', color: 'white', colorScheme: 'dark', fontSize: '0.85rem', width: '100%', outline: 'none' }} 
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
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.5rem', 
                padding: '0.8rem 1.2rem', 
                borderRadius: '12px', 
                background: paymentMethodFilter !== 'Todos' ? 'rgba(101, 131, 154, 0.15)' : 'var(--surface)',
                border: paymentMethodFilter !== 'Todos' ? '1px solid var(--primary)' : '1px solid var(--border)',
                color: paymentMethodFilter !== 'Todos' ? 'var(--primary)' : 'var(--text-main)',
                fontWeight: paymentMethodFilter !== 'Todos' ? 600 : 400,
                transition: 'all 0.2s'
              }}
            >
              <Wallet size={18} /> {paymentMethodFilter === 'Todos' ? 'Método' : paymentMethodFilter} <ChevronDown size={14} />
            </button>
            {isMethodMenuOpen && (
              <div className="filter-menu glass-panel animate-fade-in" style={{ position: 'absolute', top: '100%', right: 0, marginTop: '0.5rem', zIndex: 100, width: '200px', padding: '0.5rem', borderRadius: '12px', background: '#17242d', border: '1px solid var(--primary)', boxShadow: '0 10px 25px rgba(0,0,0,0.5)' }}>
                {methodOptions.map(opt => (
                  <button 
                    key={opt}
                    onClick={() => { 
                      setPaymentMethodFilter(opt); 
                      setIsMethodMenuOpen(false); 
                    }}
                    className={`filter-item ${paymentMethodFilter === opt ? 'active' : ''}`}
                    style={{ width: '100%', textAlign: 'left', padding: '0.6rem 1rem', borderRadius: '8px', fontSize: '0.9rem', color: 'var(--text-main)', background: 'transparent', border: 'none', cursor: 'pointer' }}
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
              ) : filteredData.length > 0 ? (
                filteredData.map((item, i) => {
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
                          onClick={() => setSelectedOrder(item)}
                          style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}
                        >
                          Detalhes
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
      </div>

      {/* Modal de Detalhes da Venda (Linha do Tempo / Completa) */}
      {selectedOrder && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.85)', zIndex: 9999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel animate-fade-in" style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '20px', maxWidth: '1400px', width: '100%', position: 'relative', border: '1px solid var(--border)', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <TransactionDetails orderId={selectedOrder.token || selectedOrder.id} onClose={() => setSelectedOrder(null)} />
          </div>
        </div>
      )}

      <style jsx>{`
        .page-header h1 {
          color: var(--text-main);
        }
        .filter-item {
          color: var(--text-main) !important;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-item:hover {
          background: var(--surface-hover) !important;
          color: white !important;
        }
        .filter-item.active {
          background: var(--primary) !important;
          color: white !important;
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
