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
import '@/styles/dashboard.css';
import '@/styles/dashboard.css';

const chartData = [
  { name: 'Seg', val: 15000 },
  { name: 'Ter', val: 28000 },
  { name: 'Qua', val: 22000 },
  { name: 'Qui', val: 35000 },
  { name: 'Sex', val: 30000 },
  { name: 'Sab', val: 45000 },
  { name: 'Dom', val: 38000 },
];

export default function DashboardHome() {
  const router = useRouter();
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('Últimos 7 dias');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Pix');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [showCustomDate, setShowCustomDate] = useState(false);
  const [dateRange, setDateRange] = useState({ start: '', end: '' });
  const [transactions, setTransactions] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayChartData, setDisplayChartData] = useState(chartData);

  const [stats, setStats] = useState({
    faturamento: 0,
    quantidade: 0,
    metodoSelecionado: 0,
    estornos: 0,
    cancelamentos: 0,
    chargebacks: 0,
  });

  // Calcula os totais sempre que as transações da API ou o método de pagamento mudam
  useEffect(() => {
    let faturamento = 0;
    let quantidade = 0;
    let metodoSelecionado = 0;
    let estornos = 0;
    let cancelamentos = 0;
    let chargebacks = 0;
    
    allOrders.forEach((t: any) => {
      const amount = parseFloat(t.amount || t.value || 0);
      const status = t.status?.toLowerCase() || '';
      const method = t.payment_method?.toLowerCase() || t.method?.toLowerCase() || '';

      // Faturamento e Quantidade (consideramos vendas concluídas/aprovadas)
      if (status === 'approved' || status === 'paid' || status === 'aprovada' || status === 'pago') {
        faturamento += amount;
        quantidade += 1;
      }
      
      // Filtrar por Método Selecionado
      const selectedMethodMap: Record<string, string[]> = {
        'Pix': ['pix'],
        'Cartão': ['credit_card', 'cartão', 'cartao', 'creditcard', 'credit'],
        'Boleto': ['boleto', 'bank_slip'],
        'Recorrência': ['recurrence', 'recorrência', 'recorrencia', 'subscription']
      };
      
      if (selectedMethodMap[selectedPaymentMethod]?.includes(method)) {
        metodoSelecionado += amount;
      }
      
      if (status === 'refunded' || status === 'estornado') estornos++;
      if (status === 'canceled' || status === 'cancelado') cancelamentos++;
      if (status === 'chargeback') chargebacks++;
    });
    
    setStats({
      faturamento,
      quantidade,
      metodoSelecionado,
      estornos,
      cancelamentos,
      chargebacks
    });
  }, [allOrders, selectedPaymentMethod]);

  // Atualiza os dados toda vez que o filtro muda
  useEffect(() => {
    setIsLoading(true);
    
    // 1. Atualizar mock do Gráfico
    if (selectedFilter === 'Hoje') {
      setDisplayChartData([{ name: '00h', val: 1200 }, { name: '06h', val: 5000 }, { name: '12h', val: 15000 }, { name: '18h', val: 28000 }]);
    } else if (selectedFilter === 'Últimos 30 dias') {
      setDisplayChartData([{ name: 'Sem 1', val: 150000 }, { name: 'Sem 2', val: 280000 }, { name: 'Sem 3', val: 220000 }, { name: 'Sem 4', val: 350000 }]);
    } else {
      // Default (7 dias) ou Personalizado
      setDisplayChartData([
        { name: 'Seg', val: 15000 },
        { name: 'Ter', val: Math.floor(Math.random() * 40000) },
        { name: 'Qua', val: 22000 },
        { name: 'Qui', val: Math.floor(Math.random() * 40000) },
        { name: 'Sex', val: 30000 },
        { name: 'Sab', val: 45000 },
        { name: 'Dom', val: Math.floor(Math.random() * 40000) },
      ]);
    }

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

    // 2. Chamar a API passando as datas como parâmetros
    import('@/services/api').then(({ api }) => {
      api.transactions.listOrders({
        created_at_gt,
        created_at_lt,
        // payment_method: selectedPaymentMethod.toLowerCase() // Caso queira filtrar a tabela por método de pagamento também
      })
        .then(res => {
          const data = res.data || res || [];
          const allOrdersFetched = Array.isArray(data) ? data : [];
          setAllOrders(allOrdersFetched);
          const filtered = allOrdersFetched.slice(0, 5);
          setTransactions(filtered);
        })
        .catch(err => console.error("Erro ao buscar transações:", err))
        .finally(() => setIsLoading(false));
    });
  }, [selectedFilter, dateRange.start, dateRange.end]);

  const filters = ['Hoje', 'Últimos 7 dias', 'Últimos 30 dias', 'Personalizado'];
  const paymentMethods = ['Pix', 'Cartão', 'Boleto', 'Recorrência'];

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
          <button className="clear-filters" onClick={() => setSelectedFilter('Últimos 7 dias')}>
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
              <span className="stat-trend trend-up">+55,3%</span>
              <button className="saque-btn" onClick={() => router.push('/finance/withdrawals/requests')}>
                Solicitar saque
              </button>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Quantidade de vendas</span>
              <div className="stat-icon-wrapper"><Clock size={24} /></div>
            </div>
            <div className="stat-value">{stats.quantidade}</div>
            <span className="stat-trend trend-up">+2,1%</span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">
                {selectedPaymentMethod === 'Recorrência' 
                  ? 'Vendas na Recorrência' 
                  : `Vendas no ${selectedPaymentMethod}`}
              </span>
              <div className="stat-icon-wrapper"><TrendingUp size={24} /></div>
            </div>
            <div className="stat-value">{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.metodoSelecionado)}</div>
            <div className="stat-footer">
              <span className="stat-trend trend-up">+4%</span>
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
            <span className="stat-trend trend-down">-55,3%</span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Cancelamentos</span>
              <div className="stat-icon-wrapper"><XCircle size={24} /></div>
            </div>
            <div className="stat-value">{stats.cancelamentos}</div>
            <span className="stat-trend trend-up">+2,1%</span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Chargeback</span>
              <div className="stat-icon-wrapper"><AlertCircle size={24} /></div>
            </div>
            <div className="stat-value">{stats.chargebacks}</div>
            <span className="stat-trend trend-down">-2%</span>
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
                  <th>Ações</th>
                </tr>
              </thead>
              <tbody>
                {isLoading ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Carregando transações...</td>
                  </tr>
                ) : transactions.length === 0 ? (
                  <tr>
                    <td colSpan={6} style={{ textAlign: 'center', padding: '2rem' }}>Nenhuma transação recente encontrada.</td>
                  </tr>
                ) : transactions.map((t, i) => (
                  <tr key={i}>
                    <td className="id-text">{t.id || t.token || 'N/A'}</td>
                    <td>{t.client || t.customer_name || 'N/A'}</td>
                    <td>{t.date || new Date(t.created_at).toLocaleString() || 'N/A'}</td>
                    <td>
                      <div className="valor-text">{t.value || `R$ ${(t.amount || 0).toFixed(2)}`}</div>
                      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>{t.method || t.payment_method || 'N/A'}</div>
                    </td>
                    <td>
                      <span className={`status-pill ${t.status?.toLowerCase() || 'aprovada'}`}>
                        {(t.status || 'Aprovada').charAt(0).toUpperCase() + (t.status || 'aprovada').slice(1).toLowerCase()}
                      </span>
                    </td>
                    <td><MoreHorizontal size={16} className="text-muted" /></td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          <div className="chart-card">
            <div className="card-header">
              <h2>Média semanal</h2>
              <button className="btn-ghost">Ver gráfico completo</button>
            </div>
            <div style={{ width: '100%', height: 300 }}>
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
                    tickFormatter={(val) => `$${val/1000}k`}
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
            </div>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
