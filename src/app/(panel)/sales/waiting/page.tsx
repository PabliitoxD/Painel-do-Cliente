"use client";

import { SalesList } from '@/components/sales/SalesList';

export default function WaitingSalesPage() {
  return (
    <SalesList 
      title="Vendas Pendentes" 
      description="Transações aguardando pagamento do cliente."
      statuses={['pending', 'waiting', 'pendente']} 
    />
  );
}
