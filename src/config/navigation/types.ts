import { LucideIcon } from 'lucide-react';

export interface NavSubItem {
  label: string;
  href?: string;
  subItems?: NavSubItem[];
}

export interface NavItem {
  label: string;
  href?: string;
  icon: LucideIcon;
  subItems?: NavSubItem[];
}
