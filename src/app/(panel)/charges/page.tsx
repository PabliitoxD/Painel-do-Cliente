"use client";

import { useState, useMemo, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  Search, Plus, X, Receipt, Trash2, ShoppingCart, User, Tag, 
  DollarSign, FileText, BarChart3, Users, Link as LinkIcon, 
  CreditCard, Smartphone, CheckCircle, Clock, AlertTriangle, RefreshCcw
} from 'lucide-react';

// Mock data for initial table
const MOCK_CHARGES = [
  { 
    id: 1, code: 'COB-1092', chargeName: 'Consultoria Premium', dueDate: '15/06/2026', value: 150.00, status: 'Pendente',
    metrics: { pendingPayments: 2, completedPayments: 0, linkAccesses: 15, abandonments: 3, conversionRate: { pix: 0, creditCard: 0 } },
    leads: [{ id: 1, name: 'Carlos', email: 'carlos@teste.com', phone: '(11) 99999-9999' }],
    checkoutUrl: typeof window !== 'undefined' ? `${window.location.origin}/checkout/COB-1092` : '/checkout/COB-1092'
  },
  { 
    id: 2, code: 'COB-1093', chargeName: 'Setup de Sistema', dueDate: '10/06/2026', value: 350.50, status: 'Pago',
    metrics: { pendingPayments: 0, completedPayments: 1, linkAccesses: 5, abandonments: 0, conversionRate: { pix: 100, creditCard: 0 } },
    leads: [],
    checkoutUrl: typeof window !== 'undefined' ? `${window.location.origin}/checkout/COB-1093` : '/checkout/COB-1093'
  },
];

export default function ChargesPage() {
  const [charges, setCharges] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [detailsModalOpen, setDetailsModalOpen] = useState(false);
  const [selectedCharge, setSelectedCharge] = useState<any>(null);

  const [cartItems, setCartItems] = useState([
    { id: Date.now(), name: '', description: '', unitPrice: 0, quantity: 1 }
  ]);

  const [chargeInfo, setChargeInfo] = useState({ 
    code: `COB-${Math.floor(1000 + Math.random() * 9000)}`, 
    name: '',
    dueDate: '', 
    description: '',
    billingType: 'unica',
    frequency: 'mensal',
    hasLimit: false,
    limitCount: 12,
    hasTrial: false,
    trialDays: 7
  });

  const handleOpenModal = () => {
    // Reset form on open
    setCartItems([{ id: Date.now(), name: '', description: '', unitPrice: 0, quantity: 1 }]);
    setChargeInfo({
      code: `COB-${Math.floor(1000 + Math.random() * 9000)}`,
      name: '',
      dueDate: '',
      description: '',
      billingType: 'unica',
      frequency: 'mensal',
      hasLimit: false,
      limitCount: 12,
      hasTrial: false,
      trialDays: 7
    });
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
  };

  const handleOpenDetails = (charge: any) => {
    setSelectedCharge(charge);
    setDetailsModalOpen(true);
  };

  const handleCloseDetails = () => {
    setDetailsModalOpen(false);
    setSelectedCharge(null);
  };

  const addProduct = () => {
    setCartItems([...cartItems, { id: Date.now(), name: '', description: '', unitPrice: 0, quantity: 1 }]);
  };

  const removeProduct = (id: number) => {
    if (cartItems.length > 1) {
      setCartItems(cartItems.filter(item => item.id !== id));
    }
  };

  const updateCartItem = (id: number, field: string, value: any) => {
    setCartItems(cartItems.map(item => 
      item.id === id ? { ...item, [field]: value } : item
    ));
  };

  const totalCheckoutValue = useMemo(() => {
    return cartItems.reduce((acc, item) => acc + ((Number(item.unitPrice) || 0) * (Number(item.quantity) || 0)), 0);
  }, [cartItems]);

  useEffect(() => {
    fetchCharges();
  }, []);

  const fetchCharges = async () => {
    setIsLoading(true);
    try {
      // Simulate API call to fetch charges
      // const response = await axios.get('/api/charges');
      // setCharges(response.data);
      
      setTimeout(() => {
        setCharges(MOCK_CHARGES);
        setIsLoading(false);
      }, 1000);
    } catch (error) {
      console.error('Error fetching charges:', error);
      setIsLoading(false);
    }
  };

  const handleSaveCharge = async () => {
    setIsSaving(true);
    try {
      // Simulate API payload
      const payload = {
        charge: chargeInfo,
        cart: cartItems,
        totalValue: totalCheckoutValue
      };
      
      // Simulate API call
      // const response = await axios.post('/api/charges', payload);
      
      setTimeout(() => {
        const newCharge = {
          id: Date.now(),
          code: chargeInfo.code,
          chargeName: chargeInfo.name || 'Cobrança Sem Nome',
          dueDate: chargeInfo.dueDate || 'N/A',
          value: totalCheckoutValue,
          status: 'Pendente',
          metrics: { pendingPayments: 0, completedPayments: 0, linkAccesses: 0, abandonments: 0, conversionRate: { pix: 0, creditCard: 0 } },
          leads: [],
          checkoutUrl: typeof window !== 'undefined' ? `${window.location.origin}/checkout/${chargeInfo.code}` : `/checkout/${chargeInfo.code}`
        };
        
        setCharges([newCharge, ...charges]);
        setIsSaving(false);
        handleCloseModal();
      }, 1500);
    } catch (error) {
      console.error('Error saving charge:', error);
      setIsSaving(false);
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(value);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    alert('Link copiado para a área de transferência!');
  };

  return (
    <DashboardLayout>
      <div className="charges-page animate-fade-in">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Receipt size={24} className="text-primary" /> Cobranças
            </h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Gerencie suas cobranças criadas e gere novos links de pagamento</p>
          </div>
          <button className="btn-primary" onClick={handleOpenModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Nova Cobrança
          </button>
        </div>

        <div className="table-filters card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem' }}>
          <div className="search-box" style={{ flex: 1, background: 'var(--background)', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', borderRadius: '10px' }}>
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Buscar por código ou nome da cobrança..." 
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-main)', fontSize: '0.95rem' }}
            />
          </div>
        </div>

        <div className="table-card">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Código</th>
                <th>Nome da Cobrança</th>
                <th>Vencimento</th>
                <th>Valor Total</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                    <div className="spinner" style={{ margin: '0 auto 1rem', width: '24px', height: '24px', border: '3px solid var(--border)', borderTopColor: 'var(--primary)', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                    Carregando cobranças...
                  </td>
                </tr>
              ) : charges.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-dim)' }}>
                    Nenhuma cobrança encontrada.
                  </td>
                </tr>
              ) : (
                charges.map(charge => (
                  <tr key={charge.id}>
                    <td style={{ fontWeight: 600, color: 'var(--primary)' }}>{charge.code}</td>
                    <td style={{ fontWeight: 600, color: 'var(--text-main)' }}>{charge.chargeName}</td>
                    <td style={{ color: 'var(--text-dim)' }}>{charge.dueDate}</td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(charge.value)}</td>
                    <td>
                      <span className={`status-pill ${charge.status === 'Pago' ? 'aprovada' : 'pendente'}`}>
                        {charge.status}
                      </span>
                    </td>
                    <td style={{ textAlign: 'right' }}>
                      <button className="btn-ghost" onClick={() => handleOpenDetails(charge)} style={{ padding: '0.4rem 0.8rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                        Ver Detalhes
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Create Charge Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content large" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '95%', maxHeight: '85vh', overflowY: 'auto', margin: 'auto' }}>
              <div className="modal-header" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Receipt size={24} className="text-primary" /> Nova Cobrança
                </h2>
                <button className="btn-ghost" onClick={handleCloseModal} style={{ padding: '0.4rem', borderRadius: '8px' }}><X size={20} /></button>
              </div>
              
              <div className="modal-body">
                
                {/* Top Value Summary */}
                <div className="total-summary-card" style={{ 
                  background: 'linear-gradient(135deg, var(--primary) 0%, #3a5368 100%)', 
                  borderRadius: '16px', 
                  padding: '1.5rem', 
                  marginBottom: '2rem',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  color: 'white',
                  boxShadow: '0 8px 24px rgba(101, 131, 154, 0.2)'
                }}>
                  <div>
                    <h3 style={{ fontSize: '1rem', fontWeight: 500, opacity: 0.9, marginBottom: '0.25rem' }}>Valor Total do Checkout</h3>
                    <p style={{ fontSize: '0.85rem', opacity: 0.8 }}>Soma de todos os produtos do carrinho</p>
                  </div>
                  <div style={{ fontSize: '2.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <DollarSign size={32} opacity={0.8} />
                    {formatCurrency(totalCheckoutValue).replace('R$', '').trim()}
                  </div>
                </div>

                <div className="form-sections-grid" style={{ marginBottom: '2rem' }}>
                  {/* Charge Info */}
                  <div className="form-section">
                    <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.5rem' }}>
                      <FileText size={18} className="text-primary" /> Detalhes da Cobrança
                    </h3>
                    
                    <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr', gap: '1rem' }}>
                      <div className="form-group">
                        <label>Nome da Cobrança</label>
                        <input 
                          type="text" 
                          className="form-control" 
                          placeholder="Ex: Consultoria de Marketing" 
                          value={chargeInfo.name}
                          onChange={e => setChargeInfo({...chargeInfo, name: e.target.value})}
                        />
                      </div>
                      <div className="form-group">
                        <label>Código (Gerado)</label>
                        <input 
                          type="text" 
                          className="form-control disabled-input" 
                          value={chargeInfo.code} 
                          readOnly 
                          style={{ background: 'var(--background)', color: 'var(--text-dim)' }}
                        />
                      </div>
                      <div className="form-group">
                        <label>Vencimento</label>
                        <input 
                          type="date" 
                          className="form-control" 
                          value={chargeInfo.dueDate}
                          onChange={e => setChargeInfo({...chargeInfo, dueDate: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="form-group">
                      <label>Descrição</label>
                      <textarea 
                        className="form-control" 
                        placeholder="Descreva o motivo desta cobrança (opcional)..." 
                        rows={2}
                        value={chargeInfo.description}
                        onChange={e => setChargeInfo({...chargeInfo, description: e.target.value})}
                        style={{ resize: 'none' }}
                      />
                    </div>

                    {/* Recurrency Options */}
                    <div style={{ marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                      <div className="form-group">
                        <label>Tipo de Cobrança</label>
                        <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500, color: 'var(--text-main)' }}>
                            <input type="radio" name="billingType" value="unica" checked={chargeInfo.billingType === 'unica'} onChange={() => setChargeInfo({...chargeInfo, billingType: 'unica'})} style={{ accentColor: 'var(--primary)' }} /> 
                            Cobrança Única
                          </label>
                          <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontWeight: 500, color: 'var(--text-main)' }}>
                            <input type="radio" name="billingType" value="recorrente" checked={chargeInfo.billingType === 'recorrente'} onChange={() => setChargeInfo({...chargeInfo, billingType: 'recorrente'})} style={{ accentColor: 'var(--primary)' }} /> 
                            Assinatura Recorrente
                          </label>
                        </div>
                      </div>

                      {chargeInfo.billingType === 'recorrente' && (
                        <div className="recurrency-settings animate-fade-in" style={{ background: 'var(--background)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                          <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-main)' }}>
                            <RefreshCcw size={16} className="text-primary" /> Configurações de Recorrência
                          </h4>
                          
                          <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1rem', marginBottom: '1.5rem' }}>
                            <div className="form-group" style={{ marginBottom: 0 }}>
                              <label>Frequência</label>
                              <select className="form-control" value={chargeInfo.frequency} onChange={e => setChargeInfo({...chargeInfo, frequency: e.target.value})}>
                                <option value="semanal">Semanal</option>
                                <option value="quinzenal">Quinzenal</option>
                                <option value="mensal">Mensal</option>
                                <option value="trimestral">Trimestral</option>
                                <option value="semestral">Semestral</option>
                                <option value="anual">Anual</option>
                              </select>
                            </div>
                          </div>

                          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem' }}>
                            {/* Limite de Cobranças */}
                            <div>
                              <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                  <input type="checkbox" checked={chargeInfo.hasLimit} onChange={e => setChargeInfo({...chargeInfo, hasLimit: e.target.checked})} style={{ accentColor: 'var(--primary)' }} />
                                  Definir limite de cobranças?
                                </label>
                              </div>
                              {chargeInfo.hasLimit && (
                                <div className="form-group animate-fade-in" style={{ marginBottom: 0 }}>
                                  <label style={{ fontSize: '0.85rem' }}>Quantidade de cobranças</label>
                                  <input type="number" min="1" className="form-control" value={chargeInfo.limitCount} onChange={e => setChargeInfo({...chargeInfo, limitCount: parseInt(e.target.value) || 1})} />
                                </div>
                              )}
                            </div>

                            {/* Período de Teste */}
                            <div>
                              <div className="form-group" style={{ marginBottom: '0.5rem' }}>
                                <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer', fontSize: '0.9rem', color: 'var(--text-main)' }}>
                                  <input type="checkbox" checked={chargeInfo.hasTrial} onChange={e => setChargeInfo({...chargeInfo, hasTrial: e.target.checked})} style={{ accentColor: 'var(--primary)' }} />
                                  Oferecer período de teste (Trial)?
                                </label>
                              </div>
                              {chargeInfo.hasTrial && (
                                <div className="form-group animate-fade-in" style={{ marginBottom: 0 }}>
                                  <label style={{ fontSize: '0.85rem' }}>Dias de teste grátis</label>
                                  <input type="number" min="1" className="form-control" value={chargeInfo.trialDays} onChange={e => setChargeInfo({...chargeInfo, trialDays: parseInt(e.target.value) || 7})} />
                                </div>
                              )}
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>

                {/* Cart Section */}
                <div className="cart-section" style={{ background: 'var(--background)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 600, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <ShoppingCart size={20} className="text-primary" /> Carrinho de Produtos
                    </h3>
                    <button className="btn-outline" onClick={addProduct} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', padding: '0.5rem 1rem', fontSize: '0.9rem' }}>
                      <Plus size={16} /> Adicionar Produto
                    </button>
                  </div>

                  <div className="cart-items" style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    {cartItems.map((item, index) => (
                      <div key={item.id} className="cart-item" style={{ background: 'var(--surface)', padding: '1.25rem', borderRadius: '10px', border: '1px solid var(--border)', position: 'relative' }}>
                        {cartItems.length > 1 && (
                          <button 
                            className="btn-ghost" 
                            onClick={() => removeProduct(item.id)}
                            style={{ position: 'absolute', top: '0.5rem', right: '0.5rem', color: 'var(--danger)', padding: '0.4rem' }}
                            title="Remover produto"
                          >
                            <Trash2 size={16} />
                          </button>
                        )}
                        <h4 style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '1rem' }}>Produto #{index + 1}</h4>
                        
                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem', marginBottom: '1rem' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Nome do Produto</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              placeholder="Ex: Consultoria Premium"
                              value={item.name}
                              onChange={e => updateCartItem(item.id, 'name', e.target.value)}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Preço Unitário (R$)</label>
                            <input 
                              type="number" 
                              className="form-control" 
                              placeholder="0.00"
                              min="0"
                              step="0.01"
                              value={item.unitPrice || ''}
                              onChange={e => updateCartItem(item.id, 'unitPrice', parseFloat(e.target.value) || 0)}
                            />
                          </div>
                        </div>

                        <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '1rem' }}>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Descrição</label>
                            <input 
                              type="text" 
                              className="form-control" 
                              placeholder="Detalhes opcionais..."
                              value={item.description}
                              onChange={e => updateCartItem(item.id, 'description', e.target.value)}
                            />
                          </div>
                          <div className="form-group" style={{ marginBottom: 0 }}>
                            <label>Quantidade</label>
                            <input 
                              type="number" 
                              className="form-control" 
                              placeholder="1"
                              min="1"
                              value={item.quantity || ''}
                              onChange={e => updateCartItem(item.id, 'quantity', parseInt(e.target.value) || 1)}
                            />
                          </div>
                        </div>
                        
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <button className="btn-ghost" onClick={handleCloseModal} style={{ padding: '0.8rem 1.5rem' }} disabled={isSaving}>Voltar</button>
                <button className="btn-primary" onClick={handleSaveCharge} style={{ padding: '0.8rem 1.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem', opacity: isSaving ? 0.7 : 1, cursor: isSaving ? 'not-allowed' : 'pointer' }} disabled={isSaving}>
                  {isSaving ? (
                    <div className="spinner" style={{ width: '18px', height: '18px', border: '2px solid white', borderTopColor: 'transparent', borderRadius: '50%', animation: 'spin 1s linear infinite' }}></div>
                  ) : (
                    <Tag size={18} />
                  )}
                  {isSaving ? 'Salvando...' : 'Salvar e Gerar Link de Cobrança'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Details Modal */}
        {detailsModalOpen && selectedCharge && (
          <div className="modal-overlay" onClick={handleCloseDetails}>
            <div className="modal-content large" onClick={e => e.stopPropagation()} style={{ maxWidth: '900px', width: '95%', maxHeight: '85vh', overflowY: 'auto', margin: 'auto' }}>
              <div className="modal-header" style={{ paddingBottom: '1rem', borderBottom: '1px solid var(--border)', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h2 style={{ fontSize: '1.5rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.25rem' }}>
                    Detalhes da Cobrança
                  </h2>
                  <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>{selectedCharge.code} • {selectedCharge.chargeName}</p>
                </div>
                <button className="btn-ghost" onClick={handleCloseDetails} style={{ padding: '0.4rem', borderRadius: '8px' }}><X size={20} /></button>
              </div>

              <div className="modal-body">
                {/* Bloco 1: Vendas e Pagamentos */}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <DollarSign size={18} className="text-primary" /> Resumo Financeiro
                </h3>
                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1rem', marginBottom: '2rem' }}>
                  <div className="stat-card" style={{ background: 'var(--background)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <DollarSign size={16} /> Total da Venda
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {formatCurrency(selectedCharge.value)}
                    </div>
                  </div>
                  
                  <div className="stat-card" style={{ background: 'var(--background)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Clock size={16} className="text-warning" /> Pagamentos Pendentes
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--warning)' }}>
                      {selectedCharge.metrics.pendingPayments}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>Pix/Boletos aguardando pagamento</div>
                  </div>

                  <div className="stat-card" style={{ background: 'var(--background)', padding: '1.5rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <CheckCircle size={16} className="text-success" /> Pagamentos Concluídos
                    </div>
                    <div style={{ fontSize: '1.8rem', fontWeight: 700, color: 'var(--success)' }}>
                      {selectedCharge.metrics.completedPayments}
                    </div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginTop: '0.25rem' }}>Aprovados com sucesso</div>
                  </div>
                </div>

                {/* Bloco 2: Informação de Pagamento / Acessos */}
                <h3 style={{ fontSize: '1.1rem', fontWeight: 600, marginBottom: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <BarChart3 size={18} className="text-primary" /> Desempenho do Checkout
                </h3>
                <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1rem', marginBottom: '1.5rem' }}>
                  <div className="stat-card" style={{ background: 'var(--background)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <Users size={16} /> Acessos ao Link
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>
                      {selectedCharge.metrics.linkAccesses} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-dim)' }}>pessoas</span>
                    </div>
                  </div>
                  
                  <div className="stat-card" style={{ background: 'var(--background)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <div style={{ color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <AlertTriangle size={16} className="text-danger" /> Abandono de Checkout
                    </div>
                    <div style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--danger)' }}>
                      {selectedCharge.metrics.abandonments} <span style={{ fontSize: '0.9rem', fontWeight: 500, color: 'var(--text-dim)' }}>pessoas</span>
                    </div>
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.5rem', marginBottom: '2rem' }}>
                  {/* Captura de Leads */}
                  <div className="leads-card" style={{ background: 'var(--background)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <User size={16} className="text-primary" /> Leads Capturados (Abandonos)
                    </h4>
                    {selectedCharge.leads.length > 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                        {selectedCharge.leads.map((lead: any) => (
                          <div key={lead.id} style={{ background: 'var(--surface)', padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border)' }}>
                            <div style={{ fontWeight: 600, fontSize: '0.9rem', color: 'var(--text-main)' }}>{lead.name}</div>
                            <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', gap: '1rem', marginTop: '0.25rem' }}>
                              <span>{lead.email}</span>
                              <span>{lead.phone}</span>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div style={{ padding: '1.5rem', textAlign: 'center', color: 'var(--text-dim)', background: 'var(--surface)', borderRadius: '8px', fontSize: '0.9rem' }}>
                        Nenhum lead capturado ainda.
                      </div>
                    )}
                  </div>

                  {/* Taxa de Conversão */}
                  <div className="conversion-card" style={{ background: 'var(--background)', padding: '1.25rem', borderRadius: '12px', border: '1px solid var(--border)' }}>
                    <h4 style={{ fontSize: '0.95rem', fontWeight: 600, marginBottom: '1rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                      <BarChart3 size={16} className="text-primary" /> Conversão por Método
                    </h4>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><Smartphone size={14} /> Pix</span>
                          <span style={{ fontWeight: 600 }}>{selectedCharge.metrics.conversionRate.pix}%</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'var(--surface)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: 'var(--success)', width: `${selectedCharge.metrics.conversionRate.pix}%`, borderRadius: '4px' }}></div>
                        </div>
                      </div>
                      
                      <div>
                        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '0.25rem', fontSize: '0.85rem' }}>
                          <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}><CreditCard size={14} /> Cartão de Crédito</span>
                          <span style={{ fontWeight: 600 }}>{selectedCharge.metrics.conversionRate.creditCard}%</span>
                        </div>
                        <div style={{ width: '100%', height: '8px', background: 'var(--surface)', borderRadius: '4px', overflow: 'hidden' }}>
                          <div style={{ height: '100%', background: 'var(--primary)', width: `${selectedCharge.metrics.conversionRate.creditCard}%`, borderRadius: '4px' }}></div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

              </div>

              {/* Rodapé com Link do Checkout */}
              <div className="modal-footer" style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center', 
                marginTop: '1rem', 
                paddingTop: '1.5rem', 
                borderTop: '1px solid var(--border)'
              }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', flex: 1, marginRight: '2rem' }}>
                  <div style={{ background: 'var(--background)', padding: '0.6rem 1rem', borderRadius: '8px', border: '1px solid var(--border)', flex: 1, display: 'flex', alignItems: 'center', gap: '0.5rem', color: 'var(--text-dim)', fontSize: '0.9rem' }}>
                    <LinkIcon size={16} />
                    <span style={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {selectedCharge.checkoutUrl}
                    </span>
                  </div>
                  <button className="btn-primary" onClick={() => copyToClipboard(selectedCharge.checkoutUrl)} style={{ padding: '0.6rem 1rem', whiteSpace: 'nowrap' }}>
                    Copiar Link
                  </button>
                </div>
                <button className="btn-ghost" onClick={handleCloseDetails} style={{ padding: '0.8rem 1.5rem' }}>Fechar</button>
              </div>
            </div>
          </div>
        )}

      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        .modal-content {
          background: var(--surface);
          border-radius: 20px;
          padding: 2rem;
          width: 100%;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border);
          margin: auto;
        }
        .modal-content::-webkit-scrollbar {
          width: 8px;
        }
        .modal-content::-webkit-scrollbar-track {
          background: transparent;
        }
        .modal-content::-webkit-scrollbar-thumb {
          background: var(--border);
          border-radius: 4px;
        }
        .form-group {
          margin-bottom: 1.25rem;
        }
        .form-group label {
          font-size: 0.9rem;
          color: var(--text-dim);
          margin-bottom: 0.5rem;
          display: block;
          font-weight: 500;
        }
        .form-control {
          background: var(--background);
          border: 1px solid var(--border);
          padding: 0.8rem 1rem;
          border-radius: 10px;
          color: var(--text-main);
          width: 100%;
          font-family: inherit;
          font-size: 0.95rem;
          transition: all 0.2s;
        }
        .form-control:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(101, 131, 154, 0.2);
        }
        .btn-outline {
          background: transparent;
          border: 1px solid var(--primary);
          color: var(--primary);
          border-radius: 10px;
          font-weight: 600;
          cursor: pointer;
          transition: all 0.2s;
        }
        .btn-outline:hover {
          background: rgba(101, 131, 154, 0.1);
        }
        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 1.5rem;
          }
          .page-header button {
            width: 100%;
            justify-content: center;
          }
          .form-sections-grid {
            grid-template-columns: 1fr !important;
          }
          .cart-item > div {
            grid-template-columns: 1fr !important;
          }
          .modal-footer {
            flex-direction: column;
            gap: 1rem;
          }
          .modal-footer > div {
            margin-right: 0 !important;
            width: 100%;
            flex-direction: column;
          }
        }
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
      `}</style>
    </DashboardLayout>
  );
}
