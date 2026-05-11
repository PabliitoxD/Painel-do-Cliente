"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  UserCheck, 
  Building2, 
  User, 
  MapPin, 
  Phone, 
  CreditCard,
  ArrowRight,
  CheckCircle2,
  AlertCircle
} from 'lucide-react';

export default function ValidationPage() {
  const [personType, setPersonType] = useState<'PF' | 'PJ'>('PF');
  const [step, setStep] = useState(1);

  return (
    <DashboardLayout>
      <div className="validation-page animate-fade-in" style={{ maxWidth: '900px', margin: '0 auto' }}>
        <div className="page-header" style={{ marginBottom: '2.5rem', textAlign: 'center' }}>
          <h1 style={{ fontSize: '2.2rem', fontWeight: 800, marginBottom: '0.5rem' }} className="gradient-text">Complete seu Cadastro</h1>
          <p className="text-muted">Para começar a transacionar e realizar saques, precisamos validar sua identidade.</p>
        </div>

        <div className="steps-container" style={{ display: 'flex', justifyContent: 'center', gap: '2rem', marginBottom: '3rem' }}>
          {[1, 2, 3].map((s) => (
            <div key={s} style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', opacity: step >= s ? 1 : 0.4 }}>
              <div style={{ 
                width: '32px', 
                height: '32px', 
                borderRadius: '50%', 
                background: step > s ? 'var(--success)' : step === s ? 'var(--primary)' : 'var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: 'white',
                fontWeight: 700,
                fontSize: '0.9rem'
              }}>
                {step > s ? <CheckCircle2 size={18} /> : s}
              </div>
              <span style={{ fontWeight: 600, fontSize: '0.9rem', color: step === s ? 'var(--text-main)' : 'var(--text-dim)' }}>
                {s === 1 ? 'Tipo de Conta' : s === 2 ? 'Dados Cadastrais' : 'Endereço'}
              </span>
              {s < 3 && <div style={{ width: '40px', height: '2px', background: 'var(--border)' }}></div>}
            </div>
          ))}
        </div>

        <div className="card glass-panel" style={{ padding: '2.5rem' }}>
          {step === 1 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', fontWeight: 700 }}>Como você deseja operar?</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                <div 
                  onClick={() => setPersonType('PF')}
                  className={`selection-card ${personType === 'PF' ? 'active' : ''}`}
                  style={{ 
                    padding: '2rem', 
                    borderRadius: '16px', 
                    border: '2px solid', 
                    borderColor: personType === 'PF' ? 'var(--primary)' : 'var(--border)',
                    background: personType === 'PF' ? 'rgba(101, 131, 154, 0.1)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <User size={32} className={personType === 'PF' ? 'text-primary' : 'text-dim'} style={{ marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600 }}>Pessoa Física</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>Ideal para produtores autônomos e iniciantes.</p>
                </div>

                <div 
                  onClick={() => setPersonType('PJ')}
                  className={`selection-card ${personType === 'PJ' ? 'active' : ''}`}
                  style={{ 
                    padding: '2rem', 
                    borderRadius: '16px', 
                    border: '2px solid', 
                    borderColor: personType === 'PJ' ? 'var(--primary)' : 'var(--border)',
                    background: personType === 'PJ' ? 'rgba(101, 131, 154, 0.1)' : 'transparent',
                    cursor: 'pointer',
                    transition: 'all 0.2s'
                  }}
                >
                  <Building2 size={32} className={personType === 'PJ' ? 'text-primary' : 'text-dim'} style={{ marginBottom: '1rem' }} />
                  <h3 style={{ fontSize: '1.1rem', marginBottom: '0.5rem', fontWeight: 600 }}>Pessoa Jurídica</h3>
                  <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)', lineHeight: 1.5 }}>Para empresas que buscam profissionalismo e maiores limites.</p>
                </div>
              </div>
              <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'flex-end' }}>
                <button className="btn-primary" onClick={() => setStep(2)} style={{ padding: '0.8rem 2rem' }}>
                  Próximo Passo <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', fontWeight: 700 }}>
                {personType === 'PF' ? 'Seus Dados Pessoais' : 'Dados da sua Empresa'}
              </h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
                {personType === 'PF' ? (
                  <>
                    <div className="form-group">
                      <label>CPF</label>
                      <input type="text" placeholder="000.000.000-00" className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>Data de Nascimento</label>
                      <input type="date" className="form-input" />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label>Nome Completo (Conforme Documento)</label>
                      <input type="text" placeholder="Seu nome completo" className="form-input" />
                    </div>
                  </>
                ) : (
                  <>
                    <div className="form-group">
                      <label>CNPJ</label>
                      <input type="text" placeholder="00.000.000/0001-00" className="form-input" />
                    </div>
                    <div className="form-group">
                      <label>Inscrição Estadual</label>
                      <input type="text" placeholder="Isento ou número" className="form-input" />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label>Razão Social</label>
                      <input type="text" placeholder="Nome da empresa Ltda" className="form-input" />
                    </div>
                    <div className="form-group" style={{ gridColumn: 'span 2' }}>
                      <label>Nome Fantasia</label>
                      <input type="text" placeholder="Marca da empresa" className="form-input" />
                    </div>
                  </>
                )}
                <div className="form-group">
                  <label>Telefone de Contato</label>
                  <input type="text" placeholder="(00) 00000-0000" className="form-input" />
                </div>
              </div>
              <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <button className="btn-ghost" onClick={() => setStep(1)}>Voltar</button>
                <button className="btn-primary" onClick={() => setStep(3)} style={{ padding: '0.8rem 2rem' }}>
                  Próximo Passo <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in">
              <h2 style={{ fontSize: '1.4rem', marginBottom: '1.5rem', fontWeight: 700 }}>Endereço de Faturamento</h2>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1.25rem' }}>
                <div className="form-group">
                  <label>CEP</label>
                  <input type="text" placeholder="00000-000" className="form-input" />
                </div>
                <div className="form-group" style={{ gridColumn: 'span 2' }}>
                  <label>Logradouro</label>
                  <input type="text" placeholder="Rua, Avenida, etc." className="form-input" />
                </div>
                <div className="form-group">
                  <label>Número</label>
                  <input type="text" placeholder="123" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Bairro</label>
                  <input type="text" placeholder="Nome do bairro" className="form-input" />
                </div>
                <div className="form-group">
                  <label>Cidade</label>
                  <input type="text" placeholder="Sua cidade" className="form-input" />
                </div>
              </div>
              <div style={{ marginTop: '2rem', padding: '1rem', background: 'rgba(59, 130, 246, 0.05)', borderRadius: '12px', border: '1px solid rgba(59, 130, 246, 0.2)', display: 'flex', gap: '0.75rem', alignItems: 'center' }}>
                <AlertCircle size={20} className="text-primary" />
                <p style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>Certifique-se de que os dados informados são verdadeiros. Informações divergentes podem atrasar a validação da conta.</p>
              </div>
              <div style={{ marginTop: '2.5rem', display: 'flex', justifyContent: 'space-between' }}>
                <button className="btn-ghost" onClick={() => setStep(2)}>Voltar</button>
                <button className="btn-primary" onClick={() => alert('Cadastro enviado para análise!')} style={{ padding: '0.8rem 2rem' }}>
                  Finalizar Validação <ArrowRight size={18} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .selection-card:hover {
          transform: translateY(-2px);
          border-color: var(--primary) !important;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-group label {
          font-size: 0.85rem;
          font-weight: 600;
          color: var(--text-dim);
        }
        .form-input {
          background: var(--background);
          border: 1px solid var(--border);
          border-radius: 10px;
          padding: 0.8rem 1rem;
          color: var(--text-main);
          font-size: 0.95rem;
          transition: all 0.2s;
        }
        .form-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(101, 131, 154, 0.2);
        }
        .text-primary { color: var(--primary); }
        .text-dim { color: var(--text-dim); }
      `}</style>
    </DashboardLayout>
  );
}
