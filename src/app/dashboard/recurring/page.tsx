"use client";

import { useState, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
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
  Clock
} from 'lucide-react';

/**
 * Dados fictícios para as assinaturas recorrentes.
 */
const RECURRING_DATA = [
  { 
    id: 'SUB-98721', 
    product: 'Mentoria Premium Anual', 
    client: 'Carlos Eduardo Oliveira', 
    createdAt: '2026-01-10', 
    frequency: 'Anual', 
    nextBilling: '2027-01-10', 
    value: 2400.00, 
    status: 'ativa' 
  },
  { 
    id: 'SUB-45210', 
    product: 'Curso Online de Design', 
    client: 'Ana Paula Souza', 
    createdAt: '2026-03-15', 
    frequency: 'Mensal', 
    nextBilling: '2026-04-15', 
    value: 97.00, 
    status: 'atrasada' 
  },
  { 
    id: 'SUB-33102', 
    product: 'Plataforma SaaS B2B', 
    client: 'Tech Solutions LTDA', 
    createdAt: '2025-12-20', 
    frequency: 'Trimestral', 
    nextBilling: '2026-03-20', 
    value: 499.90, 
    status: 'cancelada' 
  },
  { 
    id: 'SUB-11200', 
    product: 'Clube de Assinatura Fitness', 
    client: 'Mariana Lima', 
    createdAt: '2026-04-01', 
    frequency: 'Mensal', 
    nextBilling: '2026-05-01', 
    value: 129.00, 
    status: 'ativa' 
  },
  { 
    id: 'SUB-88765', 
    product: 'Hospedagem de Sites Pro', 
    client: 'Bruno Ferreira', 
    createdAt: '2026-02-15', 
    frequency: 'Semestral', 
    nextBilling: '2026-08-15', 
    value: 590.00, 
    status: 'ativa' 
  },
];

export default function RecurringPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');

  // Filtragem dos dados
  const filteredData = useMemo(() => {
    return RECURRING_DATA.filter(item => {
      const matchesSearch = item.product.toLowerCase().includes(searchQuery.toLowerCase()) || 
                           item.client.toLowerCase().includes(searchQuery.toLowerCase()) ||
                           item.id.toLowerCase().includes(searchQuery.toLowerCase());
      
      const matchesStatus = statusFilter === 'Todos' || item.status === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }, [searchQuery, statusFilter]);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const getStatusStyle = (status: string) => {
    switch(status) {
      case 'ativa': return { bg: 'rgba(49, 120, 44, 0.1)', color: 'var(--success)', label: 'Ativa' };
      case 'atrasada': return { bg: 'rgba(255, 177, 86, 0.1)', color: 'var(--warning)', label: 'Atrasada' };
      case 'cancelada': return { bg: 'rgba(203, 86, 86, 0.1)', color: 'var(--danger)', label: 'Cancelada' };
      default: return { bg: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-dim)', label: status };
    }
  };

  return (
    <DashboardLayout>
      <div className="recurring-page animate-fade-in">
        {/* Cabeçalho */}
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 700, marginBottom: '0.25rem' }}>Recorrências</h1>
            <p className="text-muted" style={{ fontSize: '0.95rem' }}>Gerencie suas assinaturas e planos recorrentes</p>
          </div>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} /> Exportar Recorrências
          </button>
        </div>

        {/* Métricas Rápidas */}
        <div className="stats-grid grid-3" style={{ marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Assinaturas Ativas</span>
              <CheckCircle2 size={20} style={{ color: 'var(--success)' }} />
            </div>
            <div className="stat-value">3</div>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Total de clientes recorrentes</p>
          </div>
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">MRR Estimado</span>
              <RefreshCcw size={20} style={{ color: 'var(--primary)' }} />
            </div>
            <div className="stat-value">R$ 1.545,00</div>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Faturamento mensal recorrente</p>
          </div>
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Inadimplência</span>
              <Clock size={20} style={{ color: 'var(--warning)' }} />
            </div>
            <div className="stat-value">1</div>
            <p className="text-muted" style={{ fontSize: '0.8rem' }}>Assinaturas aguardando pagamento</p>
          </div>
        </div>

        {/* Filtros */}
        <div className="table-filters card glass-panel" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem' }}>
          <div className="search-box" style={{ flex: 1, background: 'var(--background)', borderRadius: '12px', padding: '0 1rem' }}>
            <Search size={18} />
            <input 
              type="text" 
              placeholder="Buscar por produto, cliente ou ID..." 
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

        {/* Tabela de Recorrências */}
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
              {filteredData.map((item) => {
                const statusInfo = getStatusStyle(item.status);
                return (
                  <tr key={item.id}>
                    <td className="id-text" style={{ fontWeight: 600 }}>#{item.id}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.product}</span>
                        <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.3rem' }}>
                          <User size={12} /> {item.client}
                        </span>
                      </div>
                    </td>
                    <td className="text-muted">{formatDate(item.createdAt)}</td>
                    <td>
                      <span style={{ 
                        padding: '0.3rem 0.6rem', 
                        borderRadius: '6px', 
                        fontSize: '0.75rem', 
                        background: 'rgba(101, 131, 154, 0.1)', 
                        color: 'var(--primary)',
                        fontWeight: 600
                      }}>
                        {item.frequency}
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={14} className="text-dim" />
                        <span style={{ fontWeight: 500 }}>{formatDate(item.nextBilling)}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, fontSize: '1rem' }}>{formatCurrency(item.value)}</td>
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
        @media (max-width: 768px) {
          .table-filters {
            flex-direction: column;
            align-items: stretch !important;
            gap: 0.75rem !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
