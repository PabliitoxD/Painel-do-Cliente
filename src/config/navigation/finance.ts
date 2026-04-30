import { Wallet } from 'lucide-react';
import { NavItem } from './types';

export const financeMenu: NavItem = {
  label: 'Financeiro', 
  icon: Wallet,
  subItems: [
    { label: 'Extratos', href: '/finance/statements' },
    { label: 'Recebíveis', href: '/finance/receivables' },
    { 
      label: 'Saques', 
      href: '/finance/withdrawals',
      subItems: [
        { label: 'Histórico de saque', href: '/finance/withdrawals/history' },
        { label: 'Solicitações de saque', href: '/finance/withdrawals/requests' },
      ]
    },
  ]
};
