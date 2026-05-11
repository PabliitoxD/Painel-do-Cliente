"use client";

import { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/services/api';
import { 
  RefreshCcw, 
  Search, 
  Filter, 
  Download,
  Calendar,
  MoreHorizontal,
  CreditCard,
  User,
  CheckCircle2,
  XCircle,
  Clock,
  AlertTriangle
} from 'lucide-react';
import { translateStatus, formatCurrency } from '@/utils/formatters';

export default function RecurringPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [stats, setStats] = useState({
    active: 0,
    mrr: 0,
    overdue: 0
  });

  const loadSubscriptions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.subscriptions.list({ per_page: 100 });
      const data = res.subscriptions || [];
      setSubscriptions(data);

      // Calcular estatísticas básicas
      let active = 0;
      let mrr = 0;
      let overdue = 0;

      data.forEach((sub: any) => {
        const status = (sub.status || '').toLowerCase();
        const price = parseFloat(sub.price || sub.plan?.price || 0);
        
        if (status === 'active' || status === 'ativa') {
          active++;
          mrr += price;
        }
        if (status === 'overdue' || status === 'atrasada' || status === 'waiting_payment') {
          overdue++;
        }
      });

      setStats({ active, mrr, overdue });
    } catch (err: any) {
      console.error("Erro ao buscar assinaturas:", err);
      setError(err.message || "Erro ao carregar assinaturas.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadSubscriptions();
  }, []);

  // Filtragem dos dados
  const filteredData = useMemo(() => {
    return subscriptions.filter(item => {
      const label = (item.customer?.name || item.plan?.name || item.token || '').toLowerCase();
      const matchesSearch = label.includes(searchQuery.toLowerCase());
      
      const status = (item.status || '').toLowerCase();
      const matchesStatus = statusFilter === 'Todos' || 
                           (statusFilter === 'ativa' && (status === 'active' || status === 'ativa')) ||
                           (statusFilter === 'atrasada' && (status === 'overdue' || status === 'atrasada' || status === 'waiting_payment')) ||
                           (statusFilter === 'cancelada' && (status === 'cancelled' || status === 'cancelada'));
      
      return matchesSearch && matchesStatus;
    });
  }, [subscriptions, searchQuery, statusFilter]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const getStatusStyle = (status: string) => {
    const s = status.toLowerCase();
    if (s === 'active' || s === 'ativa') return { bg: 'rgba(49, 120, 44, 0.1)', color: 'var(--success)', label: 'Ativa' };
    if (s === 'overdue' || s === 'atrasada' || s === 'waiting_payment') return { bg: 'rgba(255, 177, 86, 0.1)', color: 'var(--warning)', label: 'Atrasada' };
    if (s === 'cancelled' || s === 'cancelada') return { bg: 'rgba(203, 86, 86, 0.1)', color: 'var(--danger)', label: 'Cancelada' };
    return { bg: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-dim)', label: translateStatus(status) };
  };

  return (
    <DashboardLayout>
      <div className="recurring-page animate-fade-in">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Recorrências</h1>
            <p className="text-muted" style={{ fontSize: '0.95rem' }}>Gerencie suas assinaturas e planos recorrentes</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-ghost" onClick={loadSubscriptions} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.6rem 1rem' }}>
              <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} /> Atualizar
            </button>
            <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Download size={18} /> Exportar
            </button>
          </div>
        </div>

        {error && (
          <div className="card" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '1rem', marginBottom: '2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={20} />
            {error}
          </div>
        )}

        <div className="stats-grid grid-3" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Assinaturas Ativas</span>
              <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
            </div>
            <div className="stat-value">{stats.active}</div>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Total de clientes recorrentes</p>
          </div>
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">MRR Estimado</span>
              <RefreshCcw size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div className="stat-value">{formatCurrency(stats.mrr)}</div>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Faturamento mensal recorrente</p>
          </div>
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Inadimplência</span>
              <Clock size={20} style={{ color: 'var(--warning)' }} />
            </div>
            <div className="stat-value">{stats.overdue}</div>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Assinaturas aguardando pagamento</p>
          </div>
        </div>

        <div className="table-filters card glass-panel" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem' }}>
          <div className="search-box" style={{ flex: 1, background: 'var(--background)', borderRadius: '12px', padding: '0 1rem' }}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Buscar por cliente ou ID..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{ background: 'none', border: 'none', color: 'white', width: '100%', padding: '0.8rem 0.5rem', outline: 'none' }} 
            />
          </div>
          
          <select 
            className="btn-ghost" 
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            style={{ padding: '0.8rem 1.2rem', borderRadius: '12px', background: 'var(--background)', color: 'white', border: '1px solid var(--border)', outline: 'none' }}
          >
            <option value="Todos">Todos os Status</option>
            <option value="ativa">Ativas</option>
            <option value="atrasada">Atrasadas</option>
            <option value="cancelada">Canceladas</option>
          </select>
        </div>

        <div className="table-card">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>ID Assinatura</th>
                <th>Produto / Cliente</th>
                <th>Data Início</th>
                <th>Recorrência</th>
                <th>Próxima Cobrança</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    <div style={{ width: '30px', height: '30px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite', margin: '0 auto 1rem' }} />
                    Carregando assinaturas...
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan={8} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    Nenhuma assinatura encontrada.
                  </td>
                </tr>
              ) : filteredData.map((item) => {
                const statusInfo = getStatusStyle(item.status);
                const periodicity = item.plan?.periodicity || 1;
                const freqLabel = periodicity === 1 ? 'Mensal' : periodicity === 3 ? 'Trimestral' : periodicity === 6 ? 'Semestral' : periodicity === 12 ? 'Anual' : 'Personalizada';

                return (
                  <tr key={item.token}>
                    <td className="id-text" style={{ fontWeight: 600 }}>#{item.token.slice(0, 8)}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.plan?.name || 'Assinatura'}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <User size={12} /> {item.customer?.name || 'Cliente'}
                        </span>
                      </div>
                    </td>
                    <td className="text-muted">{formatDate(item.created_at)}</td>
                    <td>
                      <span style={{ 
                        padding: '0.3rem 0.6rem', 
                        borderRadius: '6px', 
                        fontSize: '0.75rem', 
                        background: 'rgba(101, 131, 154, 0.1)', 
                        color: 'var(--primary)',
                        fontWeight: 600
                      }}>
                        {freqLabel}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={14} className="text-dim" />
                        <span style={{ fontWeight: 500 }}>{formatDate(item.next_billing_date)}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, fontSize: '1rem' }}>{formatCurrency(parseFloat(item.price || item.plan?.price || 0))}</td>
                    <td>
                      <span className="status-pill" style={{ 
                        background: statusInfo.bg, 
                        color: statusInfo.color,
                        border: `1px solid ${statusInfo.color}33`
                      }}>
                        {statusInfo.label}
                      </span>
                    </td>
                    <td>
                      <button className="btn-ghost" style={{ padding: '0.4rem' }}>
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
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
