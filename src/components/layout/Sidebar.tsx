"use client";

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Wallet, 
  ShoppingBag, 
  RefreshCcw, 
  Users, 
  Users2, 
  Settings, 
  HelpCircle,
  Search
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { label: 'Financeiro', href: '/dashboard/finance', icon: Wallet },
  { label: 'Vendas', href: '/dashboard/sales', icon: ShoppingBag },
  { label: 'Recorrência', href: '/dashboard/recurring', icon: RefreshCcw },
  { label: 'Recebedores', href: '/dashboard/receivers', icon: Users },
  { label: 'Minha equipe', href: '/dashboard/team', icon: Users2 },
  { label: 'Configurações', href: '/dashboard/settings', icon: Settings },
  { label: 'Suporte', href: '/dashboard/support', icon: HelpCircle },
];

import { useAuth } from '@/context/AuthContext';

export function Sidebar() {
  const pathname = usePathname();
  const { user, logout } = useAuth();

  return (
    <aside className="sidebar">
      <div className="sidebar-profile">
        <div className="profile-avatar">
          <img src={user?.avatar || "https://ui-avatars.com/api/?name=User&background=1b2932&color=65839a"} alt={user?.name || "User"} />
        </div>
        <div className="profile-info">
          <span className="profile-name">{user?.name || 'Carregando...'}</span>
        </div>
      </div>

      <div className="sidebar-search">
        <div className="search-box">
          <Search size={16} />
          <input type="text" placeholder="Pesquisar..." />
        </div>
      </div>

      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          return (
            <Link 
              key={item.href} 
              href={item.href}
              className={`sidebar-link ${pathname === item.href ? 'active' : ''}`}
            >
              <Icon size={20} className="sidebar-icon" />
              {item.label}
            </Link>
          );
        })}
      </nav>

      <div className="sidebar-footer">
        <div className="footer-logo">
          <img src="https://tronnus.com/wp-content/uploads/2026/01/tronnus-png-001.png" alt="TRONNUS" style={{ width: '120px', filter: 'brightness(0) invert(1)', opacity: 0.8 }} />
        </div>
      </div>
    </aside>
  );
}
