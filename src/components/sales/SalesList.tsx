"use client";

import { useState, useEffect, useMemo } from 'react';
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

interface SalesListProps {
  title: string;
  description: string;
  statuses: string[];
}

export function SalesList({ title, description, statuses }: SalesListProps) {
  const [ordersData, setOrdersData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const [searchQuery, setSearchQuery] = useState('');
  const [timeRange, setTimeRange] = useState('Últimos 30 dias');
  const [isTimeMenuOpen, setIsTimeMenuOpen] = useState(false);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });

  const [selectedOrder, setSelectedOrder] = useState<any>(null);

  const timeOptions = ['Hoje', 'Últimos 7 dias', 'Últimos 30 dias', 'Esse mês', 'Personalizado'];

  useEffect(() => {
    setIsLoading(true);
    api.transactions.listOrders()
      .then(res => {
        const data = Array.isArray(res.data) ? res.data : Array.isArray(res) ? res : [];
        const filteredByStatus = data.filter((item: any) => {
          const s = (item.status || '').toLowerCase();
          return statuses.includes(s) || (statuses.length === 1 && statuses[0] === 'all');
        });
        setOrdersData(filteredByStatus);
      })
      .catch(err => {
        console.error("Erro ao buscar vendas:", err);
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [statuses]);

  // Filtragem (Busca + Data)
  const filteredData = useMemo(() => {
    return ordersData.filter(item => {
      const itemDate = item.created_at ? new Date(item.created_at) : new Date(item.date || Date.now());
      const now = new Date();
      
      const matchesSearch = 
        (item.description && item.description.toLowerCase().includes(searchQuery.toLowerCase())) || 
        (item.client && item.client.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (item.customer?.name && item.customer.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
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

      return matchesSearch && matchesTime;
    });
  }, [ordersData, searchQuery, timeRange, dateRange]);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

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

          {(searchQuery !== '' || timeRange !== 'Últimos 30 dias') && (
            <button 
              onClick={() => { setSearchQuery(''); setTimeRange('Últimos 30 dias'); setShowCustomDate(false); }}
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
                  const methodLow = (item.payment_method || item.method || '').toLowerCase();
                  return (
                    <tr key={item.id || i}>
                      <td className="id-text" style={{ fontSize: '0.8rem' }}>{item.token || item.id}</td>
                      <td style={{ fontWeight: 600 }}>{item.client || item.customer?.name || 'Cliente'}</td>
                      <td className="text-muted">{item.product || item.description || 'Produto'}</td>
                      <td className="text-muted">{new Date(item.created_at || item.date || Date.now()).toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' })}</td>
                      <td className="valor-text">{formatCurrency(item.amount || item.value || 0)}</td>
                      <td>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem', textTransform: 'capitalize' }}>
                          {methodLow.includes('credit') || methodLow.includes('cart') ? <CreditCard size={14} /> : 
                           methodLow.includes('pix') ? <Wallet size={14} /> : <Banknote size={14} />}
                          {item.payment_method || item.method || 'PIX'}
                        </div>
                      </td>
                      <td>
                        <span className={`status-pill ${(item.status || '').toLowerCase()}`}>
                          {item.status}
                        </span>
                      </td>
                      <td>
                        <button 
                          className="btn-ghost" 
                          onClick={() => setSelectedOrder(item)}
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
              
              <div style={{ display: 'flex', gap: '2rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem', marginBottom: '2rem' }}>
                <span style={{ fontWeight: 600, color: 'var(--primary)', borderBottom: '2px solid var(--primary)', paddingBottom: '0.6rem', marginBottom: '-0.5rem' }}>Geral</span>
                <span className="text-muted" style={{ cursor: 'pointer' }}>Histórico</span>
                <span className="text-muted" style={{ cursor: 'pointer' }}>Rastreamento</span>
                <span className="text-muted" style={{ cursor: 'pointer' }}>Taxas e comissões</span>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '150px 1fr', gap: '1rem', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
                <div className="text-muted">Cliente</div>
                <div style={{ fontWeight: 500 }}>{selectedOrder.client || selectedOrder.customer?.name || 'Cliente não informado'}</div>
                
                <div className="text-muted">Gênero</div>
                <div style={{ color: 'var(--text-main)' }}>Não informado</div>

                <div className="text-muted">Tipo</div>
                <div style={{ color: 'var(--text-main)' }}>Pessoa física</div>

                <div className="text-muted">CPF</div>
                <div style={{ color: 'var(--primary)' }}>{selectedOrder.customer?.document || '000.000.000-00'}</div>

                <div className="text-muted">E-mail</div>
                <div style={{ color: 'var(--primary)' }}>{selectedOrder.customer?.email || 'email@não.informado'}</div>
                
                <div className="text-muted">Telefone</div>
                <div style={{ color: 'var(--primary)' }}>{selectedOrder.customer?.phone || '+55 (00) 00000-0000'}</div>
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
                      <td style={{ padding: '1rem', borderBottom: 'none' }} className="text-muted">{selectedOrder.token || selectedOrder.id}</td>
                      <td style={{ padding: '1rem', fontWeight: 500, borderBottom: 'none' }}>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                          <div style={{ width: '36px', height: '36px', background: 'var(--surface-hover)', borderRadius: '6px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                            <Banknote size={16} />
                          </div>
                          {selectedOrder.product || selectedOrder.description || 'Produto Genérico'}
                        </div>
                      </td>
                      <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 600, borderBottom: 'none' }}>{formatCurrency(selectedOrder.amount || selectedOrder.value || 0)}</td>
                    </tr>
                  </tbody>
                </table>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '1rem', marginBottom: '2.5rem', fontSize: '0.95rem' }}>
                <div className="text-muted">Data do pedido</div>
                <div style={{ color: 'var(--text-main)' }}>{new Date(selectedOrder.created_at || selectedOrder.date || Date.now()).toLocaleString('pt-BR')}</div>

                <div className="text-muted">Total dos itens (+)</div>
                <div style={{ color: 'var(--text-main)' }}>{formatCurrency(selectedOrder.amount || selectedOrder.value || 0)}</div>

                <div className="text-muted" style={{ fontWeight: 600 }}>Valor da venda (=)</div>
                <div style={{ fontWeight: 600, color: 'var(--text-main)' }}>{formatCurrency(selectedOrder.amount || selectedOrder.value || 0)}</div>

                <div className="text-muted">Adquirente</div>
                <div style={{ color: 'var(--text-main)' }}>Pagar.me / PIX</div>

                <div className="text-muted">Meio de pagamento</div>
                <div style={{ color: 'var(--text-main)', textTransform: 'uppercase' }}>{selectedOrder.payment_method || selectedOrder.method || 'PIX'}</div>

                <div className="text-muted">Condição de pagamento</div>
                <div style={{ color: 'var(--text-main)' }}>{formatCurrency(selectedOrder.amount || selectedOrder.value || 0)} à vista</div>
              </div>

              <div style={{ 
                background: ['approved', 'paid', 'completed', 'aprovada'].includes((selectedOrder.status || '').toLowerCase()) ? 'var(--success)' : 
                            ['canceled', 'failed', 'cancelada'].includes((selectedOrder.status || '').toLowerCase()) ? 'var(--danger)' : 
                            ['refunded', 'estornado'].includes((selectedOrder.status || '').toLowerCase()) ? 'var(--warning)' : 'var(--surface-hover)', 
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
                Pagamento {(selectedOrder.status || '').toUpperCase()} em {new Date(selectedOrder.updated_at || selectedOrder.created_at || selectedOrder.date || Date.now()).toLocaleString('pt-BR')}
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '250px 1fr', gap: '1rem', fontSize: '0.95rem', borderBottom: '1px solid var(--border)', paddingBottom: '2rem', marginBottom: '2rem' }}>
                <div className="text-muted">Prazo para reembolso</div>
                <div className="text-muted">7 dias após a compra (O comprador pode solicitar reembolso pela plataforma até essa data)</div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button className="btn-primary" style={{ background: '#d3365b', color: 'white', padding: '0.8rem 1.5rem', border: 'none', borderRadius: '8px', fontWeight: 600, cursor: 'pointer', transition: 'filter 0.2s' }} onMouseEnter={e => e.currentTarget.style.filter = 'brightness(1.1)'} onMouseLeave={e => e.currentTarget.style.filter = 'brightness(1)'}>
                    Estornar venda
                  </button>
                  <button className="btn-ghost" style={{ background: 'var(--surface)', padding: '0.8rem 1.5rem', borderRadius: '8px', fontWeight: 600, border: '1px solid var(--border)', cursor: 'pointer' }}>
                    Alterar
                  </button>
                </div>
                <button className="btn-ghost" style={{ background: 'var(--surface)', padding: '0.8rem 1.5rem', borderRadius: '8px', fontWeight: 600, border: '1px solid var(--border)', cursor: 'pointer' }} onClick={() => setSelectedOrder(null)}>
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
        }
      `}</style>
    </DashboardLayout>
  );
}
