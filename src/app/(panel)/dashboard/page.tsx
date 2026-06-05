"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { 
  DollarSign, 
  Clock, 
  TrendingUp, 
  TrendingDown,
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
import { api } from '@/services/api';
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
  
  const [dbOrders, setDbOrders] = useState<any[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);
  
  const [transactions, setTransactions] = useState<any[]>([]);
  const [allOrders, setAllOrders] = useState<any[]>([]);
  const [pastOrders, setPastOrders] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [displayChartData, setDisplayChartData] = useState<any[]>([]);
  const [isMounted, setIsMounted] = useState(false);

  const [stats, setStats] = useState({
    faturamento: 0,
    faturamentoGrowth: 0,
    quantidade: 0,
    quantidadeGrowth: 0,
    metodoSelecionado: 0,
    taxaConversao: 0,
    metodoTotal: 0,
    metodoAprovados: 0,
    estornos: 0,
    estornosGrowth: 0,
    cancelamentos: 0,
    cancelamentosGrowth: 0,
    chargebacks: 0,
    chargebacksGrowth: 0,
  });

  // 1. Carrega dados do Cache do Navegador na montagem (para renderização instantânea)
  useEffect(() => {
    setIsMounted(true);
    
    const cachedStats = sessionStorage.getItem('tronnus_dash_stats');
    const cachedChart = sessionStorage.getItem('tronnus_dash_chart');
    const cachedOrders = sessionStorage.getItem('tronnus_dash_orders');
    
    if (cachedStats && cachedChart && cachedOrders) {
      try {
        setStats(JSON.parse(cachedStats));
        setDisplayChartData(JSON.parse(cachedChart));
        const parsedOrders = JSON.parse(cachedOrders);
        setAllOrders(parsedOrders);
        setTransactions(parsedOrders.slice(0, 5));
        setDbOrders(parsedOrders);
        setIsLoading(false); // Evita loaders se já possuir cache
      } catch (e) {
        sessionStorage.clear();
      }
    }
  }, []);

  // 2. Busca na API apenas uma vez na carga de montagem ou quando solicitado manualmente
  useEffect(() => {
    // Apenas ativa loading cheio se não tiver nada em cache
    if (!sessionStorage.getItem('tronnus_dash_stats')) {
      setIsLoading(true);
    }
    
    api.transactions.listOrders({ per_page: 250 })
      .then(res => {
        const data = res?.data?.orders || res?.orders || res?.data || (Array.isArray(res) ? res : []);
        const allOrdersFetched = Array.isArray(data) ? data : [];
        setDbOrders(allOrdersFetched);
      })
      .catch(err => console.error("Erro ao buscar transações:", err))
      .finally(() => setIsLoading(false));
  }, [refreshTrigger]);

  // 3. Atualiza e filtra os dados localmente sem requisições de rede lentas adicionais
  useEffect(() => {
    const today = new Date();
    let currentStart = new Date();
    let currentEnd = new Date();
    let pastStart = new Date();
    let pastEnd = new Date();

    if (selectedFilter === 'Hoje') {
      currentStart = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 0, 0, 0, 0);
      currentEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
      
      pastStart = new Date(currentStart);
      pastStart.setDate(pastStart.getDate() - 1);
      pastEnd = new Date(currentEnd);
      pastEnd.setDate(pastEnd.getDate() - 1);
    } else if (selectedFilter === 'Últimos 7 dias') {
      currentStart = new Date(today);
      currentStart.setDate(currentStart.getDate() - 7);
      currentStart.setHours(0, 0, 0, 0);
      currentEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
      
      pastStart = new Date(currentStart);
      pastStart.setDate(pastStart.getDate() - 7);
      pastEnd = new Date(currentStart);
      pastEnd.setHours(23, 59, 59, 999);
    } else if (selectedFilter === 'Este mês') {
      currentStart = new Date(today.getFullYear(), today.getMonth(), 1, 0, 0, 0, 0);
      currentEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
      
      pastStart = new Date(today.getFullYear(), today.getMonth() - 1, 1, 0, 0, 0, 0);
      pastEnd = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate(), 23, 59, 59, 999);
    } else if (selectedFilter === 'Últimos 30 dias') {
      currentStart = new Date(today);
      currentStart.setDate(currentStart.getDate() - 30);
      currentStart.setHours(0, 0, 0, 0);
      currentEnd = new Date(today.getFullYear(), today.getMonth(), today.getDate(), 23, 59, 59, 999);
      
      pastStart = new Date(currentStart);
      pastStart.setDate(pastStart.getDate() - 30);
      pastEnd = new Date(currentStart);
      pastEnd.setHours(23, 59, 59, 999);
    } else if (selectedFilter.startsWith('De ')) { // Personalizado
      if (dateRange.start) {
        currentStart = new Date(`${dateRange.start}T00:00:00`);
      }
      if (dateRange.end) {
        currentEnd = new Date(`${dateRange.end}T23:59:59`);
      }
      const diffMs = currentEnd.getTime() - currentStart.getTime();
      const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24)) || 1;
      
      pastStart = new Date(currentStart);
      pastStart.setDate(pastStart.getDate() - diffDays);
      pastEnd = new Date(currentStart);
      pastEnd.setHours(23, 59, 59, 999);
    }

    const currentFiltered = dbOrders.filter((t: any) => {
      if (!t) return false;
      const date = new Date(t.created_at || t.date);
      return date >= currentStart && date <= currentEnd;
    });

    const pastFiltered = dbOrders.filter((t: any) => {
      if (!t) return false;
      const date = new Date(t.created_at || t.date);
      return date >= pastStart && date <= pastEnd;
    });

    setAllOrders(currentFiltered);
    setPastOrders(pastFiltered);
    setTransactions(currentFiltered.slice(0, 5));
  }, [dbOrders, selectedFilter, dateRange.start, dateRange.end]);

  // 4. Calcula as métricas principais do período atual vs período anterior
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

      if (isApproved) {
        faturamento += amount;
      }
      quantidade += 1;
      
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

    // Período passado para cálculo do crescimento
    let faturamentoPast = 0;
    let quantidadePast = 0;
    let estornosPast = 0;
    let cancelamentosPast = 0;
    let chargebacksPast = 0;

    pastOrders.forEach((t: any) => {
      if (!t) return;
      const amount = parseAmount(t);
      const status = (t.status?.code || t.status || '').toLowerCase();
      const isApproved = ['approved', 'paid', 'aprovada', 'pago', 'completed', 'active', 'confirmed', 'concluido', 'concluído'].includes(status);

      if (isApproved) faturamentoPast += amount;
      quantidadePast += 1;
      
      if (['refunded', 'estornado', 'reembolsado'].includes(status)) estornosPast++;
      if (['canceled', 'cancelado', 'cancelled', 'failed'].includes(status)) cancelamentosPast++;
      if (status === 'chargeback') chargebacksPast++;
    });

    const taxaConversao = metodoSelecionadoTotal > 0 ? (metodoSelecionadoAprovados / metodoSelecionadoTotal) * 100 : 0;

    const calculateGrowth = (curr: number, past: number) => {
      if (past === 0) return curr > 0 ? 100 : 0;
      return ((curr - past) / past) * 100;
    };

    const computedStats = {
      faturamento,
      faturamentoGrowth: calculateGrowth(faturamento, faturamentoPast),
      quantidade,
      quantidadeGrowth: calculateGrowth(quantidade, quantidadePast),
      metodoSelecionado,
      taxaConversao,
      metodoTotal: metodoSelecionadoTotal,
      metodoAprovados: metodoSelecionadoAprovados,
      estornos,
      estornosGrowth: calculateGrowth(estornos, estornosPast),
      cancelamentos,
      cancelamentosGrowth: calculateGrowth(cancelamentos, cancelamentosPast),
      chargebacks,
      chargebacksGrowth: calculateGrowth(chargebacks, chargebacksPast)
    };

    setStats(computedStats);

    // Salva as estatísticas computadas no sessionStorage cache
    if (allOrders.length > 0) {
      sessionStorage.setItem('tronnus_dash_stats', JSON.stringify(computedStats));
      sessionStorage.setItem('tronnus_dash_orders', JSON.stringify(allOrders));
    }
  }, [allOrders, pastOrders, selectedPaymentMethod]);

  // 5. Atualiza os dados do gráfico baseado nas transações carregadas
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

    let finalChartData = [];
    if (selectedFilter === 'Hoje') {
      const hours = [0, 0, 0, 0];
      validOrders.forEach((t: any) => {
        const date = new Date(t.created_at || t.date);
        const hour = date.getHours();
        const amount = parseAmount(t);
        if (hour < 6) hours[0] += amount;
        else if (hour < 12) hours[1] += amount;
        else if (hour < 18) hours[2] += amount;
        else hours[3] += amount;
      });
      finalChartData = [
        { name: '00-06h', val: hours[0] },
        { name: '06-12h', val: hours[1] },
        { name: '12-18h', val: hours[2] },
        { name: '18-24h', val: hours[3] }
      ];
    } else {
      const dataMap: Record<string, number> = {};
      validOrders.forEach((t: any) => {
        const date = new Date(t.created_at || t.date);
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

      finalChartData = sortedDates.map(date => ({
        name: date,
        val: dataMap[date]
      }));
    }

    setDisplayChartData(finalChartData);
    if (allOrders.length > 0) {
      sessionStorage.setItem('tronnus_dash_chart', JSON.stringify(finalChartData));
    }
  }, [allOrders, selectedFilter]);

  const renderTrend = (growth: number) => {
    if (growth > 0) {
      return (
        <span className="stat-trend trend-up" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <TrendingUp size={14} /> +{growth.toFixed(1)}% vs. período anterior
        </span>
      );
    } else if (growth < 0) {
      return (
        <span className="stat-trend trend-down" style={{ display: 'flex', alignItems: 'center', gap: '4px' }}>
          <TrendingDown size={14} /> {growth.toFixed(1)}% vs. período anterior
        </span>
      );
    } else {
      return (
        <span className="stat-trend" style={{ background: 'rgba(255,255,255,0.05)', color: 'var(--text-muted)' }}>
          0.0% vs. período anterior
        </span>
      );
    }
  };

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
                        const formatDateStr = (dStr: string) => {
                          if (!dStr) return '?';
                          const parts = dStr.split('-');
                          if (parts.length !== 3) return dStr;
                          return `${parts[2]}/${parts[1]}/${parts[0]}`;
                        };
                        const startFormatted = formatDateStr(dateRange.start);
                        const endFormatted = formatDateStr(dateRange.end);
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
          <RotateCcw size={16} className="text-muted" style={{ cursor: 'pointer' }} onClick={() => setRefreshTrigger(prev => prev + 1)} />
        </div>

        {/* Stats Grid */}
        <div className="stats-grid">
          {/* Card: Faturamento */}
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Faturamento total</span>
              <div className="stat-icon-wrapper"><DollarSign size={24} /></div>
            </div>
            {isLoading ? (
              <div className="skeleton skeleton-value" />
            ) : (
              <div className="stat-value">{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.faturamento)}</div>
            )}
            <div className="stat-footer">
              {isLoading ? (
                <div className="skeleton skeleton-title" style={{ width: '120px' }} />
              ) : (
                renderTrend(stats.faturamentoGrowth)
              )}
            </div>
          </div>

          {/* Card: Quantidade de Transações */}
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Quantidade de transações</span>
              <div className="stat-icon-wrapper"><Clock size={24} /></div>
            </div>
            {isLoading ? (
              <div className="skeleton skeleton-value" />
            ) : (
              <div className="stat-value">{stats.quantidade}</div>
            )}
            <div className="stat-footer">
              {isLoading ? (
                <div className="skeleton skeleton-title" style={{ width: '120px' }} />
              ) : (
                renderTrend(stats.quantidadeGrowth)
              )}
            </div>
          </div>

          {/* Card: Método Selecionado */}
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">
                {selectedPaymentMethod === 'Recorrência' 
                  ? 'Transações na Recorrência' 
                  : `Transações no ${selectedPaymentMethod}`}
              </span>
              <div className="stat-icon-wrapper"><TrendingUp size={24} /></div>
            </div>
            {isLoading ? (
              <div className="skeleton skeleton-value" />
            ) : (
              <div className="stat-value">{Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(stats.metodoSelecionado)}</div>
            )}
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

          {/* Card: Estornos */}
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Estornos</span>
              <div className="stat-icon-wrapper"><RotateCcw size={24} /></div>
            </div>
            {isLoading ? (
              <div className="skeleton skeleton-value" />
            ) : (
              <div className="stat-value">{stats.estornos}</div>
            )}
            <div className="stat-footer">
              {isLoading ? (
                <div className="skeleton skeleton-title" style={{ width: '120px' }} />
              ) : (
                renderTrend(stats.estornosGrowth)
              )}
            </div>
          </div>

          {/* Card: Cancelamentos */}
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Cancelamentos</span>
              <div className="stat-icon-wrapper"><XCircle size={24} /></div>
            </div>
            {isLoading ? (
              <div className="skeleton skeleton-value" />
            ) : (
              <div className="stat-value">{stats.cancelamentos}</div>
            )}
            <div className="stat-footer">
              {isLoading ? (
                <div className="skeleton skeleton-title" style={{ width: '120px' }} />
              ) : (
                renderTrend(stats.cancelamentosGrowth)
              )}
            </div>
          </div>

          {/* Card: Chargeback */}
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Chargeback</span>
              <div className="stat-icon-wrapper"><AlertCircle size={24} /></div>
            </div>
            {isLoading ? (
              <div className="skeleton skeleton-value" />
            ) : (
              <div className="stat-value">{stats.chargebacks}</div>
            )}
            <div className="stat-footer">
              {isLoading ? (
                <div className="skeleton skeleton-title" style={{ width: '120px' }} />
              ) : (
                renderTrend(stats.chargebacksGrowth)
              )}
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="bottom-grid">
          <div className="table-card">
            <div className="card-header">
              <h2>Últimas transações</h2>
              <button className="btn-ghost" onClick={() => router.push('/sales/approved')}>Ver histórico</button>
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
                {isLoading && transactions.length === 0 ? (
                  Array.from({ length: 5 }).map((_, i) => (
                    <tr key={i}>
                      <td><div className="skeleton skeleton-text" style={{ width: '80px' }} /></td>
                      <td><div className="skeleton skeleton-text" style={{ width: '120px' }} /></td>
                      <td><div className="skeleton skeleton-text" style={{ width: '100px' }} /></td>
                      <td><div className="skeleton skeleton-text" style={{ width: '70px' }} /></td>
                      <td><div className="skeleton skeleton-text" style={{ width: '60px', height: '1.25rem', borderRadius: '20px' }} /></td>
                    </tr>
                  ))
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
            </div>
            <div style={{ width: '100%', height: 300 }}>
              {isLoading && displayChartData.length === 0 ? (
                <div className="skeleton" style={{ width: '100%', height: '100%', borderRadius: '12px' }} />
              ) : isMounted && (
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
