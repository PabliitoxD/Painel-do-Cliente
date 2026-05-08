"use client";

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { 
  ShieldCheck, Check, CreditCard, Smartphone, Lock, 
  ChevronRight, ArrowLeft, AlertCircle, ShoppingBag
} from 'lucide-react';
import Image from 'next/image';

// --- MOCK DATA ---
const MOCK_CHECKOUT_DATA: Record<string, any> = {
  'COB-1092': {
    code: 'COB-1092',
    chargeName: 'Consultoria Premium',
    items: [
      { id: 1, name: 'Consultoria Premium', description: 'Plano anual de acompanhamento', unitPrice: 150.00, quantity: 1 }
    ],
    totalValue: 150.00,
    dueDate: '15/06/2026',
    status: 'Pendente'
  },
  'COB-1093': {
    code: 'COB-1093',
    chargeName: 'Setup de Sistema',
    items: [
      { id: 1, name: 'Setup de Sistema', description: 'Instalação e configuração', unitPrice: 300.00, quantity: 1 },
      { id: 2, name: 'Treinamento de Equipe', description: '2 horas de capacitação', unitPrice: 50.50, quantity: 1 }
    ],
    totalValue: 350.50,
    dueDate: '10/06/2026',
    status: 'Pendente'
  }
};

export default function CheckoutPage() {
  const params = useParams();
  const router = useRouter();
  const code = typeof params.code === 'string' ? params.code : '';

  const [isLoading, setIsLoading] = useState(true);
  const [chargeData, setChargeData] = useState<any>(null);
  
  // Forms and Steps
  const [step, setStep] = useState(1);
  const [personalData, setPersonalData] = useState({ name: '', email: '', document: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix'>('credit_card');
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);

  useEffect(() => {
    // Simulate API fetch
    setIsLoading(true);
    setTimeout(() => {
      let data = MOCK_CHECKOUT_DATA[code];
      
      // If code is not found in mock, generate a dynamic one for testing
      if (!data && code) {
        data = {
          code: code,
          chargeName: 'Cobrança Avulsa',
          items: [
            { id: 1, name: 'Produto / Serviço Adicionado', description: 'Item incluído na cobrança', unitPrice: 100.00, quantity: 1 }
          ],
          totalValue: 100.00,
          dueDate: 'N/A',
          status: 'Pendente'
        };
      }

      if (data) {
        setChargeData(data);
      }
      setIsLoading(false);
    }, 1000);
  }, [code]);

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalData.name || !personalData.email || !personalData.document || !personalData.phone) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }
    // Simulate sending lead data to backend
    console.log("Lead captured:", personalData);
    setStep(2);
  };

  const handleCheckout = (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);
    // Simulate payment processing
    setTimeout(() => {
      setIsProcessing(false);
      setPaymentSuccess(true);
    }, 2500);
  };

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center' }}>
          <div className="spinner" style={{ margin: '0 auto 1.5rem', width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#65839a', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
          <h2 style={{ color: '#334155', fontWeight: 500 }}>Carregando seu checkout seguro...</h2>
        </div>
      </div>
    );
  }

  if (!chargeData) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
        <div style={{ textAlign: 'center', maxWidth: '400px', padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' }}>
          <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
          <h2 style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Cobrança não encontrada</h2>
          <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>O link de pagamento acessado é inválido ou já expirou.</p>
          <button className="btn-primary" style={{ width: '100%' }}>Acessar Suporte</button>
        </div>
      </div>
    );
  }

  if (paymentSuccess) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '1rem' }}>
        <div style={{ textAlign: 'center', maxWidth: '500px', width: '100%', padding: '3rem 2rem', background: 'white', borderRadius: '24px', boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1)' }}>
          <div style={{ width: '80px', height: '80px', background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 0 10px rgba(34, 197, 94, 0.1)' }}>
            <Check size={40} color="white" />
          </div>
          <h2 style={{ color: '#0f172a', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Pagamento Aprovado!</h2>
          <p style={{ color: '#64748b', fontSize: '1.1rem', marginBottom: '2rem' }}>Obrigado pela sua compra. Enviamos um recibo e os próximos passos para o e-mail <strong>{personalData.email}</strong>.</p>
          <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', textAlign: 'left', marginBottom: '2rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
              <span style={{ color: '#64748b' }}>Código do Pedido</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>{chargeData.code}</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span style={{ color: '#64748b' }}>Valor Pago</span>
              <span style={{ fontWeight: 600, color: '#0f172a' }}>{formatCurrency(chargeData.totalValue)}</span>
            </div>
          </div>
          <button className="btn-primary" style={{ width: '100%' }} onClick={() => window.location.href = 'https://tronnus.com'}>Continuar</button>
        </div>
      </div>
    );
  }

  return (
    <div className="checkout-container">
      {/* Left Column: Summary & Branding */}
      <div className="checkout-sidebar">
        <div className="sidebar-content">
          <div className="brand-logo" style={{ marginBottom: '3rem' }}>
            <img src="https://tronnus.com/wp-content/uploads/2026/01/tronnus-png-001.png" alt="TRONNUS" style={{ height: '40px', filter: 'brightness(0) invert(1)' }} />
          </div>

            <div className="order-summary">
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={20} /> Resumo do Pedido
            </h3>
            <p style={{ color: 'var(--primary)', fontWeight: 500, fontSize: '0.95rem', marginBottom: '1.5rem' }}>
              {chargeData.chargeName}
            </p>
            
            <div className="items-list" style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {chargeData.items.map((item: any) => (
                <div key={item.id} className="summary-item" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 500, margin: '0 0 0.25rem 0' }}>{item.name}</h4>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', margin: 0 }}>Qtd: {item.quantity}</p>
                  </div>
                  <div style={{ color: 'white', fontWeight: 600 }}>
                    {formatCurrency(item.unitPrice * item.quantity)}
                  </div>
                </div>
              ))}
            </div>

            <div className="total-divider" style={{ height: '1px', background: 'rgba(255,255,255,0.2)', marginBottom: '1.5rem' }}></div>

            <div className="total-row" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>Total a pagar</span>
              <span style={{ color: 'white', fontSize: '2rem', fontWeight: 700 }}>{formatCurrency(chargeData.totalValue)}</span>
            </div>

            {/* Trust Badges */}
            <div className="trust-badges" style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '1rem' }}>
                <ShieldCheck size={28} color="#22c55e" />
                <div>
                  <h5 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600, margin: '0 0 0.2rem 0' }}>Compra 100% Segura</h5>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', margin: 0 }}>Seus dados são criptografados.</p>
                </div>
              </div>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                <Lock size={28} color="#3b82f6" />
                <div>
                  <h5 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600, margin: '0 0 0.2rem 0' }}>Privacidade Garantida</h5>
                  <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', margin: 0 }}>Não compartilhamos suas informações.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Right Column: Form */}
      <div className="checkout-main">
        <div className="main-content">
          
          <div className="steps-indicator" style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem', gap: '0.5rem' }}>
            <div className={`step ${step >= 1 ? 'active' : ''}`} onClick={() => setStep(1)} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="step-circle" style={{ width: '28px', height: '28px', borderRadius: '50%', background: step >= 1 ? 'var(--primary)' : '#e2e8f0', color: step >= 1 ? 'white' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.3s' }}>
                {step > 1 ? <Check size={16} /> : '1'}
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: step >= 1 ? 600 : 500, color: step >= 1 ? '#0f172a' : '#64748b' }}>Identificação</span>
            </div>
            
            <div style={{ width: '40px', height: '2px', background: step > 1 ? 'var(--primary)' : '#e2e8f0', transition: 'all 0.3s' }}></div>
            
            <div className={`step ${step >= 2 ? 'active' : ''}`} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <div className="step-circle" style={{ width: '28px', height: '28px', borderRadius: '50%', background: step >= 2 ? 'var(--primary)' : '#e2e8f0', color: step >= 2 ? 'white' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.3s' }}>
                2
              </div>
              <span style={{ fontSize: '0.9rem', fontWeight: step >= 2 ? 600 : 500, color: step >= 2 ? '#0f172a' : '#64748b' }}>Pagamento</span>
            </div>
          </div>

          {step === 1 && (
            <div className="step-content animate-fade-in">
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Dados Pessoais</h2>
              <p style={{ color: '#64748b', marginBottom: '2rem' }}>Preencha seus dados para prosseguir com a compra.</p>
              
              <form onSubmit={handleNextStep}>
                <div className="form-group">
                  <label>Nome Completo</label>
                  <input 
                    type="text" 
                    className="checkout-input" 
                    placeholder="Ex: João da Silva" 
                    value={personalData.name}
                    onChange={(e) => setPersonalData({...personalData, name: e.target.value})}
                    required
                  />
                </div>
                
                <div className="form-group">
                  <label>E-mail</label>
                  <input 
                    type="email" 
                    className="checkout-input" 
                    placeholder="voce@email.com" 
                    value={personalData.email}
                    onChange={(e) => setPersonalData({...personalData, email: e.target.value})}
                    required
                  />
                  <span style={{ fontSize: '0.8rem', color: '#64748b', marginTop: '0.25rem', display: 'block' }}>Para onde enviaremos o seu acesso/recibo.</span>
                </div>

                <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>CPF ou CNPJ</label>
                    <input 
                      type="text" 
                      className="checkout-input" 
                      placeholder="000.000.000-00" 
                      value={personalData.document}
                      onChange={(e) => setPersonalData({...personalData, document: e.target.value})}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label>Telefone / WhatsApp</label>
                    <input 
                      type="tel" 
                      className="checkout-input" 
                      placeholder="(00) 00000-0000" 
                      value={personalData.phone}
                      onChange={(e) => setPersonalData({...personalData, phone: e.target.value})}
                      required
                    />
                  </div>
                </div>

                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                  Ir para o Pagamento <ChevronRight size={20} />
                </button>
              </form>
            </div>
          )}

          {step === 2 && (
            <div className="step-content animate-fade-in">
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center', borderRadius: '50%', transition: 'background 0.2s' }} className="hover-bg">
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.1rem' }}>Pagamento</h2>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Escolha a forma de pagamento.</p>
                </div>
              </div>

              {/* Payment Tabs */}
              <div className="payment-tabs" style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                <div 
                  className={`payment-tab ${paymentMethod === 'credit_card' ? 'active' : ''}`} 
                  onClick={() => setPaymentMethod('credit_card')}
                  style={{ flex: 1, padding: '1.25rem', border: `2px solid ${paymentMethod === 'credit_card' ? 'var(--primary)' : '#e2e8f0'}`, borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', background: paymentMethod === 'credit_card' ? 'rgba(101, 131, 154, 0.05)' : 'white', transition: 'all 0.2s' }}
                >
                  <CreditCard size={28} color={paymentMethod === 'credit_card' ? 'var(--primary)' : '#64748b'} />
                  <span style={{ fontWeight: 600, color: paymentMethod === 'credit_card' ? 'var(--primary)' : '#64748b' }}>Cartão de Crédito</span>
                </div>
                <div 
                  className={`payment-tab ${paymentMethod === 'pix' ? 'active' : ''}`} 
                  onClick={() => setPaymentMethod('pix')}
                  style={{ flex: 1, padding: '1.25rem', border: `2px solid ${paymentMethod === 'pix' ? '#22c55e' : '#e2e8f0'}`, borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', background: paymentMethod === 'pix' ? 'rgba(34, 197, 94, 0.05)' : 'white', transition: 'all 0.2s' }}
                >
                  <Smartphone size={28} color={paymentMethod === 'pix' ? '#22c55e' : '#64748b'} />
                  <span style={{ fontWeight: 600, color: paymentMethod === 'pix' ? '#22c55e' : '#64748b' }}>Pix</span>
                </div>
              </div>

              <form onSubmit={handleCheckout}>
                {paymentMethod === 'credit_card' && (
                  <div className="credit-card-form animate-fade-in">
                    <div className="form-group">
                      <label>Número do Cartão</label>
                      <div style={{ position: 'relative' }}>
                        <input type="text" className="checkout-input" placeholder="0000 0000 0000 0000" required />
                        <CreditCard size={20} color="#94a3b8" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Nome do Titular</label>
                      <input type="text" className="checkout-input" placeholder="Como impresso no cartão" required />
                    </div>
                    <div className="form-row" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Validade</label>
                        <input type="text" className="checkout-input" placeholder="MM/AA" required />
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input type="text" className="checkout-input" placeholder="123" required />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Parcelamento</label>
                      <select className="checkout-input" required>
                        <option value="1">1x de {formatCurrency(chargeData.totalValue)} sem juros</option>
                        <option value="2">2x de {formatCurrency(chargeData.totalValue / 2)} sem juros</option>
                        <option value="3">3x de {formatCurrency(chargeData.totalValue / 3)} sem juros</option>
                      </select>
                    </div>
                  </div>
                )}

                {paymentMethod === 'pix' && (
                  <div className="pix-form animate-fade-in" style={{ textAlign: 'center', padding: '1rem 0 2rem' }}>
                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px dashed #cbd5e1', marginBottom: '1.5rem' }}>
                      <Smartphone size={40} color="#22c55e" style={{ margin: '0 auto 1rem' }} />
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Pagamento via Pix</h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>Ao clicar em finalizar, geraremos um QR Code exclusivo e um código "Copia e Cola" para o seu pagamento.</p>
                    </div>
                  </div>
                )}

                <button 
                  type="submit" 
                  className="btn-primary" 
                  style={{ 
                    width: '100%', 
                    marginTop: '1rem', 
                    padding: '1rem', 
                    fontSize: '1.1rem', 
                    display: 'flex', 
                    justifyContent: 'center', 
                    alignItems: 'center', 
                    gap: '0.5rem',
                    background: paymentMethod === 'pix' ? '#22c55e' : 'var(--primary)',
                    opacity: isProcessing ? 0.8 : 1,
                    cursor: isProcessing ? 'not-allowed' : 'pointer'
                  }}
                  disabled={isProcessing}
                >
                  {isProcessing ? (
                    <>
                      <div className="spinner" style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                      Processando...
                    </>
                  ) : (
                    <>
                      <Lock size={18} /> Pagar {formatCurrency(chargeData.totalValue)}
                    </>
                  )}
                </button>
                <div style={{ textAlign: 'center', marginTop: '1rem', color: '#94a3b8', fontSize: '0.8rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                  <ShieldCheck size={14} /> Pagamento processado de forma segura.
                </div>
              </form>
            </div>
          )}
        </div>
      </div>

      <style jsx>{`
        .checkout-container {
          display: flex;
          min-height: 100vh;
          font-family: var(--font-inter), sans-serif;
        }

        .checkout-sidebar {
          width: 45%;
          background: linear-gradient(135deg, #1b2932 0%, #0f172a 100%);
          padding: 4rem;
          display: flex;
          justify-content: flex-end;
          position: relative;
          overflow: hidden;
        }

        .checkout-sidebar::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%2365839a' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E");
        }

        .sidebar-content {
          width: 100%;
          max-width: 480px;
          position: relative;
          z-index: 1;
        }

        .checkout-main {
          width: 55%;
          background: #f8fafc;
          padding: 4rem;
          display: flex;
          justify-content: flex-start;
          overflow-y: auto;
        }

        .main-content {
          width: 100%;
          max-width: 520px;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-group label {
          display: block;
          font-size: 0.9rem;
          font-weight: 600;
          color: #334155;
          margin-bottom: 0.5rem;
        }

        .checkout-input {
          width: 100%;
          padding: 0.85rem 1rem;
          background: white;
          border: 1px solid #cbd5e1;
          border-radius: 10px;
          font-size: 1rem;
          color: #0f172a;
          transition: all 0.2s;
          font-family: inherit;
        }

        .checkout-input:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 3px rgba(101, 131, 154, 0.15);
        }

        .hover-bg:hover {
          background: #f1f5f9 !important;
        }

        @keyframes spin {
          to { transform: rotate(360deg); }
        }

        .animate-fade-in {
          animation: fadeIn 0.4s ease-out;
        }

        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(10px); }
          to { opacity: 1; transform: translateY(0); }
        }

        @media (max-width: 992px) {
          .checkout-container {
            flex-direction: column;
          }
          .checkout-sidebar {
            width: 100%;
            padding: 2rem;
            justify-content: center;
          }
          .sidebar-content {
            max-width: 100%;
          }
          .checkout-main {
            width: 100%;
            padding: 2rem;
            justify-content: center;
          }
          .main-content {
            max-width: 100%;
          }
          .form-row {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );
}
