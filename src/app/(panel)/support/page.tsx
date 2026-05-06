"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { MessageCircle, PhoneCall, Send, HelpCircle } from 'lucide-react';
import '@/styles/support.css';

export default function SupportPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    accountId: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulação de envio
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitted(true);
      setFormData({ name: '', email: '', accountId: '', message: '' });
      setTimeout(() => setSubmitted(false), 3000);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="support-container animate-fade-in">
        
        {/* Lado Esquerdo - Informações de Contato */}
        <div className="support-info-card card glass-panel">
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '1rem' }}>
            <HelpCircle size={28} style={{ color: 'var(--primary)' }} />
            <h1 className="support-title" style={{ marginBottom: 0 }}>Central de Suporte</h1>
          </div>
          <p className="support-subtitle">
            Estamos aqui para ajudar! Escolha um de nossos canais de atendimento direto ou abra um ticket para nossa equipe técnica.
          </p>

          <div className="contact-options">
            <div className="contact-method" style={{ cursor: 'default' }}>
              <div className="contact-icon-wrapper whatsapp-icon">
                <MessageCircle size={24} />
              </div>
              <div className="contact-details">
                <h3>Grupo do WhatsApp</h3>
                <p>Direcione-se ao seu grupo de WhatsApp exclusivo para suporte rápido.</p>
              </div>
            </div>

            <a href="https://wa.me/5511916095527" target="_blank" rel="noopener noreferrer" className="contact-method">
              <div className="contact-icon-wrapper phone-icon">
                <PhoneCall size={24} />
              </div>
              <div className="contact-details">
                <h3>Atendimento Direto</h3>
                <p>(11) 91609-5527</p>
              </div>
            </a>
          </div>
        </div>

        {/* Lado Direito - Abertura de Ticket */}
        <div className="support-ticket-card card glass-panel">
          <h2 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-main)' }}>Abrir Chamado</h2>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.95rem', marginTop: '0.5rem' }}>
            Preencha os detalhes abaixo e nossa equipe retornará por e-mail.
          </p>

          <form className="support-form" onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="name">Nome Completo</label>
              <input 
                type="text" 
                id="name" 
                required 
                placeholder="Seu nome"
                value={formData.name}
                onChange={(e) => setFormData({...formData, name: e.target.value})}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1.25rem' }}>
              <div className="form-group">
                <label htmlFor="email">E-mail</label>
                <input 
                  type="email" 
                  id="email" 
                  required 
                  placeholder="seu@email.com"
                  value={formData.email}
                  onChange={(e) => setFormData({...formData, email: e.target.value})}
                />
              </div>

              <div className="form-group">
                <label htmlFor="accountId">ID da Conta</label>
                <input 
                  type="text" 
                  id="accountId" 
                  placeholder="Opcional"
                  value={formData.accountId}
                  onChange={(e) => setFormData({...formData, accountId: e.target.value})}
                />
              </div>
            </div>

            <div className="form-group">
              <label htmlFor="message">Qual a sua dúvida?</label>
              <textarea 
                id="message" 
                required 
                placeholder="Descreva detalhadamente o que você precisa..."
                value={formData.message}
                onChange={(e) => setFormData({...formData, message: e.target.value})}
              />
            </div>

            <button 
              type="submit" 
              className="btn-primary" 
              disabled={isSubmitting}
              style={{ marginTop: '0.5rem', opacity: isSubmitting ? 0.7 : 1 }}
            >
              {isSubmitting ? 'Enviando...' : submitted ? 'Chamado Enviado!' : (
                <>
                  <Send size={18} />
                  Enviar Chamado
                </>
              )}
            </button>
          </form>
        </div>

      </div>
    </DashboardLayout>
  );
}
