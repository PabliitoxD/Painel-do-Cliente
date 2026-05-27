"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

export interface Notification {
  id: string;
  type: 'withdrawal_approved' | 'sale_approved' | 'chargeback' | 'sale_refunded';
  title: string;
  message: string;
  date: string;
  read: boolean;
  amount?: number;
}

interface NotificationContextType {
  notifications: Notification[];
  unreadCount: number;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  addNotification: (
    type: Notification['type'],
    title: string,
    message: string,
    amount?: number
  ) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const INITIAL_NOTIFICATIONS: Notification[] = [
  {
    id: 'n1',
    type: 'withdrawal_approved',
    title: 'Saque Aprovado',
    message: 'Seu saque foi processado e o valor já foi transferido para a sua conta cadastrada.',
    date: '27/05/2026 - 16:30',
    read: false,
    amount: 1850.00
  },
  {
    id: 'n2',
    type: 'sale_approved',
    title: 'Venda Realizada',
    message: 'Nova assinatura do Plano VIP aprovada para o cliente João Silva.',
    date: '27/05/2026 - 15:42',
    read: false,
    amount: 99.90
  },
  {
    id: 'n3',
    type: 'chargeback',
    title: 'Chargeback Recebido',
    message: 'Atenção: Contestação de pagamento aberta pelo cliente para a transação #TR5593.',
    date: '27/05/2026 - 11:15',
    read: false,
    amount: 350.00
  },
  {
    id: 'n4',
    type: 'sale_refunded',
    title: 'Venda Estornada',
    message: 'A transação da venda #TR4820 foi estornada com sucesso e o valor reembolsado ao comprador.',
    date: '26/05/2026 - 14:20',
    read: true,
    amount: 120.00
  }
];

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem('tronnus_notifications');
    if (stored) {
      try {
        setNotifications(JSON.parse(stored));
      } catch (e) {
        setNotifications(INITIAL_NOTIFICATIONS);
      }
    } else {
      setNotifications(INITIAL_NOTIFICATIONS);
      localStorage.setItem('tronnus_notifications', JSON.stringify(INITIAL_NOTIFICATIONS));
    }
  }, []);

  const saveNotifications = (newNotifications: Notification[]) => {
    setNotifications(newNotifications);
    localStorage.setItem('tronnus_notifications', JSON.stringify(newNotifications));
  };

  const markAsRead = (id: string) => {
    const updated = notifications.map(notif =>
      notif.id === id ? { ...notif, read: true } : notif
    );
    saveNotifications(updated);
  };

  const markAllAsRead = () => {
    const updated = notifications.map(notif => ({ ...notif, read: true }));
    saveNotifications(updated);
  };

  const clearAll = () => {
    saveNotifications([]);
  };

  const addNotification = (
    type: Notification['type'],
    title: string,
    message: string,
    amount?: number
  ) => {
    const now = new Date();
    const day = String(now.getDate()).padStart(2, '0');
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const year = now.getFullYear();
    const hours = String(now.getHours()).padStart(2, '0');
    const minutes = String(now.getMinutes()).padStart(2, '0');
    const formattedDate = `${day}/${month}/${year} - ${hours}:${minutes}`;

    const newNotif: Notification = {
      id: `n_${Date.now()}`,
      type,
      title,
      message,
      date: formattedDate,
      read: false,
      amount
    };

    saveNotifications([newNotif, ...notifications]);
  };

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        unreadCount,
        markAsRead,
        markAllAsRead,
        clearAll,
        addNotification
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
}

export function useNotifications() {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error('useNotifications must be used within a NotificationProvider');
  }
  return context;
}
