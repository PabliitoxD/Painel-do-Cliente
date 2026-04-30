import { Users2 } from 'lucide-react';
import { NavItem } from './types';

export const teamMenu: NavItem = {
  label: 'Minha equipe', 
  icon: Users2,
  subItems: [
    { label: 'Colaborador', href: '/team/collaborators' },
    { label: 'Perfil', href: '/team/profiles' },
  ]
};
