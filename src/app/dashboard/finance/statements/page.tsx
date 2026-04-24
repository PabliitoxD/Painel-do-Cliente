"use client";

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  ArrowUpRight, 
  ArrowDownLeft, 
  Search, 
  Filter, 
  Download,
  Calendar,
  Wallet,
  ArrowRightLeft
} from 'lucide-react';

/**
 * Dados fictícios para demonstração da tabela de extratos.
 * Em um cenário real, esses dados viriam de uma API.
 */
const EXTRACT_DATA = [
  { id: 1, type: 'Venda', date: '24/04/2026 14:32', description: 'Venda #YXFQVFTFFX', value: 97.00, status: 'aprovado' },
  { id: 2, type: 'Saque', date: '23/04/2026 10:15', description: 'Saque realizado - Bradesco', value: -1500.00, status: 'processado' },
  { id: 3, type: 'Estorno', date: '22/04/2026 16:45', description: 'Estorno cliente Maria Rosa', value: -55.90, status: 'estornado' },
  { id: 4, type: 'Chargeback', date: '21/04/2026 09:20', description: 'Contestação de venda #45G53571E', value: -497.00, status: 'bloqueado' },
  { id: 5, type: 'Venda', date: '21/04/2026 08:12', description: 'Venda #45G53571E', value: 497.00, status: 'aprovado' },
];

/**
 * Página de Extratos Financeiros.
 * Permite ao usuário visualizar todas as entradas e saídas de sua conta.
 */
export default function StatementsPage() {
  return (
    <DashboardLayout>
      <div className="statements-page animate-fade-in">
        {/* Cabeçalho da Página com Título e Ação Global */}
        <div className="page-header">
          <div>
            <h1>Extratos</h1>
            <p className="text-muted">Acompanhe sua movimentação financeira detalhada</p>
          </div>
          <button className="btn-primary">
            <Download size={18} /> Exportar CSV
          </button>
        </div>

        {/* Sumário Financeiro: Cards com métricas consolidadas */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '2rem' }}>
          {/* Card: Vendas Aprovadas */}
          <div className="stat-card">
            <span className="stat-title">Vendas Aprovadas</span>
            <div className="stat-value" style={{ fontSize: '1.8rem' }}>R$ 12.432,00</div>
            <span className="stat-trend trend-up">+12%</span>
          </div>
          {/* Card: Estornos e Reembolsos (Valor Negativo) */}
          <div className="stat-card">
            <span className="stat-title">Estornos/Reembolsos</span>
            <div className="stat-value" style={{ fontSize: '1.8rem', color: 'var(--danger)' }}>R$ -850,40</div>
            <span className="stat-trend trend-down">-5%</span>
          </div>
          {/* Card: Chargebacks (Métrica Crítica) */}
          <div className="stat-card">
            <span className="stat-title">Chargebacks</span>
            <div className="stat-value" style={{ fontSize: '1.8rem', color: 'var(--danger)' }}>R$ -497,00</div>
            <span className="stat-trend trend-down">+2%</span>
          </div>
          {/* Card: Total de Saques */}
          <div className="stat-card">
            <span className="stat-title">Saques Realizados</span>
            <div className="stat-value" style={{ fontSize: '1.8rem' }}>R$ 5.000,00</div>
            <span className="stat-trend trend-up">Este mês</span>
          </div>
        </div>

        {/* Barra de Filtros: Pesquisa por texto e filtros temporais */}
        <div className="table-filters card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center' }}>
          <div className="search-box" style={{ flex: 1, background: 'var(--background)' }}>
            <Search size={18} />
            <input type="text" placeholder="Buscar por descrição ou ID..." style={{ background: 'none', border: 'none', color: 'white', width: '100%', padding: '0.5rem' }} />
          </div>
          <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Calendar size={18} /> Últimos 30 dias
          </button>
          <button className="btn-ghost" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Filter size={18} /> Filtros avançados
          </button>
        </div>

        {/* Tabela de Extratos Detalhada */}
        <div className="table-card">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Tipo</th>
                <th>Data</th>
                <th>Descrição</th>
                <th>Valor</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {EXTRACT_DATA.map((item) => (
                <tr key={item.id}>
                  {/* Coluna Tipo: Mostra ícone e label baseado no valor (entrada/saída) */}
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ 
                        width: '32px', 
                        height: '32px', 
                        borderRadius: '8px', 
                        background: item.value > 0 ? 'rgba(49, 120, 44, 0.1)' : 'rgba(203, 86, 86, 0.1)',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        color: item.value > 0 ? 'var(--success)' : 'var(--danger)'
                      }}>
                        {item.type === 'Venda' ? <ArrowUpRight size={16} /> : 
                         item.type === 'Saque' ? <Wallet size={16} /> : <ArrowDownLeft size={16} />}
                      </div>
                      <span style={{ fontWeight: 500 }}>{item.type}</span>
                    </div>
                  </td>
                  <td className="text-muted">{item.date}</td>
                  <td>{item.description}</td>
                  {/* Valor: Colorido dinamicamente (Preto/Branco para positivo, Vermelho para negativo) */}
                  <td style={{ fontWeight: 600, color: item.value > 0 ? 'var(--text-main)' : 'var(--danger)' }}>
                    {item.value.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' })}
                  </td>
                  <td>
                    <span className={`status-pill ${item.status}`}>
                      {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                  </td>
                  <td>
                    <button className="btn-ghost" style={{ padding: '0.25rem' }}>
                      <ArrowRightLeft size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Estilos específicos da página (Scoped CSS) */}
      <style jsx>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }
        .page-header h1 {
          font-size: 1.8rem;
          margin-bottom: 0.25rem;
        }
        .text-muted {
          color: var(--text-muted);
          font-size: 0.9rem;
        }
      `}</style>
    </DashboardLayout>
  );
}
