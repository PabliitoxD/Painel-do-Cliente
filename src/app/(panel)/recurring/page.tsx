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
import { Pagination } from '@/components/ui/Pagination';

export default function RecurringPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('Todos');
  const [subscriptions, setSubscriptions] = useState<any[]>([]);
  const [selectedSubscription, setSelectedSubscription] = useState<any | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const perPage = 10;

  const [stats, setStats] = useState({
    active: 0,
    mrr: 0,
    overdue: 0
  });

  const loadSubscriptions = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res: any = await api.subscriptions.list({ page: currentPage, per_page: perPage });
      const data = res.subscriptions || [];
      const meta = res?.meta || res?.data?.meta;
      setTotalCount(meta?.total_count ?? meta?.totalCount ?? data.length);
      setSubscriptions(data);

      // Calcular estatísticas básicas
      let active = 0;
      let mrr = 0;
      let overdue = 0;

      data.forEach((sub: any) => {
        // status é número: 1=Aguardando ativação, 2=Ativo, 3=Excedido/Atrasado, 4=Cancelado
        const st = Number(sub.status);
        const price = parseFloat(sub.subscription_plans?.[0]?.price || sub.price || 0);

        if (st === 2) {
          active++;
          mrr += price;
        }
        if (st === 3) {
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
  }, [currentPage]);

  // Filtragem dos dados
  const filteredData = useMemo(() => {
    return subscriptions.filter(item => {
      const label = (item.customer?.name || item.subscription_plans?.[0]?.name || item.id || '').toLowerCase();
      const matchesSearch = label.includes(searchQuery.toLowerCase());

      const st = Number(item.status);
      const matchesStatus = statusFilter === 'Todos' ||
                           (statusFilter === 'ativa' && st === 2) ||
                           (statusFilter === 'atrasada' && st === 3) ||
                           (statusFilter === 'cancelada' && st === 4);
      
      return matchesSearch && matchesStatus;
    });
  }, [subscriptions, searchQuery, statusFilter]);

  useEffect(() => { setCurrentPage(1); }, [searchQuery, statusFilter]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('pt-BR');
  };

  const getStatusStyle = (status: any) => {
    const st = Number(status);
    if (st === 1) return { bg: 'rgba(255, 177, 86, 0.1)', color: 'var(--warning)', label: 'Aguardando ativação' };
    if (st === 2) return { bg: 'rgba(49, 120, 44, 0.1)', color: 'var(--success)', label: 'Ativo' };
    if (st === 3) return { bg: 'rgba(255, 177, 86, 0.1)', color: 'var(--warning)', label: 'Excedido' };
    if (st === 4) return { bg: 'rgba(203, 86, 86, 0.1)', color: 'var(--danger)', label: 'Cancelado' };
    return { bg: 'rgba(255, 255, 255, 0.05)', color: 'var(--text-dim)', label: String(status) };
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
                const subPlan = item.subscription_plans?.[0];
                const price = parseFloat(subPlan?.price || item.price || 0);

                return (
                  <tr key={item.id || Math.random()}>
                    <td className="id-text" style={{ fontWeight: 600 }}>#{(item.id || '—').slice(0, 8)}</td>
                    <td>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                        <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.code || 'Assinatura'}</span>
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
                        Mensal
                      </span>
                    </td>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                        <Calendar size={14} className="text-dim" />
                        <span style={{ fontWeight: 500 }}>{item.expiration_day ? `Dia ${item.expiration_day}` : '—'}</span>
                      </div>
                    </td>
                    <td style={{ fontWeight: 700, fontSize: '1rem' }}>{formatCurrency(price)}</td>
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
                      <button className="btn-ghost" onClick={() => setSelectedSubscription(item)} style={{ padding: '0.4rem' }}>
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
          <Pagination currentPage={currentPage} totalItems={totalCount} perPage={perPage} onPageChange={setCurrentPage} />
        </div>

        {/* MODAL DETALHES DA ASSINATURA */}
        {selectedSubscription && (
          <div className="modal-overlay" onClick={() => setSelectedSubscription(null)} style={{ position:'fixed', top:0, left:0, right:0, bottom:0, background:'rgba(0,0,0,0.5)', display:'flex', alignItems:'center', justifyContent:'center', zIndex:999, backdropFilter:'blur(4px)' }}>
            <div className="modal-content animate-fade-in" onClick={e => e.stopPropagation()} style={{ background:'var(--surface)', maxWidth:'650px', width:'95%', maxHeight:'85vh', overflowY:'auto', borderRadius:'16px', padding:'0', border:'1px solid var(--border)', boxShadow:'0 25px 50px -12px rgba(0,0,0,0.5)' }}>
              
              <div style={{ padding:'1.5rem', borderBottom:'1px solid var(--border)', display:'flex', justifyContent:'space-between', alignItems:'center', background:'rgba(255,255,255,0.02)' }}>
                <h2 style={{ fontSize:'1.25rem', fontWeight:600, display:'flex', alignItems:'center', gap:'0.5rem' }}>
                  <CreditCard className="text-primary" size={20} /> Detalhes da Assinatura
                </h2>
                <button className="btn-ghost" onClick={() => setSelectedSubscription(null)} style={{ padding:'0.4rem' }}><XCircle size={20} /></button>
              </div>

              <div style={{ padding:'1.5rem', display:'flex', flexDirection:'column', gap:'1.5rem' }}>
                
                {/* Header info */}
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', background:'var(--background)', padding:'1.25rem', borderRadius:'12px', border:'1px solid var(--border)' }}>
                  <div>
                    <p style={{ color:'var(--text-dim)', fontSize:'0.85rem', marginBottom:'0.25rem' }}>Status Atual</p>
                    <span className="status-pill" style={{ 
                      background: getStatusStyle(selectedSubscription.status).bg, 
                      color: getStatusStyle(selectedSubscription.status).color,
                      border: `1px solid ${getStatusStyle(selectedSubscription.status).color}33`,
                      fontSize:'0.8rem'
                    }}>
                      {getStatusStyle(selectedSubscription.status).label}
                    </span>
                  </div>
                  <div style={{ textAlign:'right' }}>
                    <p style={{ color:'var(--text-dim)', fontSize:'0.85rem', marginBottom:'0.25rem' }}>Valor Recorrente</p>
                    <p style={{ fontSize:'1.25rem', fontWeight:700, color:'var(--primary)' }}>
                      {formatCurrency(parseFloat(selectedSubscription.subscription_plans?.[0]?.price || selectedSubscription.price || 0))}
                    </p>
                  </div>
                </div>

                {/* Cliente Info */}
                <div>
                  <h3 style={{ fontSize:'1rem', fontWeight:600, marginBottom:'0.75rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <User size={16} className="text-dim"/> Dados do Cliente
                  </h3>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', background:'var(--background)', padding:'1.25rem', borderRadius:'12px', border:'1px solid var(--border)' }}>
                    <div>
                      <p style={{ fontSize:'0.8rem', color:'var(--text-dim)', marginBottom:'0.2rem' }}>Nome</p>
                      <p style={{ fontWeight:500 }}>{selectedSubscription.customer?.name || 'Não informado'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize:'0.8rem', color:'var(--text-dim)', marginBottom:'0.2rem' }}>E-mail</p>
                      <p style={{ fontWeight:500 }}>{selectedSubscription.customer?.email || 'Não informado'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize:'0.8rem', color:'var(--text-dim)', marginBottom:'0.2rem' }}>Documento (CPF/CNPJ)</p>
                      <p style={{ fontWeight:500 }}>{selectedSubscription.customer?.document || 'Não informado'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize:'0.8rem', color:'var(--text-dim)', marginBottom:'0.2rem' }}>Telefone</p>
                      <p style={{ fontWeight:500 }}>{selectedSubscription.customer?.phone || 'Não informado'}</p>
                    </div>
                  </div>
                </div>

                {/* Dados da Compra */}
                <div>
                  <h3 style={{ fontSize:'1rem', fontWeight:600, marginBottom:'0.75rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <CreditCard size={16} className="text-dim" /> Dados do Plano
                  </h3>
                  <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem', background:'var(--background)', padding:'1.25rem', borderRadius:'12px', border:'1px solid var(--border)' }}>
                    <div>
                      <p style={{ fontSize:'0.8rem', color:'var(--text-dim)', marginBottom:'0.2rem' }}>Produto/Plano Assinado</p>
                      <p style={{ fontWeight:500 }}>{selectedSubscription.code || 'Assinatura'}</p>
                    </div>
                    <div>
                      <p style={{ fontSize:'0.8rem', color:'var(--text-dim)', marginBottom:'0.2rem' }}>ID da Assinatura</p>
                      <p style={{ fontWeight:500, fontFamily:'monospace' }}>{selectedSubscription.id}</p>
                    </div>
                    <div>
                      <p style={{ fontSize:'0.8rem', color:'var(--text-dim)', marginBottom:'0.2rem' }}>Dia de Vencimento</p>
                      <p style={{ fontWeight:500 }}>
                        {selectedSubscription.expiration_day ? `Dia ${selectedSubscription.expiration_day}` : '—'}
                      </p>
                    </div>
                    <div>
                      <p style={{ fontSize:'0.8rem', color:'var(--text-dim)', marginBottom:'0.2rem' }}>Data de Criação</p>
                      <p style={{ fontWeight:500 }}>{formatDate(selectedSubscription.created_at)}</p>
                    </div>
                  </div>
                </div>

                {/* Histórico / Próxima Cobrança */}
                <div>
                  <h3 style={{ fontSize:'1rem', fontWeight:600, marginBottom:'0.75rem', display:'flex', alignItems:'center', gap:'0.5rem' }}>
                    <Clock size={16} className="text-dim"/> Histórico & Próxima Cobrança
                  </h3>
                  <div style={{ background:'var(--background)', padding:'1.25rem', borderRadius:'12px', border:'1px solid var(--border)' }}>
                    
                    <div style={{ display:'flex', gap:'1rem', alignItems:'flex-start', marginBottom:'1.25rem' }}>
                      <div style={{ marginTop:'0.2rem' }}><CheckCircle2 size={16} className="text-primary"/></div>
                      <div>
                        <p style={{ fontWeight:500, fontSize:'0.9rem' }}>Assinatura Iniciada</p>
                        <p style={{ fontSize:'0.8rem', color:'var(--text-dim)' }}>{formatDate(selectedSubscription.created_at)}</p>
                      </div>
                    </div>

                    <div style={{ position:'relative', paddingLeft:'0.45rem', marginLeft:'0.3rem', borderLeft:'2px dashed var(--border)', paddingBottom:'1.25rem', marginBottom:'1.25rem', marginTop:'-1.5rem', paddingTop:'1.5rem', zIndex:0 }}>
                    </div>

                    <div style={{ display:'flex', gap:'1rem', alignItems:'flex-start', marginTop:'-2.5rem', zIndex:1, position:'relative' }}>
                      <div style={{ marginTop:'0.2rem', background:'var(--background)' }}><Calendar size={16} className="text-warning"/></div>
                      <div>
                        <p style={{ fontWeight:500, fontSize:'0.9rem' }}>Próxima Cobrança Agendada</p>
                        <p style={{ fontSize:'0.8rem', color:'var(--text-dim)' }}>{formatDate(selectedSubscription.next_billing_date) || '—'}</p>
                      </div>
                    </div>
                    
                  </div>
                </div>

              </div>
              
              <div style={{ padding:'1.25rem 1.5rem', borderTop:'1px solid var(--border)', display:'flex', justifyContent:'flex-end', background:'var(--background)', borderBottomLeftRadius:'16px', borderBottomRightRadius:'16px' }}>
                <button className="btn-ghost" onClick={() => setSelectedSubscription(null)}>Fechar Detalhes</button>
              </div>

            </div>
          </div>
        )}
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
