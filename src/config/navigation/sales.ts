import { ShoppingBag } from 'lucide-react';
import { NavItem } from './types';

export const salesMenu: NavItem = {
  label: 'Vendas', 
  icon: ShoppingBag,
  subItems: [
    { label: 'Aprovadas', href: '/sales/approved' },
    { label: 'Não Concluídas', href: '/sales/not-completed' },
    { label: 'Aguardando Pagamento', href: '/sales/waiting' },
    { label: 'Estornos/Reembolsos', href: '/sales/reversals' },
    { label: 'Chargebacks', href: '/sales/chargebacks' },
  ]
};
