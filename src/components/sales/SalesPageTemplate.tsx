"use client";

import { ReactNode } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Search, 
  Filter, 
  Download, 
  Calendar, 
  Package,
  ChevronDown
} from 'lucide-react';

interface SalesPageTemplateProps {
  title: string;
  description: string;
  children: ReactNode;
}

/**
 * Template base para as páginas de vendas.
 * Padroniza o cabeçalho, filtros e layout de container.
 */
export function SalesPageTemplate({ title, description, children }: SalesPageTemplateProps) {
  return (
    <DashboardLayout>
      <div className="sales-page animate-fade-in">
        {/* Cabeçalho com Título e Botão de Exportação */}
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>{title}</h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{description}</p>
          </div>
          <button className="btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Download size={18} /> Exportar Relatório
          </button>
        </div>

        {/* Barra de Filtros (Data e Produto) */}
        <div className="table-filters card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem' }}>
          {/* Busca por texto */}
          <div className="search-box filter-mobile-1" style={{ flex: 1, background: 'var(--background)', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', borderRadius: '10px' }}>
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Pesquisar venda, cliente ou ID..." 
              style={{ background: 'none', border: 'none', color: 'white', width: '100%', outline: 'none' }} 
            />
          </div>
          
          {/* Filtro de Data */}
          <button className="btn-ghost filter-mobile-2" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border)' }}>
            <Calendar size={18} /> Mês Atual <ChevronDown size={14} />
          </button>

          {/* Filtro de Produto */}
          <button className="btn-ghost filter-mobile-3" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border)' }}>
            <Package size={18} /> Todos os Produtos <ChevronDown size={14} />
          </button>

          {/* Mais Filtros */}
          <button className="btn-ghost filter-mobile-4" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', border: '1px solid var(--border)' }}>
            <Filter size={18} /> Filtros
          </button>
        </div>

        {/* Conteúdo da Página (Tabelas ou Gráficos) */}
        {children}
      </div>

      <style jsx>{`
        .page-header h1 {
          color: var(--text-main);
        }
        @media (max-width: 768px) {
          .table-filters {
            flex-direction: column;
            align-items: stretch !important;
            gap: 0.75rem !important;
          }
          .filter-mobile-1 { order: 1; }
          .filter-mobile-2 { order: 2; }
          .filter-mobile-3 { order: 3; }
          .filter-mobile-4 { order: 4; }
          
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
