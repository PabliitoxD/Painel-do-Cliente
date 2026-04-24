"use client";

import { SalesPageTemplate } from '@/components/sales/SalesPageTemplate';
import { MoreHorizontal, CreditCard, Wallet, Banknote } from 'lucide-react';

/**
 * Dados simulados para Vendas Aprovadas.
 * Status: APPROVED ou COMPLETED.
 */
const DATA = [
  { id: '#YXFQVFTFFX', client: 'Maria Rosa Soares', product: 'Curso Master Digital', date: '24/04/2026 14:32', value: 97.00, method: 'Cartão', status: 'COMPLETED' },
  { id: '#45G53571E', client: 'Hugo Costa', product: 'Ebook Dieta 30 Dias', date: '24/04/2026 13:10', value: 55.90, method: 'PIX', status: 'APPROVED' },
  { id: '#89X23192B', client: 'Ana Paula Silva', product: 'Mentoria Exclusiva', date: '23/04/2026 16:45', value: 497.00, method: 'Cartão', status: 'COMPLETED' },
  { id: '#12Z88211M', client: 'Carlos Eduardo', product: 'Curso Master Digital', date: '23/04/2026 11:20', value: 97.00, method: 'Cartão', status: 'APPROVED' },
];

export default function ApprovedSalesPage() {
  return (
    <SalesPageTemplate 
      title="Vendas Aprovadas" 
      description="Lista de transações concluídas com sucesso no mês vigente."
    >
      <div className="table-card">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Produto</th>
              <th>Data</th>
              <th>Valor</th>
              <th>Método</th>
              <th>Status</th>
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            {DATA.map((item, i) => (
              <tr key={i}>
                <td className="id-text">{item.id}</td>
                <td style={{ fontWeight: 600 }}>{item.client}</td>
                <td className="text-muted">{item.product}</td>
                <td className="text-muted">{item.date}</td>
                <td className="valor-text">R$ {item.value.toFixed(2)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                    {item.method === 'Cartão' ? <CreditCard size={14} /> : 
                     item.method === 'PIX' ? <Wallet size={14} /> : <Banknote size={14} />}
                    {item.method}
                  </div>
                </td>
                <td>
                  <span className="status-pill aprovada">
                    {item.status === 'COMPLETED' ? 'Completa' : 'Aprovada'}
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
