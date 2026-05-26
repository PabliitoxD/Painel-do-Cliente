"use client";
import { useState, useMemo, useEffect, useCallback } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Search, Plus, X, Receipt, Trash2, ShoppingCart, DollarSign, FileText, Link as LinkIcon, RefreshCcw, Tag, AlertTriangle, CheckCircle, Clock, User } from 'lucide-react';
import { chargesService, plansService, subscriptionsService, ApiCharge, ApiSubscription, ApiPlan, CreateChargePayload, CreatePlanPayload, frequencyToPeriodicity, periodicityLabel } from '@/services/api/charges';
import { translateStatus, getStatusPillClass, formatCurrency } from '@/utils/formatters';

type TabType = 'avulsa' | 'recorrente';

interface Row {
  type: TabType;
  token: string;
  code?: string;
  label: string;
  value: number;
  status: string;
  extra?: string;
  raw: any;
}

export default function ChargesPage() {
  const [tab, setTab] = useState<TabType>('avulsa');
  const [rows, setRows] = useState<Row[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selected, setSelected] = useState<Row | null>(null);
  const [search, setSearch] = useState('');
  const [filterDate, setFilterDate] = useState('');

  // form state
  const [cartItems, setCartItems] = useState([{ id: Date.now(), name: '', unitPrice: 0, quantity: 1 }]);
  const [chargeInfo, setChargeInfo] = useState({ name: '', dueDate: '', customerName: '', customerEmail: '', billingType: 'unica' as 'unica'|'recorrente', frequency: 'mensal', hasLimit: false, limitCount: 12, hasTrial: false, trialDays: 7, allowBoleto: true, hasNoExpiration: false });

  const totalValue = useMemo(() => cartItems.reduce((a, i) => a + (i.unitPrice||0)*(i.quantity||0), 0), [cartItems]);

  const formatDateBR = (dateStr?: string) => {
    if (!dateStr) return 'Sem Vencimento';
    if (dateStr.includes('/')) return dateStr;
    
    // Remove any trailing time portion (T or space)
    const cleanDate = dateStr.split('T')[0].split(' ')[0];
    const parts = cleanDate.split('-');
    if (parts.length === 3) {
      const [y, m, d] = parts;
      return `${d.padStart(2, '0')}/${m.padStart(2, '0')}/${y}`;
    }
    
    try {
      const parsed = new Date(dateStr);
      if (!isNaN(parsed.getTime())) {
        const d = String(parsed.getDate()).padStart(2, '0');
        const m = String(parsed.getMonth() + 1).padStart(2, '0');
        const y = parsed.getFullYear();
        return `${d}/${m}/${y}`;
      }
    } catch (e) {}

    return dateStr;
  };

  const load = useCallback(async () => {
    setIsLoading(true); setError(null);
    try {
      if (tab === 'avulsa') {
        const res: any = await chargesService.list({ per_page: 50 });
        const list = res.charges || res.data || res.items || (Array.isArray(res) ? res : []);
        
        let localCharges: any[] = [];
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('local_charges');
          if (stored) {
            try { localCharges = JSON.parse(stored); } catch (e) {}
          }
        }

        const mappedApi: Row[] = list.map((c: any) => ({
          type: 'avulsa', 
          token: c.token || c.id || c.uuid, 
          code: c.code || c.id || c.uuid, 
          label: c.description || c.name || c.title || '—',
          value: Number(c.price || c.amount || c.value) || 0, 
          status: c.status || 'PENDENTE', 
          extra: formatDateBR(c.expiration_date || c.due_date), 
          raw: c,
        }));

        const mappedLocal: Row[] = localCharges.map((c: any) => ({
          type: 'avulsa',
          token: c.token || c.id || c.uuid,
          code: c.code || c.id || c.uuid,
          label: c.description || c.name || c.title || '—',
          value: Number(c.price || c.amount || c.value) || 0,
          status: c.status || 'PENDENTE',
          extra: formatDateBR(c.expiration_date || c.due_date),
          raw: c,
        }));

        const combined = [...mappedLocal];
        mappedApi.forEach((item: any) => {
          if (!combined.some(c => c.token === item.token)) {
            combined.push(item);
          }
        });

        setRows(combined);
      } else {
        const res: any = await plansService.list({ per_page: 50 });
        const list = res.plans || res.data || res.items || (Array.isArray(res) ? res : []);
        
        let localPlans: any[] = [];
        if (typeof window !== 'undefined') {
          const stored = localStorage.getItem('local_plans');
          if (stored) {
            try { localPlans = JSON.parse(stored); } catch (e) {}
          }
        }

        const mappedApi: Row[] = list.map((p: any) => ({
          type: 'recorrente', 
          token: p.token || p.id || p.uuid, 
          code: p.code || p.id || p.uuid, 
          label: p.name || p.description || p.title || '—',
          value: Number(p.price || p.amount || p.value) || 0, 
          status: p.status || 'ATIVO',
          extra: periodicityLabel[p.periodicity] || p.periodicity || 'Mensal', 
          raw: p,
        }));

        const mappedLocal: Row[] = localPlans.map((p: any) => ({
          type: 'recorrente',
          token: p.token || p.id || p.uuid,
          code: p.code || p.id || p.uuid,
          label: p.name || p.description || p.title || '—',
          value: Number(p.price || p.amount || p.value) || 0,
          status: p.status || 'ATIVO',
          extra: periodicityLabel[p.periodicity] || p.periodicity || 'Mensal',
          raw: p,
        }));

        const combined = [...mappedLocal];
        mappedApi.forEach((item: any) => {
          if (!combined.some(p => p.token === item.token)) {
            combined.push(item);
          }
        });

        setRows(combined);
      }
    } catch (e: any) { setError(e.message || 'Erro ao carregar.'); }
    finally { setIsLoading(false); }
  }, [tab]);

  useEffect(() => { load(); }, [load]);

  const openModal = () => {
    setCartItems([{ id: Date.now(), name: '', unitPrice: 0, quantity: 1 }]);
    setChargeInfo({ name: '', dueDate: '', customerName: '', customerEmail: '', billingType: 'unica', frequency: 'mensal', hasLimit: false, limitCount: 12, hasTrial: false, trialDays: 7, allowBoleto: true, hasNoExpiration: false });
    setIsModalOpen(true);
  };

  const save = async () => {
    if (!chargeInfo.name) { alert('Informe o nome/descrição.'); return; }
    setIsSaving(true);
    try {
      let createdToken = '';
      if (chargeInfo.billingType === 'unica') {
        let formattedDate = undefined;
        if (!chargeInfo.hasNoExpiration && chargeInfo.dueDate) {
          const [year, month, day] = chargeInfo.dueDate.split('-');
          formattedDate = `${day}/${month}/${year}`;
        }

        const payload: CreateChargePayload = {
          charge: {
            description: chargeInfo.name,
            expiration_date: formattedDate,
            payer_name: chargeInfo.customerName || 'Cliente Consumidor',
            payer_email: chargeInfo.customerEmail || 'cliente@email.com',
            products: cartItems.map(i => ({ 
              name: i.name, 
              price: i.unitPrice.toFixed(2),
              quantity: String(i.quantity)
            })),
          }
        };
        
        const res = await chargesService.create(payload);
        const data = (res as any)?.charge || (res as any)?.data || res;
        createdToken = data?.token || data?.id || '';

        // Save locally so it persists and renders instantly for testing
        if (createdToken && typeof window !== 'undefined') {
          const stored = localStorage.getItem('local_charges');
          let current: any[] = [];
          if (stored) {
            try { current = JSON.parse(stored); } catch (e) {}
          }
          current.unshift({
            id: createdToken,
            token: createdToken,
            code: data?.code || createdToken,
            description: chargeInfo.name,
            price: totalValue,
            status: 'NOT_PAID',
            expiration_date: formattedDate || '',
            payer_name: chargeInfo.customerName || 'Cliente Consumidor',
            payer_email: chargeInfo.customerEmail || 'cliente@email.com',
            products: cartItems.map(i => ({ 
              name: i.name, 
              price: i.unitPrice.toFixed(2),
              quantity: String(i.quantity)
            }))
          });
          localStorage.setItem('local_charges', JSON.stringify(current));
        }
      } else {
        const planPayload: CreatePlanPayload = {
          name: chargeInfo.name,
          price: totalValue.toFixed(2),
          periodicity: frequencyToPeriodicity[chargeInfo.frequency] ?? 1,
          public: true,
        };
        const res = await plansService.create(planPayload);
        const data = (res as any)?.plan || (res as any)?.data || res;
        createdToken = data?.token || data?.id || '';

        // Save locally so it persists and renders instantly for testing
        if (createdToken && typeof window !== 'undefined') {
          const stored = localStorage.getItem('local_plans');
          let current: any[] = [];
          if (stored) {
            try { current = JSON.parse(stored); } catch (e) {}
          }
          current.unshift({
            id: createdToken,
            token: createdToken,
            code: data?.code || createdToken,
            name: chargeInfo.name,
            price: totalValue,
            periodicity: frequencyToPeriodicity[chargeInfo.frequency] ?? 1,
            public: true,
            status: 'ATIVO'
          });
          localStorage.setItem('local_plans', JSON.stringify(current));
        }
      }

      if (createdToken) {
        localStorage.setItem(`allow_boleto_${createdToken}`, chargeInfo.allowBoleto ? 'true' : 'false');
      }

      await load();
      setIsModalOpen(false);
    } catch (e: any) { alert(e.message || 'Erro ao salvar.'); }
    finally { setIsSaving(false); }
  };

  const filtered = useMemo(() => {
    return rows.filter(r => {
      const matchesSearch = !search || r.label.toLowerCase().includes(search.toLowerCase()) || (r.code||'').toLowerCase().includes(search.toLowerCase());
      
      let matchesDate = true;
      if (filterDate) {
        const [year, month, day] = filterDate.split('-');
        const dateBR = `${day}/${month}/${year}`;
        matchesDate = r.extra === dateBR;
      }
      
      return matchesSearch && matchesDate;
    });
  }, [rows, search, filterDate]);

  const checkoutUrl = (r: Row) => {
    return `${typeof window !== 'undefined' ? window.location.origin : ''}/c/${r.token}`;
  };

  return (
    <DashboardLayout>
      <div className="charges-page animate-fade-in">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Receipt size={24} className="text-primary" /> Cobranças</h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Gerencie cobranças avulsas e assinaturas recorrentes</p>
          </div>
          <button className="btn-primary" onClick={openModal} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}><Plus size={18} /> Nova Cobrança</button>
        </div>

        {/* Tabs */}
        <div style={{ display: 'flex', gap: '0.5rem', marginBottom: '1.5rem' }}>
          {(['avulsa','recorrente'] as TabType[]).map(t => (
            <button key={t} onClick={() => setTab(t)} className={tab === t ? 'btn-primary' : 'btn-ghost'}
              style={{ padding: '0.6rem 1.5rem', borderRadius: '10px', fontWeight: 600, fontSize: '0.95rem', border: '1px solid var(--border)', cursor: 'pointer' }}>
              {t === 'avulsa' ? 'Avulsa' : 'Recorrente'}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem', flexWrap: 'wrap' }}>
          <div style={{ flex: 1, minWidth: '240px', background: 'var(--background)', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', borderRadius: '10px' }}>
            <Search size={18} className="text-muted" />
            <input type="text" placeholder="Buscar..." value={search} onChange={e => setSearch(e.target.value)}
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-main)' }} />
          </div>

          {/* Filtro de Data de Vencimento */}
          {tab === 'avulsa' && (
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: 'var(--background)', padding: '0.5rem 1rem', borderRadius: '10px', border: '1px solid var(--border)' }}>
              <span style={{ fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 500 }}>Vencimento:</span>
              <input type="date" value={filterDate} onChange={e => setFilterDate(e.target.value)} 
                style={{ border: 'none', background: 'transparent', outline: 'none', color: 'var(--text-main)', fontSize: '0.85rem', fontFamily: 'inherit' }} />
              {filterDate && (
                <button onClick={() => setFilterDate('')} style={{ border:'none', background:'transparent', color:'var(--text-dim)', cursor:'pointer', display:'flex', alignItems:'center', padding:0, marginLeft:'0.25rem' }} title="Limpar data">
                  <X size={14} />
                </button>
              )}
            </div>
          )}

          <button className="btn-ghost" onClick={load} title="Atualizar" style={{ padding: '0.6rem', borderRadius: '8px' }}><RefreshCcw size={18} /></button>
        </div>

        {error && <div style={{ background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.3)', borderRadius: '10px', padding: '1rem', color: '#ef4444', marginBottom: '1rem', display:'flex', gap:'0.5rem', alignItems:'center' }}><AlertTriangle size={16}/>{error}</div>}

        <div className="table-card">
          <table className="transactions-table">
            <thead><tr>
              <th>Código</th>
              <th>{tab === 'avulsa' ? 'Descrição' : 'Plano'}</th>
              <th>{tab === 'avulsa' ? 'Vencimento' : 'Frequência'}</th>
              <th>Valor</th>
              <th>Status</th>
              <th style={{ textAlign:'right' }}>Ações</th>
            </tr></thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={6} style={{ textAlign:'center', padding:'2rem', color:'var(--text-dim)' }}>
                  <div style={{ margin:'0 auto 1rem', width:'24px', height:'24px', border:'3px solid var(--border)', borderTopColor:'var(--primary)', borderRadius:'50%', animation:'spin 1s linear infinite' }}/>
                  Carregando...
                </td></tr>
              ) : filtered.length === 0 ? (
                <tr><td colSpan={6} style={{ textAlign:'center', padding:'2rem', color:'var(--text-dim)' }}>Nenhum registro encontrado.</td></tr>
              ) : filtered.map(r => (
                <tr key={r.token}>
                  <td style={{ fontWeight:600, color:'var(--primary)' }}>{r.code || (r.token ? r.token.slice(0,8) : '—')}</td>
                  <td style={{ fontWeight:600, color:'var(--text-main)' }}>{r.label}</td>
                  <td style={{ color:'var(--text-dim)' }}>{r.extra || '—'}</td>
                  <td style={{ fontWeight:600 }}>{formatCurrency(r.value)}</td>
                  <td><span className={`status-pill ${getStatusPillClass(r.status)}`}>{translateStatus(r.status)}</span></td>
                  <td style={{ textAlign:'right' }}>
                    <button className="btn-ghost" onClick={() => setSelected(r)} style={{ padding:'0.4rem 0.8rem', borderRadius:'8px', fontSize:'0.85rem' }}>Ver Detalhes</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Create Modal */}
        {isModalOpen && (
          <div className="modal-overlay">
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth:'780px', width:'95%', maxHeight:'85vh', overflowY:'auto' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom:'1rem', borderBottom:'1px solid var(--border)', marginBottom:'1.5rem' }}>
                <h2 style={{ fontSize:'1.5rem', fontWeight:700, display:'flex', alignItems:'center', gap:'0.5rem' }}><Receipt size={22} className="text-primary"/>Nova Cobrança</h2>
                <button className="btn-ghost" onClick={() => setIsModalOpen(false)} style={{ padding:'0.4rem', borderRadius:'8px' }}><X size={20}/></button>
              </div>

              {/* Total banner */}
              <div style={{ background:'linear-gradient(135deg, var(--primary) 0%, #3a5368 100%)', borderRadius:'14px', padding:'1.25rem 1.5rem', marginBottom:'1.5rem', display:'flex', justifyContent:'space-between', alignItems:'center', color:'white' }}>
                <div><p style={{ opacity:0.85, marginBottom:'0.1rem' }}>Valor Total</p><p style={{ fontSize:'0.8rem', opacity:0.7 }}>Soma dos produtos</p></div>
                <span style={{ fontSize:'2rem', fontWeight:700 }}>{formatCurrency(totalValue)}</span>
              </div>

              {/* Billing type toggle */}
              <div className="form-group">
                <label>Tipo de Cobrança</label>
                <div style={{ display:'flex', gap:'1.5rem', marginBottom:'1rem' }}>
                  {[['unica','Única'],['recorrente','Recorrente']].map(([v,l]) => (
                    <label key={v} style={{ display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer', fontWeight:500 }}>
                      <input type="radio" name="btype" value={v} checked={chargeInfo.billingType === v} onChange={() => setChargeInfo({...chargeInfo, billingType: v as any})} style={{ accentColor:'var(--primary)' }}/>
                      {l}
                    </label>
                  ))}
                </div>
                <div style={{ display:'flex', alignItems:'center', marginTop:'0.5rem' }}>
                  <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer', fontWeight:500, margin: 0 }}>
                    <input type="checkbox" checked={chargeInfo.allowBoleto} onChange={e => setChargeInfo({...chargeInfo, allowBoleto: e.target.checked})} style={{ accentColor:'var(--primary)', width:'16px', height:'16px' }}/>
                    Oferecer pagamento via Boleto Bancário no checkout
                  </label>
                </div>
              </div>

              {/* Info fields */}
              <div style={{ display:'grid', gridTemplateColumns: chargeInfo.billingType==='unica' ? '2fr 1fr' : '1fr 1fr', gap:'1rem', marginBottom:'1rem' }}>
                <div className="form-group" style={{ marginBottom:0 }}>
                  <label>Nome / Descrição *</label>
                  <input className="form-control" type="text" placeholder="Ex: Plano Mensal Premium" value={chargeInfo.name} onChange={e => setChargeInfo({...chargeInfo, name:e.target.value})}/>
                </div>
                {chargeInfo.billingType === 'unica' ? (
                  <div className="form-group" style={{ marginBottom:0 }}>
                    <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'0.45rem' }}>
                      <label style={{ margin:0 }}>Vencimento</label>
                      <label style={{ display:'flex', alignItems:'center', gap:'0.3rem', fontSize:'0.78rem', color:'var(--text-dim)', fontWeight:400, margin:0, cursor:'pointer' }}>
                        <input type="checkbox" checked={chargeInfo.hasNoExpiration} onChange={e => setChargeInfo({...chargeInfo, hasNoExpiration: e.target.checked})} style={{ accentColor:'var(--primary)', width:'13px', height:'13px' }}/>
                        Sem vencimento
                      </label>
                    </div>
                    <input className="form-control" type="date" value={chargeInfo.dueDate} onChange={e => setChargeInfo({...chargeInfo, dueDate:e.target.value})} disabled={chargeInfo.hasNoExpiration} style={{ opacity: chargeInfo.hasNoExpiration ? 0.5 : 1 }}/>
                  </div>
                ) : (
                  <div className="form-group" style={{ marginBottom:0 }}>
                    <label>Frequência de Cobrança</label>
                    <select className="form-control" value={chargeInfo.frequency} onChange={e => setChargeInfo({...chargeInfo, frequency:e.target.value})}>
                      {Object.entries(frequencyToPeriodicity).map(([k]) => (
                        <option key={k} value={k}>{periodicityLabel[frequencyToPeriodicity[k]]}</option>
                      ))}
                    </select>
                  </div>
                )}
              </div>

              {/* Customer Info */}
              <div style={{ background:'var(--background)', padding:'1.25rem', borderRadius:'12px', border:'1px solid var(--border)', marginTop:'1rem' }}>
                <h4 style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontWeight:600, marginBottom:'1rem' }}><User size={18} className="text-primary"/>Informações do Cliente <span style={{fontSize:'0.85rem', color:'var(--text-dim)', fontWeight:400}}>(Opcional)</span></h4>
                <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:'1rem' }}>
                  <div className="form-group" style={{ marginBottom:0 }}>
                    <label>Nome do Cliente</label>
                    <input className="form-control" type="text" placeholder="Ex: João da Silva" value={chargeInfo.customerName} onChange={e => setChargeInfo({...chargeInfo, customerName:e.target.value})}/>
                  </div>
                  <div className="form-group" style={{ marginBottom:0 }}>
                    <label>E-mail</label>
                    <input className="form-control" type="email" placeholder="joao@email.com" value={chargeInfo.customerEmail} onChange={e => setChargeInfo({...chargeInfo, customerEmail:e.target.value})}/>
                  </div>
                </div>
              </div>

              {/* Products / cart */}
              <div style={{ background:'var(--background)', padding:'1.25rem', borderRadius:'12px', border:'1px solid var(--border)', marginTop:'1rem' }}>
                <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:'1rem' }}>
                  <h4 style={{ display:'flex', alignItems:'center', gap:'0.5rem', fontWeight:600 }}><ShoppingCart size={18} className="text-primary"/>{chargeInfo.billingType==='unica' ? 'Produtos' : 'Itens do Plano'}</h4>
                  <button className="btn-outline" onClick={() => setCartItems([...cartItems, {id:Date.now(), name:'', unitPrice:0, quantity:1}])} style={{ display:'flex', alignItems:'center', gap:'0.4rem', padding:'0.4rem 0.9rem', fontSize:'0.85rem' }}><Plus size={14}/>Adicionar</button>
                </div>
                <div style={{ display:'flex', flexDirection:'column', gap:'0.75rem' }}>
                  {cartItems.map((item, idx) => (
                    <div key={item.id} style={{ background:'var(--surface)', padding:'1rem', borderRadius:'10px', border:'1px solid var(--border)', display:'grid', gridTemplateColumns:'2fr 1fr 1fr auto', gap:'0.75rem', alignItems:'end' }}>
                      <div className="form-group" style={{ marginBottom:0 }}>
                        {idx===0 && <label>Nome</label>}
                        <input className="form-control" type="text" placeholder="Produto" value={item.name} onChange={e => setCartItems(cartItems.map(i => i.id===item.id ? {...i, name:e.target.value} : i))}/>
                      </div>
                      <div className="form-group" style={{ marginBottom:0 }}>
                        {idx===0 && <label>Preço R$</label>}
                        <input className="form-control" type="number" placeholder="0.00" min="0" step="0.01" value={item.unitPrice||''} onChange={e => setCartItems(cartItems.map(i => i.id===item.id ? {...i, unitPrice:parseFloat(e.target.value)||0} : i))}/>
                      </div>
                      <div className="form-group" style={{ marginBottom:0 }}>
                        {idx===0 && <label>Qtd</label>}
                        <input className="form-control" type="number" placeholder="1" min="1" value={item.quantity||''} onChange={e => setCartItems(cartItems.map(i => i.id===item.id ? {...i, quantity:parseInt(e.target.value)||1} : i))}/>
                      </div>
                      <button className="btn-ghost" onClick={() => { if(cartItems.length>1) setCartItems(cartItems.filter(i => i.id!==item.id)); }} style={{ color:'var(--danger)', padding:'0.5rem', marginTop: idx===0 ? '1.5rem' : 0 }}><Trash2 size={16}/></button>
                    </div>
                  ))}
                </div>
              </div>

              <div style={{ display:'flex', justifyContent:'flex-end', gap:'1rem', marginTop:'1.5rem', paddingTop:'1.5rem', borderTop:'1px solid var(--border)' }}>
                <button className="btn-ghost" onClick={() => setIsModalOpen(false)} disabled={isSaving} style={{ padding:'0.8rem 1.5rem' }}>Cancelar</button>
                <button className="btn-primary" onClick={save} disabled={isSaving} style={{ padding:'0.8rem 1.5rem', display:'flex', alignItems:'center', gap:'0.5rem', opacity:isSaving?0.7:1 }}>
                  {isSaving ? <div style={{ width:'18px', height:'18px', border:'2px solid white', borderTopColor:'transparent', borderRadius:'50%', animation:'spin 1s linear infinite' }}/> : <Tag size={18}/>}
                  {isSaving ? 'Salvando...' : (chargeInfo.billingType==='unica' ? 'Criar Cobrança' : 'Criar Plano Recorrente')}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Detail Modal */}
        {selected && (
          <div className="modal-overlay" onClick={() => setSelected(null)}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth:'600px', width:'95%' }}>
              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingBottom:'1rem', borderBottom:'1px solid var(--border)', marginBottom:'1.5rem' }}>
                <div>
                  <h2 style={{ fontSize:'1.4rem', fontWeight:700, marginBottom:'0.2rem' }}>Detalhes</h2>
                  <p style={{ color:'var(--text-dim)', fontSize:'0.88rem' }}>{selected.code || (selected.token ? selected.token.slice(0,12) : '—')} • {selected.type === 'avulsa' ? 'Cobrança Avulsa' : 'Assinatura'}</p>
                </div>
                <button className="btn-ghost" onClick={() => setSelected(null)} style={{ padding:'0.4rem', borderRadius:'8px' }}><X size={20}/></button>
              </div>

              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:'1rem', marginBottom:'1.5rem' }}>
                {[
                  { label:'Valor', value: formatCurrency(selected.value), icon:<DollarSign size={16}/> },
                  { label:'Status', value: translateStatus(selected.status), icon:<CheckCircle size={16}/> },
                  { label: selected.type==='avulsa' ? 'Vencimento' : 'Frequência', value: selected.extra||'—', icon:<Clock size={16}/> },
                ].map((item,i) => (
                  <div key={i} style={{ background:'var(--background)', padding:'1rem', borderRadius:'12px', border:'1px solid var(--border)' }}>
                    <div style={{ color:'var(--text-dim)', fontSize:'0.85rem', display:'flex', alignItems:'center', gap:'0.4rem', marginBottom:'0.4rem' }}>{item.icon}{item.label}</div>
                    <div style={{ fontWeight:700, fontSize:'1.2rem' }}>{item.value}</div>
                  </div>
                ))}
              </div>

              <div style={{ display:'flex', justifyContent:'space-between', alignItems:'center', paddingTop:'1rem', borderTop:'1px solid var(--border)' }}>
                <div style={{ display:'flex', alignItems:'center', gap:'0.75rem', flex:1, marginRight:'1rem', overflow:'hidden' }}>
                  <div style={{ background:'var(--background)', padding:'0.55rem 1rem', borderRadius:'8px', border:'1px solid var(--border)', flex:1, display:'flex', alignItems:'center', gap:'0.5rem', color:'var(--text-dim)', fontSize:'0.85rem', overflow:'hidden' }}>
                    <LinkIcon size={14}/><span style={{ whiteSpace:'nowrap', overflow:'hidden', textOverflow:'ellipsis' }}>{checkoutUrl(selected)}</span>
                  </div>
                  <button className="btn-primary" onClick={() => { navigator.clipboard.writeText(checkoutUrl(selected)); alert('Link copiado!'); }} style={{ padding:'0.55rem 1rem', whiteSpace:'nowrap' }}>Copiar</button>
                </div>
                <button className="btn-ghost" onClick={() => setSelected(null)} style={{ padding:'0.8rem 1.2rem' }}>Fechar</button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .modal-overlay { position:fixed; top:0; left:0; right:0; bottom:0; background:rgba(0,0,0,0.6); backdrop-filter:blur(4px); display:flex; align-items:center; justify-content:center; z-index:1000; padding:1rem; }
        .modal-content { background:var(--surface); border-radius:20px; padding:2rem; width:100%; box-shadow:var(--shadow-lg); border:1px solid var(--border); margin:auto; }
        .modal-content::-webkit-scrollbar{width:8px;} .modal-content::-webkit-scrollbar-thumb{background:var(--border);border-radius:4px;}
        .form-group { margin-bottom:1.25rem; }
        .form-group label { font-size:0.88rem; color:var(--text-dim); margin-bottom:0.45rem; display:block; font-weight:500; }
        .form-control { background:var(--background); border:1px solid var(--border); padding:0.75rem 1rem; border-radius:10px; color:var(--text-main); width:100%; font-family:inherit; font-size:0.95rem; transition:all 0.2s; }
        .form-control:focus { outline:none; border-color:var(--primary); box-shadow:0 0 0 2px rgba(101,131,154,0.2); }
        .btn-outline { background:transparent; border:1px solid var(--primary); color:var(--primary); border-radius:10px; font-weight:600; cursor:pointer; transition:all 0.2s; }
        .btn-outline:hover { background:rgba(101,131,154,0.1); }
        @keyframes spin { to { transform:rotate(360deg); } }
      `}</style>
    </DashboardLayout>
  );
}
