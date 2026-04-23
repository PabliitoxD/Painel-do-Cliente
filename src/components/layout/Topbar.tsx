"use client";

import { Bell, Settings, Sun, Moon, Power, ChevronLeft } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useRouter } from 'next/navigation';

export function Topbar() {
  const { logout, theme, toggleTheme } = useAuth();
  const router = useRouter();

  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="back-btn" onClick={() => router.back()}>
          <ChevronLeft size={20} />
        </button>
      </div>

      <div className="topbar-actions">
        <button className="icon-btn" onClick={() => alert('Notificações: Em breve...')}>
          <Bell size={18} />
          <span className="badge">3</span>
        </button>
        
        <button className="icon-btn" onClick={() => router.push('/dashboard/settings')}>
          <Settings size={18} />
        </button>

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
