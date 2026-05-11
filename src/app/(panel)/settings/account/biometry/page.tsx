"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Scan, 
  ShieldCheck, 
  Smartphone, 
  CheckCircle2, 
  ArrowRight,
  ShieldAlert,
  User
} from 'lucide-react';


export default function BiometryPage() {
  const [status, setStatus] = useState<'idle' | 'scanning' | 'success'>('idle');

  const startScan = () => {
    setStatus('scanning');
    setTimeout(() => {
      setStatus('success');
    }, 3000);
  };

  return (
    <DashboardLayout>
      <div className="biometry-page animate-fade-in" style={{ maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
        <div className="card glass-panel" style={{ padding: '3rem', borderRadius: '24px' }}>
          <div style={{ 
            width: '80px', 
            height: '80px', 
            borderRadius: '20px', 
            background: status === 'success' ? 'rgba(16, 185, 129, 0.1)' : 'rgba(101, 131, 154, 0.1)', 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center', 
            margin: '0 auto 2rem',
            color: status === 'success' ? '#10b981' : 'var(--primary)',
            transition: 'all 0.3s'
          }}>
            {status === 'success' ? <ShieldCheck size={40} /> : <Scan size={40} className={status === 'scanning' ? 'animate-pulse' : ''} />}
          </div>

          <h1 style={{ fontSize: '1.8rem', fontWeight: 800, marginBottom: '1rem' }}>
            {status === 'idle' && 'Autenticação Biométrica'}
            {status === 'scanning' && 'Validando Identidade...'}
            {status === 'success' && 'Identidade Validada!'}
          </h1>

          <p className="text-muted" style={{ marginBottom: '2.5rem', lineHeight: 1.6 }}>
            {status === 'idle' && 'Para garantir a máxima segurança em seus saques e transações, solicitamos uma rápida validação facial.'}
            {status === 'scanning' && 'Por favor, permaneça em frente à câmera e siga as instruções na tela.'}
            {status === 'success' && 'Sua biometria foi registrada com sucesso. Agora você tem acesso total a todas as funcionalidades financeiras.'}
          </p>

          {status === 'idle' && (
            <div className="info-box" style={{ background: 'rgba(255,255,255,0.03)', padding: '1.5rem', borderRadius: '16px', textAlign: 'left', marginBottom: '2.5rem', border: '1px solid var(--border)' }}>
              <div style={{ display: 'flex', gap: '0.75rem', marginBottom: '1rem' }}>
                <Smartphone size={20} className="text-primary" />
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.2rem' }}>Use sua Câmera</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Certifique-se de estar em um local bem iluminado.</p>
                </div>
              </div>
              <div style={{ display: 'flex', gap: '0.75rem' }}>
                <ShieldAlert size={20} className="text-primary" />
                <div>
                  <h3 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '0.2rem' }}>Privacidade Garantida</h3>
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Seus dados são criptografados e usados apenas para verificação.</p>
                </div>
              </div>
            </div>
          )}

          {status === 'idle' && (
            <button className="btn-primary" onClick={startScan} style={{ width: '100%', padding: '1.2rem', fontSize: '1.1rem', fontWeight: 700 }}>
              Iniciar Reconhecimento Facial <ArrowRight size={20} />
            </button>
          )}

          {status === 'scanning' && (
            <div style={{ width: '200px', height: '200px', border: '2px dashed var(--primary)', borderRadius: '50%', margin: '0 auto', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden' }}>
              <div style={{ position: 'absolute', top: '0', left: '0', right: '0', height: '2px', background: 'var(--primary)', boxShadow: '0 0 10px var(--primary)', animation: 'scan-line 2s ease-in-out infinite' }}></div>
              <User size={100} style={{ opacity: 0.2 }} />
            </div>
          )}

          {status === 'success' && (
            <div className="animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', color: '#10b981', fontWeight: 700, marginBottom: '2rem' }}>
                <CheckCircle2 size={24} /> Verificação Concluída
              </div>
              <button className="btn-secondary" style={{ width: '100%', padding: '1.2rem' }} onClick={() => window.location.href = '/finance/withdrawals/requests'}>
                Ir para Saques
              </button>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        @keyframes scan-line {
          0% { top: 0%; }
          50% { top: 100%; }
          100% { top: 0%; }
        }
        .text-primary { color: var(--primary); }
      `}</style>
    </DashboardLayout>
  );
}
