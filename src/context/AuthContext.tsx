"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  avatar?: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, password: string) => Promise<void>;
  logout: () => void;
  isLoading: boolean;
  theme: 'dark' | 'light';
  toggleTheme: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [theme, setTheme] = useState<'dark' | 'light'>('dark');
  const router = useRouter();

  useEffect(() => {
    // Check for stored user on mount
    const storedUser = localStorage.getItem('tronnus_user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    
    const storedTheme = localStorage.getItem('tronnus_theme') as 'dark' | 'light';
    if (storedTheme) {
      setTheme(storedTheme);
      document.documentElement.setAttribute('data-theme', storedTheme);
    } else {
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    
    setIsLoading(false);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('tronnus_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    // Mock login logic
    try {
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 800));

      if (email === 'joao@tronnus.com' && password === '123456') {
        const mockUser: User = {
          id: '1',
          name: 'João Silva',
          email: 'joao@tronnus.com',
          role: 'PRODUCER',
          avatar: 'https://ui-avatars.com/api/?name=Joao+Silva&background=1b2932&color=65839a'
        };
        setUser(mockUser);
        localStorage.setItem('tronnus_user', JSON.stringify(mockUser));
        router.push('/dashboard');
      } else {
        throw new Error('Credenciais inválidas');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tronnus_user');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, logout, isLoading, theme, toggleTheme }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
