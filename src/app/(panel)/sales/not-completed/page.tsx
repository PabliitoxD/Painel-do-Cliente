"use client";

import { SalesList } from '@/components/sales/SalesList';

export default function NotCompletedSalesPage() {
  return (
    <SalesList 
      title="Transações Não Concluídas" 
      description="Boletos vencidos, PIX não pagos e falhas no cartão."
      statuses={['not_paid', 'canceled']}
      apiStatuses={['NOT_PAID', 'CANCELED']}
      viewType="not-completed"
    />
  );
}
