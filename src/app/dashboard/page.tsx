"use client";

import { useState } from 'react';
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
import './dashboard.css';

const chartData = [
  { name: 'Seg', val: 15000 },
  { name: 'Ter', val: 28000 },
  { name: 'Qua', val: 22000 },
  { name: 'Qui', val: 35000 },
  { name: 'Sex', val: 30000 },
  { name: 'Sab', val: 45000 },
  { name: 'Dom', val: 38000 },
];

const transactions = [
  { id: '#YXFQVFTFFX', client: 'Maria Rosa Soares', date: '12/09/25 15:33', value: 'R$ 97,00', status: 'aprovada' },
  { id: '#45G53571E', client: 'Hugo Costa', date: '12/09/25 14:57', value: 'R$ 55,90', status: 'aprovada' },
  { id: '#YXFQVFTFFX', client: 'Teresa Cristina Nunes', date: '12/09/25 13:11', value: 'R$ 97,00', status: 'aguardando' },
  { id: '#45G53571E', client: 'Olivia Schulz', date: '12/09/25 10:23', value: 'R$ 497,00', status: 'recusada' },
  { id: '#45G53571E', client: 'Selina Fonseca', date: '12/09/25 07:13', value: 'R$ 97,00', status: 'aprovada' },
];

export default function DashboardHome() {
  const { user } = useAuth();
  const [selectedFilter, setSelectedFilter] = useState('Últimos 7 dias');
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState('Pix');
  const [isFilterOpen, setIsFilterOpen] = useState(false);

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
            <img src="https://tronnus.com/wp-content/uploads/2026/01/tronnus-png-001.png" alt="TRONNUS" style={{ width: '100px', filter: 'brightness(0) invert(1)', opacity: 0.6 }} />
          </div>
        </div>

        {/* Filters */}
        <div className="dashboard-actions">
          <div className="filter-dropdown-container">
            <button className="filter-select" onClick={() => setIsFilterOpen(!isFilterOpen)}>
              {selectedFilter} <ChevronDown size={16} />
            </button>
            {isFilterOpen && (
              <div className="filter-menu glass-panel">
                {filters.map(f => (
                  <button 
                    key={f} 
                    className={`filter-item ${selectedFilter === f ? 'active' : ''}`}
                    onClick={() => { setSelectedFilter(f); setIsFilterOpen(false); }}
                  >
                    {f}
                  </button>
                ))}
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
              <div className="stat-icon-wrapper"><DollarSign size={30} /></div>
            </div>
            <div className="stat-value">R$ 534.321,23</div>
            <div className="stat-footer" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span className="stat-trend trend-up">+55,3%</span>
              <button className="saque-btn">Solicitar saque</button>
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Quantidade de vendas</span>
              <div className="stat-icon-wrapper"><Clock size={30} /></div>
            </div>
            <div className="stat-value">10.432</div>
            <span className="stat-trend trend-up">+2,1%</span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Total em vendas no {selectedPaymentMethod}</span>
              <div className="stat-icon-wrapper"><TrendingUp size={30} /></div>
            </div>
            <div className="stat-value">R$ 301.234,55</div>
            <div className="stat-footer">
              <span className="stat-trend trend-up">+4%</span>
              <div className="payment-chips">
                {paymentMethods.map(m => (
                  <span 
                    key={m} 
                    className={`chip ${selectedPaymentMethod === m ? 'active' : ''}`}
                    onClick={() => setSelectedPaymentMethod(m)}
                    style={{ cursor: 'pointer' }}
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
              <div className="stat-icon-wrapper"><RotateCcw size={30} /></div>
            </div>
            <div className="stat-value">22</div>
            <span className="stat-trend trend-down">-55,3%</span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Cancelamentos</span>
              <div className="stat-icon-wrapper"><XCircle size={30} /></div>
            </div>
            <div className="stat-value">2</div>
            <span className="stat-trend trend-up">+2,1%</span>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Chargeback</span>
              <div className="stat-icon-wrapper"><AlertCircle size={30} /></div>
            </div>
            <div className="stat-value">2</div>
            <span className="stat-trend trend-up">+2%</span>
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
                {transactions.map((t, i) => (
                  <tr key={i}>
                    <td className="id-text">{t.id}</td>
                    <td>{t.client}</td>
                    <td>{t.date}</td>
                    <td className="valor-text">{t.value}</td>
                    <td>
                      <span className={`status-pill ${t.status}`}>
                        {t.status.charAt(0).toUpperCase() + t.status.slice(1)}
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
                <AreaChart data={chartData}>
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
