/* eslint-disable react-hooks/set-state-in-effect */
"use client";

import React, { createContext, useContext, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { api } from '@/services/api';

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
  loginWithOneId: (token: string, company_token: string, account_token?: number) => Promise<void>;
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
    const initAuth = async () => {
      const storedTheme = localStorage.getItem('tronnus_theme') as 'dark' | 'light';
      if (storedTheme) {
        setTheme(storedTheme);
        document.documentElement.setAttribute('data-theme', storedTheme);
      } else {
        document.documentElement.setAttribute('data-theme', 'dark');
      }

      const storedToken = localStorage.getItem('tronnus_token');
      const storedUser = localStorage.getItem('tronnus_user');
      const isMockSession = localStorage.getItem('tronnus_mock_session') === 'true';

      if (storedToken && !isMockSession) {
        // Token real — valida com a API
        try {
          const res = await api.users.me();
          if (res && res.user) {
            setUser(res.user);
            localStorage.setItem('tronnus_user', JSON.stringify(res.user));
          } else if (storedUser) {
            setUser(JSON.parse(storedUser));
          }
        } catch (error: any) {
          console.error('Falha ao validar token:', error);
          // 401 já foi tratado pelo client.ts (limpeza + redirect)
          // Para outros erros, usa o usuário em cache
          if (storedUser && storedToken) {
            setUser(JSON.parse(storedUser));
          }
        }
      } else if (storedUser) {
        // Sessão mock ou sem token mas com usuário em cache
        setUser(JSON.parse(storedUser));
      }

      setIsLoading(false);
    };

    initAuth();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'dark' ? 'light' : 'dark';
    setTheme(newTheme);
    localStorage.setItem('tronnus_theme', newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
  };

  const login = async (email: string, password: string) => {
    setIsLoading(true);
    try {
      const response = await api.auth.loginEmail({ email, password });
      
      if (response.access_token) {
        localStorage.setItem('tronnus_token', response.access_token);
      }
      
      const userData: User = response.user || {
        id: '1',
        name: 'Usuário',
        email: email,
        role: 'PRODUCER',
        avatar: 'https://ui-avatars.com/api/?name=User&background=1b2932&color=65839a'
      };
      
      setUser(userData);
      localStorage.setItem('tronnus_user', JSON.stringify(userData));
      router.push('/dashboard');
    } catch (err) {
      console.error('Login error:', err);
      // Fallback mock para joao@tronnus.com enquanto a API de autenticação por email não é habilitada
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
        // Flag que indica sessão de teste — evita que initAuth chame api.users.me() com token falso
        localStorage.setItem('tronnus_mock_session', 'true');
        localStorage.removeItem('tronnus_token'); // Não salva token falso
        router.push('/dashboard');
      } else {
        throw new Error(err instanceof Error ? err.message : 'Credenciais inválidas');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const loginWithOneId = async (token: string, company_token: string, account_token?: number) => {
    setIsLoading(true);
    try {
      const response = await api.auth.loginOneId({ token, company_token, account_token });
      
      if (response.access_token) {
        localStorage.setItem('tronnus_token', response.access_token);
      }
      
      const userData: User = response.user || {
        id: '1',
        name: 'Usuário OneID',
        email: 'oneid@user.com',
        role: 'PRODUCER',
        avatar: 'https://ui-avatars.com/api/?name=One+ID&background=1b2932&color=65839a'
      };
      
      setUser(userData);
      localStorage.setItem('tronnus_user', JSON.stringify(userData));
      router.push('/dashboard');
    } catch (err) {
      console.error('OneID Login error:', err);
      throw new Error(err instanceof Error ? err.message : 'Falha na autenticação via OneID');
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('tronnus_user');
    localStorage.removeItem('tronnus_token');
    localStorage.removeItem('tronnus_mock_session');
    router.push('/login');
  };

  return (
    <AuthContext.Provider value={{ user, login, loginWithOneId, logout, isLoading, theme, toggleTheme }}>
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
