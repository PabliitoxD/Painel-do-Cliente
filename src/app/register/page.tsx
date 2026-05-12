"use client";
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import '@/styles/login.css';
import { 
  User, Mail, Lock, ArrowRight, CheckCircle2, Phone, Building2, ArrowLeft, 
  Globe, ChevronRight, Upload
} from 'lucide-react';

export default function RegisterPage() {
  const router = useRouter();
  const [step, setStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const [accountType, setAccountType] = useState<'PF' | 'PJ'>('PJ');
  
  const [formData, setFormData] = useState({
    respName: '', respCpf: '', email: '', phoneType: 'celular', phone: '',
    bizDescription: '', salesChannel: 'site', siteUrl: '', cnpj: '', razaoSocial: '',
    nomeFantasia: '', foundationDate: '', annualRevenue: '', cep: '', address: '',
    number: '', complement: '', neighborhood: '', city: '', state: '',
    bank: '', agency: '', agencyDigit: '', account: '', accountDigit: '',
    bankAccountType: '', bankAccountName: '', receiverType: '',
    password: '', confirmPassword: ''
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
    setTimeout(() => {
      setIsLoading(false);
      router.push('/login?registered=success');
    }, 2000);
  };

  const steps = [
    { id: 1, label: 'Básico' },
    { id: 2, label: 'Empresa' },
    { id: 3, label: 'Banco' },
    { id: 4, label: 'Docs' }
  ];

  return (
    <div className="login-container" style={{ minHeight: '100vh', padding: '2rem 1rem' }}>
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <div className="login-card glass-panel animate-fade-in" style={{ maxWidth: step === 2 || step === 3 ? '750px' : '600px', width: '100%', position: 'relative', border: '1px solid rgba(255,255,255,0.1)', padding: '2.5rem' }}>
        
        {/* Botão Voltar Branco com Destaque */}
        <button 
          onClick={() => step === 1 ? router.push('/login') : setStep(step - 1)} 
          className="btn-back-white"
        >
          <ArrowLeft size={18} /> {step === 1 ? 'Voltar ao Login' : 'Voltar'}
        </button>

        <div className="login-header" style={{ marginTop: '3.5rem' }}>
          <img src="https://tronnus.com/wp-content/uploads/2026/01/tronnus-png-001.png" alt="Tronnus" className="login-logo" style={{ marginBottom: '1.5rem', height: '40px' }} />
          <h1 className="gradient-text" style={{ fontSize: '2.2rem', marginBottom: '0.5rem', fontWeight: 800 }}>Crie a sua conta Tronnus</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Leva menos de 2 minutos.</p>
        </div>

        {/* Stepper Premium com Flechas */}
        <div className="steps-tracker-premium">
          {steps.map((s, idx) => (
            <div key={s.id} className="step-wrapper">
              <div className={`step-item ${step === s.id ? 'active' : step > s.id ? 'completed' : ''}`}>
                <div className="step-circle">
                  {step > s.id ? <CheckCircle2 size={16} /> : s.id}
                </div>
                <span className="step-label">{s.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <ChevronRight size={18} className="step-arrow" style={{ color: step > s.id ? 'var(--primary)' : 'rgba(255,255,255,0.1)' }} />
              )}
            </div>
          ))}
        </div>

        <form className="login-form" onSubmit={handleNext}>
          {/* STEP 1: DADOS BÁSICOS */}
          {step === 1 && (
            <div className="animate-fade-in">
              {/* Seleção PF/PJ Premium */}
              <div className="selection-cards">
                <div 
                  className={`selection-card ${accountType === 'PF' ? 'active' : ''}`}
                  onClick={() => setAccountType('PF')}
                >
                  <div className="card-icon"><User size={26} /></div>
                  <div className="card-info">
                    <h3>Pessoa Física</h3>
                    <p>Cadastro com CPF</p>
                  </div>
                  <div className="card-check">
                    <div className="inner-check"></div>
                  </div>
                </div>
                <div 
                  className={`selection-card ${accountType === 'PJ' ? 'active' : ''}`}
                  onClick={() => setAccountType('PJ')}
                >
                  <div className="card-icon"><Building2 size={26} /></div>
                  <div className="card-info">
                    <h3>Pessoa Jurídica</h3>
                    <p>Cadastro com CNPJ</p>
                  </div>
                  <div className="card-check">
                    <div className="inner-check"></div>
                  </div>
                </div>
              </div>

              {/* Destaque nos Dados Iniciais */}
              <div className="form-section-highlight">
                <div className="section-title">
                  <User size={18} />
                  <span>Informações do Responsável</span>
                </div>
                
                <div className="form-group">
                  <label>Nome do responsável*</label>
                  <div className="input-with-icon-login premium">
                    <User size={18} className="input-icon" />
                    <input type="text" placeholder="Nome completo" value={formData.respName} onChange={e => setFormData({...formData, respName: e.target.value})} required />
                  </div>
                </div>

                <div className="form-row">
                  <div className="form-group">
                    <label>CPF do responsável*</label>
                    <input className="form-control premium" type="text" placeholder="000.000.000-00" value={formData.respCpf} onChange={e => setFormData({...formData, respCpf: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>E-mail*</label>
                    <div className="input-with-icon-login premium">
                      <Mail size={18} className="input-icon" />
                      <input type="email" placeholder="seu@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                    </div>
                  </div>
                </div>

                <div className="form-row phone-row">
                  <div className="form-group">
                    <label>Tipo de telefone*</label>
                    <select className="form-control premium" value={formData.phoneType} onChange={e => setFormData({...formData, phoneType: e.target.value})}>
                      <option value="celular">Celular / WhatsApp</option>
                      <option value="fixo">Telefone fixo</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Número de telefone*</label>
                    <div className="input-with-icon-login premium">
                      <Phone size={18} className="input-icon" />
                      <input type="text" placeholder="(00) 90000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary login-submit" style={{ marginTop: '2rem' }}>
                Próximo Passo <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* STEP 2: SUA EMPRESA */}
          {step === 2 && (
            <div className="animate-fade-in" style={{ display: 'grid', gap: '1.25rem' }}>
              <div className="form-group">
                <label>Descrição do modelo de negócio</label>
                <textarea className="form-control premium" placeholder="Conte-nos brevemente o que sua empresa faz..." style={{ height: '70px', resize: 'none' }} value={formData.bizDescription} onChange={e => setFormData({...formData, bizDescription: e.target.value})} />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Canal de vendas</label>
                  <select className="form-control premium" value={formData.salesChannel} onChange={e => setFormData({...formData, salesChannel: e.target.value})}>
                    <option value="site">Site</option>
                    <option value="social">Redes Sociais</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>URL do Site</label>
                  <div className="input-with-icon-login premium">
                    <Globe size={16} className="input-icon" />
                    <input type="text" placeholder="www.exemplo.com.br" value={formData.siteUrl} onChange={e => setFormData({...formData, siteUrl: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>CNPJ da empresa*</label>
                  <input className="form-control premium" type="text" placeholder="00.000.000/0000-00" value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Razão social*</label>
                  <input className="form-control premium" type="text" placeholder="Razão Social completa" value={formData.razaoSocial} onChange={e => setFormData({...formData, razaoSocial: e.target.value})} required />
                </div>
              </div>

              <div className="form-row three-col">
                <div className="form-group">
                  <label>Nome fantasia</label>
                  <input className="form-control premium" type="text" placeholder="Nome comercial" value={formData.nomeFantasia} onChange={e => setFormData({...formData, nomeFantasia: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Faturamento anual*</label>
                  <select className="form-control premium" value={formData.annualRevenue} onChange={e => setFormData({...formData, annualRevenue: e.target.value})} required>
                    <option value="">Selecionar...</option>
                    <option value="1">Até R$ 100k</option>
                    <option value="2">R$ 100k a R$ 500k</option>
                    <option value="3">Acima de R$ 500k</option>
                  </select>
                </div>
              </div>

              <div className="form-section-highlight address-section">
                <div className="section-title"><ArrowRight size={16} /> <span>Endereço</span></div>
                <div className="form-row">
                  <div className="form-group">
                    <label>CEP*</label>
                    <input className="form-control premium" type="text" placeholder="00000-000" value={formData.cep} onChange={e => setFormData({...formData, cep: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Logradouro*</label>
                    <input className="form-control premium" type="text" placeholder="Rua, Av, etc." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required />
                  </div>
                </div>
                <div className="form-row three-col">
                  <div className="form-group">
                    <label>Número</label>
                    <input className="form-control premium" type="text" placeholder="00" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} />
                  </div>
                  <div className="form-group">
                    <label>Bairro*</label>
                    <input className="form-control premium" type="text" placeholder="Bairro" value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} required />
                  </div>
                  <div className="form-group">
                    <label>Cidade/UF*</label>
                    <input className="form-control premium" type="text" placeholder="Cidade - UF" value={`${formData.city}${formData.state ? ' - ' + formData.state : ''}`} onChange={e => {
                      const [city, state] = e.target.value.split(' - ');
                      setFormData({...formData, city: city || '', state: state || ''});
                    }} required />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary login-submit">Continuar <ArrowRight size={20} /></button>
            </div>
          )}

          {/* STEP 3: DADOS BANCÁRIOS */}
          {step === 3 && (
            <div className="animate-fade-in" style={{ display: 'grid', gap: '1.5rem' }}>
              <div className="form-group">
                <label>Instituição Financeira (Banco)*</label>
                <select className="form-control premium" value={formData.bank} onChange={e => setFormData({...formData, bank: e.target.value})} required>
                  <option value="">Selecione o banco</option>
                  <option value="001">Banco do Brasil</option>
                  <option value="237">Bradesco</option>
                  <option value="341">Itaú</option>
                  <option value="033">Santander</option>
                  <option value="260">Nubank</option>
                  <option value="077">Inter</option>
                </select>
              </div>

              <div className="form-row bank-row">
                <div className="form-group">
                  <label>Agência*</label>
                  <input className="form-control premium" type="text" placeholder="0000" value={formData.agency} onChange={e => setFormData({...formData, agency: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Conta*</label>
                  <div style={{ display: 'flex', gap: '0.5rem' }}>
                    <input className="form-control premium" type="text" placeholder="00000" value={formData.account} onChange={e => setFormData({...formData, account: e.target.value})} required style={{ flex: 1 }} />
                    <input className="form-control premium" type="text" placeholder="X" value={formData.accountDigit} onChange={e => setFormData({...formData, accountDigit: e.target.value})} required style={{ width: '50px', textAlign: 'center' }} />
                  </div>
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Tipo de conta*</label>
                  <select className="form-control premium" value={formData.bankAccountType} onChange={e => setFormData({...formData, bankAccountType: e.target.value})} required>
                    <option value="">Selecionar...</option>
                    <option value="corrente">Corrente</option>
                    <option value="poupanca">Poupança</option>
                  </select>
                </div>
                <div className="form-group">
                  <label>Tipo de recebedor*</label>
                  <select className="form-control premium" value={formData.receiverType} onChange={e => setFormData({...formData, receiverType: e.target.value})} required>
                    <option value="proprio">Titular Próprio</option>
                    <option value="terceiro">Terceiro</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Titular da conta*</label>
                <div className="input-with-icon-login premium">
                  <User size={18} className="input-icon" />
                  <input type="text" placeholder="Nome completo do titular" value={formData.bankAccountName} onChange={e => setFormData({...formData, bankAccountName: e.target.value})} required />
                </div>
              </div>

              <button type="submit" className="btn-primary login-submit">Próximo Passo <ArrowRight size={20} /></button>
            </div>
          )}

          {/* STEP 4: DOCUMENTOS */}
          {step === 4 && (
            <div className="animate-fade-in" style={{ display: 'grid', gap: '1.25rem' }}>
              <p style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.9rem', marginBottom: '0.5rem' }}>Finalize enviando seus documentos para validação.</p>
              
              <div className="docs-grid">
                {[
                  { label: 'Contrato Social', sub: 'PDF/JPG' },
                  { label: 'RG/CNH', sub: 'Frente e verso' },
                  { label: 'Residência', sub: 'Últimos 3 meses' },
                  { label: 'Extrato Bancário', sub: 'Comprovação' }
                ].map((doc, idx) => (
                  <div key={idx} className="doc-upload-card">
                    <div className="doc-icon"><Upload size={20} /></div>
                    <div className="doc-info">
                      <strong>{doc.label}</strong>
                      <span>{doc.sub}</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-section-highlight" style={{ marginTop: '1rem' }}>
                <div className="form-group">
                  <label>Defina sua senha de segurança*</label>
                  <div className="input-with-icon-login premium">
                    <Lock size={18} className="input-icon" />
                    <input type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary login-submit" disabled={isLoading}>
                {isLoading ? 'Finalizando...' : 'Concluir Cadastro'}
              </button>
            </div>
          )}
        </form>

        <div className="login-footer">
          <span style={{ color: 'rgba(255,255,255,0.5)' }}>Já possui uma conta?</span>
          <a href="/login" className="signup-link" style={{ fontWeight: 800 }}>Fazer Login</a>
        </div>
      </div>

      <style jsx>{`
        /* Botão Voltar em Branco */
        .btn-back-white {
          position: absolute; top: 1.5rem; left: 1.5rem; padding: 0.6rem 1.2rem;
          background: white; color: black; border-radius: 10px; border: none;
          font-weight: 800; font-size: 0.85rem; display: flex; align-items: center; gap: 0.6rem;
          cursor: pointer; transition: all 0.3s; z-index: 100; box-shadow: 0 4px 15px rgba(255,255,255,0.2);
        }
        .btn-back-white:hover { transform: translateX(-5px); background: #f0f0f0; box-shadow: 0 6px 20px rgba(255,255,255,0.3); }

        /* Stepper com Flechas */
        .steps-tracker-premium { display: flex; justify-content: center; align-items: center; gap: 0.75rem; }
        .step-wrapper { display: flex; align-items: center; gap: 0.75rem; }
        .step-item { display: flex; flex-direction: column; align-items: center; gap: 0.4rem; opacity: 0.3; transition: all 0.4s cubic-bezier(0.4, 0, 0.2, 1); }
        .step-item.active { opacity: 1; transform: translateY(-3px); }
        .step-item.completed { opacity: 0.7; }
        .step-circle { 
          width: 38px; height: 38px; border-radius: 50%; border: 2px solid var(--border); 
          display: flex; align-items: center; justify-content: center; 
          font-weight: 800; color: white; background: rgba(255,255,255,0.03);
          transition: all 0.3s;
        }
        .step-item.active .step-circle { border-color: var(--primary); background: var(--primary); box-shadow: 0 0 20px var(--primary-glow); }
        .step-item.completed .step-circle { border-color: #10b981; background: #10b981; }
        .step-label { font-size: 0.65rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; color: var(--text-dim); }
        .step-item.active .step-label { color: white; }

        /* Seleção PF/PJ Agradável */
        .selection-cards { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .selection-card {
          padding: 1.5rem; border-radius: 20px; border: 2px solid var(--border);
          background: rgba(255,255,255,0.01); cursor: pointer; transition: all 0.3s;
          display: flex; align-items: center; gap: 1rem; position: relative;
        }
        .selection-card:hover { border-color: rgba(255,255,255,0.2); background: rgba(255,255,255,0.03); }
        .selection-card.active { border-color: var(--primary); background: rgba(101,131,154,0.1); }
        .card-icon { 
          width: 50px; height: 50px; border-radius: 14px; background: rgba(255,255,255,0.05);
          display: flex; align-items: center; justify-content: center; color: var(--text-dim);
          transition: all 0.3s;
        }
        .selection-card.active .card-icon { background: var(--primary); color: white; box-shadow: 0 5px 15px var(--primary-glow); }
        .card-info h3 { font-size: 1rem; font-weight: 800; color: white; margin-bottom: 0.2rem; }
        .card-info p { font-size: 0.75rem; color: var(--text-dim); }
        .card-check { width: 22px; height: 22px; border-radius: 50%; border: 2px solid var(--border); margin-left: auto; display: flex; align-items: center; justify-content: center; }
        .selection-card.active .card-check { border-color: var(--primary); }
        .selection-card.active .inner-check { width: 12px; height: 12px; border-radius: 50%; background: var(--primary); }

        /* Campos e Destaques */
        .form-section-highlight { 
          background: rgba(255,255,255,0.02); border: 1px solid rgba(255,255,255,0.1); 
          border-radius: 24px; padding: 1.75rem; margin-top: 1rem;
          box-shadow: inset 0 0 40px rgba(0,0,0,0.2);
        }
        .section-title { display: flex; align-items: center; gap: 0.6rem; margin-bottom: 1.5rem; color: var(--primary); font-weight: 800; font-size: 0.95rem; text-transform: uppercase; letter-spacing: 1px; }
        .form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .form-row.three-col { grid-template-columns: 0.7fr 1.3fr 1fr; }
        .form-group { margin-bottom: 1.25rem; }
        .form-group label { font-size: 0.8rem; font-weight: 700; color: rgba(255,255,255,0.5); margin-bottom: 0.6rem; display: block; }
        
        .input-with-icon-login.premium input { 
          background: rgba(0,0,0,0.3) !important; border: 1px solid rgba(255,255,255,0.1) !important; 
          padding: 0.9rem 1rem 0.9rem 3.5rem !important; border-radius: 14px; color: white; width: 100%;
          transition: all 0.3s;
        }
        .input-with-icon-login.premium input:focus { border-color: var(--primary) !important; box-shadow: 0 0 0 4px rgba(101,131,154,0.1) !important; background: rgba(0,0,0,0.4) !important; }
        .form-control.premium { 
          background: rgba(0,0,0,0.3); border: 1px solid rgba(255,255,255,0.1); 
          padding: 0.9rem 1.2rem; border-radius: 14px; color: white; width: 100%; font-size: 0.95rem;
          transition: all 0.3s;
        }
        .form-control.premium:focus { outline: none; border-color: var(--primary); background: rgba(0,0,0,0.4); }

        /* Docs Grid */
        .docs-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1rem; }
        .doc-upload-card {
          padding: 1.25rem; border-radius: 16px; border: 2px dashed var(--border);
          background: rgba(255,255,255,0.01); display: flex; align-items: center; gap: 1rem; cursor: pointer; transition: all 0.3s;
        }
        .doc-upload-card:hover { border-color: var(--primary); background: rgba(255,255,255,0.04); }
        .doc-icon { color: var(--primary); }
        .doc-info strong { display: block; font-size: 0.85rem; color: white; margin-bottom: 0.1rem; }
        .doc-info span { font-size: 0.7rem; color: var(--text-dim); }
      `}</style>
    </div>
  );
}
