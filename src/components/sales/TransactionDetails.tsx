"use client";

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/services/api';
import {
  ArrowLeft,
  DollarSign,
  Clock,
  CheckCircle,
  User,
  MapPin,
  CreditCard,
  Wallet,
  Banknote,
  Package,
  ExternalLink,
  Copy,
  ChevronDown,
  ChevronUp,
  Loader2,
  Split,
  X,
} from 'lucide-react';
import { translateStatus, translateMethod, getStatusPillClass, formatCurrency } from '@/utils/formatters';

interface TransactionDetailsProps {
  orderId: string;
  onClose?: () => void;
}

export function TransactionDetails({ orderId, onClose }: TransactionDetailsProps) {
  const router = useRouter();
  const [order, setOrder] = useState<any>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedProduct, setExpandedProduct] = useState<number | null>(null);
  const [copiedField, setCopiedField] = useState<string | null>(null);

  useEffect(() => {
    setIsLoading(true);
    import('@/services/api/client').then(({ fetchApi }) => {
      fetchApi(`/payments/${orderId}`)
        .then((res: any) => {
          const data = res?.order || res?.data?.order || res?.data || res;
          setOrder(data);
        })
        .catch((err: any) => console.error('Erro ao buscar transação:', err))
        .finally(() => setIsLoading(false));
    });
  }, [orderId]);

  const copyToClipboard = (text: string, field: string) => {
    navigator.clipboard.writeText(text);
    setCopiedField(field);
    setTimeout(() => setCopiedField(null), 2000);
  };

  const paymentPaid = order?.payments?.find((p: any) => p.status === 'PAID');

  const getPaymentMethod = () => {
    if (!order?.payments?.length) return 'Indefinido';
    return paymentPaid?.payment_method?.description || paymentPaid?.paymentMethod?.description || order?.payments[0]?.payment_method?.description || order?.payments[0]?.paymentMethod?.description || 'N/A';
  };

  const sumProductValues = (products: any[]) => {
    if (!products?.length) return 0;
    return products.reduce((acc: number, p: any) => {
      if (p.name !== 'Desconto') {
        const price = parseFloat(p.price);
        const qty = parseInt(p.quantity, 10);
        if (!isNaN(price) && !isNaN(qty)) acc += price * qty;
      }
      return acc;
    }, 0);
  };

  const pendingPayments = () => {
    let count = 0;
    order?.payments?.forEach((p: any) => {
      if (['NOT_PAID', 'WAITING_PAYMENT', 'WAITING_CONFIRM', 'PENDING'].includes(p.status)) count++;
    });
    return count;
  };

  const approvedPayments = () => {
    let count = 0;
    order?.payments?.forEach((p: any) => {
      if (p.status === 'PAID') count++;
    });
    return count;
  };

  const formatDate = (dateStr: string) => {
    if (!dateStr) return '—';
    return new Date(dateStr).toLocaleDateString('pt-BR', {
      day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  const getStepperSteps = () => {
    const steps = [
      { label: 'Registrado', key: 'sent' },
      { label: 'Aguardando Pagamento', key: 'processing' },
      { label: 'Aguardando Confirmação', key: 'waiting' },
      { label: 'Pago', key: 'paid' },
    ];
    let activeIndex = 0;
    switch (order?.status) {
      case 'NOT_PAID': activeIndex = 0; break;
      case 'WAITING_PAYMENT': activeIndex = 1; break;
      case 'WAITING_CONFIRM': activeIndex = 2; break;
      case 'PAID': activeIndex = 4; break;
      default: activeIndex = 0;
    }
    return { steps, activeIndex };
  };

  const methodIcon = (method: string) => {
    const m = method?.toLowerCase() || '';
    if (m.includes('credit') || m.includes('cart')) return <CreditCard size={16} />;
    if (m.includes('pix')) return <Wallet size={16} />;
    return <Banknote size={16} />;
  };

  if (isLoading) {
    return onClose ? (
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
        <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
      </div>
    ) : (
      <DashboardLayout>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', minHeight: '60vh' }}>
          <Loader2 size={32} className="animate-spin" style={{ color: 'var(--primary)' }} />
        </div>
      </DashboardLayout>
    );
  }

  if (!order) {
    return onClose ? (
      <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
        <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Transação não encontrada.</p>
        <button className="btn-primary" onClick={onClose}>Fechar</button>
      </div>
    ) : (
      <DashboardLayout>
        <div style={{ textAlign: 'center', padding: '4rem 2rem', color: 'var(--text-dim)' }}>
          <p style={{ fontSize: '1.1rem', marginBottom: '1.5rem' }}>Transação não encontrada.</p>
          <button className="btn-primary" onClick={() => router.push('/sales/approved')}>Voltar para transações</button>
        </div>
      </DashboardLayout>
    );
  }

  const { steps, activeIndex } = getStepperSteps();
  const methodRaw = paymentPaid?.paymentMethod?.method || order?.payments?.[0]?.paymentMethod?.method || order?.payment_method || order?.method || '';
  const isCard = methodRaw.toLowerCase().includes('credit') || methodRaw.toLowerCase().includes('cart');

  const renderContent = () => (
    <div className="animate-fade-in" style={{ padding: onClose ? '0.5rem' : 0 }}>

        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', marginBottom: '2rem' }}>
          <button
            onClick={() => onClose ? onClose() : router.back()}
            style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '12px', padding: '0.6rem', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', color: 'var(--text-main)', transition: 'all 0.2s' }}
          >
            {onClose ? <X size={20} /> : <ArrowLeft size={20} />}
          </button>
          <div>
            <h1 style={{ fontSize: '1.6rem', fontWeight: 700 }}>{onClose ? 'Detalhes da Venda' : 'Detalhes da Transação'}</h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>
              Token: {order.token || orderId}
            </p>
          </div>
          <div style={{ marginLeft: 'auto' }}>
            <span className={`status-pill ${getStatusPillClass(order.status?.code || order.status)}`} style={{ fontSize: '0.85rem', padding: '0.4rem 1rem' }}>
              {translateStatus(order.status?.code || order.status)}
            </span>
          </div>
        </div>

        {/* Cards de resumo */}
        <div className="stats-grid" style={{ gridTemplateColumns: 'repeat(4, 1fr)', marginBottom: '2rem' }}>
          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Valor</span>
              <div style={{ background: 'rgba(101, 131, 154, 0.15)', borderRadius: '10px', padding: '0.5rem', display: 'flex' }}>
                <DollarSign size={18} style={{ color: 'var(--primary)' }} />
              </div>
            </div>
            <div className="stat-value" style={{ fontSize: '1.6rem' }}>
              {formatCurrency(sumProductValues(order.products) || order.amount || 0)}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Valor Recebido</span>
              <div style={{ background: 'rgba(49, 120, 44, 0.15)', borderRadius: '10px', padding: '0.5rem', display: 'flex' }}>
                <DollarSign size={18} style={{ color: 'var(--success)' }} />
              </div>
            </div>
            <div className="stat-value" style={{ fontSize: '1.6rem' }}>
              {(() => {
                const receivable = order.amount_receivable || order.amountReceivable;
                if (!receivable && !(order.payment_split_accounts?.length > 0 || order.paymentSplitAccounts?.length > 0)) {
                  return '—';
                }
                if (order.payment_split_accounts?.length > 0 || order.paymentSplitAccounts?.length > 0) {
                  const splits = order.payment_split_accounts || order.paymentSplitAccounts || [];
                  const seller = splits.find((v: any) => (order.seller_token || order.sellerToken) === (v.account_token || v.accountToken));
                  return formatCurrency(seller?.amount_receivable || seller?.amountReceivable || 0);
                }
                return formatCurrency(receivable);
              })()}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Pag. Pendentes</span>
              <div style={{ background: 'rgba(255, 177, 86, 0.15)', borderRadius: '10px', padding: '0.5rem', display: 'flex' }}>
                <Clock size={18} style={{ color: 'var(--warning)' }} />
              </div>
            </div>
            <div className="stat-value" style={{ fontSize: '1.6rem' }}>
              {pendingPayments()}
            </div>
          </div>

          <div className="stat-card">
            <div className="stat-top">
              <span className="stat-title">Pago</span>
              <div style={{ background: 'rgba(49, 120, 44, 0.15)', borderRadius: '10px', padding: '0.5rem', display: 'flex' }}>
                <CheckCircle size={18} style={{ color: 'var(--success)' }} />
              </div>
            </div>
            <div className="stat-value" style={{ fontSize: '1.6rem' }}>
              {approvedPayments()}
            </div>
          </div>
        </div>

        {/* Stepper de Status */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '1.5rem 2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Status do Pagamento</h3>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', position: 'relative' }}>
            {/* Linha de conexão */}
            <div style={{ position: 'absolute', top: '20px', left: '40px', right: '40px', height: '3px', background: 'var(--border)', zIndex: 0 }}>
              <div style={{ width: `${Math.min(100, (activeIndex / (steps.length - 1)) * 100)}%`, height: '100%', background: 'var(--success)', borderRadius: '2px', transition: 'width 0.5s ease' }} />
            </div>
            {steps.map((step, i) => (
              <div key={step.key} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', zIndex: 1, flex: 1 }}>
                <div style={{
                  width: '40px', height: '40px', borderRadius: '50%',
                  background: i < activeIndex ? 'var(--success)' : i === activeIndex ? 'var(--primary)' : 'var(--surface-hover)',
                  border: `2px solid ${i <= activeIndex ? 'var(--success)' : 'var(--border)'}`,
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  transition: 'all 0.3s ease'
                }}>
                  {i < activeIndex ? (
                    <CheckCircle size={18} style={{ color: 'white' }} />
                  ) : (
                    <span style={{ color: i === activeIndex ? 'white' : 'var(--text-dim)', fontSize: '0.8rem', fontWeight: 600 }}>{i + 1}</span>
                  )}
                </div>
                <span style={{ marginTop: '0.5rem', fontSize: '0.75rem', color: i <= activeIndex ? 'var(--text-main)' : 'var(--text-dim)', fontWeight: i === activeIndex ? 600 : 400, textAlign: 'center' }}>
                  {step.label}
                </span>
              </div>
            ))}
          </div>
        </div>

        {/* Grid principal: Cliente + Informações */}
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1.5rem', marginBottom: '2rem' }}>

          {/* Card do Cliente */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2rem' }}>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '1.5rem' }}>
              <div style={{ width: '64px', height: '64px', borderRadius: '50%', background: 'rgba(101, 131, 154, 0.2)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: '0.75rem' }}>
                <User size={28} style={{ color: 'var(--primary)' }} />
              </div>
              <h3 style={{ fontSize: '1.1rem', fontWeight: 600 }}>
                {order.buyer?.name || order.customer?.name || 'Pendente'}
              </h3>
              {order.buyer?.address?.city && (
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginTop: '0.5rem', background: 'rgba(101, 131, 154, 0.1)', padding: '0.3rem 0.8rem', borderRadius: '20px' }}>
                  <MapPin size={14} style={{ color: 'var(--primary)' }} />
                  <span style={{ fontSize: '0.8rem', color: 'var(--primary)' }}>
                    {order.buyer.address.city}, {order.buyer.address.state}
                  </span>
                </div>
              )}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <InfoRow label="E-mail" value={order.buyer?.email || order.customer?.email || '—'} />
              <InfoRow label="CPF/CNPJ" value={order.buyer?.document?.value || (typeof order.buyer?.document === 'string' ? order.buyer.document : null) || order.customer?.doc || order.customer?.document || '—'} />
              <InfoRow label="Telefone" value={order.buyer?.celphone || order.buyer?.phone || order.customer?.phone || '—'} />
            </div>
          </div>

          {/* Card de Informações da Transação */}
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Informações da Transação</h3>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div style={{ gridColumn: 'span 2' }}>
                <InfoRow
                  label="ID da transação"
                  value={order.token || '—'}
                  copyable
                  onCopy={() => copyToClipboard(order.token, 'token')}
                  copied={copiedField === 'token'}
                />
              </div>
              <InfoRow label="Código" value={order.code || '—'} />
              <InfoRow label="Método de pagamento" value={getPaymentMethod()} icon={methodIcon(methodRaw)} />
              <InfoRow label="Data de criação" value={formatDate(order.createdAt || order.created_at)} />
              {paymentPaid?.approvalDate && (
                <InfoRow label="Data de aprovação" value={formatDate(paymentPaid.approvalDate)} />
              )}
              {paymentPaid?.splitNumber && (
                <InfoRow label="Parcelas" value={`${paymentPaid.splitNumber}x`} />
              )}
              {isCard && paymentPaid && (
                <>
                  {order.firstCreditDate && (
                    <InfoRow label="Creditação 1ª parcela" value={formatDate(order.firstCreditDate)} />
                  )}
                  {paymentPaid.splitNumber > 1 && order.lastCreditDate && (
                    <InfoRow label="Creditação última parcela" value={formatDate(order.lastCreditDate)} />
                  )}
                </>
              )}
            </div>

            {/* Link de pagamento */}
            <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <button
                className="btn-primary"
                style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', width: '100%', justifyContent: 'center' }}
                onClick={() => window.open(`${window.location.origin}/checkout/order/${order.token}`, '_blank')}
              >
                <ExternalLink size={16} /> Acessar Página de Pagamento
              </button>
            </div>
          </div>
        </div>

        {/* Endereço */}
        <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
          <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Endereço</h3>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.25rem' }}>
            <InfoRow label="CEP" value={order.buyer?.address?.postal_code || order.buyer?.address?.postalCode || '—'} />
            <InfoRow label="Estado" value={order.buyer?.address?.state || '—'} />
            <InfoRow label="Cidade" value={order.buyer?.address?.city || '—'} />
            <InfoRow label="Bairro" value={order.buyer?.address?.neighborhood || '—'} />
            <InfoRow label="Rua" value={order.buyer?.address?.street || '—'} />
            <InfoRow label="Número" value={order.buyer?.address?.number || '—'} />
          </div>
        </div>

        {/* Split de Pagamento */}
        {order.paymentSplitAccounts?.length > 0 && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Split size={18} /> Split de Pagamento
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {order.paymentSplitAccounts.map((acc: any, i: number) => (
                <div key={i} style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '1rem', padding: '1rem 0', borderBottom: i < order.paymentSplitAccounts.length - 1 ? '1px solid var(--border)' : 'none' }}>
                  <InfoRow
                    label={order.sellerToken === acc.accountToken ? 'Vendedor' : 'Beneficiário'}
                    value={acc.accountName}
                  />
                  <InfoRow
                    label={acc.splitType === 'fixed' ? 'Split (Fixo)' : acc.splitType ? 'Split (%)' : '—'}
                    value={acc.splitValue != null ? String(acc.splitValue) : '—'}
                  />
                  <InfoRow
                    label="Valor repassado"
                    value={formatCurrency(acc.amountReceivable || 0)}
                  />
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Produtos/Serviços */}
        {order.products?.length > 0 && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Package size={18} /> Produtos / Serviços
            </h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1rem' }}>
              {order.products.map((product: any, i: number) => (
                <div key={i} style={{ background: 'var(--surface-hover)', borderRadius: '16px', overflow: 'hidden', border: '1px solid var(--border)', transition: 'all 0.2s' }}>
                  <div style={{ background: 'linear-gradient(135deg, var(--primary), var(--primary-hover))', height: '80px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <Package size={28} style={{ color: 'white', opacity: 0.7 }} />
                  </div>
                  <div style={{ padding: '1.25rem' }}>
                    <h4 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '0.25rem' }}>{product.name}</h4>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.85rem', marginBottom: '0.75rem' }}>
                      {product.description?.length > 60 ? product.description.substring(0, 60) + '...' : product.description}
                    </p>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                      <span style={{ fontWeight: 700, color: 'var(--text-main)' }}>{formatCurrency(parseFloat(product.price) || 0)}</span>
                      <span style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>Qtd: {product.quantity}</span>
                    </div>
                    {product.description && product.description.length > 60 && (
                      <button
                        onClick={() => setExpandedProduct(expandedProduct === i ? null : i)}
                        style={{ marginTop: '0.75rem', color: 'var(--primary)', fontSize: '0.85rem', display: 'flex', alignItems: 'center', gap: '0.25rem', background: 'none', border: 'none', cursor: 'pointer' }}
                      >
                        {expandedProduct === i ? 'Menos detalhes' : 'Mais detalhes'}
                        {expandedProduct === i ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                      </button>
                    )}
                    {expandedProduct === i && (
                      <p style={{ marginTop: '0.5rem', color: 'var(--text-dim)', fontSize: '0.85rem', lineHeight: 1.5 }}>
                        {product.description}
                      </p>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Cobranças (Payments) */}
        {order.payments?.length > 0 && (
          <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', borderRadius: '20px', padding: '2rem', marginBottom: '2rem' }}>
            <h3 style={{ fontSize: '1rem', fontWeight: 600, marginBottom: '1.5rem', color: 'var(--text-dim)', textTransform: 'uppercase', letterSpacing: '0.5px' }}>Pagamentos</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
              {order.payments.map((payment: any, i: number) => (
                <div key={i} style={{
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between',
                  padding: '1rem 1.25rem', background: 'var(--surface-hover)', borderRadius: '12px',
                  border: '1px solid var(--border)', transition: 'all 0.2s'
                }}>
                  <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
                    <div style={{ background: 'rgba(101, 131, 154, 0.15)', borderRadius: '10px', padding: '0.5rem', display: 'flex' }}>
                      <DollarSign size={18} style={{ color: 'var(--primary)' }} />
                    </div>
                    <div>
                      <div style={{ fontSize: '0.85rem', color: 'var(--text-dim)' }}>
                        {payment.payment_method?.description || payment.paymentMethod?.description || translateMethod(payment.method || '')}
                      </div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                        {formatDate(payment.createdAt || payment.created_at)}
                      </div>
                    </div>
                  </div>
                  <div style={{ textAlign: 'right' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.15rem' }}>Total</div>
                    <div style={{ fontWeight: 600, fontSize: '0.95rem' }}>{formatCurrency(payment.amount || 0)}</div>
                  </div>
                  <span className={`status-pill ${getStatusPillClass(payment.status)}`} style={{ fontSize: '0.75rem' }}>
                    {translateStatus(payment.status)}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}
      <style jsx>{`
        @media (max-width: 992px) {
          .stats-grid {
            grid-template-columns: repeat(2, 1fr) !important;
          }
        }
        @media (max-width: 768px) {
          .stats-grid {
            grid-template-columns: 1fr !important;
          }
        }
      `}</style>
    </div>
  );

  return onClose ? renderContent() : <DashboardLayout>{renderContent()}</DashboardLayout>;
}

/* Componente auxiliar de Info Row */
function InfoRow({ label, value, icon, copyable, onCopy, copied }: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  copyable?: boolean;
  onCopy?: () => void;
  copied?: boolean;
}) {
  return (
    <div>
      <div style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginBottom: '0.2rem', textTransform: 'uppercase', letterSpacing: '0.3px', fontWeight: 500 }}>
        {label}
      </div>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.95rem', fontWeight: 500, color: 'var(--text-main)' }}>
        {icon}
        <span>{value}</span>
        {copyable && onCopy && (
          <button
            onClick={onCopy}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '0.15rem', color: copied ? 'var(--success)' : 'var(--text-dim)', transition: 'color 0.2s' }}
            title="Copiar"
          >
            <Copy size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
