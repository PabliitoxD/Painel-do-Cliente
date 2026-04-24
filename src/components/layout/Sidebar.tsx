"use client";

import { useState } from 'react';
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

/**
 * Definição dos itens de navegação da barra lateral.
 * Suporta sub-itens e sub-itens aninhados (até 3 níveis).
 */
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
  { 
    label: 'Vendas', 
    icon: ShoppingBag,
    subItems: [
      { label: 'Aprovadas', href: '/dashboard/sales/approved' },
      { label: 'Não Concluídas', href: '/dashboard/sales/not-completed' },
      { label: 'Aguardando Pagamento', href: '/dashboard/sales/waiting' },
      { label: 'Estornos/Reembolsos', href: '/dashboard/sales/reversals' },
      { label: 'Chargebacks', href: '/dashboard/sales/chargebacks' },
    ]
  },
  { label: 'Recorrência', href: '/dashboard/recurring', icon: RefreshCcw },
  { label: 'Recebedores', href: '/dashboard/receivers', icon: Users },
  { label: 'Minha equipe', href: '/dashboard/team', icon: Users2 },
  { label: 'Configurações', href: '/dashboard/settings', icon: Settings },
  { label: 'Suporte', href: '/dashboard/support', icon: HelpCircle },
];

import { useAuth } from '@/context/AuthContext';

/**
 * Componente Sidebar principal.
 * Gerencia a navegação, perfil do usuário e estados de colapso dos menus.
 */
export function Sidebar() {
  const pathname = usePathname();
  const { user } = useAuth();
  
  // Estado para controlar quais menus e submenus estão abertos/expandidos
  const [expandedMenus, setExpandedMenus] = useState<Record<string, boolean>>({});

  /**
   * Alterna o estado de exibição de um menu específico.
   * @param label O nome do menu a ser alternado.
   */
  const toggleMenu = (label: string) => {
    setExpandedMenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  return (
    <aside className="sidebar">
      {/* Seção de Perfil do Usuário */}
      <div className="sidebar-profile">
        <div className="profile-avatar">
          <img src={user?.avatar || "https://ui-avatars.com/api/?name=User&background=1b2932&color=65839a"} alt={user?.name || "User"} />
        </div>
        <div className="profile-info">
          <span className="profile-name">{user?.name || 'Carregando...'}</span>
        </div>
      </div>

      {/* Caixa de Pesquisa Global no Menu */}
      <div className="sidebar-search">
        <div className="search-box">
          <Search size={16} />
          <input type="text" placeholder="Pesquisar..." />
        </div>
      </div>

      {/* Navegação Principal */}
      <nav className="sidebar-nav">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const hasSubItems = item.subItems && item.subItems.length > 0;
          // Verifica se o item principal ou algum de seus filhos está ativo
          const isActive = pathname === item.href || (hasSubItems && pathname.startsWith(item.href || '/dashboard/finance'));
          const isExpanded = expandedMenus[item.label] || isActive;
          
          return (
            <div key={item.label} className="nav-group">
              {/* Item de Menu Principal */}
              <div 
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => hasSubItems && toggleMenu(item.label)}
                style={{ cursor: 'pointer' }}
              >
                {item.href && !hasSubItems ? (
                  <Link href={item.href} style={{ display: 'flex', alignItems: 'center', gap: 'inherit', width: '100%', color: 'inherit' }}>
                    <Icon size={20} className="sidebar-icon" />
                    {item.label}
                  </Link>
                ) : (
                  <>
                    <Icon size={20} className="sidebar-icon" />
                    <span style={{ flex: 1 }}>{item.label}</span>
                    {hasSubItems && (
                      <ChevronDown 
                        size={14} 
                        className="chevron" 
                        style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0)' }} 
                      />
                    )}
                  </>
                )}
              </div>
              
              {/* Renderização de Submenus (Nível 2) */}
              {hasSubItems && isExpanded && (
                <div className="sidebar-subnav">
                  {item.subItems.map((sub) => {
                    const subHasNested = sub.subItems && sub.subItems.length > 0;
                    const subIsActive = pathname === sub.href || (subHasNested && pathname.startsWith(sub.href || ''));
                    const subIsExpanded = expandedMenus[sub.label] || subIsActive;
                    
                    return (
                      <div key={sub.label} className="sub-nav-group">
                        <div 
                          className={`sidebar-sublink ${subIsActive ? 'active' : ''}`}
                          onClick={() => subHasNested && toggleMenu(sub.label)}
                          style={{ cursor: 'pointer' }}
                        >
                          {sub.href && !subHasNested ? (
                            <Link href={sub.href} style={{ flex: 1, color: 'inherit' }}>
                              {sub.label}
                            </Link>
                          ) : (
                            <>
                              <span style={{ flex: 1 }}>{sub.label}</span>
                              {subHasNested && (
                                <ChevronDown 
                                  size={12} 
                                  className="chevron" 
                                  style={{ transform: subIsExpanded ? 'rotate(180deg)' : 'rotate(0)' }} 
                                />
                              )}
                            </>
                          )}
                        </div>
                        
                        {/* Renderização de Submenus Aninhados (Nível 3) */}
                        {subHasNested && subIsExpanded && (
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

      {/* Rodapé do Menu com Logo */}
      <div className="sidebar-footer">
        <div className="footer-logo">
          <img src="https://tronnus.com/wp-content/uploads/2026/01/tronnus-png-001.png" alt="TRONNUS" style={{ width: '120px', filter: 'brightness(0) invert(1)', opacity: 0.8 }} />
        </div>
      </div>
    </aside>
  );
}
