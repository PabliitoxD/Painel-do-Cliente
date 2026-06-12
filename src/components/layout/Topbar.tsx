"use client";

import { Bell, Sun, Moon, Power, Menu, X } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useNotifications } from '@/context/NotificationContext';
import { NotificationDropdown } from './NotificationDropdown';

interface TopbarProps {
  onMenuClick: () => void;
}

export function Topbar({ onMenuClick }: TopbarProps) {
  const { logout, theme, toggleTheme } = useAuth();
  const { unreadCount } = useNotifications();
  const router = useRouter();
  const [isNotifOpen, setIsNotifOpen] = useState(false);

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="menu-toggle-btn" onClick={onMenuClick}>
          <Menu size={24} />
        </button>
      </div>

      <div className="topbar-actions">
        {/* <button className="icon-btn" onClick={() => setIsNotifOpen(!isNotifOpen)}>
          <Bell size={18} />
          {unreadCount > 0 && <span className="badge">{unreadCount}</span>}
        </button>

        {isNotifOpen && (
          <NotificationDropdown onClose={() => setIsNotifOpen(false)} />
        )} */}

        <button className="icon-btn" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </button>

        <button className="icon-btn logout-top-btn" onClick={logout}>
          <Power size={18} />
        </button>
      </div>
    </header>
  );
}
