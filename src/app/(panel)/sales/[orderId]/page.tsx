"use client";

import { use } from 'react';
import { TransactionDetails } from '@/components/sales/TransactionDetails';

export default function TransactionDetailsPage({ params }: { params: Promise<{ orderId: string }> }) {
  const { orderId } = use(params);
  return <TransactionDetails orderId={orderId} />;
}
