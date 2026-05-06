"use client";

import { SalesList } from '@/components/sales/SalesList';

export default function ReversalsPage() {
  return (
    <SalesList 
      title="Estornos" 
      description="Transações devolvidas para os clientes."
      statuses={['refunded', 'estornado']} 
    />
  );
}
