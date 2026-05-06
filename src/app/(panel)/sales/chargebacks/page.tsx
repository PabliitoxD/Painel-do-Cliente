"use client";

import { SalesList } from '@/components/sales/SalesList';

export default function ChargebacksPage() {
  return (
    <SalesList 
      title="Chargebacks" 
      description="Transações contestadas pelos clientes nos cartões de crédito."
      statuses={['chargeback', 'disputed']} 
    />
  );
}
