"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign, 
  Clock, 
  TrendingUp, 
  XCircle, 
  RotateCcw, 
  AlertCircle,
  ChevronDown,
  Filter,
  MoreHorizontal
} from 'lucide-react';
import { 
  AreaChart, 
  Area, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer 
} from 'recharts';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { useAuth } from '@/context/AuthContext';
import { translateStatus, translateMethod, getStatusPillClass, formatCurrency } from '@/utils/formatters';
import '@/styles/dashboard.css';
import '@/styles/dashboard.css';

// Helper function to safely parse amount from raw numbers or formatted BRL currency strings
const parseAmount = (t: any): number => {
  if (!t) return 0;
  if (t.amount !== undefined && t.amount !== null && t.amount !== '') {
    const parsed = parseFloat(String(t.amount));
    if (!isNaN(parsed)) return parsed;
  }
  if (t.value !== undefined && t.value !== null && t.value !== '') {
    if (typeof t.value === 'number') return t.value;
    const cleaned = String(t.value)
      .replace(/R\$\s?/, '')
      .replace(/\./g, '')
      .replace(',', '.');
    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed)) return parsed;
  }
  return 0;
};

export default function DashboardHome() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('Este mês');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Pix');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayChartData, setDisplayChartData] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const [stats, setStats] = useState({
    faturamento: 0,
    quantidade: 0,
    metodoSelecionado: 0,
    taxaConversao: 0,
    metodoTotal: 0,
    metodoAprovados: 0,
    estornos: 0,
    cancelamentos: 0,
    chargebacks: 0,
  });

  // Calcula os totais sempre que as transações da API ou o método de pagamento mudam
  useEffect(() => {
    let faturamento = 0;
    let quantidade = 0;
    let metodoSelecionado = 0;
    let metodoSelecionadoTotal = 0;
    let metodoSelecionadoAprovados = 0;
    let estornos = 0;
    let cancelamentos = 0;
    let chargebacks = 0;
    
    allOrders.forEach((t: any) => {
      if (!t) return;
      const amount = parseAmount(t);
      const status = (t.status?.code || t.status || '').toLowerCase();
      const lastPay = t.payments?.length ? t.payments[t.payments.length - 1] : null;
      const actualMethod = lastPay?.payment_method?.description || lastPay?.payment_method?.method || t.payment?.method || t.payment_method || t.method || '';
      const method = String(actualMethod).toLowerCase();

      const isApproved = ['approved', 'paid', 'aprovada', 'pago', 'completed', 'active', 'confirmed', 'concluido', 'concluído'].includes(status);

      // Faturamento (consideramos vendas concluídas/aprovadas) e Quantidade (total)
      if (isApproved) {
        faturamento += amount;
      }
      quantidade += 1;
      
      // Filtrar por Método Selecionado
      const selectedMethodMap: Record<string, string[]> = {
        'Pix': ['pix'],
        'Cartão': ['credit_card', 'cartão', 'cartao', 'creditcard', 'credit'],
        'Boleto': ['boleto', 'bank_slip', 'slip'],
        'Recorrência': ['recurrence', 'recorrência', 'recorrencia', 'subscription']
      };
      
      const isMethodMatch = selectedMethodMap[selectedPaymentMethod]?.includes(method) || 
                           (selectedPaymentMethod === 'Cartão' && (method.includes('credit') || method.includes('cart'))) ||
                           (selectedPaymentMethod === 'Recorrência' && (t.recurrence || t.subscription));

      if (isMethodMatch) {
        metodoSelecionadoTotal++;
        if (isApproved) {
          metodoSelecionado += amount;
          metodoSelecionadoAprovados++;
        }
      }
      
      if (['refunded', 'estornado', 'reembolsado'].includes(status)) estornos++;
      if (['canceled', 'cancelado', 'cancelled', 'failed'].includes(status)) cancelamentos++;
      if (status === 'chargeback') chargebacks++;
    });

    const taxaConversao = metodoSelecionadoTotal > 0 ? (metodoSelecionadoAprovados / metodoSelecionadoTotal) * 100 : 0;

    setStats({
      faturamento,
      quantidade,
      metodoSelecionado,
      taxaConversao,
      metodoTotal: metodoSelecionadoTotal,
      metodoAprovados: metodoSelecionadoAprovados,
      estornos,
      cancelamentos,
      chargebacks
    });
  }, [allOrders, selectedPaymentMethod]);

  // Atualiza os dados do gráfico baseado nas transações carregadas
  useEffect(() => {
    if (!allOrders || allOrders.length === 0) {
      setDisplayChartData([{ name: 'Sem dados', val: 0 }]);
      return;
    }

    const validOrders = allOrders.filter((t: any) => {
      if (!t) return false;
      const status = (t.status?.code || t.status || '').toLowerCase();
      return ['approved', 'paid', 'aprovada', 'pago', 'completed', 'active', 'confirmed', 'concluido', 'concluído'].includes(status);
    });


    if (validOrders.length === 0) {
      setDisplayChartData([{ name: 'Sem dados', val: 0 }]);
      return;
    }

    if (selectedFilter === 'Hoje') {
      const hours = [0, 0, 0, 0];
      validOrders.forEach((t: any) => {
        const date = new Date(t.created_at);
        const hour = date.getHours();
        const amount = parseAmount(t);
        if (hour < 6) hours[0] += amount;
        else if (hour < 12) hours[1] += amount;
        else if (hour < 18) hours[2] += amount;
        else hours[3] += amount;
      });
      setDisplayChartData([
        { name: '00-06h', val: hours[0] },
        { name: '06-12h', val: hours[1] },
        { name: '12-18h', val: hours[2] },
        { name: '18-24h', val: hours[3] }
      ]);
    } else {
      const dataMap: Record<string, number> = {};
      validOrders.forEach((t: any) => {
        const date = new Date(t.created_at);
        const dateStr = `${date.getDate().toString().padStart(2, '0')}/${(date.getMonth() + 1).toString().padStart(2, '0')}`;
        const amount = parseAmount(t);
        dataMap[dateStr] = (dataMap[dateStr] || 0) + amount;
      });

      const sortedDates = Object.keys(dataMap).sort((a, b) => {
        const [dayA, monthA] = a.split('/').map(Number);
        const [dayB, monthB] = b.split('/').map(Number);
        if (monthA !== monthB) return monthA - monthB;
        return dayA - dayB;
      });

      let finalData = sortedDates.map(date => ({
        name: date,
        val: dataMap[date]
      }));

      setDisplayChartData(finalData);
    }
  }, [allOrders, selectedFilter]);

  // Atualiza os dados toda vez que o filtro muda
  useEffect(() => {
    setIsLoading(true);

    // Calcular datas para a API
    const today = new Date();
    let created_at_gt: string | undefined;
    let created_at_lt: string | undefined;
    
    if (selectedFilter === 'Hoje') {
      created_at_gt = new Date(today.setHours(0,0,0,0)).toISOString();
      created_at_lt = new Date(today.setHours(23,59,59,999)).toISOString();
    } else if (selectedFilter === 'Últimos 7 dias') {
      const past = new Date(today);
      past.setDate(past.getDate() - 7);
      created_at_gt = new Date(past.setHours(0,0,0,0)).toISOString();
      created_at_lt = new Date(new Date().setHours(23,59,59,999)).toISOString();
    } else if (selectedFilter === 'Este mês') {
      const startOfMonth = new Date(today.getFullYear(), today.getMonth(), 1);
      created_at_gt = new Date(startOfMonth.setHours(0,0,0,0)).toISOString();
      created_at_lt = new Date(new Date().setHours(23,59,59,999)).toISOString();
    } else if (selectedFilter === 'Últimos 30 dias') {
      const past = new Date(today);
      past.setDate(past.getDate() - 30);
      created_at_gt = new Date(past.setHours(0,0,0,0)).toISOString();
      created_at_lt = new Date(new Date().setHours(23,59,59,999)).toISOString();
    } else if (selectedFilter.startsWith('De ')) { // Personalizado
      if (dateRange.start) {
        created_at_gt = new Date(`${dateRange.start}T00:00:00`).toISOString();
      }
      if (dateRange.end) {
        created_at_lt = new Date(`${dateRange.end}T23:59:59`).toISOString();
      }
    }

    // 2. Chamar a API buscando todas as transações e filtrando no frontend
    import('@/services/api').then(({ api }) => {
      api.transactions.listOrders()
        .then(res => {
          const data = res?.data?.orders || res?.orders || res?.data || (Array.isArray(res) ? res : []);
          const allOrdersFetched = Array.isArray(data) ? data : [];
          
          // Filtra no frontend por datas de forma segura e consistente
          const filtered = allOrdersFetched.filter((t: any) => {
            if (!t) return false;
            if (!t.created_at && !t.date) return true;
            const date = new Date(t.created_at || t.date);
            const gt = created_at_gt ? new Date(created_at_gt) : null;
            const lt = created_at_lt ? new Date(created_at_lt) : null;
            if (gt && date < gt) return false;
            if (lt && date > lt) return false;
            return true;
          });

          setAllOrders(filtered);
          setTransactions(filtered.slice(0, 5));
        })
        .catch(err => console.error("Erro ao buscar transações:", err))
        .finally(() => setIsLoading(false));
    });
  }, [selectedFilter, dateRange.start, dateRange.end]);

  const filters = ['Hoje', 'Últimos 7 dias', 'Este mês', 'Últimos 30 dias', 'Personalizado'];
  const paymentMethods = ['Pix', 'Cartão', 'Boleto'];

  return (
    <DashboardLayout>
      <div className="dashboard-home animate-fade-in">
        {/* Welcome Section */}
        <div className="welcome-card">
          <div className="welcome-content">
            <h1>Bem-vindo de volta, {user?.name.split(' ')[0] || 'Produtor'}!</h1>
          </div>
          <div className="welcome-logo">
            <img src="https://tronnus.com/wp-content/uploads/2026/01/tronnus-png-001.png" alt="TRONNUS" style={{ width: '160px', filter: 'brightness(0) invert(1) drop-shadow(0 4px 12px rgba(101, 131, 154, 0.5))', opacity: 0.8 }} />
          </div>
        </div>

        {/* Filters */}
        <div className="dashboard-actions">
          <div className="filter-dropdown-container">
            <button className="filter-select" onClick={() => { setIsFilterOpen(!isFilterOpen); setShowCustomDate(false); }}>
              {selectedFilter.length > 20 ? selectedFilter.substring(0, 18) + '...' : selectedFilter} <ChevronDown size={16} />
            </button>
            {isFilterOpen && (
              <div className="filter-menu glass-panel">
                {filters.map(f => (
                  <button 
                    key={f} 
                    className={`filter-item ${selectedFilter === f && !showCustomDate ? 'active' : ''}`}
                    onClick={() => { 
                      if (f === 'Personalizado') {
                        setShowCustomDate(true);
                      } else {
                        setSelectedFilter(f); 
                        setIsFilterOpen(false); 
                      }
                    }}
                  >
                    {f}
                  </button>
                ))}
                
                {showCustomDate && (
                  <div className="custom-date-picker animate-fade-in" style={{ padding: '0.75rem', borderTop: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                      <input 
                        type="date" 
                        value={dateRange.start} 
                        onChange={e => setDateRange({...dateRange, start: e.target.value})} 
                        style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '6px', padding: '0.5rem', color: 'var(--text-main)', fontSize: '0.8rem', width: '100%' }} 
                      />
                      <span style={{ color: 'var(--text-muted)' }}>até</span>
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
                        setSelectedFilter(`De ${startFormatted} até ${endFormatted}`);
                        setIsFilterOpen(false);
                      }}
                    >
                      Aplicar Período
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
          <button className="clear-filters" onClick={() => setSelectedFilter('Este mês')}>
            <XCircle size={14} /> Limpar filtros
          </button>
          <RotateCcw size={16} className="text-muted" style={{ cursor: 'pointer' }} />
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Faturamento total</span>
              <div className="stat-icon-wrapper"><DollarSign size={24} /></div>
            </div>
            <div className="stat-value">{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.faturamento)}</div>
            <div className="stat-footer">
              <span className="stat-trend trend-up">—</span>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Quantidade de transações</span>
              <div className="stat-icon-wrapper"><Clock size={24} /></div>
            </div>
            <div className="stat-value">{stats.quantidade}</div>
            <span className="stat-trend trend-up">—</span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">
                {selectedPaymentMethod === 'Recorrência' 
                  ? 'Transações na Recorrência' 
                  : `Transações no ${selectedPaymentMethod}`}
              </span>
              <div className="stat-icon-wrapper"><TrendingUp size={24} /></div>
            </div>
            <div className="stat-value">{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.metodoSelecionado)}</div>
            <div className="stat-footer" style={{ flexDirection: 'column', alignItems: 'flex-start', gap: '0.8rem', width: '100%' }}>
              <div style={{ width: '100%' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.3rem' }}>
                  <span className="stat-trend trend-up" style={{ fontSize: '0.85rem', whiteSpace: 'nowrap' }}>
                    Conversão: {stats.taxaConversao.toFixed(1)}%
                  </span>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-main)', fontWeight: 500, whiteSpace: 'nowrap' }}>
                    {stats.metodoAprovados} de {stats.metodoTotal}
                  </span>
                </div>
                <div style={{ width: '100%', height: '6px', background: 'var(--border)', borderRadius: '3px', overflow: 'hidden' }}>
                  <div 
                    style={{ 
                      height: '100%', 
                      width: `${stats.taxaConversao}%`, 
                      background: stats.taxaConversao > 75 ? 'var(--success, #22c55e)' : stats.taxaConversao > 40 ? 'var(--warning, #eab308)' : 'var(--danger, #ef4444)',
                      transition: 'width 0.5s ease-in-out'
                    }} 
                  />
                </div>
              </div>
              <div className="payment-chips">
                {paymentMethods.map(m => (
                  <span 
                    key={m} 
                    className={`chip ${selectedPaymentMethod === m ? 'active' : ''}`}
                    onClick={() => setSelectedPaymentMethod(m)}
                  >
                    {m}
                  </span>
                ))}
              </div>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Estornos</span>
              <div className="stat-icon-wrapper"><RotateCcw size={24} /></div>
            </div>
            <div className="stat-value">{stats.estornos}</div>
            <span className="stat-trend trend-down">—</span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Cancelamentos</span>
              <div className="stat-icon-wrapper"><XCircle size={24} /></div>
            </div>
            <div className="stat-value">{stats.cancelamentos}</div>
            <span className="stat-trend trend-up">—</span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Chargeback</span>
              <div className="stat-icon-wrapper"><AlertCircle size={24} /></div>
            </div>
            <div className="stat-value">{stats.chargebacks}</div>
            <span className="stat-trend trend-down">—</span>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bottom-grid">
          <div className="table-card">
            <div className="card-header">
              <h2>Últimas transações</h2>
              <button className="btn-ghost">Ver histórico</button>
            </div>
            <table className="transactions-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Cliente</th>
                  <th>Data</th>
                  <th>Valor</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Carregando transações...</td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Nenhuma transação recente encontrada.</td>
                  </tr>
                ) : transactions.map((t, i) => (
                  <tr key={i}>
                    <td className="id-text" style={{ fontSize: '0.8rem' }}>
                      <a href={`/sales/${t.token || t.id}`} title={t.token || t.id} style={{ color: 'var(--primary)', textDecoration: 'none', cursor: 'pointer' }}>{(t.token || t.id || 'N/A').slice(0, 12)}...</a>
                      {(() => {
                        const actualMethod = t.payment?.method || t.payment_method || t.method || '';
                        const methodLow = actualMethod.toLowerCase();
                        if (t.recurrence || t.subscription || t.is_recurrence || methodLow.includes('recurrence') || methodLow.includes('subscription')) {
                          const p = String(t.recurrence?.periodicy || t.recurrence?.periodicity || t.subscription?.plan?.periodicity || '').toLowerCase();
                          let label = 'Recorrente';
                          if (p === '1' || p === 'monthly' || p === 'mensal') label = 'Mensal';
                          else if (p === '3' || p === 'quarterly' || p === 'trimestral') label = 'Trimestral';
                          else if (p === '6' || p === 'semiannual' || p === 'semestral') label = 'Semestral';
                          else if (p === '12' || p === 'yearly' || p === 'annual' || p === 'anual') label = 'Anual';
                          
                          return (
                            <div style={{ marginTop: '4px' }}>
                              <span style={{ fontSize: '0.65rem', padding: '2px 6px', background: 'rgba(0, 193, 180, 0.15)', color: '#00c1b4', borderRadius: '4px', textTransform: 'uppercase', fontWeight: 600, border: '1px solid rgba(0, 193, 180, 0.3)' }}>
                                {label}
                              </span>
                            </div>
                          );
                        }
                        return null;
                      })()}
                    </td>
                    <td>{t.client || t.customer_name || t.buyer?.name || t.customerName || 'N/A'}</td>
                    <td>{t.date || (t.created_at || t.createdAt ? new Date(t.created_at || t.createdAt).toLocaleString() : 'N/A')}</td>
                    <td>
                      <div className="valor-text">{t.value || formatCurrency(t.amount || 0)}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>{(() => {
                          const lastPay = t.payments?.length ? t.payments[t.payments.length - 1] : null;
                          return lastPay?.payment_method?.description || translateMethod(lastPay?.payment_method?.method || t.payment_method || t.method);
                        })()}</div>
                    </td>
                    <td>
                      <span className={`status-pill ${getStatusPillClass(t.status?.code || t.status)}`}>
                        {translateStatus(t.status?.code || t.status)}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="chart-card">
            <div className="card-header">
              <h2>Evolução do Faturamento</h2>
              {/* <button className="btn-ghost">Ver gráfico completo</button> */}
            </div>
            <div style={{ width: '100%', height: 300 }}>
              {isMounted && (
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={displayChartData}>
                    <defs>
                      <linearGradient id="colorVal" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#65839a" stopOpacity={0.3}/>
                        <stop offset="95%" stopColor="#65839a" stopOpacity={0}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#1b2932" />
                    <XAxis 
                      dataKey="name" 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#8a949e', fontSize: 11, fontWeight: 500 }} 
                      dy={10}
                    />
                    <YAxis 
                      axisLine={false} 
                      tickLine={false} 
                      tick={{ fill: '#8a949e', fontSize: 11, fontWeight: 500 }} 
                      tickFormatter={(val) => val >= 1000 ? `R$ ${(val/1000).toFixed(1)}k` : `R$ ${val}`}
                    />
                    <Tooltip 
                      contentStyle={{ backgroundColor: '#111a1f', border: '1px solid #1b2932', borderRadius: '10px' }}
                      itemStyle={{ color: '#fff' }}
                    />
                    <Area 
                      type="monotone" 
                      dataKey="val" 
                      stroke="#65839a" 
                      strokeWidth={3}
                      fillOpacity={1} 
                      fill="url(#colorVal)" 
                    />
                  </AreaChart>
                </ResponsiveContainer>
              )}
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
