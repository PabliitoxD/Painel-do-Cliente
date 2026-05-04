"use client";

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Users, Construction } from 'lucide-react';

export default function ReceiversPage() {
  return (
    <DashboardLayout>
      <div className="receivers-page animate-fade-in" style={{ 
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
          <Users size={64} style={{ color: 'var(--primary)' }} />
        </div>
        <h1 style={{ fontSize: '2.5rem', fontWeight: 700, marginBottom: '1rem' }}>Recebedores</h1>
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
          Estamos trabalhando para trazer as melhores ferramentas de gestão de recebedores para você. 
          Em breve você poderá gerenciar repasses, comissões e splits de pagamento aqui.
        </p>
      </div>
    </DashboardLayout>
  );
}
