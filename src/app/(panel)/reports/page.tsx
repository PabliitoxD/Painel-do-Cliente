"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { 
  BarChart3, 
  Download, 
  Calendar, 
  CheckCircle, 
  Clock, 
  DollarSign, 
  RefreshCw, 
  FileSpreadsheet, 
  Plus, 
  CreditCard, 
  Wallet, 
  ArrowUpRight, 
  FileText,
  Loader2
} from 'lucide-react';

interface PreviewItem {
  id: string;
  type: string;
  name: string;
  amount: string;
  date: string;
  status: string;
  extra?: string;
}

export default function ReportsPage() {
  const [selectedSources, setSelectedSources] = useState<string[]>([
    'transactions', 
    'charges', 
    'subscriptions', 
    'withdrawals', 
    'receivables'
  ]);
  
  const [dateRange, setDateRange] = useState({
    start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    end: new Date().toISOString().split('T')[0]
  });

  const [exportFormat, setExportFormat] = useState<'csv' | 'xlsx' | 'json'>('csv');
  const [activeTab, setActiveTab] = useState<string>('transactions');
  const [isExporting, setIsExporting] = useState(false);
  const [showNextBillings, setShowNextBillings] = useState(false);
  const [copiedNotification, setCopiedNotification] = useState(false);

  // Set the activeTab to the first selected source if the current one is unselected
  useEffect(() => {
    if (selectedSources.length > 0 && !selectedSources.includes(activeTab)) {
      setActiveTab(selectedSources[0]);
    }
  }, [selectedSources, activeTab]);

  const toggleSource = (source: string) => {
    if (selectedSources.includes(source)) {
      setSelectedSources(selectedSources.filter(s => s !== source));
    } else {
      setSelectedSources([...selectedSources, source]);
    }
  };

  const getFormatLabel = () => {
    if (exportFormat === 'csv') return 'CSV (Valores separados por vírgula)';
    if (exportFormat === 'xlsx') return 'Excel (XLSX Spreadsheet)';
    return 'JSON estruturado';
  };

  const mockData: Record<string, PreviewItem[]> = {
    transactions: [
      { id: 'TRX-9821', type: 'Venda', name: 'Ana Silva', amount: 'R$ 149,90', date: '12/06/2026', status: 'Aprovada', extra: 'Cartão de Crédito' },
      { id: 'TRX-8742', type: 'Estorno', name: 'Bruno Souza', amount: '-R$ 89,00', date: '11/06/2026', status: 'Processado', extra: 'Pix' },
      { id: 'TRX-7621', type: 'Venda', name: 'Carlos Lima', amount: 'R$ 299,90', date: '10/06/2026', status: 'Aguardando', extra: 'Boleto' },
      { id: 'TRX-6541', type: 'Saque', name: 'Transferência Própria', amount: '-R$ 500,00', date: '09/06/2026', status: 'Aprovada', extra: 'Transferência' }
    ],
    charges: [
      { id: 'COB-102', type: 'Cobrança Única', name: 'Diana Reis', amount: 'R$ 45,00', date: '15/06/2026', status: 'Pendente', extra: 'Link de Pagamento' },
      { id: 'COB-099', type: 'Cobrança Única', name: 'Eduardo Melo', amount: 'R$ 120,00', date: '08/06/2026', status: 'Pago', extra: 'Boleto Gerado' },
      { id: 'COB-095', type: 'Cobrança Única', name: 'Flávia Neves', amount: 'R$ 350,00', date: '02/06/2026', status: 'Pago', extra: 'Pix Manual' }
    ],
    subscriptions: [
      { id: 'REC-001', type: 'Plano Premium', name: 'Fernanda Costa', amount: 'R$ 59,90/mês', date: '28/06/2026', status: 'Ativa', extra: 'Cartão • Próximo ciclo' },
      { id: 'REC-002', type: 'Plano Basic', name: 'Gabriel Santos', amount: 'R$ 99,90/mês', date: '02/07/2026', status: 'Ativa', extra: 'Pix • Próximo ciclo' },
      { id: 'REC-003', type: 'Plano Pro', name: 'Helena Dias', amount: 'R$ 159,90/mês', date: '—', status: 'Cancelada', extra: 'Sem próximas cobranças' }
    ],
    next_billings: [
      { id: 'REC-001', type: 'Assinatura Mensal', name: 'Fernanda Costa', amount: 'R$ 59,90', date: '28/06/2026', status: 'Agendada', extra: 'Ciclo 03/12' },
      { id: 'REC-002', type: 'Assinatura Trimestral', name: 'Gabriel Santos', amount: 'R$ 99,90', date: '02/07/2026', status: 'Agendada', extra: 'Ciclo 02/04' },
      { id: 'REC-004', type: 'Assinatura Anual', name: 'Igor Rocha', amount: 'R$ 499,00', date: '18/06/2026', status: 'Agendada', extra: 'Renovação automática' }
    ],
    withdrawals: [
      { id: 'SAQ-871', type: 'Saque Conta', name: 'Banco Itaú S.A.', amount: 'R$ 1.500,00', date: '10/06/2026', status: 'Processado', extra: 'Pix para Chave CNPJ' },
      { id: 'SAQ-852', type: 'Saque Conta', name: 'Banco Cora S.A.', amount: 'R$ 750,00', date: '12/06/2026', status: 'Pendente', extra: 'Ted para Conta Corrente' }
    ],
    receivables: [
      { id: 'REC-998', type: 'Crédito Venda', name: 'Venda de Balcão', amount: 'R$ 485,00', date: '10/07/2026', status: 'A liberar', extra: 'Valor bruto: R$ 500,00' },
      { id: 'REC-981', type: 'Crédito Antecipado', name: 'Antecipação Manual', amount: 'R$ 194,00', date: '25/06/2026', status: 'Antecipado', extra: 'Valor bruto: R$ 200,00' }
    ]
  };

  const generateAndDownloadCSV = () => {
    setIsExporting(true);

    setTimeout(() => {
      let csvContent = "data:text/csv;charset=utf-8,";
      
      selectedSources.forEach(source => {
        const headerName = source.toUpperCase();
        csvContent += `\n=== RELATÓRIO DE ${headerName} ===\n`;
        
        if (source === 'subscriptions' && showNextBillings) {
          csvContent += "ID;Tipo;Cliente;Valor Previsto;Data Prevista;Status;Extra/Metodo\n";
          mockData.next_billings.forEach(item => {
            csvContent += `${item.id};${item.type};${item.name};${item.amount};${item.date};${item.status};${item.extra}\n`;
          });
        } else {
          csvContent += "ID;Tipo;Beneficiario/Cliente;Valor;Data/Vencimento;Status;Extra/Metodo\n";
          (mockData[source] || []).forEach(item => {
            csvContent += `${item.id};${item.type};${item.name};${item.amount};${item.date};${item.status};${item.extra}\n`;
          });
        }
      });

      const encodedUri = encodeURI(csvContent);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `relatorio_financeiro_${dateRange.start}_a_${dateRange.end}.${exportFormat}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setIsExporting(false);
      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 3000);
    }, 1500);
  };

  return (
    <DashboardLayout>
      <div className="animate-fade-in" style={{ padding: '1rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2.5rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>Relatórios Customizáveis</h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', marginTop: '0.3rem' }}>
              Configure os módulos, filtre por período e faça exportações integradas.
            </p>
          </div>
          
          <button 
            className="btn-primary" 
            onClick={generateAndDownloadCSV}
            disabled={selectedSources.length === 0 || isExporting}
            style={{ 
              display: 'flex', 
              alignItems: 'center', 
              gap: '0.6rem', 
              padding: '0.8rem 1.5rem', 
              borderRadius: '12px',
              fontWeight: 600,
              opacity: (selectedSources.length === 0 || isExporting) ? 0.6 : 1,
              transition: 'all 0.2s',
              boxShadow: '0 0 15px rgba(101, 131, 154, 0.25)'
            }}
          >
            {isExporting ? <Loader2 size={18} className="animate-spin" /> : <Download size={18} />}
            {isExporting ? 'Processando...' : 'Exportar Relatório'}
          </button>
        </div>

        {copiedNotification && (
          <div className="animate-fade-in" style={{ color: 'var(--text-main)', background: 'var(--success)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
            <CheckCircle size={20} />
            Relatório gerado e baixado com sucesso em formato .{exportFormat}!
          </div>
        )}

        <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '2rem' }}>
          
          {/* Lado Esquerdo - Filtros e Configuração */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
            
            {/* Box 1: Modulos de Dados */}
            <div className="glass-panel" style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <BarChart3 size={18} style={{ color: 'var(--primary)' }} />
                Escolha o que exportar
              </h2>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
                
                {/* Transações */}
                <div 
                  onClick={() => toggleSource('transactions')}
                  style={{
                    background: selectedSources.includes('transactions') ? 'rgba(101, 131, 154, 0.1)' : 'rgba(255,255,255,0.02)',
                    border: selectedSources.includes('transactions') ? '1px solid var(--primary)' : '1px solid var(--border)',
                    padding: '1rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Transações</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Vendas aprovadas, recusadas e estornos</p>
                  </div>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: '2px solid var(--primary)',
                    background: selectedSources.includes('transactions') ? 'var(--primary)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '10px'
                  }}>
                    {selectedSources.includes('transactions') && '✓'}
                  </div>
                </div>

                {/* Cobranças Únicas */}
                <div 
                  onClick={() => toggleSource('charges')}
                  style={{
                    background: selectedSources.includes('charges') ? 'rgba(101, 131, 154, 0.1)' : 'rgba(255,255,255,0.02)',
                    border: selectedSources.includes('charges') ? '1px solid var(--primary)' : '1px solid var(--border)',
                    padding: '1rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Cobranças Únicas</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Pix, cartões e boletos de faturas avulsas</p>
                  </div>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: '2px solid var(--primary)',
                    background: selectedSources.includes('charges') ? 'var(--primary)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '10px'
                  }}>
                    {selectedSources.includes('charges') && '✓'}
                  </div>
                </div>

                {/* Recorrência / Assinaturas */}
                <div 
                  onClick={() => toggleSource('subscriptions')}
                  style={{
                    background: selectedSources.includes('subscriptions') ? 'rgba(101, 131, 154, 0.1)' : 'rgba(255,255,255,0.02)',
                    border: selectedSources.includes('subscriptions') ? '1px solid var(--primary)' : '1px solid var(--border)',
                    padding: '1rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Recorrência e Assinaturas</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Contratos recorrentes e planos periódicos</p>
                  </div>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: '2px solid var(--primary)',
                    background: selectedSources.includes('subscriptions') ? 'var(--primary)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '10px'
                  }}>
                    {selectedSources.includes('subscriptions') && '✓'}
                  </div>
                </div>

                {/* Saques */}
                <div 
                  onClick={() => toggleSource('withdrawals')}
                  style={{
                    background: selectedSources.includes('withdrawals') ? 'rgba(101, 131, 154, 0.1)' : 'rgba(255,255,255,0.02)',
                    border: selectedSources.includes('withdrawals') ? '1px solid var(--primary)' : '1px solid var(--border)',
                    padding: '1rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Saques</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Histórico de solicitações de saque</p>
                  </div>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: '2px solid var(--primary)',
                    background: selectedSources.includes('withdrawals') ? 'var(--primary)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '10px'
                  }}>
                    {selectedSources.includes('withdrawals') && '✓'}
                  </div>
                </div>

                {/* Recebíveis */}
                <div 
                  onClick={() => toggleSource('receivables')}
                  style={{
                    background: selectedSources.includes('receivables') ? 'rgba(101, 131, 154, 0.1)' : 'rgba(255,255,255,0.02)',
                    border: selectedSources.includes('receivables') ? '1px solid var(--primary)' : '1px solid var(--border)',
                    padding: '1rem',
                    borderRadius: '10px',
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    transition: 'all 0.2s'
                  }}
                >
                  <div>
                    <h3 style={{ fontSize: '0.95rem', fontWeight: 600 }}>Recebíveis</h3>
                    <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.2rem' }}>Valores futuros e histórico de lançamentos</p>
                  </div>
                  <div style={{
                    width: '20px',
                    height: '20px',
                    borderRadius: '4px',
                    border: '2px solid var(--primary)',
                    background: selectedSources.includes('receivables') ? 'var(--primary)' : 'transparent',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    color: 'white',
                    fontSize: '10px'
                  }}>
                    {selectedSources.includes('receivables') && '✓'}
                  </div>
                </div>

              </div>
            </div>

            {/* Box 2: Periodo do Relatorio */}
            <div className="glass-panel" style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <Calendar size={18} style={{ color: 'var(--primary)' }} />
                Período do Relatório
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Data de Início</span>
                  <input 
                    type="date"
                    value={dateRange.start}
                    onChange={e => setDateRange({...dateRange, start: e.target.value})}
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '0.6rem 0.8rem', borderRadius: '8px', color: 'var(--text-main)', colorScheme: 'dark', outline: 'none', fontSize: '0.85rem' }}
                  />
                </div>
                
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <span style={{ fontSize: '0.75rem', color: 'var(--text-dim)' }}>Data de Fim</span>
                  <input 
                    type="date"
                    value={dateRange.end}
                    onChange={e => setDateRange({...dateRange, end: e.target.value})}
                    style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', padding: '0.6rem 0.8rem', borderRadius: '8px', color: 'var(--text-main)', colorScheme: 'dark', outline: 'none', fontSize: '0.85rem' }}
                  />
                </div>
              </div>
            </div>

            {/* Box 3: Formato de Saida */}
            <div className="glass-panel" style={{ background: 'var(--surface)', padding: '1.5rem', borderRadius: '16px', border: '1px solid var(--border)' }}>
              <h2 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <FileText size={18} style={{ color: 'var(--primary)' }} />
                Formato de Exportação
              </h2>
              
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '0.75rem' }}>
                {['csv', 'xlsx', 'json'].map(format => (
                  <button
                    key={format}
                    onClick={() => setExportFormat(format as any)}
                    style={{
                      background: exportFormat === format ? 'rgba(101, 131, 154, 0.15)' : 'rgba(255,255,255,0.02)',
                      border: exportFormat === format ? '1px solid var(--primary)' : '1px solid var(--border)',
                      padding: '0.8rem',
                      borderRadius: '8px',
                      color: exportFormat === format ? 'var(--text-main)' : 'var(--text-dim)',
                      fontWeight: 600,
                      textTransform: 'uppercase',
                      fontSize: '0.85rem',
                      transition: 'all 0.2s'
                    }}
                  >
                    {format}
                  </button>
                ))}
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-dim)', marginTop: '0.8rem', textAlign: 'center' }}>
                Será gerado um arquivo tipo {getFormatLabel()}.
              </p>
            </div>

          </div>

          {/* Lado Direito - Pré-visualização dos Dados */}
          <div className="glass-panel" style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border)', paddingBottom: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap', gap: '1rem' }}>
              <div>
                <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Pré-visualização Dinâmica</h2>
                <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginTop: '0.1rem' }}>Mostrando dados fictícios simulando o formato final.</p>
              </div>

              {/* Subscriptions special toggle */}
              {activeTab === 'subscriptions' && (
                <button
                  onClick={() => setShowNextBillings(!showNextBillings)}
                  style={{
                    background: showNextBillings ? 'rgba(101, 131, 154, 0.2)' : 'rgba(255,255,255,0.03)',
                    border: '1px solid var(--border)',
                    padding: '0.5rem 1rem',
                    borderRadius: '8px',
                    fontSize: '0.8rem',
                    color: 'var(--text-main)',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.5rem',
                    transition: 'all 0.2s'
                  }}
                >
                  <Clock size={14} style={{ color: 'var(--primary)' }} />
                  {showNextBillings ? 'Ver Assinaturas' : 'Acompanhar Próximas Cobranças'}
                </button>
              )}
            </div>

            {selectedSources.length === 0 ? (
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '4rem 1rem', color: 'var(--text-dim)' }}>
                <FileSpreadsheet size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                <p style={{ fontSize: '0.95rem' }}>Nenhum módulo selecionado.</p>
                <p style={{ fontSize: '0.8rem', marginTop: '0.2rem' }}>Selecione ao menos um tipo de dado à esquerda.</p>
              </div>
            ) : (
              <>
                {/* Tabs de Fontes de Dados Selecionadas */}
                <div style={{ display: 'flex', gap: '0.5rem', overflowX: 'auto', paddingBottom: '0.75rem', marginBottom: '1.5rem', borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                  {selectedSources.map(source => {
                    const labelMap: Record<string, string> = {
                      transactions: 'Transações',
                      charges: 'Cobranças Únicas',
                      subscriptions: 'Recorrência',
                      withdrawals: 'Saques',
                      receivables: 'Recebíveis'
                    };
                    return (
                      <button
                        key={source}
                        onClick={() => setActiveTab(source)}
                        style={{
                          background: activeTab === source ? 'var(--surface-hover)' : 'transparent',
                          border: 'none',
                          padding: '0.5rem 1rem',
                          borderRadius: '8px',
                          color: activeTab === source ? 'var(--primary)' : 'var(--text-dim)',
                          fontWeight: activeTab === source ? 600 : 400,
                          fontSize: '0.85rem',
                          whiteSpace: 'nowrap',
                          transition: 'all 0.2s'
                        }}
                      >
                        {labelMap[source] || source}
                      </button>
                    );
                  })}
                </div>

                {/* Tabela de Preview */}
                <div style={{ flex: 1, overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem', textAlign: 'left' }}>
                    <thead>
                      <tr style={{ color: 'var(--text-dim)', borderBottom: '1px solid var(--border)' }}>
                        <th style={{ padding: '0.75rem 1rem' }}>ID</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Tipo/Plano</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Beneficiário/Cliente</th>
                        <th style={{ padding: '0.75rem 1rem', textAlign: 'right' }}>Valor</th>
                        <th style={{ padding: '0.75rem 1rem' }}>{activeTab === 'subscriptions' ? 'Próxima Renovação' : activeTab === 'receivables' ? 'Liberação' : 'Data'}</th>
                        <th style={{ padding: '0.75rem 1rem' }}>Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {(showNextBillings && activeTab === 'subscriptions' ? mockData.next_billings : mockData[activeTab] || []).map((item) => (
                        <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', verticalAlign: 'middle' }}>
                          <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-dim)' }}>{item.id}</td>
                          <td style={{ padding: '1rem' }}>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                              <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.type}</span>
                              <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>{item.extra}</span>
                            </div>
                          </td>
                          <td style={{ padding: '1rem', color: 'var(--text-main)' }}>{item.name}</td>
                          <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700, color: item.amount.startsWith('-') ? 'var(--danger)' : 'var(--text-main)' }}>{item.amount}</td>
                          <td style={{ padding: '1rem', color: 'var(--text-main)' }}>{item.date}</td>
                          <td style={{ padding: '1rem' }}>
                            <span 
                              style={{ 
                                padding: '0.2rem 0.5rem', 
                                borderRadius: '6px', 
                                fontSize: '0.75rem', 
                                fontWeight: 600,
                                color: 'white',
                                background: ['Aprovada', 'Pago', 'Ativa', 'Processado', 'Antecipado'].includes(item.status) ? 'var(--success)' : 
                                            ['Pendente', 'A liberar', 'Aguardando', 'Agendada'].includes(item.status) ? 'var(--warning)' : 'var(--danger)'
                              }}
                            >
                              {item.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                <div style={{ padding: '1rem', background: 'rgba(255,255,255,0.01)', border: '1px dashed var(--border)', borderRadius: '10px', marginTop: '1.5rem', fontSize: '0.75rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <ArrowUpRight size={14} style={{ color: 'var(--primary)' }} />
                  <span>Dica: Para acompanhar as cobranças futuras das assinaturas, utilize o botão "Acompanhar Próximas Cobranças" na aba de Recorrência.</span>
                </div>
              </>
            )}

          </div>

        </div>

      </div>
    </DashboardLayout>
  );
}
