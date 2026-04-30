import { LayoutDashboard, RefreshCcw, Users, HelpCircle } from 'lucide-react';
import { NavItem } from './types';

import { financeMenu } from './finance';
import { salesMenu } from './sales';
import { teamMenu } from './team';
import { settingsMenu } from './settings';

export const NAV_ITEMS: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  financeMenu,
  salesMenu,
  { label: 'Recorrência', href: '/recurring', icon: RefreshCcw },
  { label: 'Recebedores', href: '/receivers', icon: Users },
  teamMenu,
  settingsMenu,
  { label: 'Suporte', href: '/support', icon: HelpCircle },
];
