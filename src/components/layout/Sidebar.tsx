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
  { 
    label: 'Minha equipe', 
    icon: Users2,
    subItems: [
      { label: 'Colaborador', href: '/dashboard/team/collaborators' },
      { label: 'Perfil', href: '/dashboard/team/profiles' },
    ]
  },
  { label: 'Configurações', href: '/dashboard/settings', icon: Settings },
  { label: 'Suporte', href: '/dashboard/support', icon: HelpCircle },
];

import { useAuth } from '@/context/AuthContext';
import { X } from 'lucide-react';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

/**
 * Componente Sidebar principal com comportamento de Acordeão.
 * Gerencia a navegação e garante que apenas um submenu principal esteja aberto por vez.
 */
export function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const { user } = useAuth();
  
  // Estado para controlar qual menu principal está expandido (Accordion)
  const [openMenu, setOpenMenu] = useState<string | null>(null);
  // Estado para controlar submenus de nível 2
  const [openSubMenu, setOpenSubMenu] = useState<string | null>(null);

  /**
   * Alterna o estado de exibição de um menu principal.
   * @param label O nome do menu a ser alternado.
   */
  const toggleMenu = (label: string) => {
    setOpenMenu(openMenu === label ? null : label);
    setOpenSubMenu(null); // Fecha submenus internos ao trocar de menu principal
  };

  /**
   * Alterna o estado de exibição de um submenu.
   * @param label O nome do submenu a ser alternado.
   */
  const toggleSubMenu = (label: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setOpenSubMenu(openSubMenu === label ? null : label);
  };

  return (
    <aside className={`sidebar ${isOpen ? 'mobile-open' : ''}`}>
      {/* Botão de Fechar (apenas mobile) */}
      <button className="sidebar-close-btn" onClick={onClose}>
        <X size={24} />
      </button>

      {/* Seção de Perfil do Usuário */}
      <div className="sidebar-profile">
        <div className="profile-avatar">
          <img src={user?.avatar || "https://ui-avatars.com/api/?name=User&background=1b2932&color=65839a"} alt={user?.name || "User"} />
        </div>
        <div className="profile-info">
          <span className="profile-name">{user?.name || 'Administrador'}</span>
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
          
          // Verifica se o item está ativo baseado na URL ou se algum subitem está ativo
          const isActive = item.href ? pathname === item.href : 
            hasSubItems ? item.subItems?.some(sub => 
              pathname === sub.href || sub.subItems?.some(nested => pathname === nested.href)
            ) : false;
          
          // O menu expande se for clicado OU se estiver ativo pela URL (e nada mais foi clicado)
          const isExpanded = openMenu === item.label || (openMenu === null && isActive);
          
          return (
            <div key={item.label} className="nav-group">
              <div 
                className={`sidebar-link ${isActive ? 'active' : ''}`}
                onClick={() => hasSubItems && toggleMenu(item.label)}
                style={{ cursor: 'pointer' }}
              >
                {item.href && !hasSubItems ? (
                  <Link href={item.href} onClick={onClose} style={{ display: 'flex', alignItems: 'center', gap: 'inherit', width: '100%', color: 'inherit' }}>
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
                    const subIsExpanded = openSubMenu === sub.label || (openSubMenu === null && subIsActive);
                    
                    return (
                      <div key={sub.label} className="sub-nav-group">
                        <div 
                          className={`sidebar-sublink ${subIsActive ? 'active' : ''}`}
                          onClick={(e) => subHasNested && toggleSubMenu(sub.label, e)}
                          style={{ cursor: 'pointer' }}
                        >
                          {sub.href && !subHasNested ? (
                            <Link href={sub.href} onClick={onClose} style={{ flex: 1, color: 'inherit' }}>
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
                                onClick={onClose}
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
          <img src="https://tronnus.com/wp-content/uploads/2026/01/tronnus-png-001.png" alt="TRONNUS" style={{ width: '180px', filter: 'brightness(0) invert(1) drop-shadow(0 4px 12px rgba(101, 131, 154, 0.6))', opacity: 0.9 }} />
        </div>
      </div>
    </aside>
  );
}
