import { Settings } from 'lucide-react';
import { NavItem } from './types';

export const settingsMenu: NavItem = {
  label: 'Configurações', 
  icon: Settings,
  subItems: [
    { label: 'Minha Conta', href: '/settings/account' },
    { label: 'Meu Plano', href: '/settings/plan' },
    { label: 'Webhooks', href: '/settings/webhooks' },
    { label: 'Integração via API', href: '/settings/api' }
  ]
};
