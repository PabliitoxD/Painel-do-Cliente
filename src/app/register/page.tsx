"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/login.css';
import { 
  User, Mail, Lock, ArrowRight, CheckCircle2, ChevronLeft, Phone, Building2, ArrowLeft, 
  Globe, Briefcase, Calendar, DollarSign, MapPin, Landmark, CreditCard, Upload, FileText, Info
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState<'PF' | 'PJ'>('PJ');
  
  const [formData, setFormData] = useState({
    // Step 1: Responsável
    respName: '',
    respCpf: '',
    email: '',
    phoneType: 'celular',
    phone: '',
    // Step 2: Empresa
    bizDescription: '',
    salesChannel: 'site',
    siteUrl: '',
    cnpj: '',
    razaoSocial: '',
    nomeFantasia: '',
    foundationDate: '',
    annualRevenue: '',
    cep: '',
    address: '',
    number: '',
    complement: '',
    neighborhood: '',
    city: '',
    state: '',
    // Step 3: Bancário
    bank: '',
    agency: '',
    agencyDigit: '',
    account: '',
    accountDigit: '',
    bankAccountType: '',
    bankAccountName: '',
    receiverType: '',
    // Step 4: Segurança / Registro
    password: '',
    confirmPassword: ''
  });

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 4) {
      setStep(step + 1);
      window.scrollTo(0, 0);
    } else {
      handleRegister();
    }
  };

  const handleRegister = async () => {
    setIsLoading(true);
    console.log("Registrando com dados:", { accountType, ...formData });
    setTimeout(() => {
      setIsLoading(false);
      router.push('/login?registered=success');
    }, 2000);
  };

  const steps = [
    { id: 1, label: 'Dados básicos' },
    { id: 2, label: 'Sua empresa' },
    { id: 3, label: 'Dados bancários' },
    { id: 4, label: 'Documentos' }
  ];

  return (
    <div className="login-container" style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <div className="login-card glass-panel animate-fade-in" style={{ maxWidth: step === 2 || step === 3 ? '700px' : '550px', width: '100%', position: 'relative' }}>
        <button 
          onClick={() => step === 1 ? router.push('/login') : setStep(step - 1)} 
          className="btn-ghost" 
          style={{ position: 'absolute', top: '1.5rem', left: '1.5rem', padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.85rem', zIndex: 10 }}
        >
          <ArrowLeft size={18} /> {step === 1 ? 'Voltar ao Login' : 'Voltar'}
        </button>

        <div className="login-header" style={{ marginTop: '2.5rem' }}>
          <img src="https://tronnus.com/wp-content/uploads/2026/01/tronnus-png-001.png" alt="Tronnus" className="login-logo" />
          <h1 className="gradient-text" style={{ fontSize: '1.8rem' }}>Crie a sua conta Tronnus</h1>
          <p>Leva menos de 2 minutos.</p>
        </div>

        {/* Progress Tracker */}
        <div className="steps-tracker" style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '2.5rem', marginTop: '1rem' }}>
          {steps.map((s) => (
            <div key={s.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.5rem' }}>
              <div style={{ 
                width: '32px', height: '32px', borderRadius: '50%', 
                background: step >= s.id ? 'var(--primary)' : 'rgba(255,255,255,0.05)', 
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.8rem', fontWeight: 700, color: step >= s.id ? 'white' : 'var(--text-dim)',
                border: step === s.id ? '2px solid var(--primary)' : 'none',
                boxShadow: step === s.id ? '0 0 15px var(--primary-glow)' : 'none'
              }}>
                {s.id}
              </div>
              <span style={{ fontSize: '0.65rem', color: step >= s.id ? 'var(--text-main)' : 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>{s.label}</span>
            </div>
          ))}
        </div>

        <form className="login-form" onSubmit={handleNext}>
          {/* STEP 1: DADOS BÁSICOS */}
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label>Você está criando a sua conta como:</label>
                <div style={{ display: 'flex', gap: '1.5rem', marginTop: '0.5rem' }}>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" name="accountType" checked={accountType === 'PF'} onChange={() => setAccountType('PF')} /> Pessoa física
                  </label>
                  <label style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
                    <input type="radio" name="accountType" checked={accountType === 'PJ'} onChange={() => setAccountType('PJ')} /> Pessoa jurídica
                  </label>
                </div>
              </div>

              <div className="form-group">
                <label>Nome do responsável*</label>
                <div className="input-with-icon-login">
                  <User size={18} className="input-icon" />
                  <input type="text" placeholder="Nome completo" value={formData.respName} onChange={e => setFormData({...formData, respName: e.target.value})} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>CPF do responsável*</label>
                  <input className="form-control" type="text" placeholder="000.000.000-00" value={formData.respCpf} onChange={e => setFormData({...formData, respCpf: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>E-mail*</label>
                  <input className="form-control" type="email" placeholder="email@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.5fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Tipo de telefone*</label>
                  <select className="form-control" value={formData.phoneType} onChange={e => setFormData({...formData, phoneType: e.target.value})}>
                    <option value="celular">Celular</option>
                    <option value="fixo">Telefone fixo</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Número de telefone*</label>
                  <input className="form-control" type="text" placeholder="(00) 90000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                </div>
              </div>

              <button type="submit" className="btn-primary login-submit" style={{ marginTop: '1rem' }}>Continuar <ArrowRight size={18} /></button>
            </div>
          )}

          {/* STEP 2: SUA EMPRESA */}
          {step === 2 && (
            <div className="animate-fade-in" style={{ display: 'grid', gap: '1.25rem' }}>
              <div className="form-group">
                <label>Descrição do modelo de negócio</label>
                <textarea className="form-control" placeholder="Descreva brevemente sobre o que a sua empresa faz." style={{ height: '80px', resize: 'none' }} value={formData.bizDescription} onChange={e => setFormData({...formData, bizDescription: e.target.value})} />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Canal de vendas</label>
                  <select className="form-control" value={formData.salesChannel} onChange={e => setFormData({...formData, salesChannel: e.target.value})}>
                    <option value="site">Site</option>
                    <option value="social">Redes Sociais</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>URL do Site</label>
                  <div className="input-with-icon-login">
                    <Globe size={16} className="input-icon" />
                    <input type="text" placeholder="www.suaempresa.com.br" value={formData.siteUrl} onChange={e => setFormData({...formData, siteUrl: e.target.value})} />
                  </div>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>CNPJ da empresa*</label>
                  <input className="form-control" type="text" placeholder="00.000.000/0000-00" value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Razão social*</label>
                  <input className="form-control" type="text" placeholder="Razão social da empresa" value={formData.razaoSocial} onChange={e => setFormData({...formData, razaoSocial: e.target.value})} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 0.8fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Nome fantasia</label>
                  <input className="form-control" type="text" placeholder="Nome fantasia da empresa" value={formData.nomeFantasia} onChange={e => setFormData({...formData, nomeFantasia: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Data de fundação</label>
                  <input className="form-control" type="text" placeholder="00/00/0000" value={formData.foundationDate} onChange={e => setFormData({...formData, foundationDate: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Faturamento anual*</label>
                  <select className="form-control" value={formData.annualRevenue} onChange={e => setFormData({...formData, annualRevenue: e.target.value})} required>
                    <option value="">Selecionar</option>
                    <option value="1">Até R$ 100k</option>
                    <option value="2">R$ 100k a R$ 500k</option>
                    <option value="3">Acima de R$ 500k</option>
                  </select>
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '0.8fr 2.2fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>CEP*</label>
                  <input className="form-control" type="text" placeholder="00000-000" value={formData.cep} onChange={e => setFormData({...formData, cep: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Logradouro*</label>
                  <input className="form-control" type="text" placeholder="Rua, Avenida, etc." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '0.6fr 1.4fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Número</label>
                  <input className="form-control" type="text" placeholder="000" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Complemento</label>
                  <input className="form-control" type="text" placeholder="Bloco, Apto, etc." value={formData.complement} onChange={e => setFormData({...formData, complement: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Bairro*</label>
                  <input className="form-control" type="text" placeholder="Seu bairro" value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1.5fr 0.5fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Cidade*</label>
                  <input className="form-control" type="text" placeholder="Sua cidade" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Estado*</label>
                  <input className="form-control" type="text" placeholder="UF" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} required />
                </div>
              </div>

              <button type="submit" className="btn-primary login-submit">Continuar <ArrowRight size={18} /></button>
            </div>
          )}

          {/* STEP 3: DADOS BANCÁRIOS */}
          {step === 3 && (
            <div className="animate-fade-in" style={{ display: 'grid', gap: '1.25rem' }}>
              <div className="form-group">
                <label>Banco*</label>
                <select className="form-control" value={formData.bank} onChange={e => setFormData({...formData, bank: e.target.value})} required>
                  <option value="">Selecionar banco</option>
                  <option value="001">Banco do Brasil</option>
                  <option value="237">Bradesco</option>
                  <option value="341">Itaú</option>
                  <option value="033">Santander</option>
                  <option value="260">Nubank</option>
                </select>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 0.5fr 1fr 0.5fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Agência*</label>
                  <input className="form-control" type="text" placeholder="0000" value={formData.agency} onChange={e => setFormData({...formData, agency: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Dígito</label>
                  <input className="form-control" type="text" placeholder="0" value={formData.agencyDigit} onChange={e => setFormData({...formData, agencyDigit: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Conta bancária*</label>
                  <input className="form-control" type="text" placeholder="000000" value={formData.account} onChange={e => setFormData({...formData, account: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Dígito</label>
                  <input className="form-control" type="text" placeholder="0" value={formData.accountDigit} onChange={e => setFormData({...formData, accountDigit: e.target.value})} required />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Tipo de conta*</label>
                  <select className="form-control" value={formData.bankAccountType} onChange={e => setFormData({...formData, bankAccountType: e.target.value})} required>
                    <option value="">Selecionar</option>
                    <option value="corrente">Conta Corrente</option>
                    <option value="poupanca">Conta Poupança</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Tipo de recebedor*</label>
                  <select className="form-control" value={formData.receiverType} onChange={e => setFormData({...formData, receiverType: e.target.value})} required>
                    <option value="">Selecionar</option>
                    <option value="proprio">Próprio Responsável</option>
                    <option value="terceiro">Terceiro</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Nome da conta bancária*</label>
                <input className="form-control" type="text" placeholder="Nome do titular da conta" value={formData.bankAccountName} onChange={e => setFormData({...formData, bankAccountName: e.target.value})} required />
              </div>

              <button type="submit" className="btn-primary login-submit">Continuar <ArrowRight size={18} /></button>
            </div>
          )}

          {/* STEP 4: DOCUMENTOS E SEGURANÇA */}
          {step === 4 && (
            <div className="animate-fade-in" style={{ display: 'grid', gap: '1.25rem' }}>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem', textAlign: 'center', marginBottom: '1rem' }}>Envie os documentos abaixo para finalizar o seu cadastro.</p>
              
              {[
                'Contrato ou Estatuto Social*',
                'RG do responsável (frente e verso)*',
                'Comprovante de residência (Últimos 90 dias)*',
                'Comprovante bancário (Extrato ou documento)*'
              ].map((doc, idx) => (
                <div key={idx} className="form-group">
                  <label>{doc}</label>
                  <div style={{ 
                    border: '2px dashed var(--border)', 
                    borderRadius: '12px', 
                    padding: '1.5rem', 
                    textAlign: 'center', 
                    cursor: 'pointer',
                    background: 'rgba(255,255,255,0.02)',
                    transition: 'all 0.2s'
                  }} onMouseEnter={e => e.currentTarget.style.borderColor = 'var(--primary)'} onMouseLeave={e => e.currentTarget.style.borderColor = 'var(--border)'}>
                    <Upload size={20} style={{ color: 'var(--primary)', marginBottom: '0.5rem' }} />
                    <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Arraste o arquivo ou clique para enviar</p>
                    <p style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', marginTop: '0.25rem' }}>PDF ou imagem (máx. 10MB)</p>
                  </div>
                </div>
              ))}

              <hr style={{ border: 'none', borderTop: '1px solid var(--border)', margin: '1rem 0' }} />

              <div className="form-group">
                <label>Defina uma senha de acesso*</label>
                <div className="input-with-icon-login">
                  <Lock size={18} className="input-icon" />
                  <input type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                </div>
              </div>

              <button type="submit" className="btn-primary login-submit" disabled={isLoading}>
                {isLoading ? 'Criando conta...' : 'Criar minha conta'}
              </button>
            </div>
          )}
        </form>

        <div className="login-footer">
          <span>Já possui uma conta?</span>
          <a href="/login" className="signup-link">Fazer Login</a>
        </div>
      </div>

      <style jsx>{`
        .input-with-icon-login { position: relative; }
        .input-with-icon-login .input-icon { position: absolute; left: 1rem; top: 50%; transform: translateY(-50%); color: var(--text-dim); }
        .input-with-icon-login input { padding-left: 3rem !important; }
        .form-control { background: rgba(255,255,255,0.05); border: 1px solid var(--border); padding: 0.75rem 1rem; border-radius: 10px; color: white; width: 100%; font-family: inherit; font-size: 0.95rem; }
        .form-control:focus { outline: none; border-color: var(--primary); }
        .form-group label { font-size: 0.85rem; color: var(--text-dim); margin-bottom: 0.5rem; display: block; font-weight: 500; }
        select.form-control { appearance: none; }
      `}</style>
    </div>
  );
}
