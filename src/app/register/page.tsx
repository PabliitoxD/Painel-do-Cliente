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
  const [accountType] = useState<'PF' | 'PJ'>('PJ');
  
  const [formData, setFormData] = useState({
    // Dados Empresa (PJ)
    bizDescription: '', salesChannel: 'site', siteUrl: '', cnpj: '', razaoSocial: '',
    nomeFantasia: '', annualRevenue: '', companyEmail: '',
    
    // Endereço Empresa
    cep: '', address: '', number: '', complement: '', neighborhood: '', city: '', state: '', referencePoint: '',
    
    // Telefone Empresa
    companyPhoneType: 'celular', companyPhoneDdd: '', companyPhone: '',
    
    // Dados Representante Legal (PJ)
    repName: '', repEmail: '', repCpf: '', repMotherName: '', repBirthDate: '', repMonthlyIncome: '', repOccupation: '',
    
    // Endereço Representante (PJ)
    repCep: '', repAddress: '', repNumber: '', repComplement: '', repNeighborhood: '', repCity: '', repState: '', repReferencePoint: '',
    
    // Telefone Representante (PJ)
    repPhoneType: 'celular', repPhoneDdd: '', repPhone: '',
    
    // Dados Bancários
    bank: '', agency: '', agencyDigit: '', account: '', accountDigit: '',
    bankAccountType: 'corrente', bankAccountName: '', receiverType: 'PJ', bankAccountDoc: '',
    
    password: '', confirmPassword: ''
  });

  const handleCepBlur = async (type: 'company' | 'rep') => {
    const cepValue = type === 'company' ? formData.cep : formData.repCep;
    const cep = cepValue.replace(/\D/g, '');
    if (cep.length === 8) {
      try {
        const response = await fetch(`https://viacep.com.br/ws/${cep}/json/`);
        const data = await response.json();
        if (!data.erro) {
          if (type === 'company') {
            setFormData({
              ...formData,
              address: data.logradouro,
              neighborhood: data.bairro,
              city: data.localidade,
              state: data.uf
            });
          } else {
            setFormData({
              ...formData,
              repAddress: data.logradouro,
              repNeighborhood: data.bairro,
              repCity: data.localidade,
              repState: data.uf
            });
          }
        }
      } catch (error) {
        console.error("Erro ao buscar CEP:", error);
      }
    }
  };

  const banks = [
    { code: '001', name: 'Banco do Brasil' },
    { code: '033', name: 'Santander' },
    { code: '104', name: 'Caixa Econômica' },
    { code: '237', name: 'Bradesco' },
    { code: '341', name: 'Itaú' },
    { code: '077', name: 'Inter' },
    { code: '260', name: 'Nubank' },
    { code: '422', name: 'Safra' },
    { code: '748', name: 'Sicredi' },
    { code: '756', name: 'Sicoob' },
    { code: '655', name: 'Neon' },
    { code: '290', name: 'PagBank' },
    { code: '336', name: 'C6 Bank' },
  ];

  const handleNext = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 5) {
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
    { id: 3, label: 'Rep. Legal' },
    { id: 4, label: 'Banco' },
    { id: 5, label: 'Docs' }
  ];

  return (
    <div className="login-container" style={{ minHeight: '100vh', padding: '3rem 1rem' }}>
      <div className="login-bg-shapes">
        <div className="shape shape-1"></div>
        <div className="shape shape-2"></div>
      </div>

      <div className="login-card glass-panel animate-fade-in register-main-card">
        
        <button 
          onClick={() => step === 1 ? router.push('/login') : setStep(step - 1)} 
          className="btn-back-subtle"
        >
          <ArrowLeft size={18} /> {step === 1 ? 'Voltar ao Login' : 'Voltar'}
        </button>

        <div className="login-header" style={{ marginTop: '3rem' }}>
          <img src="https://tronnus.com/wp-content/uploads/2026/01/tronnus-png-001.png" alt="Tronnus" className="login-logo" style={{ marginBottom: '1.2rem', height: '45px' }} />
          <h1 className="gradient-text" style={{ fontSize: '2.5rem', marginBottom: '0.5rem', fontWeight: 800 }}>Crie a sua conta Tronnus</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem' }}>Leva menos de 2 minutos.</p>
        </div>

        <div className="steps-tracker-premium">
          {steps.map((s, idx) => (
            <div key={s.id} className="step-wrapper">
              <div className={`step-item ${step === s.id ? 'active' : step > s.id ? 'completed' : ''}`}>
                <div className="step-circle">
                  {step > s.id ? <CheckCircle2 size={24} /> : s.id}
                </div>
                <span className="step-label">{s.label}</span>
              </div>
              {idx < steps.length - 1 && (
                <ChevronRight size={22} className="step-arrow" />
              )}
            </div>
          ))}
        </div>

        <form className="login-form" onSubmit={handleNext}>
          {step === 1 && (
            <div className="animate-fade-in">
              <div className="form-section-highlight-premium">
                <div className="section-header-pill"><Building2 size={16} /><span>Dados da Empresa</span></div>
                <div className="form-grid-2">
                  <div className="form-group-full"><label>Nome fantasia*</label><input className="input-control-premium" type="text" placeholder="Nome da empresa" value={formData.nomeFantasia} onChange={e => setFormData({...formData, nomeFantasia: e.target.value})} required /></div>
                  <div className="form-group-full"><label>Razão social*</label><input className="input-control-premium" type="text" placeholder="Razão social completa" value={formData.razaoSocial} onChange={e => setFormData({...formData, razaoSocial: e.target.value})} required /></div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group-full"><label>E-mail da empresa*</label><input className="input-control-premium" type="email" placeholder="empresa@email.com" value={formData.companyEmail} onChange={e => setFormData({...formData, companyEmail: e.target.value})} required /></div>
                  <div className="form-group-full"><label>Número do CNPJ*</label><input className="input-control-premium" type="text" placeholder="00.000.000/0000-00" value={formData.cnpj} onChange={e => setFormData({...formData, cnpj: e.target.value})} required /></div>
                </div>
              </div>
              <button type="submit" className="btn-primary-register">Próximo Passo <ArrowRight size={22} /></button>
            </div>
          )}

          {step === 2 && (
            <div className="animate-fade-in" style={{ display: 'grid', gap: '1.5rem' }}>
              <div className="form-section-highlight-premium">
                <div className="section-header-pill"><span>Informações Adicionais</span></div>
                <div className="form-group-full">
                  <label>Faturamento Anual*</label>
                  <select className="select-premium" value={formData.annualRevenue} onChange={e => setFormData({...formData, annualRevenue: e.target.value})} required>
                    <option value="">Selecione a faixa</option>
                    <option value="Até R$ 50.000,00">Até R$ 50.000,00</option><option value="R$ 50.000 a R$ 150.000">R$ 50.000 a R$ 150.000</option><option value="R$ 150.000 a R$ 300.000">R$ 150.000 a R$ 300.000</option><option value="R$ 300.000 a R$ 500.000">R$ 300.000 a R$ 500.000</option><option value="R$ 500.000 a R$ 1.000.000">R$ 500.000 a R$ 1.000.000</option><option value="Acima de R$ 1.000.000,00">Acima de R$ 1.000.000,00</option><option value="Não tenho faturamento ainda">Não tenho faturamento ainda</option>
                  </select>
                </div>
                <div className="form-group-full"><label>Descrição do Modelo de Negócio (Opcional)</label><textarea className="textarea-premium" style={{ height: '80px' }} placeholder="Descreva o que sua empresa faz" value={formData.bizDescription} onChange={e => setFormData({...formData, bizDescription: e.target.value})} /></div>
                <div className="form-grid-2">
                  <div className="form-group-full">
                    <label>Canal de Vendas (Opcional)</label>
                    <select className="select-premium" value={formData.salesChannel} onChange={e => setFormData({...formData, salesChannel: e.target.value})}>
                      <option value="">Nenhum</option><option value="site">Site</option><option value="social">Redes Sociais</option><option value="balcao">Balcão</option>
                    </select>
                  </div>
                  <div className="form-group-full"><label>Site do recebedor (Opcional)</label><input className="input-control-premium" type="text" placeholder="www.seusite.com.br" value={formData.siteUrl} onChange={e => setFormData({...formData, siteUrl: e.target.value})} /></div>
                </div>
              </div>

              <div className="form-section-highlight-premium address-section">
                <div className="section-header-pill"><span>Endereço Empresa</span></div>
                <div className="form-grid-2" style={{ gridTemplateColumns: '0.8fr 2.2fr' }}>
                  <div className="form-group-full"><label>CEP*</label><input className="input-control-premium" type="text" placeholder="00000-000" value={formData.cep} onChange={e => setFormData({...formData, cep: e.target.value})} onBlur={() => handleCepBlur('company')} required /></div>
                  <div className="form-group-full"><label>Logradouro*</label><input className="input-control-premium" type="text" placeholder="Rua, Av, etc." value={formData.address} onChange={e => setFormData({...formData, address: e.target.value})} required /></div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group-full"><label>Número*</label><input className="input-control-premium" type="text" placeholder="00" value={formData.number} onChange={e => setFormData({...formData, number: e.target.value})} required /></div>
                  <div className="form-group-full"><label>Complemento (Opcional)</label><input className="input-control-premium" type="text" placeholder="Apto, Bloco, etc." value={formData.complement} onChange={e => setFormData({...formData, complement: e.target.value})} /></div>
                </div>
                <div className="form-grid-3">
                  <div className="form-group-full"><label>Bairro*</label><input className="input-control-premium" type="text" placeholder="Bairro" value={formData.neighborhood} onChange={e => setFormData({...formData, neighborhood: e.target.value})} required /></div>
                  <div className="form-group-full"><label>Cidade*</label><input className="input-control-premium" type="text" placeholder="Cidade" value={formData.city} onChange={e => setFormData({...formData, city: e.target.value})} required /></div>
                  <div className="form-group-full"><label>Estado*</label><input className="input-control-premium" type="text" placeholder="UF" value={formData.state} onChange={e => setFormData({...formData, state: e.target.value})} required /></div>
                </div>
                <div className="form-group-full"><label>Ponto de referência (Opcional)</label><input className="input-control-premium" type="text" placeholder="Próximo a..." value={formData.referencePoint} onChange={e => setFormData({...formData, referencePoint: e.target.value})} /></div>
              </div>

              <div className="form-section-highlight-premium">
                <div className="section-header-pill"><span>Telefone Empresa</span></div>
                <div className="form-grid-3" style={{ gridTemplateColumns: '1.2fr 0.8fr 1.5fr' }}>
                  <div className="form-group-full"><label>Tipo de telefone*</label><select className="select-premium" value={formData.companyPhoneType} onChange={e => setFormData({...formData, companyPhoneType: e.target.value})} required><option value="celular">Celular</option><option value="fixo">Fixo</option></select></div>
                  <div className="form-group-full"><label>DDD*</label><div className="input-group-premium no-icon"><input type="text" placeholder="(000)" value={formData.companyPhoneDdd} onChange={e => setFormData({...formData, companyPhoneDdd: e.target.value})} required /></div></div>
                  <div className="form-group-full"><label>Número*</label><div className="input-group-premium"><Phone size={20} className="field-icon" /><input type="text" placeholder="0 0000-0000" value={formData.companyPhone} onChange={e => setFormData({...formData, companyPhone: e.target.value})} required /></div></div>
                </div>
              </div>

              <button type="submit" className="btn-primary-register">Continuar <ArrowRight size={22} /></button>
            </div>
          )}

          {step === 3 && (
            <div className="animate-fade-in" style={{ display: 'grid', gap: '1.5rem' }}>
              <div className="form-section-highlight-premium">
                <div className="section-header-pill"><span>Dados do Representante Legal</span></div>
                <div className="form-grid-2">
                  <div className="form-group-full"><label>Nome do representante legal*</label><input className="input-control-premium" type="text" placeholder="Nome completo" value={formData.repName} onChange={e => setFormData({...formData, repName: e.target.value})} required /></div>
                  <div className="form-group-full"><label>E-mail do representante legal*</label><input className="input-control-premium" type="email" placeholder="email@rep.com" value={formData.repEmail} onChange={e => setFormData({...formData, repEmail: e.target.value})} required /></div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group-full"><label>Número do CPF*</label><input className="input-control-premium" type="text" placeholder="000.000.000-00" value={formData.repCpf} onChange={e => setFormData({...formData, repCpf: e.target.value})} required /></div>
                  <div className="form-group-full"><label>Nome da mãe*</label><input className="input-control-premium" type="text" placeholder="Nome completo da mãe" value={formData.repMotherName} onChange={e => setFormData({...formData, repMotherName: e.target.value})} required /></div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group-full"><label>Aniversário*</label><input className="input-control-premium" type="text" placeholder="00/00/0000" value={formData.repBirthDate} onChange={e => setFormData({...formData, repBirthDate: e.target.value})} required /></div>
                  <div className="form-group-full"><label>Ocupação profissional*</label><input className="input-control-premium" type="text" placeholder="Cargo/Profissão" value={formData.repOccupation} onChange={e => setFormData({...formData, repOccupation: e.target.value})} required /></div>
                </div>
                <div className="form-group-full">
                  <label>Renda mensal*</label>
                  <select className="select-premium" value={formData.repMonthlyIncome} onChange={e => setFormData({...formData, repMonthlyIncome: e.target.value})} required>
                    <option value="">Selecione a renda</option>
                    <option value="Até R$ 5.000">Até R$ 5.000</option><option value="R$ 5.000 a R$ 15.000">R$ 5.000 a R$ 15.000</option><option value="R$ 15.000 a R$ 25.000">R$ 15.000 a R$ 25.000</option><option value="R$ 25.000 a R$ 50.000">R$ 25.000 a R$ 50.000</option><option value="Acima de R$ 50.000">Acima de R$ 50.000</option><option value="Não tenho renda ainda">Não tenho renda ainda</option>
                  </select>
                </div>
              </div>

              <div className="form-section-highlight-premium address-section">
                <div className="section-header-pill"><span>Endereço Representante</span></div>
                <div className="form-grid-2" style={{ gridTemplateColumns: '0.8fr 2.2fr' }}>
                  <div className="form-group-full"><label>CEP*</label><input className="input-control-premium" type="text" placeholder="00000-000" value={formData.repCep} onChange={e => setFormData({...formData, repCep: e.target.value})} onBlur={() => handleCepBlur('rep')} required /></div>
                  <div className="form-group-full"><label>Logradouro*</label><input className="input-control-premium" type="text" placeholder="Rua, Av, etc." value={formData.repAddress} onChange={e => setFormData({...formData, repAddress: e.target.value})} required /></div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group-full"><label>Número*</label><input className="input-control-premium" type="text" placeholder="00" value={formData.repNumber} onChange={e => setFormData({...formData, repNumber: e.target.value})} required /></div>
                  <div className="form-group-full"><label>Complemento (Opcional)</label><input className="input-control-premium" type="text" placeholder="Apto, Bloco, etc." value={formData.repComplement} onChange={e => setFormData({...formData, repComplement: e.target.value})} /></div>
                </div>
                <div className="form-grid-3">
                  <div className="form-group-full"><label>Bairro*</label><input className="input-control-premium" type="text" placeholder="Bairro" value={formData.repNeighborhood} onChange={e => setFormData({...formData, repNeighborhood: e.target.value})} required /></div>
                  <div className="form-group-full"><label>Cidade*</label><input className="input-control-premium" type="text" placeholder="Cidade" value={formData.repCity} onChange={e => setFormData({...formData, repCity: e.target.value})} required /></div>
                  <div className="form-group-full"><label>Estado*</label><input className="input-control-premium" type="text" placeholder="UF" value={formData.repState} onChange={e => setFormData({...formData, repState: e.target.value})} required /></div>
                </div>
                <div className="form-group-full"><label>Ponto de referência (Opcional)</label><input className="input-control-premium" type="text" placeholder="Próximo a..." value={formData.repReferencePoint} onChange={e => setFormData({...formData, repReferencePoint: e.target.value})} /></div>
              </div>

              <div className="form-section-highlight-premium">
                <div className="section-header-pill"><span>Telefone Representante</span></div>
                <div className="form-grid-3" style={{ gridTemplateColumns: '1.2fr 0.8fr 1.5fr' }}>
                  <div className="form-group-full"><label>Tipo de telefone*</label><select className="select-premium" value={formData.repPhoneType} onChange={e => setFormData({...formData, repPhoneType: e.target.value})} required><option value="celular">Celular</option><option value="fixo">Fixo</option></select></div>
                  <div className="form-group-full"><label>DDD*</label><div className="input-group-premium no-icon"><input type="text" placeholder="(000)" value={formData.repPhoneDdd} onChange={e => setFormData({...formData, repPhoneDdd: e.target.value})} required /></div></div>
                  <div className="form-group-full"><label>Número*</label><div className="input-group-premium"><Phone size={20} className="field-icon" /><input type="text" placeholder="0 0000-0000" value={formData.repPhone} onChange={e => setFormData({...formData, repPhone: e.target.value})} required /></div></div>
                </div>
              </div>

              <button type="submit" className="btn-primary-register">Próximo Passo <ArrowRight size={22} /></button>
            </div>
          )}

          {step === 4 && (
            <div className="animate-fade-in" style={{ display: 'grid', gap: '1.5rem' }}>
              <div className="form-section-highlight-premium">
                <div className="section-header-pill"><span>Dados Bancários</span></div>
                <div className="form-group-full">
                  <label>Banco*</label>
                  <select className="select-premium" value={formData.bank} onChange={e => setFormData({...formData, bank: e.target.value})} required>
                    <option value="">Selecione o banco</option>
                    {banks.map(bank => (<option key={bank.code} value={bank.code}>{bank.code} - {bank.name}</option>))}
                  </select>
                </div>
                <div className="form-grid-2">
                  <div className="form-group-full"><label>Agência*</label><input className="input-control-premium" type="text" placeholder="0000" value={formData.agency} onChange={e => setFormData({...formData, agency: e.target.value})} required /></div>
                  <div className="form-group-full"><label>Dígito Agência</label><input className="input-control-premium" type="text" placeholder="0" value={formData.agencyDigit} onChange={e => setFormData({...formData, agencyDigit: e.target.value})} /></div>
                </div>
                <div className="form-grid-2">
                  <div className="form-group-full"><label>Conta Bancária*</label><input className="input-control-premium" type="text" placeholder="00000" value={formData.account} onChange={e => setFormData({...formData, account: e.target.value})} required /></div>
                  <div className="form-group-full"><label>Dígito Conta</label><input className="input-control-premium" type="text" placeholder="0" value={formData.accountDigit} onChange={e => setFormData({...formData, accountDigit: e.target.value})} /></div>
                </div>
                <div className="form-group-full">
                  <label>Tipo de Conta*</label>
                  <select className="select-premium" value={formData.bankAccountType} onChange={e => setFormData({...formData, bankAccountType: e.target.value})} required>
                    <option value="corrente">Conta corrente</option><option value="corrente_conjunta">Conta corrente conjunta</option><option value="poupanca">Conta poupança</option><option value="poupanca_conjunta">Conta poupança conjunta</option>
                  </select>
                </div>
                <div className="form-group-full"><label>Nome da conta bancária*</label><div className="input-group-premium"><User size={20} className="field-icon" /><input type="text" placeholder="Nome completo do titular" value={formData.bankAccountName} onChange={e => setFormData({...formData, bankAccountName: e.target.value})} required /></div></div>
                <div className="form-grid-2">
                  <div className="form-group-full"><label>Tipo de recebedor*</label><select className="select-premium" value={formData.receiverType} onChange={e => setFormData({...formData, receiverType: e.target.value})} required><option value="PJ">Pessoa Jurídica</option></select></div>
                  <div className="form-group-full"><label>Nº Documento da Conta Bancária*</label><input className="input-control-premium" type="text" placeholder="CPF ou CNPJ" value={formData.bankAccountDoc} onChange={e => setFormData({...formData, bankAccountDoc: e.target.value})} required /></div>
                </div>
              </div>
              <button type="submit" className="btn-primary-register">Próximo Passo <ArrowRight size={22} /></button>
            </div>
          )}

          {step === 5 && (
            <div className="animate-fade-in" style={{ display: 'grid', gap: '1.5rem' }}>
              <div className="docs-upload-grid">
                {[
                  'Contrato Social', 'RG do Responsável', 'Comprovante Residência', 'Extrato Bancário'
                ].map((doc, idx) => (
                  <div key={idx} className="doc-card-premium" onClick={() => document.getElementById(`file-upload-${idx}`)?.click()}>
                    <Upload size={24} className="upload-icon-pulse" />
                    <div className="doc-info">
                      <strong>{doc}</strong>
                      <span>PDF ou Imagem</span>
                    </div>
                    <input type="file" id={`file-upload-${idx}`} style={{ display: 'none' }} />
                  </div>
                ))}
              </div>
              <div className="form-section-highlight-premium">
                <div className="form-group-full"><label>Crie uma senha de acesso*</label><div className="input-group-premium"><Lock size={20} className="field-icon" /><input type="password" placeholder="••••••••" value={formData.password} onChange={e => setFormData({...formData, password: e.target.value})} required /></div></div>
              </div>
              <button type="submit" className="btn-primary-register" disabled={isLoading}>{isLoading ? 'Criando sua conta...' : 'Finalizar Cadastro'}</button>
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
          max-width: 850px !important; width: 100%; padding: 3.5rem; 
          position: relative; border: 1px solid rgba(255,255,255,0.08);
          background: rgba(13, 17, 23, 0.9);
          box-shadow: 0 20px 50px rgba(0,0,0,0.5);
        }

        .btn-back-subtle {
          position: absolute; top: 1.5rem; left: 1.5rem; padding: 0.6rem 1rem;
          background: rgba(255,255,255,0.05); color: rgba(255,255,255,0.8);
          border: 1px solid rgba(255,255,255,0.1); border-radius: 12px;
          font-weight: 700; font-size: 0.85rem; display: flex; align-items: center; gap: 0.5rem;
          cursor: pointer; transition: all 0.3s;
        }

        /* Stepper Maior */
        .steps-tracker-premium { display: flex; justify-content: center; align-items: center; gap: 1.5rem; margin-bottom: 4rem; }
        .step-wrapper { display: flex; align-items: center; gap: 1.5rem; }
        .step-item { display: flex; flex-direction: column; align-items: center; gap: 0.6rem; opacity: 0.2; }
        .step-item.active { opacity: 1; transform: scale(1.1); }
        .step-item.completed { opacity: 0.6; }
        .step-circle { width: 50px; height: 50px; border-radius: 50%; border: 2px solid var(--border); display: flex; align-items: center; justify-content: center; font-weight: 800; font-size: 1.1rem; background: rgba(0,0,0,0.3); }
        .step-item.active .step-circle { border-color: var(--primary); background: var(--primary); box-shadow: 0 0 25px var(--primary-glow); }
        .step-item.completed .step-circle { border-color: #10b981; background: #10b981; }
        .step-label { font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.2px; }

        /* Form Sections */
        .form-section-highlight-premium { background: rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.05); border-radius: 28px; padding: 2.5rem; margin-bottom: 2rem; }
        .section-header-pill { display: inline-flex; align-items: center; gap: 0.6rem; background: rgba(101,131,154,0.15); color: var(--primary); padding: 0.5rem 1.25rem; border-radius: 100px; font-size: 0.8rem; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; margin-bottom: 2.5rem; }
        
        .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; }
        .form-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 1.5rem; }
        .form-group-full { margin-bottom: 1.75rem; }
        .form-group-full label { font-size: 0.9rem; font-weight: 700; color: rgba(255,255,255,0.6); margin-bottom: 0.75rem; display: block; }

        /* Input Group Corrigido */
        .input-group-premium { 
          position: relative; 
          display: flex; 
          align-items: center;
          background: rgba(255,255,255,0.03); 
          border: 1px solid rgba(255,255,255,0.1); 
          border-radius: 16px;
          transition: all 0.3s;
        }
        .input-group-premium:focus-within { border-color: var(--primary); box-shadow: 0 0 0 4px rgba(101,131,154,0.15); background: rgba(255,255,255,0.05); }
        .input-group-premium .field-icon { margin-left: 1.25rem; color: var(--text-dim); flex-shrink: 0; }
        .input-group-premium input { 
          background: transparent !important; border: none !important; 
          padding: 1.1rem 1.25rem !important; color: white; font-size: 1rem; width: 100%;
        }
        .input-group-premium input:focus { outline: none !important; }
        .input-group-premium input::placeholder { color: rgba(255,255,255,0.2); }
        .input-group-premium.no-icon input { padding-left: 1.25rem !important; }

        .select-premium { 
          width: 100%; padding: 1.1rem 1.25rem; border-radius: 16px; 
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); 
          color: white; font-size: 1rem; appearance: none;
          cursor: pointer;
        }
        .select-premium option {
          background-color: #0d1117;
          color: white;
          padding: 10px;
        }
        .select-premium:focus { outline: none; border-color: var(--primary); }

        .input-control-premium { 
          width: 100%; padding: 1.1rem 1.25rem; border-radius: 16px; 
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); 
          color: white; font-size: 1rem;
        }
        .textarea-premium { 
          width: 100%; padding: 1.1rem 1.25rem; border-radius: 16px; height: 110px; resize: none;
          background: rgba(255,255,255,0.03); border: 1px solid rgba(255,255,255,0.1); 
          color: white; font-size: 1rem;
        }

        .btn-primary-register {
          width: 100%; padding: 1.25rem; border-radius: 18px; border: none;
          background: linear-gradient(135deg, var(--primary) 0%, #4a6a8a 100%);
          color: white; font-weight: 800; font-size: 1.2rem; display: flex; align-items: center;
          justify-content: center; gap: 1rem; cursor: pointer; transition: all 0.4s;
          box-shadow: 0 10px 30px rgba(101,131,154,0.3);
        }

        .docs-upload-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 1.5rem; margin-bottom: 2rem; }
        .doc-card-premium {
          padding: 2rem; border-radius: 20px; border: 1px dashed rgba(255,255,255,0.1);
          background: rgba(255,255,255,0.02); display: flex; align-items: center; gap: 1.5rem;
          cursor: pointer; transition: all 0.3s;
        }
        .doc-card-premium:hover { border-color: var(--primary); background: rgba(101,131,154,0.05); }
        .upload-icon-pulse { color: var(--primary); }
        .doc-info strong { display: block; font-size: 1rem; color: white; margin-bottom: 0.25rem; }
        .doc-info span { font-size: 0.8rem; color: var(--text-dim); }
      `}</style>
    </div>
  );
}
