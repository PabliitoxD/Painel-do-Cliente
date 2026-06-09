"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { api } from '@/services/api';

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
  isLoading: boolean;
  markAsRead: (id: string) => void;
  markAllAsRead: () => void;
  clearAll: () => void;
  refresh: () => Promise<void>;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

const parseAmount = (t: any): number | undefined => {
  if (!t) return undefined;
  if (t.amount !== undefined && t.amount !== null && t.amount !== '') {
    const parsed = parseFloat(String(t.amount));
    if (!isNaN(parsed)) return parsed;
  }
  if (t.value !== undefined && t.value !== null && t.value !== '') {
    if (typeof t.value === 'number') return t.value;
    const cleaned = String(t.value)
      .replace(/R\$\s?/, '')
      .replace(/\./g, '')
      .replace(',', '.');
    const parsed = parseFloat(cleaned);
    if (!isNaN(parsed)) return parsed;
  }
  return undefined;
};

const formatDate = (dateString: string) => {
  try {
    const d = new Date(dateString);
    if (isNaN(d.getTime())) return dateString;
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    return `${day}/${month}/${year} - ${hours}:${minutes}`;
  } catch {
    return dateString;
  }
};

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [readIds, setReadIds] = useState<string[]>([]);
  const [clearedIds, setClearedIds] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load local state for read/cleared notifications on mount
  useEffect(() => {
    const storedRead = localStorage.getItem('tronnus_read_notifs');
    if (storedRead) {
      try {
        setReadIds(JSON.parse(storedRead));
      } catch (e) {}
    }

    const storedCleared = localStorage.getItem('tronnus_cleared_notifs');
    if (storedCleared) {
      try {
        setClearedIds(JSON.parse(storedCleared));
      } catch (e) {}
    }
  }, []);

  const fetchRealNotifications = async () => {
    setIsLoading(true);
    try {
      // Fetch orders and withdrawals in parallel
      const [ordersRes, withdrawalsRes] = await Promise.allSettled([
        api.transactions.listOrders({ per_page: 50 }),
        api.withdrawals.list({ per_page: 50 })
      ]);

      const list: Notification[] = [];

      // Process orders
      if (ordersRes.status === 'fulfilled') {
        const res = ordersRes.value;
        const data = res?.data?.orders || res?.orders || res?.data || (Array.isArray(res) ? res : []);
        if (Array.isArray(data)) {
          data.forEach((o: any) => {
            const id = o.token || o.id;
            if (!id) return;

            const status = (o.status?.code || o.status || '').toLowerCase();
            const dateRaw = o.created_at || o.date || o.createdAt;
            const amount = parseAmount(o);
            const clientName = o.client || o.customer_name || o.buyer?.name || o.customerName || 'Cliente';

            if (['approved', 'paid', 'aprovada', 'pago', 'completed', 'active', 'confirmed', 'concluido', 'concluído', 'processed'].includes(status)) {
              list.push({
                id: `sale_${id}`,
                type: 'sale_approved',
                title: 'Venda Realizada',
                message: `Nova venda aprovada para o cliente ${clientName}.`,
                date: formatDate(dateRaw),
                read: false,
                amount,
                rawDate: new Date(dateRaw).getTime()
              } as any);
            } else if (['refunded', 'estornado', 'reembolsado'].includes(status)) {
              list.push({
                id: `refund_${id}`,
                type: 'sale_refunded',
                title: 'Venda Estornada',
                message: `A transação da venda para ${clientName} foi estornada com sucesso.`,
                date: formatDate(dateRaw),
                read: false,
                amount,
                rawDate: new Date(dateRaw).getTime()
              } as any);
            } else if (status === 'chargeback' || status === 'in_chargeback') {
              list.push({
                id: `chargeback_${id}`,
                type: 'chargeback',
                title: 'Chargeback Recebido',
                message: `Contestação de pagamento aberta pelo cliente ${clientName}.`,
                date: formatDate(dateRaw),
                read: false,
                amount,
                rawDate: new Date(dateRaw).getTime()
              } as any);
            }
          });
        }
      }

      // Process withdrawals
      if (withdrawalsRes.status === 'fulfilled') {
        const res = withdrawalsRes.value;
        const data = res?.withdraws || res?.data?.withdraws || res?.withdrawals || res?.data || (Array.isArray(res) ? res : []);
        if (Array.isArray(data)) {
          data.forEach((w: any) => {
            const id = w.id || w.token;
            if (!id) return;

            const status = (w.status || '').toLowerCase();
            const dateRaw = w.created_at || w.createdAt || w.date;
            const amount = parseAmount(w.amount || w);

            if (['approved', 'aprovado', 'completed', 'concluido', 'concluído', 'paid', 'pago'].includes(status)) {
              list.push({
                id: `withdrawal_${id}`,
                type: 'withdrawal_approved',
                title: 'Saque Aprovado',
                message: 'Seu saque foi processado e o valor já foi transferido para a sua conta.',
                date: formatDate(dateRaw),
                read: false,
                amount,
                rawDate: new Date(dateRaw).getTime()
              } as any);
            }
          });
        }
      }

      // Sort decrescente by raw date
      list.sort((a: any, b: any) => b.rawDate - a.rawDate);

      // Clean up rawDate property
      const cleaned = list.map(({ rawDate, ...rest }: any) => rest);

      setNotifications(cleaned);
    } catch (err) {
      console.error("Erro ao buscar notificações da API:", err);
    } finally {
      setIsLoading(false);
    }
  };

  // Run on mount
  useEffect(() => {
    fetchRealNotifications();
  }, []);

  // Map state to actual displayed notifications (filtering out cleared ones and setting read flags)
  const activeNotifications = notifications
    .filter(n => !clearedIds.includes(n.id))
    .map(n => ({
      ...n,
      read: readIds.includes(n.id)
    }));

  const markAsRead = (id: string) => {
    const updated = [...readIds];
    if (!updated.includes(id)) {
      updated.push(id);
      setReadIds(updated);
      localStorage.setItem('tronnus_read_notifs', JSON.stringify(updated));
    }
  };

  const markAllAsRead = () => {
    const updated = [...readIds];
    activeNotifications.forEach(n => {
      if (!updated.includes(n.id)) {
        updated.push(n.id);
      }
    });
    setReadIds(updated);
    localStorage.setItem('tronnus_read_notifs', JSON.stringify(updated));
  };

  const clearAll = () => {
    const updated = [...clearedIds];
    activeNotifications.forEach(n => {
      if (!updated.includes(n.id)) {
        updated.push(n.id);
      }
    });
    setClearedIds(updated);
    localStorage.setItem('tronnus_cleared_notifs', JSON.stringify(updated));
  };

  const unreadCount = activeNotifications.filter(n => !n.read).length;

  return (
    <NotificationContext.Provider
      value={{
        notifications: activeNotifications,
        unreadCount,
        isLoading,
        markAsRead,
        markAllAsRead,
        clearAll,
        refresh: fetchRealNotifications
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
