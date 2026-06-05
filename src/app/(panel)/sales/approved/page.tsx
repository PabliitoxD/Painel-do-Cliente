"use client";

import { SalesList } from '@/components/sales/SalesList';

export default function ApprovedSalesPage() {
  return (
    <SalesList 
      title="Transações Aprovadas" 
      description="Lista de transações concluídas com sucesso."
      statuses={['paid']}
      apiStatuses={['PAID']}
      viewType="approved"
    />
  );
}
