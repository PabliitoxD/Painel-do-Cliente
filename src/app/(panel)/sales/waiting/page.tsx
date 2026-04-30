"use client";

import { SalesPageTemplate } from '@/components/sales/SalesPageTemplate';
import { MoreHorizontal, Wallet, Banknote, Clock } from 'lucide-react';

/**
 * Dados simulados para Vendas Aguardando Pagamento.
 * Status: WAITING (PIX/Boleto).
 */
const DATA = [
  { id: '#PX223311W', client: 'Fernanda Souza', product: 'Curso Master Digital', date: '24/04/2026 16:00', value: 97.00, method: 'PIX', status: 'WAITING', expires: '24/04/2026 16:30' },
  { id: '#BL998877Q', client: 'Marcos Vinicius', product: 'Mentoria Exclusiva', date: '23/04/2026 14:15', value: 497.00, method: 'Boleto', status: 'WAITING', expires: '26/04/2026' },
  { id: '#PX554433E', client: 'Patricia Lima', product: 'Ebook Dieta 30 Dias', date: '23/04/2026 09:10', value: 55.90, method: 'PIX', status: 'WAITING', expires: '23/04/2026 09:40' },
];

export default function WaitingSalesPage() {
  return (
    <SalesPageTemplate 
      title="Aguardando Pagamento" 
      description="Vendas via PIX e Boleto que ainda não foram compensadas."
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
              <th>Vencimento</th>
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
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)', fontSize: '0.85rem' }}>
                    <Clock size={14} />
                    {item.expires}
                  </div>
                </td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', fontSize: '0.8rem' }}>
                    {item.method === 'PIX' ? <Wallet size={14} /> : <Banknote size={14} />}
                    {item.method}
                  </div>
                </td>
                <td>
                  <span className="status-pill aguardando">
                    Aguardando
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
