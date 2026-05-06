"use client";

import { SalesList } from '@/components/sales/SalesList';

export default function ApprovedSalesPage() {
  return (
    <SalesList 
      title="Vendas Aprovadas" 
      description="Lista de transações concluídas com sucesso."
      statuses={['approved', 'completed', 'paid']} 
    />
  );
}
