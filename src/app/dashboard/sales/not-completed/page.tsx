"use client";

import { SalesPageTemplate } from '@/components/sales/SalesPageTemplate';
import { MoreHorizontal, CreditCard, AlertCircle } from 'lucide-react';

/**
 * Dados simulados para Vendas Não Concluídas.
 * Status: REFUSED ou NOT_COMPLETED.
 */
const DATA = [
  { id: '#NX882211A', client: 'Beatriz Lima', product: 'Curso Master Digital', date: '24/04/2026 15:45', value: 97.00, method: 'Cartão', status: 'REFUSED', reason: 'Saldo Insuficiente' },
  { id: '#MJ229910C', client: 'Ricardo Alves', product: 'Mentoria Exclusiva', date: '23/04/2026 10:20', value: 497.00, method: 'Cartão', status: 'NOT_COMPLETED', reason: 'Autenticação 3D falhou' },
  { id: '#KP112233D', client: 'Julia Mendes', product: 'Ebook Dieta 30 Dias', date: '22/04/2026 16:30', value: 55.90, method: 'Cartão', status: 'REFUSED', reason: 'Cartão Expirado' },
];

export default function NotCompletedSalesPage() {
  return (
    <SalesPageTemplate 
      title="Vendas Não Concluídas / Canceladas" 
      description="Transações de cartão de crédito que foram recusadas ou não finalizadas."
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
              <th>Motivo da Recusa</th>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--danger)', fontSize: '0.85rem' }}>
                    <AlertCircle size={14} />
                    {item.reason}
                  </div>
                </td>
                <td>
                  <span className="status-pill recusada">
                    {item.status === 'REFUSED' ? 'Recusada' : 'Não Concluída'}
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
