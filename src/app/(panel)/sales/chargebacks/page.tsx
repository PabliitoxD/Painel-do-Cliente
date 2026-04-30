"use client";

import { SalesPageTemplate } from '@/components/sales/SalesPageTemplate';
import { MoreHorizontal, AlertTriangle, ShieldAlert } from 'lucide-react';

/**
 * Dados simulados para Chargebacks.
 * Status: CHARGEBACK.
 */
const DATA = [
  { id: '#CB223311K', client: 'Marcos Roberto', product: 'Mentoria Exclusiva', date: '22/04/2026 11:00', value: 497.00, method: 'Cartão', status: 'CHARGEBACK', reason: 'Fraude Amigável', deadline: '29/04/2026' },
  { id: '#CB554433L', client: 'Elaine Santos', product: 'Curso Master Digital', date: '18/04/2026 09:30', value: 97.00, method: 'Cartão', status: 'CHARGEBACK', reason: 'Transação não reconhecida', deadline: '25/04/2026' },
];

export default function ChargebacksSalesPage() {
  return (
    <SalesPageTemplate 
      title="Chargebacks" 
      description="Contestações de vendas realizadas via cartão de crédito."
    >
      {/* Alerta de Urgência */}
      <div className="card" style={{ background: 'rgba(203, 86, 86, 0.05)', borderColor: 'rgba(203, 86, 86, 0.2)', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '1.5rem' }}>
        <div style={{ width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(203, 86, 86, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--danger)' }}>
          <ShieldAlert size={24} />
        </div>
        <div>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, color: 'var(--text-main)', marginBottom: '0.2rem' }}>Atenção Necessária</h3>
          <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
            Chargebacks podem impactar a saúde da sua conta. Você tem até a data limite para enviar a defesa e tentar recuperar o valor.
          </p>
        </div>
      </div>

      <div className="table-card">
        <table className="transactions-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Cliente</th>
              <th>Data Venda</th>
              <th>Valor</th>
              <th>Motivo do Chargeback</th>
              <th>Prazo Defesa</th>
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
                <td className="valor-text" style={{ color: 'var(--danger)' }}>R$ {item.value.toFixed(2)}</td>
                <td>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--warning)', fontSize: '0.85rem' }}>
                    <AlertTriangle size={14} />
                    {item.reason}
                  </div>
                </td>
                <td style={{ fontWeight: 700, color: 'var(--danger)' }}>{item.deadline}</td>
                <td>
                  <span className="status-pill recusada">
                    Chargeback
                  </span>
                </td>
                <td>
                  <button className="btn-ghost" style={{ fontSize: '0.75rem', color: 'var(--primary)' }}>Enviar Defesa</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </SalesPageTemplate>
  );
}
