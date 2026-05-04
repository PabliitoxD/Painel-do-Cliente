"use client";

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { HelpCircle, Construction } from 'lucide-react';

export default function SupportPage() {
  return (
    <DashboardLayout>
      <div className="support-page animate-fade-in" style={{ 
        display: 'flex', 
        flexDirection: 'column', 
        alignItems: 'center', 
        justifyContent: 'center', 
        minHeight: '60vh',
        textAlign: 'center'
      }}>
        <div className="icon-wrapper" style={{ 
          background: 'rgba(101, 131, 154, 0.1)', 
          padding: '2rem', 
          borderRadius: '50%',
          marginBottom: '1.5rem'
        }}>
          <HelpCircle size={64} style={{ color: 'var(--primary)' }} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Suporte</h1>
        <div style={{ 
          display: 'flex', 
          alignItems: 'center', 
          gap: '0.75rem', 
          background: 'rgba(255, 177, 86, 0.1)', 
          color: 'var(--warning)', 
          padding: '0.75rem 1.5rem', 
          borderRadius: '12px',
          fontWeight: 600
        }}>
          <Construction size={24} />
          <span>Módulo em Produção</span>
        </div>
        <p className="text-muted" style={{ marginTop: '1.5rem', maxWidth: '500px', lineHeight: 1.6 }}>
          Nossa central de suporte integrada está sendo desenvolvida. 
          Em breve você poderá abrir chamados, consultar a base de conhecimento e falar com nossos especialistas diretamente por aqui.
        </p>
      </div>
    </DashboardLayout>
  );
}
