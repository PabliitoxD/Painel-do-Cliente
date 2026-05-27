"use client";

import { useNotifications, Notification } from '@/context/NotificationContext';
import { 
  CheckCircle2, DollarSign, AlertTriangle, RefreshCw, X, Trash2, CheckSquare 
} from 'lucide-react';
import { useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';

interface NotificationDropdownProps {
  onClose: () => void;
}

export function NotificationDropdown({ onClose }: NotificationDropdownProps) {
  const { notifications, unreadCount, markAsRead, markAllAsRead, clearAll } = useNotifications();
  const dropdownRef = useRef<HTMLDivElement>(null);
  const router = useRouter();

  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        onClose();
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [onClose]);

  const formatCurrency = (val: number) => {
    return val.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });
  };

  const handleNotifClick = (notif: Notification) => {
    markAsRead(notif.id);
    
    // Direcionar para a tela correspondente com base no status da notificação
    switch (notif.type) {
      case 'withdrawal_approved':
        router.push('/finance/withdrawals/history');
        break;
      case 'sale_approved':
        router.push('/sales/approved');
        break;
      case 'chargeback':
        router.push('/sales/chargebacks');
        break;
      case 'sale_refunded':
        router.push('/sales/reversals');
        break;
    }
    onClose();
  };

  const getIconAndColor = (type: Notification['type']) => {
    switch (type) {
      case 'withdrawal_approved':
        return {
          icon: <CheckCircle2 size={18} />,
          color: '#10b981',
          bg: 'rgba(16, 185, 129, 0.15)'
        };
      case 'sale_approved':
        return {
          icon: <DollarSign size={18} />,
          color: '#06b6d4',
          bg: 'rgba(6, 182, 212, 0.15)'
        };
      case 'chargeback':
        return {
          icon: <AlertTriangle size={18} />,
          color: '#ef4444',
          bg: 'rgba(239, 68, 68, 0.15)'
        };
      case 'sale_refunded':
        return {
          icon: <RefreshCw size={18} />,
          color: '#f59e0b',
          bg: 'rgba(245, 158, 11, 0.15)'
        };
    }
  };

  // Filtra as notificações limitando às 3 últimas ocorrências de cada status
  const getFilteredNotifications = () => {
    const types: Notification['type'][] = ['withdrawal_approved', 'sale_approved', 'chargeback', 'sale_refunded'];
    const allowedIds = new Set<string>();
    
    types.forEach(t => {
      notifications
        .filter(n => n.type === t)
        .slice(0, 3)
        .forEach(n => allowedIds.add(n.id));
    });
    
    return notifications.filter(n => allowedIds.has(n.id));
  };

  const displayedNotifications = getFilteredNotifications();

  return (
    <div className="notification-dropdown glass-panel animate-fade-in" ref={dropdownRef}>
      <div className="notif-header">
        <div>
          <h3>Notificações</h3>
          <div className="notif-sub-header">
            <span className="notif-badge-count">{unreadCount} não lidas</span>
            <span className="notif-separator">•</span>
            <span className="notif-total-count">{notifications.length} total</span>
          </div>
        </div>
        <div className="header-actions">
          {notifications.length > 0 && (
            <>
              <button 
                onClick={markAllAsRead} 
                className="notif-action-btn" 
                title="Marcar todas como lidas"
              >
                <CheckSquare size={16} />
              </button>
              <button 
                onClick={clearAll} 
                className="notif-action-btn" 
                title="Limpar todas"
              >
                <Trash2 size={16} />
              </button>
            </>
          )}
          <button onClick={onClose} className="notif-close-btn">
            <X size={18} />
          </button>
        </div>
      </div>

      <div className="notif-list">
        {displayedNotifications.length === 0 ? (
          <div className="notif-empty">
            <p>Você não tem nenhuma notificação.</p>
          </div>
        ) : (
          displayedNotifications.map(notif => {
            const config = getIconAndColor(notif.type);
            return (
              <div 
                key={notif.id} 
                className={`notif-item ${notif.read ? 'read' : 'unread'}`}
                onClick={() => handleNotifClick(notif)}
              >
                <div 
                  className="notif-icon-wrapper" 
                  style={{ backgroundColor: config.bg, color: config.color }}
                >
                  {config.icon}
                </div>
                <div className="notif-content">
                  <div className="notif-title-row">
                    <span className="notif-title">{notif.title}</span>
                    {!notif.read && <span className="notif-dot" />}
                  </div>
                  <p className="notif-message">{notif.message}</p>
                  {notif.amount !== undefined && (
                    <div className="notif-amount" style={{ color: config.color }}>
                      {formatCurrency(notif.amount)}
                    </div>
                  )}
                  <span className="notif-date">{notif.date}</span>
                </div>
              </div>
            );
          })
        )}
      </div>

      <style jsx>{`
        .notification-dropdown {
          position: absolute;
          top: 70px;
          right: 20px;
          width: 380px;
          max-height: 480px;
          display: flex;
          flex-direction: column;
          border-radius: 20px;
          border: 1px solid rgba(255, 255, 255, 0.08);
          background: rgba(13, 17, 23, 0.95);
          box-shadow: 0 15px 40px rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(12px);
          z-index: 1000;
          overflow: hidden;
        }

        .notif-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1.2rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.06);
        }

        .notif-header h3 {
          margin: 0;
          font-size: 1.1rem;
          font-weight: 800;
          color: white;
        }

        .notif-sub-header {
          display: flex;
          align-items: center;
          gap: 0.4rem;
          margin-top: 0.2rem;
        }

        .notif-badge-count, .notif-total-count {
          font-size: 0.8rem;
          color: var(--text-dim);
          font-weight: 600;
        }

        .notif-separator {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.2);
        }

        .header-actions {
          display: flex;
          align-items: center;
          gap: 0.8rem;
        }

        .notif-action-btn {
          background: transparent;
          border: none;
          color: var(--text-dim);
          cursor: pointer;
          transition: color 0.2s;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .notif-action-btn:hover {
          color: white;
        }

        .notif-close-btn {
          background: rgba(255, 255, 255, 0.05);
          border: none;
          border-radius: 50%;
          width: 28px;
          height: 28px;
          display: flex;
          align-items: center;
          justify-content: center;
          color: var(--text-dim);
          cursor: pointer;
          transition: all 0.2s;
        }

        .notif-close-btn:hover {
          background: rgba(255, 255, 255, 0.1);
          color: white;
        }

        .notif-list {
          overflow-y: auto;
          flex: 1;
        }

        .notif-empty {
          padding: 3rem 1.5rem;
          text-align: center;
          color: var(--text-dim);
          font-size: 0.95rem;
        }

        .notif-item {
          display: flex;
          gap: 1rem;
          padding: 1.2rem 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.03);
          cursor: pointer;
          transition: all 0.2s;
        }

        .notif-item:hover {
          background: rgba(255, 255, 255, 0.02);
        }

        .notif-item.unread {
          background: rgba(255, 255, 255, 0.01);
        }

        .notif-icon-wrapper {
          width: 36px;
          height: 36px;
          border-radius: 12px;
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
        }

        .notif-content {
          flex: 1;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }

        .notif-title-row {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .notif-title {
          font-weight: 700;
          font-size: 0.95rem;
          color: white;
        }

        .notif-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: var(--primary);
          box-shadow: 0 0 8px var(--primary-glow);
        }

        .notif-message {
          font-size: 0.85rem;
          color: rgba(255, 255, 255, 0.7);
          margin: 0;
          line-height: 1.4;
        }

        .notif-amount {
          font-size: 0.9rem;
          font-weight: 800;
          margin-top: 0.2rem;
        }

        .notif-date {
          font-size: 0.75rem;
          color: var(--text-dim);
          margin-top: 0.25rem;
        }

        @media (max-width: 480px) {
          .notification-dropdown {
            width: calc(100vw - 32px);
            right: 16px;
          }
        }
      `}</style>
    </div>
  );
}
