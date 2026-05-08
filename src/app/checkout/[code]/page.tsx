"use client";

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import {
  ShieldCheck, Check, CreditCard, Smartphone, Lock,
  ChevronRight, ArrowLeft, AlertCircle, ShoppingBag, RefreshCcw
} from 'lucide-react';
import { chargesService, plansService, subscriptionsService, periodicityLabel } from '@/services/api/charges';

interface CheckoutItem { id: number; name: string; description?: string; unitPrice: number; quantity: number; }
interface CheckoutData { token: string; code: string; chargeName: string; items: CheckoutItem[]; totalValue: number; dueDate: string; status: string; isRecurring?: boolean; periodicity?: number; }

function mapApiToCheckout(raw: any, isRecurring = false): CheckoutData {
  const products: CheckoutItem[] = (raw.products || []).map((p: any, i: number) => ({
    id: i + 1,
    name: p.name || 'Produto',
    description: p.description,
    unitPrice: parseFloat(p.price) || 0,
    quantity: parseInt(p.quantity) || 1,
  }));
  const total = products.reduce((s, p) => s + p.unitPrice * p.quantity, 0);
  return {
    token: raw.token || raw.id || '',
    code: raw.code || '',
    chargeName: raw.name || raw.description || 'Cobrança',
    items: products.length ? products : [{ id: 1, name: raw.name || raw.description || 'Assinatura', unitPrice: parseFloat(raw.price) || 0, quantity: 1 }],
    totalValue: total || parseFloat(raw.price) || 0,
    dueDate: raw.expiration_date || '',
    status: raw.status || '',
    isRecurring,
    periodicity: raw.periodicity,
  };
}

export default function CheckoutPage() {
  const params = useParams();
  const code = typeof params.code === 'string' ? params.code : '';

  const [isLoading, setIsLoading] = useState(true);
  const [chargeData, setChargeData] = useState<CheckoutData | null>(null);
  const [notFound, setNotFound] = useState(false);
  const [step, setStep] = useState(1);
  const [personalData, setPersonalData] = useState({ name: '', email: '', document: '', phone: '' });
  const [paymentMethod, setPaymentMethod] = useState<'credit_card' | 'pix'>('credit_card');
  const [cardData, setCardData] = useState({ number: '', holder: '', expiry: '', cvv: '', installments: 1 });
  const [isProcessing, setIsProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [pixData, setPixData] = useState<{ qr_code?: string; qr_code_text?: string } | null>(null);
  const [payError, setPayError] = useState<string | null>(null);

  useEffect(() => {
    if (!code) return;
    setIsLoading(true);
    // Try one-time charge first, then subscription plan
    chargesService.get(code)
      .then(res => {
        const charge = (res as any).charge ?? res;
        setChargeData(mapApiToCheckout(charge, false));
      })
      .catch(() => {
        // Fallback: try as a subscription plan token
        return plansService.get(code)
          .then(res => {
            const plan = (res as any).plan ?? res;
            setChargeData(mapApiToCheckout(plan, true));
          })
          .catch(() => setNotFound(true));
      })
      .finally(() => setIsLoading(false));
  }, [code]);

  const fmt = (v: number) => new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(v);

  const handleNextStep = (e: React.FormEvent) => {
    e.preventDefault();
    if (!personalData.name || !personalData.email || !personalData.document || !personalData.phone) {
      alert('Preencha todos os campos obrigatórios.'); return;
    }
    setStep(2);
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!chargeData) return;
    setIsProcessing(true);
    setPayError(null);
    try {
      let res: any;
      if (chargeData.isRecurring) {
        // Subscription: POST /payments/full
        res = await subscriptionsService.processFirstPayment({
          plan_token: chargeData.token,
          customer: {
            name: personalData.name,
            email: personalData.email,
            document: personalData.document,
            phone: personalData.phone,
          },
          payment: {
            method: paymentMethod,
            recurrency: true,
            ...(paymentMethod === 'credit_card' && {
              card_number: cardData.number.replace(/\s/g, ''),
              card_holder_name: cardData.holder,
              card_expiration_date: cardData.expiry,
              card_cvv: cardData.cvv,
              installments: cardData.installments,
            }),
          },
        });
      } else {
        // One-time: POST /payments
        res = await chargesService.processPayment({
          token: chargeData.token,
          payment_method: paymentMethod,
          customer_name: personalData.name,
          customer_email: personalData.email,
          customer_document: personalData.document,
          customer_phone: personalData.phone,
          ...(paymentMethod === 'credit_card' && {
            card_number: cardData.number.replace(/\s/g, ''),
            card_holder_name: cardData.holder,
            card_expiration_date: cardData.expiry,
            card_cvv: cardData.cvv,
            installments: cardData.installments,
          }),
        });
      }
      if (paymentMethod === 'pix') {
        setPixData({ qr_code: res?.qr_code, qr_code_text: res?.qr_code_text });
      }
      setPaymentSuccess(true);
    } catch (err: any) {
      setPayError(err.message || 'Erro ao processar pagamento.');
    } finally {
      setIsProcessing(false);
    }
  };

  /* ── Loading ── */
  if (isLoading) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ textAlign: 'center' }}>
        <div style={{ margin: '0 auto 1.5rem', width: '40px', height: '40px', border: '3px solid #e2e8f0', borderTopColor: '#65839a', borderRadius: '50%', animation: 'spin 1s linear infinite' }} />
        <h2 style={{ color: '#334155', fontWeight: 500 }}>Carregando checkout seguro...</h2>
      </div>
      <style>{`@keyframes spin{to{transform:rotate(360deg)}}`}</style>
    </div>
  );

  /* ── Not Found ── */
  if (notFound || !chargeData) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc' }}>
      <div style={{ textAlign: 'center', maxWidth: '400px', padding: '2rem', background: 'white', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.1)' }}>
        <AlertCircle size={48} color="#ef4444" style={{ margin: '0 auto 1rem' }} />
        <h2 style={{ color: '#0f172a', fontSize: '1.5rem', fontWeight: 600, marginBottom: '0.5rem' }}>Cobrança não encontrada</h2>
        <p style={{ color: '#64748b' }}>O link de pagamento é inválido ou expirou.</p>
      </div>
    </div>
  );

  /* ── Success ── */
  if (paymentSuccess) return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f8fafc', padding: '1rem' }}>
      <div style={{ textAlign: 'center', maxWidth: '520px', width: '100%', padding: '3rem 2rem', background: 'white', borderRadius: '24px', boxShadow: '0 10px 25px -5px rgba(0,0,0,0.1)' }}>
        <div style={{ width: '80px', height: '80px', background: '#22c55e', borderRadius: '50%', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 1.5rem', boxShadow: '0 0 0 10px rgba(34,197,94,0.1)' }}>
          <Check size={40} color="white" />
        </div>
        {paymentMethod === 'pix' && pixData?.qr_code_text ? (
          <>
            <h2 style={{ color: '#0f172a', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Pix Gerado!</h2>
            <p style={{ color: '#64748b', marginBottom: '1.5rem' }}>Copie o código abaixo e pague no seu banco:</p>
            <div style={{ background: '#f8fafc', padding: '1rem', borderRadius: '12px', border: '1px dashed #cbd5e1', wordBreak: 'break-all', fontSize: '0.85rem', marginBottom: '1rem', color: '#0f172a', textAlign: 'left' }}>
              {pixData.qr_code_text}
            </div>
            <button className="btn-primary" style={{ width: '100%' }} onClick={() => navigator.clipboard.writeText(pixData.qr_code_text!)}>
              Copiar Código Pix
            </button>
          </>
        ) : (
          <>
            <h2 style={{ color: '#0f172a', fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.5rem' }}>Pagamento Aprovado!</h2>
            <p style={{ color: '#64748b', fontSize: '1rem', marginBottom: '2rem' }}>
              Recibo enviado para <strong>{personalData.email}</strong>.
            </p>
            <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '12px', textAlign: 'left', marginBottom: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.5rem' }}>
                <span style={{ color: '#64748b' }}>Código</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{chargeData.code}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span style={{ color: '#64748b' }}>Valor</span>
                <span style={{ fontWeight: 600, color: '#0f172a' }}>{fmt(chargeData.totalValue)}</span>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );

  /* ── Main ── */
  return (
    <div className="checkout-container">
      {/* Sidebar */}
      <div className="checkout-sidebar">
        <div className="sidebar-content">
          <div style={{ marginBottom: '3rem' }}>
            <img src="https://tronnus.com/wp-content/uploads/2026/01/tronnus-png-001.png" alt="TRONNUS" style={{ height: '40px', filter: 'brightness(0) invert(1)' }} />
          </div>
          <div>
            <h3 style={{ fontSize: '1.25rem', fontWeight: 600, color: 'white', marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <ShoppingBag size={20} /> {chargeData.isRecurring ? 'Assinatura' : 'Resumo do Pedido'}
            </h3>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <p style={{ color: 'var(--primary)', fontWeight: 500, fontSize: '0.95rem', margin: 0 }}>{chargeData.chargeName}</p>
              {chargeData.isRecurring && chargeData.periodicity && (
                <span style={{ background: 'rgba(34,197,94,0.2)', color: '#22c55e', border: '1px solid rgba(34,197,94,0.3)', borderRadius: '20px', padding: '0.15rem 0.65rem', fontSize: '0.78rem', fontWeight: 600 }}>
                  🔄 {periodicityLabel[chargeData.periodicity] ?? 'Recorrente'}
                </span>
              )}
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', marginBottom: '2rem' }}>
              {chargeData.items.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div>
                    <h4 style={{ color: 'white', fontSize: '1rem', fontWeight: 500, margin: '0 0 0.25rem' }}>{item.name}</h4>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.85rem', margin: 0 }}>Qtd: {item.quantity}</p>
                  </div>
                  <div style={{ color: 'white', fontWeight: 600 }}>{fmt(item.unitPrice * item.quantity)}</div>
                </div>
              ))}
            </div>
            <div style={{ height: '1px', background: 'rgba(255,255,255,0.2)', marginBottom: '1.5rem' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '3rem' }}>
              <span style={{ color: 'rgba(255,255,255,0.8)', fontSize: '1.1rem' }}>Total a pagar</span>
              <span style={{ color: 'white', fontSize: '2rem', fontWeight: 700 }}>{fmt(chargeData.totalValue)}</span>
            </div>
            <div style={{ background: 'rgba(255,255,255,0.1)', padding: '1.5rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)' }}>
              {[
                { icon: <ShieldCheck size={28} color="#22c55e" />, title: 'Compra 100% Segura', sub: 'Seus dados são criptografados.' },
                { icon: <Lock size={28} color="#3b82f6" />, title: 'Privacidade Garantida', sub: 'Não compartilhamos suas informações.' },
              ].map((b, i) => (
                <div key={i} style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: i === 0 ? '1rem' : 0 }}>
                  {b.icon}
                  <div>
                    <h5 style={{ color: 'white', fontSize: '0.95rem', fontWeight: 600, margin: '0 0 0.2rem' }}>{b.title}</h5>
                    <p style={{ color: 'rgba(255,255,255,0.7)', fontSize: '0.8rem', margin: 0 }}>{b.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Main */}
      <div className="checkout-main">
        <div className="main-content">
          {/* Steps */}
          <div style={{ display: 'flex', alignItems: 'center', marginBottom: '2.5rem', gap: '0.5rem' }}>
            {['Identificação', 'Pagamento'].map((label, i) => {
              const n = i + 1;
              const active = step >= n;
              return (
                <div key={n} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  {i > 0 && <div style={{ width: '40px', height: '2px', background: step > 1 ? 'var(--primary)' : '#e2e8f0', transition: 'all 0.3s' }} />}
                  <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: n < step ? 'pointer' : 'default' }}
                    onClick={() => n < step && setStep(n)}>
                    <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: active ? 'var(--primary)' : '#e2e8f0', color: active ? 'white' : '#64748b', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '0.85rem', fontWeight: 600, transition: 'all 0.3s' }}>
                      {step > n ? <Check size={16} /> : n}
                    </div>
                    <span style={{ fontSize: '0.9rem', fontWeight: active ? 600 : 500, color: active ? '#0f172a' : '#64748b' }}>{label}</span>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Step 1 */}
          {step === 1 && (
            <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
              <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', marginBottom: '0.5rem' }}>Dados Pessoais</h2>
              <p style={{ color: '#64748b', marginBottom: '2rem' }}>Preencha seus dados para prosseguir.</p>
              <form onSubmit={handleNextStep}>
                {[
                  { label: 'Nome Completo', field: 'name', type: 'text', placeholder: 'João da Silva' },
                  { label: 'E-mail', field: 'email', type: 'email', placeholder: 'voce@email.com' },
                ].map(({ label, field, type, placeholder }) => (
                  <div key={field} className="form-group">
                    <label>{label}</label>
                    <input type={type} className="checkout-input" placeholder={placeholder} required
                      value={(personalData as any)[field]}
                      onChange={e => setPersonalData({ ...personalData, [field]: e.target.value })} />
                  </div>
                ))}
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label>CPF ou CNPJ</label>
                    <input type="text" className="checkout-input" placeholder="000.000.000-00" required
                      value={personalData.document} onChange={e => setPersonalData({ ...personalData, document: e.target.value })} />
                  </div>
                  <div className="form-group">
                    <label>Telefone</label>
                    <input type="tel" className="checkout-input" placeholder="(00) 00000-0000" required
                      value={personalData.phone} onChange={e => setPersonalData({ ...personalData, phone: e.target.value })} />
                  </div>
                </div>
                <button type="submit" className="btn-primary" style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}>
                  Ir para Pagamento <ChevronRight size={20} />
                </button>
              </form>
            </div>
          )}

          {/* Step 2 */}
          {step === 2 && (
            <div style={{ animation: 'fadeIn 0.4s ease-out' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
                <button onClick={() => setStep(1)} style={{ background: 'none', border: 'none', color: '#64748b', cursor: 'pointer', padding: '0.5rem', display: 'flex', alignItems: 'center', borderRadius: '50%' }}>
                  <ArrowLeft size={20} />
                </button>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: '#0f172a', margin: 0 }}>Pagamento</h2>
                  <p style={{ color: '#64748b', margin: 0, fontSize: '0.9rem' }}>Escolha a forma de pagamento.</p>
                </div>
              </div>

              {/* Tabs */}
              <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem' }}>
                {[
                  { id: 'credit_card', label: 'Cartão de Crédito', icon: <CreditCard size={28} />, activeColor: 'var(--primary)' },
                  { id: 'pix', label: 'Pix', icon: <Smartphone size={28} />, activeColor: '#22c55e' },
                ].map(tab => {
                  const active = paymentMethod === tab.id;
                  return (
                    <div key={tab.id} onClick={() => setPaymentMethod(tab.id as any)}
                      style={{ flex: 1, padding: '1.25rem', border: `2px solid ${active ? tab.activeColor : '#e2e8f0'}`, borderRadius: '12px', cursor: 'pointer', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem', background: active ? `${tab.activeColor}0d` : 'white', transition: 'all 0.2s' }}>
                      <span style={{ color: active ? tab.activeColor : '#64748b' }}>{tab.icon}</span>
                      <span style={{ fontWeight: 600, color: active ? tab.activeColor : '#64748b' }}>{tab.label}</span>
                    </div>
                  );
                })}
              </div>

              {payError && (
                <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '0.75rem 1rem', color: '#ef4444', marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                  {payError}
                </div>
              )}

              <form onSubmit={handleCheckout}>
                {paymentMethod === 'credit_card' && (
                  <div>
                    <div className="form-group">
                      <label>Número do Cartão</label>
                      <div style={{ position: 'relative' }}>
                        <input type="text" className="checkout-input" placeholder="0000 0000 0000 0000" required
                          value={cardData.number} onChange={e => setCardData({ ...cardData, number: e.target.value })} />
                        <CreditCard size={20} color="#94a3b8" style={{ position: 'absolute', right: '1rem', top: '50%', transform: 'translateY(-50%)' }} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Nome do Titular</label>
                      <input type="text" className="checkout-input" placeholder="Como impresso no cartão" required
                        value={cardData.holder} onChange={e => setCardData({ ...cardData, holder: e.target.value })} />
                    </div>
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Validade</label>
                        <input type="text" className="checkout-input" placeholder="MM/AA" required
                          value={cardData.expiry} onChange={e => setCardData({ ...cardData, expiry: e.target.value })} />
                      </div>
                      <div className="form-group">
                        <label>CVV</label>
                        <input type="text" className="checkout-input" placeholder="123" required
                          value={cardData.cvv} onChange={e => setCardData({ ...cardData, cvv: e.target.value })} />
                      </div>
                    </div>
                    <div className="form-group">
                      <label>Parcelamento</label>
                      <select className="checkout-input" value={cardData.installments}
                        onChange={e => setCardData({ ...cardData, installments: parseInt(e.target.value) })}>
                        {[1, 2, 3].map(n => (
                          <option key={n} value={n}>{n}x de {fmt(chargeData.totalValue / n)} sem juros</option>
                        ))}
                      </select>
                    </div>
                  </div>
                )}

                {paymentMethod === 'pix' && (
                  <div style={{ textAlign: 'center', padding: '1rem 0 2rem' }}>
                    <div style={{ background: '#f8fafc', padding: '1.5rem', borderRadius: '16px', border: '1px dashed #cbd5e1' }}>
                      <Smartphone size={40} color="#22c55e" style={{ margin: '0 auto 1rem' }} />
                      <h3 style={{ fontSize: '1.1rem', fontWeight: 600, color: '#0f172a', marginBottom: '0.5rem' }}>Pagamento via Pix</h3>
                      <p style={{ color: '#64748b', fontSize: '0.9rem', margin: 0 }}>
                        Ao confirmar, geraremos um QR Code e código "Copia e Cola" exclusivos.
                      </p>
                    </div>
                  </div>
                )}

                <button type="submit" disabled={isProcessing}
                  style={{ width: '100%', marginTop: '1rem', padding: '1rem', fontSize: '1.1rem', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem', background: paymentMethod === 'pix' ? '#22c55e' : 'var(--primary)', color: 'white', border: 'none', borderRadius: '12px', fontWeight: 600, cursor: isProcessing ? 'not-allowed' : 'pointer', opacity: isProcessing ? 0.8 : 1, transition: 'all 0.2s' }}>
                  {isProcessing ? (
                    <><div style={{ width: '20px', height: '20px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }} /> Processando...</>
                  ) : (
                    <><Lock size={18} /> Pagar {fmt(chargeData.totalValue)}</>
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
        .checkout-container { display: flex; min-height: 100vh; font-family: var(--font-inter), sans-serif; }
        .checkout-sidebar { width: 45%; background: linear-gradient(135deg, #1b2932 0%, #0f172a 100%); padding: 4rem; display: flex; justify-content: flex-end; position: relative; overflow: hidden; }
        .checkout-sidebar::before { content: ''; position: absolute; top: 0; left: 0; width: 100%; height: 100%; background: url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none'%3E%3Cg fill='%2365839a' fill-opacity='0.05'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E"); }
        .sidebar-content { width: 100%; max-width: 480px; position: relative; z-index: 1; }
        .checkout-main { width: 55%; background: #f8fafc; padding: 4rem; display: flex; justify-content: flex-start; overflow-y: auto; }
        .main-content { width: 100%; max-width: 520px; }
        .form-group { margin-bottom: 1.5rem; }
        .form-group label { display: block; font-size: 0.9rem; font-weight: 600; color: #334155; margin-bottom: 0.5rem; }
        .checkout-input { width: 100%; padding: 0.85rem 1rem; background: white; border: 1px solid #cbd5e1; border-radius: 10px; font-size: 1rem; color: #0f172a; transition: all 0.2s; font-family: inherit; }
        .checkout-input:focus { outline: none; border-color: var(--primary); box-shadow: 0 0 0 3px rgba(101,131,154,0.15); }
        @keyframes spin { to { transform: rotate(360deg); } }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(10px); } to { opacity: 1; transform: translateY(0); } }
        @media (max-width: 992px) {
          .checkout-container { flex-direction: column; }
          .checkout-sidebar { width: 100%; padding: 2rem; justify-content: center; }
          .sidebar-content { max-width: 100%; }
          .checkout-main { width: 100%; padding: 2rem; justify-content: center; }
          .main-content { max-width: 100%; }
        }
      `}</style>
    </div>
  );
}
