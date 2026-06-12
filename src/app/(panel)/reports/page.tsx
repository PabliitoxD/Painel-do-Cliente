"use client";

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { BarChart3, Compass, RefreshCw } from 'lucide-react';

export default function ReportsPage() {
  return (
    <DashboardLayout>
      <div 
        className="animate-fade-in" 
        style={{ 
          display: 'flex', 
          flexDirection: 'column', 
          alignItems: 'center', 
          justifyContent: 'center', 
          minHeight: '70vh', 
          textAlign: 'center',
          padding: '2rem' 
        }}
      >
        <div 
          style={{ 
            background: 'rgba(101, 131, 154, 0.1)', 
            border: '1px solid var(--primary)', 
            borderRadius: '50%', 
            padding: '2.5rem', 
            marginBottom: '2rem',
            boxShadow: '0 0 30px rgba(0, 196, 140, 0.2)'
          }}
        >
          <BarChart3 size={64} style={{ color: 'var(--primary)' }} />
        </div>
        
        <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '1rem', color: 'var(--text-main)' }}>
          Módulo de Relatórios
        </h1>
        
        <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', maxWidth: '600px', lineHeight: '1.6', marginBottom: '2rem' }}>
          Esta funcionalidade está em fase de desenvolvimento. Em breve você terá acesso a relatórios avançados de vendas, conciliação financeira, faturamento e exportação de dados analíticos estruturados.
        </p>

        <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap', justifyContent: 'center' }}>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1rem 1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <Compass size={18} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Métricas Customizadas</span>
          </div>
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', padding: '1rem 1.5rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <RefreshCw size={18} style={{ color: 'var(--primary)' }} />
            <span style={{ fontSize: '0.9rem', color: 'var(--text-main)' }}>Atualizações em Tempo Real</span>
          </div>
        </div>
      </div>
    </DashboardLayout>
  );
}
