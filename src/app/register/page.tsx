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
    <div className="login-container" style={{ minHeight: '100vh', padding: '3rem 1rem' }}>
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <div className="login-card glass-panel animate-fade-in register-main-card">
        
        {/* Botão Voltar Discreto */}
        <button 
          onClick={() => step === 1 ? router.push('/login') : setStep(step - 1)} 
          className="btn-back-subtle"
        >
          <ArrowLeft size={16} /> {step === 1 ? 'Voltar ao Login' : 'Voltar'}
        </button>

        <div className="login-header" style={{ marginTop: '3rem' }}>
          <img src="https://tronnus.com/wp-content/uploads/2026/01/tronnus-png-001.png" alt="Tronnus" className="login-logo" style={{ marginBottom: '1.2rem', height: '45px' }} />
          <h1 className="gradient-text" style={{ fontSize: '2.4rem', marginBottom: '0.5rem', fontWeight: 800 }}>Crie a sua conta Tronnus</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Leva menos de 2 minutos.</p>
        </div>

        {/* Stepper com 1 2 3 4 */}
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
                <ChevronRight size={18} className="step-arrow" />
              )}
            </div>
          ))}
        </div>

        <form className="login-form" onSubmit={handleNext}>
          {/* STEP 1: DADOS BÁSICOS */}
          {step === 1 && (
            <div className="animate-fade-in">
              {/* Seleção PF/PJ mais comprida */}
              <div className="selection-cards-grid">
                <div 
                  className={`selection-card-premium ${accountType === 'PF' ? 'active' : ''}`}
                  onClick={() => setAccountType('PF')}
                >
                  <div className="card-icon-box"><User size={28} /></div>
                  <div className="card-content">
                    <h3>Pessoa Física</h3>
                    <p>Vender como autônomo (CPF)</p>
                  </div>
                  <div className="card-status-indicator"></div>
                </div>
                <div 
                  className={`selection-card-premium ${accountType === 'PJ' ? 'active' : ''}`}
                  onClick={() => setAccountType('PJ')}
                >
                  <div className="card-icon-box"><Building2 size={28} /></div>
                  <div className="card-content">
                    <h3>Pessoa Jurídica</h3>
                    <p>Vender como empresa (CNPJ)</p>
                  </div>
                  <div className="card-status-indicator"></div>
                </div>
              </div>

              {/* Destaque nos Dados Iniciais com Alinhamento Corrigido */}
              <div className="form-section-highlight-premium">
                <div className="section-header-pill">
                  <User size={16} />
                  <span>Informações do Responsável</span>
                </div>
                
                <div className="form-group-full">
                  <label>Nome do responsável*</label>
                  <div className="input-group-premium">
                    <User size={18} className="field-icon" />
                    <input type="text" placeholder="Digite seu nome completo" value={formData.respName} onChange={e => setFormData({...formData, respName: e.target.value})} required />
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group-full">
                    <label>CPF do responsável*</label>
                    <div className="input-group-premium no-icon">
                      <input type="text" placeholder="000.000.000-00" value={formData.respCpf} onChange={e => setFormData({...formData, respCpf: e.target.value})} required />
                    </div>
                  </div>
                  <div className="form-group-full">
                    <label>E-mail*</label>
                    <div className="input-group-premium">
                      <Mail size={18} className="field-icon" />
                      <input type="email" placeholder="seu@email.com" value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} required />
                    </div>
                  </div>
                </div>

                <div className="form-grid-2">
                  <div className="form-group-full">
                    <label>Tipo de telefone*</label>
                    <select className="select-premium" value={formData.phoneType} onChange={e => setFormData({...formData, phoneType: e.target.value})}>
                      <option value="celular">Celular / WhatsApp</option>
                      <option value="fixo">Telefone fixo</option>
                    </select>
                  </div>
                  <div className="form-group-full">
                    <label>Número de telefone*</label>
                    <div className="input-group-premium">
                      <Phone size={18} className="field-icon" />
                      <input type="text" placeholder="(00) 90000-0000" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} required />
                    </div>
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary-register">
                Próximo Passo <ArrowRight size={20} />
              </button>
            </div>
          )}

          {/* STEP 2: SUA EMPRESA */}
          {step === 2 && (
            <div className="animate-fade-in" style={{ display: 'grid', gap: '1.5rem' }}>
              <div className="form-group-full">
                <label>Descrição do modelo de negócio</label>
                <textarea className="textarea-premium" placeholder="Breve descrição do que sua empresa faz..." value={formData.bizDescription} onChange={e => setFormData({...formData, bizDescription: e.target.value})} />
              </div>

              <div className="form-grid-2">
                <div className="form-group-full">
                  <label>Canal de vendas</label>
                  <select className="select-premium" value={formData.salesChannel} onChange={e => setFormData({...formData, salesChannel: e.target.value})}>
                    <option value="site">Site</option>
                    <option value="social">Redes Sociais</option>
                  </select>
                </div>
                <div className="form-group-full">
                  <label>URL do Site</label>
                  <div className="input-group-premium">
                    <Globe size={18} className="field-icon" />
                    <input type="text" placeholder="www.seusite.com.br" value={formData.siteUrl} onChange={e => setFormData({...formData, siteUrl: e.target.value})} />
                  </div>
                </div>
              </div>

              <div className="form-grid-2">
                <div className="form-group-full">
                  <label>CNPJ da empresa*</label>
                  <input className="input-control-premium" type="text" placeholder="00.000.000/0000-00" value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} required />
                </div>
                <div className="form-group-full">
                  <label>Razão social*</label>
                  <input className="input-control-premium" type="text" placeholder="Nome empresarial completo" value={formData.razaoSocial} onChange={e => setFormData({...formData, razaoSocial: e.target.value})} required />
                </div>
              </div>

              <div className="form-section-highlight-premium address-section">
                <div className="section-header-pill"><span>Endereço Comercial</span></div>
                <div className="form-grid-2" style={{ gridTemplateColumns: '0.8fr 2.2fr' }}>
                  <div className="form-group-full"><label>CEP*</label><input className="input-control-premium" type="text" placeholder="00000-000" value={formData.cep} onChange={e => setFormData({...formData, cep: e.target.value})} required /></div>
                  <div className="form-group-full"><label>Logradouro*</label><input className="input-control-premium" type="text" placeholder="Rua, Av, etc." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required /></div>
                </div>
                <div className="form-grid-3">
                  <div className="form-group-full"><label>Número</label><input className="input-control-premium" type="text" placeholder="00" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} /></div>
                  <div className="form-group-full"><label>Bairro*</label><input className="input-control-premium" type="text" placeholder="Bairro" value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} required /></div>
                  <div className="form-group-full"><label>Cidade/UF*</label><input className="input-control-premium" type="text" placeholder="Cidade - UF" value={`${formData.city}${formData.state ? ' - ' + formData.state : ''}`} required /></div>
                </div>
              </div>

              <button type="submit" className="btn-primary-register">Continuar <ArrowRight size={20} /></button>
            </div>
          )}

          {/* STEP 3: DADOS BANCÁRIOS */}
          {step === 3 && (
            <div className="animate-fade-in" style={{ display: 'grid', gap: '1.5rem' }}>
              <div className="form-group-full">
                <label>Banco*</label>
                <select className="select-premium" value={formData.bank} onChange={e => setFormData({...formData, bank: e.target.value})} required>
                  <option value="">Selecione o banco</option>
                  <option value="001">Banco do Brasil</option>
                  <option value="260">Nubank</option>
                  <option value="341">Itaú</option>
                  <option value="077">Inter</option>
                </select>
              </div>

              <div className="form-grid-2">
                <div className="form-group-full"><label>Agência*</label><input className="input-control-premium" type="text" placeholder="0000" value={formData.agency} onChange={e => setFormData({...formData, agency: e.target.value})} required /></div>
                <div className="form-group-full"><label>Conta* (com dígito)</label><input className="input-control-premium" type="text" placeholder="00000-0" value={formData.account} onChange={e => setFormData({...formData, account: e.target.value})} required /></div>
              </div>

              <div className="form-group-full">
                <label>Titular da conta*</label>
                <div className="input-group-premium">
                  <User size={18} className="field-icon" />
                  <input type="text" placeholder="Nome completo do titular" value={formData.bankAccountName} onChange={e => setFormData({...formData, bankAccountName: e.target.value})} required />
                </div>
              </div>

              <button type="submit" className="btn-primary-register">Próximo Passo <ArrowRight size={20} /></button>
            </div>
          )}

          {/* STEP 4: DOCUMENTOS */}
          {step === 4 && (
            <div className="animate-fade-in" style={{ display: 'grid', gap: '1.5rem' }}>
              <div className="docs-upload-grid">
                {[
                  'Contrato Social', 'RG do Responsável', 'Comprovante Residência', 'Extrato Bancário'
                ].map((doc, idx) => (
                  <div key={idx} className="doc-card-premium">
                    <Upload size={24} className="upload-icon-pulse" />
                    <div className="doc-info">
                      <strong>{doc}</strong>
                      <span>PDF ou Imagem</span>
                    </div>
                  </div>
                ))}
              </div>

              <div className="form-section-highlight-premium">
                <div className="form-group-full">
                  <label>Crie uma senha de acesso*</label>
                  <div className="input-group-premium">
                    <Lock size={18} className="field-icon" />
                    <input type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required />
                  </div>
                </div>
              </div>

              <button type="submit" className="btn-primary-register" disabled={isLoading}>
                {isLoading ? 'Criando sua conta...' : 'Finalizar Cadastro'}
              </button>
            </div>
          )}
        </form>

        <div className="login-footer">
          <span style={{ color: 'rgba(255,255,255,0.4)' }}>Já possui uma conta?</span>
          <a href="/login" className="signup-link" style={{ fontWeight: 800 }}>Fazer Login</a>
        </div>
      </div>

      <style jsx>{`
        .register-main-card {
          max-width: 850px !important; width: 100%; padding: 3rem; 
          position: relative; border: 1px solid rgba(255,255,255,0.08);
          background: rgba(13, 17, 23, 0.8);
        }

        /* Botão Voltar Discreto */
        .btn-back-subtle {
          position: absolute; top: 1.5rem; left: 1.5rem; padding: 0.6rem 1rem;
          background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.8);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
          font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;
          cursor: pointer; transition: all 0.3s; z-index: 10;
        }
        .btn-back-subtle:hover { background: rgba(255,255,255,0.1); color: white; transform: translateX(-3px); }

        /* Stepper */
        .steps-tracker-premium { display: flex; justify-content: center; align-items: center; gap: 1rem; margin-bottom: 3.5rem; }
        .step-wrapper { display: flex; align-items: center; gap: 1rem; }
        .step-item { display: flex; flex-direction: column; align-items: center; gap: 0.5rem; opacity: 0.2; }
        .step-item.active { opacity: 1; }
        .step-item.completed { opacity: 0.6; }
        .step-circle { width: 40px; height: 40px; border-radius: 50%; border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-weight: 800; background: rgba(0,0,0,0.2); }
        .step-item.active .step-circle { border-color: var(--primary); background: var(--primary); box-shadow: 0 0 20px var(--primary-glow); }
        .step-item.completed .step-circle { border-color: #10b981; background: #10b981; }
        .step-label { font-size: 0.7rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; }
        .step-arrow { color: rgba(255,255,255,0.05); }

        /* PF/PJ Cards */
        .selection-cards-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2.5rem; }
        .selection-card-premium {
          padding: 1.75rem; border-radius: 24px; border: 2px solid rgba(255,255,255,0.05);
          background: rgba(255,255,255,0.02); cursor: pointer; transition: all 0.4s;
          display: flex; align-items: center; gap: 1.25rem; position: relative; overflow: hidden;
        }
        .selection-card-premium:hover { border-color: rgba(255,255,255,0.15); background: rgba(255,255,255,0.04); }
        .selection-card-premium.active { border-color: var(--primary); background: rgba(101,131,154,0.1); }
        .card-icon-box { width: 55px; height: 55px; border-radius: 16px; background: rgba(255,255,255,0.05); display: flex; align-items: center; justify-content: center; color: var(--text-dim); }
        .selection-card-premium.active .card-icon-box { background: var(--primary); color: white; }
        .card-content h3 { font-size: 1.1rem; font-weight: 800; color: white; margin-bottom: 0.25rem; }
        .card-content p { font-size: 0.8rem; color: var(--text-dim); }
        .card-status-indicator { width: 24px; height: 24px; border-radius: 50%; border: 2px solid var(--border); margin-left: auto; }
        .selection-card-premium.active .card-status-indicator { border-color: var(--primary); background: var(--primary); box-shadow: inset 0 0 0 4px #0d1117; }

        /* Form Sections */
        .form-section-highlight-premium { background: rgba(0,0,0,0.2); border: 1px solid rgba(255,255,255,0.05); border-radius: 28px; padding: 2rem; margin-bottom: 2rem; }
        .section-header-pill { display: inline-flex; align-items: center; gap: 0.6rem; background: rgba(101,131,154,0.1); color: var(--primary); padding: 0.4rem 1rem; border-radius: 100px; font-size: 0.75rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1px; margin-bottom: 2rem; }
        
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1.5fr; gap: 1.5rem; }
        .form-group-full { margin-bottom: 1.5rem; }
        .form-group-full label { font-size: 0.85rem; font-weight: 700; color: rgba(255,255,255,0.5); margin-bottom: 0.75rem; display: block; }

        /* Input Group com Ícone Correto */
        .input-group-premium { position: relative; display: flex; align-items: center; }
        .input-group-premium .field-icon { position: absolute; left: 1.25rem; color: var(--text-dim); pointer-events: none; }
        .input-group-premium input { 
          width: 100%; padding: 1rem 1rem 1rem 3.5rem; border-radius: 16px; 
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); 
          color: white; font-size: 1rem; transition: all 0.3s;
        }
        .input-group-premium.no-icon input { padding-left: 1.25rem; }
        .input-group-premium input:focus { outline: none; border-color: var(--primary); background: rgba(255,255,255,0.06); box-shadow: 0 0 0 4px rgba(101,131,154,0.1); }
        
        .input-control-premium { 
          width: 100%; padding: 1rem 1.25rem; border-radius: 16px; 
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); 
          color: white; font-size: 1rem;
        }
        .select-premium { 
          width: 100%; padding: 1rem 1.25rem; border-radius: 16px; 
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); 
          color: white; font-size: 1rem; appearance: none;
        }
        .textarea-premium { 
          width: 100%; padding: 1rem 1.25rem; border-radius: 16px; height: 100px; resize: none;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.08); 
          color: white; font-size: 1rem;
        }

        /* Botão Submit */
        .btn-primary-register {
          width: 100%; padding: 1.1rem; border-radius: 18px; border: none;
          background: linear-gradient(135deg, var(--primary) 0%, #4a6a8a 100%);
          color: white; font-weight: 800; font-size: 1.1rem; display: flex; align-items: center;
          justify-content: center; gap: 1rem; cursor: pointer; transition: all 0.4s;
          box-shadow: 0 10px 25px rgba(101,131,154,0.3);
        }
        .btn-primary-register:hover { transform: translateY(-3px); box-shadow: 0 15px 30px rgba(101,131,154,0.4); }

        /* Docs */
        .docs-upload-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.25rem; }
        .doc-card-premium {
          padding: 1.5rem; border-radius: 20px; border: 2px dashed rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.02); display: flex; align-items: center; gap: 1rem;
          cursor: pointer; transition: all 0.3s;
        }
        .doc-card-premium:hover { border-color: var(--primary); background: rgba(255,255,255,0.05); }
        .upload-icon-pulse { color: var(--primary); }
      `}</style>
    </div>
  );
}
