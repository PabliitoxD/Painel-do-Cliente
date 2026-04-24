"use client";

import { SalesPageTemplate } from '@/components/sales/SalesPageTemplate';
import { MoreHorizontal, RotateCcw, MessageSquare } from 'lucide-react';

/**
 * Dados simulados para Vendas Estornadas/Reembolsadas.
 * Status: REVERSED ou CLAIMED.
 */
const DATA = [
  { id: '#RV882211X', client: 'Roberto Carlos', product: 'Mentoria Exclusiva', date: '24/04/2026 12:00', value: 497.00, method: 'Cartão', status: 'REVERSED', reason: 'Arrependimento (7 dias)', dateReversal: '24/04/2026' },
  { id: '#CL229910Y', client: 'Lúcia Helena', product: 'Curso Master Digital', date: '20/04/2026 10:15', value: 97.00, method: 'PIX', status: 'CLAIMED', reason: 'Acesso não recebido', dateReversal: '21/04/2026' },
  { id: '#RV112233Z', client: 'Thiago Oliveira', product: 'Ebook Dieta 30 Dias', date: '15/04/2026 14:30', value: 55.90, method: 'Cartão', status: 'REVERSED', reason: 'Duplicidade de compra', dateReversal: '16/04/2026' },
];

export default function ReversalsSalesPage() {
  return (
    <SalesPageTemplate 
      title="Vendas Estornadas / Reembolsadas" 
      description="Registros de devoluções e reembolsos processados no período."
    >
      <div className="table-card">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Data Venda</th>
              <th>Data Estorno</th>
              <th>Valor</th>
              <th>Motivo</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {DATA.map((item, i) => (
              <tr key={i}>
                <td className="id-text">{item.id}</td>
                <td style={{ fontWeight: 600 }}>{item.client}</td>
                <td className="text-muted">{item.date}</td>
                <td className="text-muted">{item.dateReversal}</td>
                <td className="valor-text" style={{ color: 'var(--danger)' }}>R$ {item.value.toFixed(2)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.85rem' }}>
                    <MessageSquare size={14} />
                    {item.reason}
                  </div>
                </td>
                <td>
                  <span className="status-pill recusada">
                    {item.status === 'REVERSED' ? 'Estornada' : 'Reembolsada'}
                  </span>
                </td>
                <td><MoreHorizontal size={18} className="text-muted" style={{ cursor: 'pointer' }} /></td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SalesPageTemplate>
  );
}
