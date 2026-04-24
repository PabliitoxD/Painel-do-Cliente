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
  Search,
  ChevronRight,
  ChevronDown
} from 'lucide-react';

const NAV_ITEMS = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { 
    label: 'Financeiro', 
    icon: Wallet,
    subItems: [
      { label: 'Extratos', href: '/dashboard/finance/statements' },
      { 
        label: 'Saques', 
        href: '/dashboard/finance/withdrawals',
        subItems: [
          { label: 'Histórico de saque', href: '/dashboard/finance/withdrawals/history' },
          { label: 'Solicitações de saque', href: '/dashboard/finance/withdrawals/requests' },
        ]
      },
      { label: 'Recebíveis', href: '/dashboard/finance/receivables' },
    ]
  },
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
          const hasSubItems = item.subItems && item.subItems.length > 0;
          const isActive = pathname === item.href || (hasSubItems && pathname.startsWith(item.href || ''));
          
          return (
            <div key={item.label} className="nav-group">
              {item.href ? (
                <Link 
                  href={item.href}
                  className={`sidebar-link ${isActive ? 'active' : ''}`}
                >
                  <Icon size={20} className="sidebar-icon" />
                  {item.label}
                  {hasSubItems && <ChevronDown size={14} className="chevron" />}
                </Link>
              ) : (
                <div className={`sidebar-link non-clickable ${isActive ? 'active' : ''}`}>
                  <Icon size={20} className="sidebar-icon" />
                  {item.label}
                  {hasSubItems && <ChevronDown size={14} className="chevron" />}
                </div>
              )}
              
              {hasSubItems && (
                <div className="sidebar-subnav">
                  {item.subItems.map((sub) => {
                    const subHasNested = sub.subItems && sub.subItems.length > 0;
                    const subIsActive = pathname === sub.href || (subHasNested && pathname.startsWith(sub.href || ''));
                    
                    return (
                      <div key={sub.label} className="sub-nav-group">
                        <Link 
                          href={sub.href || '#'}
                          className={`sidebar-sublink ${subIsActive ? 'active' : ''}`}
                        >
                          {sub.label}
                          {subHasNested && <ChevronDown size={12} className="chevron" />}
                        </Link>
                        
                        {subHasNested && (
                          <div className="sidebar-sub-subnav">
                            {sub.subItems.map((nested) => (
                              <Link 
                                key={nested.label}
                                href={nested.href}
                                className={`sidebar-sub-sublink ${pathname === nested.href ? 'active' : ''}`}
                              >
                                {nested.label}
                              </Link>
                            ))}
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
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
