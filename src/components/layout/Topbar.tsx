"use client";

import { Bell, Settings, Sun, Power, ChevronLeft } from 'lucide-react';

export function Topbar() {
  return (
    <header className="topbar">
      <div className="topbar-left">
        <button className="back-btn">
          <ChevronLeft size={20} />
        </button>
      </div>

      <div className="topbar-actions">
        <button className="icon-btn">
          <Bell size={18} />
          <span className="badge">3</span>
        </button>
        
        <button className="icon-btn">
          <Settings size={18} />
        </button>

        <button className="icon-btn">
          <Sun size={18} />
        </button>

        <button className="icon-btn">
          <Power size={18} />
        </button>
      </div>
    </header>
  );
}
