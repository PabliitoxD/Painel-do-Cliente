
export const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
};

export const translateStatus = (status: string) => {
  const s = status?.toLowerCase();
  switch (s) {
    case 'approved':
    case 'paid':
    case 'aprovada':
    case 'pago':
    case 'active':
      return 'Aprovado';
    case 'pending':
    case 'waiting_payment':
    case 'pendente':
    case 'not_paid':
      return 'Aguardando pagamento';
    case 'canceled':
    case 'cancelado':
    case 'cancelled':
      return 'Cancelado';
    case 'chargeback':
    case 'in_chargeback':
      return 'Chargeback';
    case 'refunded':
    case 'estornado':
    case 'reembolsado':
      return 'Estornado';
    case 'expired':
    case 'expirado':
      return 'Expirado';
    case 'suspended':
    case 'suspensa':
      return 'Suspensa';
    case 'confirmed':
    case 'concluido':
    case 'concluído':
      return 'Concluído';
    case 'requested':
    case 'solicitado':
      return 'Solicitado';
    case 'denied':
    case 'negado':
    case 'reprovado':
      return 'Reprovado';
    default:
      return status || 'N/A';
  }
};

export const translateMethod = (method: string) => {
  const m = method?.toLowerCase();
  if (m?.includes('pix')) return 'PIX';
  if (m?.includes('credit_card') || m?.includes('cartao') || m?.includes('cartão') || m?.includes('credit')) return 'Cartão de Crédito';
  if (m?.includes('boleto') || m?.includes('slip')) return 'Boleto';
  if (m?.includes('recurrence') || m?.includes('recorrência') || m?.includes('subscription')) return 'Recorrência';
  return method || 'N/A';
};

export const getStatusPillClass = (status: string) => {
  const s = status?.toLowerCase();
  // Verde: aprovada
  if (['approved', 'paid', 'aprovada', 'pago', 'active', 'confirmed', 'concluido', 'concluído'].includes(s)) return 'aprovada';
  
  // Vermelho: recusada (para cancelados, estornados, negados e chargebacks)
  if (['canceled', 'cancelado', 'cancelled', 'refunded', 'estornado', 'reembolsado', 'expired', 'expirado', 'suspended', 'denied', 'negado', 'reprovado', 'chargeback', 'in_chargeback'].includes(s)) return 'recusada';
  
  // Amarelo: aguardando (para pendentes e solicitações)
  return 'aguardando';
};
