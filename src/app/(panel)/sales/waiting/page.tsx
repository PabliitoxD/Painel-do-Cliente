"use client";

import { SalesList } from '@/components/sales/SalesList';

export default function WaitingSalesPage() {
  return (
    <SalesList 
      title="Transações Pendentes" 
      description="Transações aguardando pagamento do cliente."
      statuses={['waiting_payment']}
      apiStatuses={['WAITING_PAYMENT']}
      viewType="waiting"
    />
  );
}
