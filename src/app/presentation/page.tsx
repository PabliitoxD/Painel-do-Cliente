"use client";

import { 
  ArrowLeft, 
  Eye, 
  DollarSign, 
  FileSpreadsheet, 
  RefreshCw, 
  Calendar, 
  Lock, 
  FileCheck,
  CheckCircle,
  TrendingUp,
  X
} from 'lucide-react';
import Link from 'next/link';

export default function PresentationPage() {
  return (
    <div style={{ minHeight: '100vh', background: '#020507', color: '#F8FAFC', padding: '2rem 1rem', fontFamily: 'sans-serif' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto', display: 'flex', flexDirection: 'column', gap: '2.5rem' }}>
        
        {/* Header da Apresentação */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', borderBottom: '1px solid rgba(255,255,255,0.05)', paddingBottom: '1.5rem' }}>
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem', marginBottom: '0.5rem' }}>
              <span style={{ background: 'rgba(101, 131, 154, 0.15)', color: '#65839a', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(101, 131, 154, 0.3)' }}>
                White-Label Premium
              </span>
              <span style={{ background: 'rgba(49, 120, 44, 0.15)', color: '#31782c', padding: '0.4rem 0.8rem', borderRadius: '20px', fontSize: '0.8rem', fontWeight: 700, border: '1px solid rgba(49, 120, 44, 0.3)' }}>
                Vendas & Finanças
              </span>
            </div>
            <h1 style={{ fontSize: '2.5rem', fontWeight: 800, color: 'white', letterSpacing: '-0.025em' }}>
              Painel Tronnus vs. Painel Superfin
            </h1>
            <p style={{ color: '#64748B', fontSize: '1rem', marginTop: '0.4rem' }}>
              Relatório visual demonstrando as melhorias de usabilidade e o impacto prático na rotina do cliente.
            </p>
          </div>

          <div style={{ display: 'flex', gap: '0.75rem' }} className="no-print">
            <button 
              onClick={() => window.print()}
              style={{
                background: '#65839a',
                color: 'white',
                border: 'none',
                padding: '0.75rem 1.5rem',
                borderRadius: '10px',
                fontWeight: 600,
                fontSize: '0.9rem',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center',
                gap: '0.5rem',
                boxShadow: '0 4px 12px rgba(101, 131, 154, 0.2)'
              }}
            >
              <FileCheck size={18} />
              Imprimir / Salvar PDF
            </button>
          </div>
        </div>

        {/* Resumo executivo */}
        <div style={{ background: 'rgba(11, 17, 20, 0.8)', padding: '2rem', borderRadius: '16px', border: '1px solid rgba(255,255,255,0.05)', display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }} className="intro-card">
          <div style={{ background: 'rgba(101, 131, 154, 0.1)', padding: '1rem', borderRadius: '12px', color: '#65839a' }}>
            <TrendingUp size={32} />
          </div>
          <div>
            <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'white', marginBottom: '0.5rem' }}>A Experiência do Cliente Elevada ao Próximo Nível</h2>
            <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: '1.6' }}>
              A plataforma original da Superfin oferece a robustez técnica necessária na API, mas carece de uma experiência visual dinâmica e intuitiva para produtores que lidam com centenas de vendas por dia. O painel da <strong>Tronnus</strong> redesenha essa rotina operacional, eliminando a lentidão, melhorando a leitura de dados financeiros cruciais e agregando inteligência operacional autónoma diretamente nas mãos do produtor.
            </p>
          </div>
        </div>

        {/* Grid dos Comparativos */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
          
          {/* Item 1: Vendas em Modal com Imagem */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem', alignItems: 'center' }} className="comparison-row">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Eye size={22} style={{ color: '#65839a' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>1. Detalhes da Venda sem Perder a Navegação</h2>
              </div>
              
              <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Em vez de retirar o cliente da lista para ver os detalhes da compra, agora uma janela flutuante se abre por cima da tabela de vendas, mantendo a listagem intacta.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#ef4444', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>⚠️ Como era (Superfin Nativo):</span>
                  O usuário clicava para ver os dados de frete ou cartão e era levado a outra página. Para analisar a próxima venda, precisava recarregar a lista e reconfigurar filtros.
                </div>
                <div style={{ background: 'rgba(49, 120, 44, 0.05)', border: '1px solid rgba(49, 120, 44, 0.15)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#65839a', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>🚀 Como ficou (Tronnus Premium):</span>
                  Detalhes mostrados em modal sobreposto com layout completo e linha do tempo de status de entrega. O produtor fecha a janela e continua auditando as vendas sem perder o foco.
                </div>
              </div>
            </div>
            
            <div style={{ background: 'rgba(11, 17, 20, 0.5)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '0.5rem', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
              <img 
                src="/media__1781278837526.png" 
                alt="Modal de Detalhes da Transação com Linha do Tempo" 
                style={{ width: '100%', borderRadius: '8px', display: 'block' }}
              />
              <span style={{ display: 'block', textAlign: 'center', fontSize: '0.75rem', color: '#64748B', marginTop: '0.5rem', fontStyle: 'italic' }}>
                Imagem Real: Linha do tempo e detalhamento de taxas no modal Tronnus
              </span>
            </div>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid rgba(255,255,255,0.03)' }} />

          {/* Item 2: Filtros Inteligentes e Contraste com Imagem */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2.5rem', alignItems: 'center' }} className="comparison-row reverse-row">
            <div style={{ background: 'rgba(11, 17, 20, 0.5)', border: '1px solid rgba(255,255,255,0.05)', borderRadius: '12px', padding: '0.5rem', overflow: 'hidden', boxShadow: '0 20px 25px -5px rgba(0,0,0,0.5)' }}>
              <img 
                src="/media__1781276992717.png" 
                alt="Destaque de Filtros e Contraste do Menu Suspenso" 
                style={{ width: '100%', borderRadius: '8px', display: 'block' }}
              />
              <span style={{ display: 'block', textAlign: 'center', fontSize: '0.75rem', color: '#64748B', marginTop: '0.5rem', fontStyle: 'italic' }}>
                Imagem Real: Filtros destacados e opções do menu em alto contraste claro
              </span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={22} style={{ color: '#65839a' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>2. Filtros Destacados e Leitura Confortável</h2>
              </div>
              
              <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: '1.6' }}>
                As regras de filtragem ganharam destaque visual que facilita saber instantaneamente se a lista está filtrada ou geral, com texto em alto contraste para leitura rápida.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#ef4444', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>⚠️ Como era (Superfin Nativo):</span>
                  Opções de filtro tinham baixo destaque e a cor das fontes no menu escuro era quase preta, dificultando a leitura em telas mais brilhantes.
                </div>
                <div style={{ background: 'rgba(49, 120, 44, 0.05)', border: '1px solid rgba(49, 120, 44, 0.15)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#65839a', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>🚀 Como ficou (Tronnus Premium):</span>
                  Filtros ativos ganham borda e fundo em destaque. As opções dos dropdowns utilizam cor branca brilhante de alto contraste, e o seletor de datas personalizadas se adapta ao tema escuro.
                </div>
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid rgba(255,255,255,0.03)' }} />

          {/* Item 3: Relatorios e Acompanhamento de Assinaturas */}
          <div style={{ display: 'grid', gridTemplateColumns: '1.2fr 1fr', gap: '2.5rem', alignItems: 'center' }} className="comparison-row">
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileSpreadsheet size={22} style={{ color: '#65839a' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>3. Central de Relatórios Unificada e Real</h2>
              </div>
              
              <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Disponibilizamos uma página independente e exclusiva onde o cliente cruza fontes de dados variadas (vendas, saques, assinaturas) para compor seu próprio relatório gerencial.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#ef4444', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>⚠️ Como era (Superfin Nativo):</span>
                  Informações isoladas por aba e exportações básicas manuais, o que forçava o cliente a realizar cruzamentos manuais complexos no Excel.
                </div>
                <div style={{ background: 'rgba(49, 120, 44, 0.05)', border: '1px solid rgba(49, 120, 44, 0.15)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#65839a', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>🚀 Como ficou (Tronnus Premium):</span>
                  Seletor dinâmico que integra com o faturamento real da API e permite baixar arquivos consolidados em formato CSV, Excel e JSON. Inclui ferramenta de <strong>Acompanhamento de Próximas Cobranças</strong> de contratos ativos.
                </div>
              </div>
            </div>

            <div style={{ background: 'rgba(11, 17, 20, 0.8)', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1.25rem' }}>
              <h4 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'white' }}>Módulos de Relatório Integrados:</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.85rem' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <span>📈 Transações</span>
                  <span style={{ color: '#31782c', fontWeight: 600 }}>Real • Conectado</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <span>💸 Cobranças Únicas</span>
                  <span style={{ color: '#31782c', fontWeight: 600 }}>Real • Conectado</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <span>🔄 Recorrência & Planos</span>
                  <span style={{ color: '#31782c', fontWeight: 600 }}>Real • Conectado</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <span>📅 Próximas Faturas Previstas</span>
                  <span style={{ color: '#31782c', fontWeight: 600 }}>Real • Conectado</span>
                </div>
                <div style={{ display: 'flex', justifyContent: 'space-between', padding: '0.5rem', background: 'rgba(255,255,255,0.02)', borderRadius: '6px' }}>
                  <span>🏦 Histórico de Saques</span>
                  <span style={{ color: '#31782c', fontWeight: 600 }}>Real • Conectado</span>
                </div>
              </div>
            </div>
          </div>

          <hr style={{ border: 'none', borderBottom: '1px solid rgba(255,255,255,0.03)' }} />

          {/* Item 4: Extratos, Saques e Autonomia */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1.2fr', gap: '2.5rem', alignItems: 'center' }} className="comparison-row reverse-row">
            <div style={{ background: 'rgba(11, 17, 20, 0.8)', border: '1px solid rgba(255,255,255,0.05)', padding: '2rem', borderRadius: '16px', display: 'flex', flexDirection: 'column', gap: '1rem', fontStyle: 'italic', fontSize: '0.9rem', color: '#94A3B8' }}>
              <p>"Eu precisava exportar e cruzar dados de saques e extratos toda semana para prestar contas, mas o painel antigo indicava apenas 'entrada/saída' sem rótulos e travava se eu tentasse cancelar um saque solicitado incorretamente. Com o painel Tronnus eu resolvo isso de forma imediata e sem abrir chamados."</p>
              <span style={{ fontSize: '0.8rem', fontWeight: 700, color: 'white', fontStyle: 'normal' }}>— Depoimento de Usabilidade do Produtor</span>
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Lock size={22} style={{ color: '#65839a' }} />
                <h2 style={{ fontSize: '1.5rem', fontWeight: 700 }}>4. Autonomia de Saques e Extratos Inteligentes</h2>
              </div>
              
              <p style={{ color: '#94A3B8', fontSize: '0.95rem', lineHeight: '1.6' }}>
                A experiência financeira foi facilitada através de rotulagem inteligente e controle transparente de ações críticas, como o cancelamento de transferências.
              </p>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', marginTop: '0.5rem' }}>
                <div style={{ background: 'rgba(239, 68, 68, 0.05)', border: '1px solid rgba(239, 68, 68, 0.15)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#ef4444', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>⚠️ Como era (Superfin Nativo):</span>
                  Caso houvesse um erro de digitação na conta bancária durante o saque, a ação de cancelamento retornava falha no servidor (erro 500) e obrigava o produtor a contatar o suporte técnico.
                </div>
                <div style={{ background: 'rgba(49, 120, 44, 0.05)', border: '1px solid rgba(49, 120, 44, 0.15)', padding: '0.75rem 1rem', borderRadius: '8px', fontSize: '0.85rem' }}>
                  <span style={{ color: '#65839a', fontWeight: 700, display: 'block', marginBottom: '0.2rem' }}>🚀 Como ficou (Tronnus Premium):</span>
                  Ativação de rotas inteligentes de cancelamento. O cliente clica no botão, cancela o saque pendente em tempo real e re-solicita a transferência de forma imediata e sem atrito.
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Rodapé da Apresentação */}
        <div style={{ borderTop: '1px solid rgba(255,255,255,0.05)', paddingTop: '2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', color: '#64748B', fontSize: '0.85rem' }}>
          <span>Painel Tronnus White-Label Premium © 2026</span>
          <Link href="/dashboard" style={{ color: '#65839a', textDecoration: 'none', display: 'flex', alignItems: 'center', gap: '0.25rem' }} className="no-print">
            Voltar para o Painel <ArrowLeft size={16} style={{ transform: 'rotate(180deg)' }} />
          </Link>
        </div>

      </div>

      <style jsx global>{`
        @media print {
          body {
            background: #ffffff !important;
            color: #000000 !important;
          }
          .no-print {
            display: none !important;
          }
          div[style*="#020507"] {
            background: #ffffff !important;
            color: #000000 !important;
            padding: 0 !important;
          }
          h1, h2, h3, h4, span[style*="white"] {
            color: #0f172a !important;
          }
          p, span {
            color: #334155 !important;
          }
          .intro-card {
            background: #ffffff !important;
            border: 1px solid #cbd5e1 !important;
            box-shadow: none !important;
            color: #000000 !important;
            padding: 1.5rem !important;
          }
          .comparison-row {
            display: flex !important;
            flex-direction: column !important;
            gap: 1.5rem !important;
            page-break-inside: avoid !important;
            margin-bottom: 2rem !important;
          }
          .reverse-row {
            flex-direction: column-reverse !important;
          }
          div[style*="rgba(11, 17, 20, 0.5)"], div[style*="rgba(11, 17, 20, 0.8)"] {
            background: #ffffff !important;
            border: 1px solid #cbd5e1 !important;
            box-shadow: none !important;
            color: #000000 !important;
          }
          div[style*="rgba(255, 68, 68, 0.05)"] {
            background: #fef2f2 !important;
            border: 1px solid #fee2e2 !important;
            color: #000000 !important;
          }
          div[style*="rgba(255, 68, 68, 0.05)"] span {
            color: #b91c1c !important;
          }
          div[style*="rgba(49, 120, 44, 0.05)"] {
            background: #f0fdf4 !important;
            border: 1px solid #dcfce7 !important;
            color: #000000 !important;
          }
          div[style*="rgba(49, 120, 44, 0.05)"] span {
            color: #15803d !important;
          }
          div[style*="rgba(255,255,255,0.02)"] {
            background: #f8fafc !important;
            border: 1px solid #e2e8f0 !important;
          }
          div[style*="rgba(255,255,255,0.02)"] span[style*="color: '#31782c'"] {
            color: #15803d !important;
          }
        }
      `}</style>
    </div>
  );
}
