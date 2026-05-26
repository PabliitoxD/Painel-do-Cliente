"use client";

import { SalesList } from '@/components/sales/SalesList';

export default function NotCompletedSalesPage() {
  return (
    <SalesList 
      title="Transações Não Concluídas" 
      description="Boletos vencidos, PIX não pagos e falhas no cartão."
      statuses={['canceled', 'failed', 'abandoned', 'cancelada', 'recusada', 'not_completed', 'não concluída']} 
      viewType="not-completed"
    />
  );
}
