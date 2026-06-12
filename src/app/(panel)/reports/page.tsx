"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/services/api';
import { formatCurrency, translateStatus, translateMethod } from '@/utils/formatters';
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
  Loader2,
  Lock,
  ChevronRight,
  Eye,
  Settings,
  HelpCircle,
  FileCheck
} from 'lucide-react';

interface PreviewItem {
  id: string;
  type: string;
  name: string;
  amount: number;
  date: string;
  status: string;
  extra?: string;
  raw: any;
}

export default function ReportsPage() {
  const [activeView, setActiveView] = useState<'generator' | 'presentation'>('generator');
  
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

  const [apiData, setApiData] = useState<Record<string, any[]>>({
    transactions: [],
    charges: [],
    subscriptions: [],
    next_billings: [],
    withdrawals: [],
    receivables: []
  });
  
  const [loadingMap, setLoadingMap] = useState<Record<string, boolean>>({});

  const toggleSource = (source: string) => {
    if (selectedSources.includes(source)) {
      setSelectedSources(selectedSources.filter(s => s !== source));
    } else {
      setSelectedSources([...selectedSources, source]);
    }
  };

  const fetchSourceData = async (source: string) => {
    setLoadingMap(prev => ({ ...prev, [source]: true }));
    try {
      if (source === 'transactions') {
        const res = await api.transactions.listOrders({
          created_at_gt: dateRange.start ? `${dateRange.start}T00:00:00Z` : undefined,
          created_at_lt: dateRange.end ? `${dateRange.end}T23:59:59Z` : undefined,
          per_page: 100
        }) as any;
        const data = res?.orders || res?.data?.orders || (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
        setApiData(prev => ({ ...prev, transactions: Array.isArray(data) ? data : [] }));
      } 
      else if (source === 'charges') {
        const res = await api.charges.list({ page: 1, per_page: 100 }) as any;
        const data = res?.charges || res?.data?.charges || res?.data || (Array.isArray(res) ? res : []);
        setApiData(prev => ({ ...prev, charges: Array.isArray(data) ? data : [] }));
      } 
      else if (source === 'subscriptions') {
        const res = await api.subscriptions.list({ page: 1, per_page: 100 }) as any;
        const data = res?.subscriptions || res?.data?.subscriptions || res?.data || (Array.isArray(res) ? res : []);
        setApiData(prev => ({ ...prev, subscriptions: Array.isArray(data) ? data : [] }));
      } 
      else if (source === 'next_billings') {
        const res = await api.invoices.list({ page: 1, per_page: 100 }) as any;
        const data = res?.invoices || res?.data?.invoices || res?.data || (Array.isArray(res) ? res : []);
        setApiData(prev => ({ ...prev, next_billings: Array.isArray(data) ? data : [] }));
      } 
      else if (source === 'withdrawals') {
        const res = await api.withdrawals.list({ per_page: 100 }) as any;
        const data = res?.withdraws || res?.data?.withdraws || res?.withdrawals || res?.data || (Array.isArray(res) ? res : []);
        setApiData(prev => ({ ...prev, withdrawals: Array.isArray(data) ? data : [] }));
      } 
      else if (source === 'receivables') {
        const res = await api.receivableSchedules.listSchedules() as any;
        const data = res?.data?.balanceControls || res?.data?.balance_controls || res?.balanceControls || res?.balance_controls || res?.data || [];
        setApiData(prev => ({ ...prev, receivables: Array.isArray(data) ? data : [] }));
      }
    } catch (err) {
      console.warn(`Erro ao carregar dados da API para o relatorio (${source}):`, err);
      setApiData(prev => ({ ...prev, [source]: [] }));
    } finally {
      setLoadingMap(prev => ({ ...prev, [source]: false }));
    }
  };

  // Trigger fetch when parameters or active tab changes
  useEffect(() => {
    if (activeView === 'generator') {
      const targetSource = (activeTab === 'subscriptions' && showNextBillings) ? 'next_billings' : activeTab;
      fetchSourceData(targetSource);
    }
  }, [activeTab, showNextBillings, dateRange.start, dateRange.end, activeView]);

  // Set the activeTab to the first selected source if the current one is unselected
  useEffect(() => {
    if (selectedSources.length > 0 && !selectedSources.includes(activeTab)) {
      setActiveTab(selectedSources[0]);
    }
  }, [selectedSources, activeTab]);

  const getFormatLabel = () => {
    if (exportFormat === 'csv') return 'CSV (Valores separados por ponto e vírgula)';
    if (exportFormat === 'xlsx') return 'Planilha Excel (XLSX)';
    return 'JSON estruturado';
  };

  const getMappedPreviewData = (): PreviewItem[] => {
    const targetSource = (activeTab === 'subscriptions' && showNextBillings) ? 'next_billings' : activeTab;
    const rawList = apiData[targetSource] || [];

    return rawList.map((item: any) => {
      if (targetSource === 'transactions') {
        return {
          id: item.token || item.id || 'N/A',
          type: item.payment_method || item.method || 'Venda',
          name: item.client || item.customer?.name || '—',
          amount: parseFloat(item.amount || item.value || item.transaction?.total || 0),
          date: item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : '—',
          status: translateStatus(item.status?.code || item.status),
          extra: translateMethod(item.payment_method || item.method || ''),
          raw: item
        };
      }
      if (targetSource === 'charges') {
        return {
          id: item.token || item.id || 'N/A',
          type: item.description || 'Cobrança',
          name: item.payer_name || item.payer_email || '—',
          amount: parseFloat(item.price || item.amount || 0),
          date: item.expiration_date || (item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : '—'),
          status: translateStatus(item.status),
          extra: item.payer_email || '',
          raw: item
        };
      }
      if (targetSource === 'subscriptions') {
        return {
          id: item.token || item.id || 'N/A',
          type: item.plan?.name || item.plan_name || 'Assinatura',
          name: item.customer?.name || item.payer_name || '—',
          amount: parseFloat(item.price || item.amount || 0),
          date: item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : '—',
          status: translateStatus(item.status),
          extra: item.plan?.code || '',
          raw: item
        };
      }
      if (targetSource === 'next_billings') {
        return {
          id: item.token || item.id || 'N/A',
          type: item.plan?.name || 'Ciclo de Recorrência',
          name: item.subscription?.customer?.name || item.customer?.name || '—',
          amount: parseFloat(item.amount || item.price || 0),
          date: item.due_date || (item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : '—'),
          status: translateStatus(item.status),
          extra: `Fatura Nª ${item.code || item.id}`,
          raw: item
        };
      }
      if (targetSource === 'withdrawals') {
        return {
          id: item.id || item.token || 'N/A',
          type: 'Saque Conta',
          name: item.bank_account?.holder_name || item.bank_account?.bank_name || 'Transferência',
          amount: parseFloat(item.amount || 0),
          date: item.created_at ? new Date(item.created_at).toLocaleDateString('pt-BR') : '—',
          status: translateStatus(item.status),
          extra: item.bank_account?.bank_name || '',
          raw: item
        };
      }
      if (targetSource === 'receivables') {
        return {
          id: item.id || item.token || 'N/A',
          type: item.type_description || item.description || 'Lançamento',
          name: 'Recebível Futuro',
          amount: parseFloat(item.net_amount || item.amount || 0),
          date: item.payment_date || item.date || '—',
          status: translateStatus(item.status),
          extra: item.type || '',
          raw: item
        };
      }
      return {
        id: '—',
        type: '—',
        name: '—',
        amount: 0,
        date: '—',
        status: '—',
        raw: item
      };
    });
  };

  const handleExport = async () => {
    setIsExporting(true);
    try {
      const exportData: Record<string, any[]> = {};
      
      await Promise.all(
        selectedSources.map(async (source) => {
          const target = (source === 'subscriptions' && showNextBillings) ? 'next_billings' : source;
          try {
            if (target === 'transactions') {
              const res = await api.transactions.listOrders({
                created_at_gt: dateRange.start ? `${dateRange.start}T00:00:00Z` : undefined,
                created_at_lt: dateRange.end ? `${dateRange.end}T23:59:59Z` : undefined,
                per_page: 250
              }) as any;
              exportData[target] = res?.orders || res?.data?.orders || (Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : []);
            } else if (target === 'charges') {
              const res = await api.charges.list({ page: 1, per_page: 250 }) as any;
              exportData[target] = res?.charges || res?.data?.charges || res?.data || [];
            } else if (target === 'subscriptions') {
              const res = await api.subscriptions.list({ page: 1, per_page: 250 }) as any;
              exportData[target] = res?.subscriptions || res?.data?.subscriptions || res?.data || [];
            } else if (target === 'next_billings') {
              const res = await api.invoices.list({ page: 1, per_page: 250 }) as any;
              exportData[target] = res?.invoices || res?.data?.invoices || res?.data || [];
            } else if (target === 'withdrawals') {
              const res = await api.withdrawals.list({ per_page: 250 }) as any;
              exportData[target] = res?.withdraws || res?.data?.withdraws || res?.withdrawals || res?.data || [];
            } else if (target === 'receivables') {
              const res = await api.receivableSchedules.listSchedules() as any;
              exportData[target] = res?.data?.balanceControls || res?.data?.balance_controls || res?.balanceControls || res?.balance_controls || res?.data || [];
            }
          } catch (e) {
            console.warn(`Falha na exportação real da API para ${target}:`, e);
            exportData[target] = [];
          }
        })
      );

      let fileContent = '';
      let mimeType = 'text/plain';
      
      if (exportFormat === 'json') {
        fileContent = JSON.stringify(exportData, null, 2);
        mimeType = 'application/json';
      } else {
        let csvContent = "";
        Object.entries(exportData).forEach(([sourceKey, list]) => {
          csvContent += `\n=== RELATORIO DE ${sourceKey.toUpperCase()} ===\n`;
          if (list.length === 0) {
            csvContent += "Nenhum dado encontrado para o periodo solicitado.\n";
            return;
          }
          
          const firstItem = list[0];
          const flatKeys = Object.keys(firstItem).filter(k => typeof firstItem[k] !== 'object');
          csvContent += flatKeys.join(';') + '\n';
          
          list.forEach(item => {
            const rowValues = flatKeys.map(k => {
              const val = item[k];
              if (val === undefined || val === null) return '';
              return String(val).replace(/;/g, ',');
            });
            csvContent += rowValues.join(';') + '\n';
          });
        });
        fileContent = csvContent;
        mimeType = 'text/csv';
      }

      const blob = new Blob([fileContent], { type: mimeType });
      const encodedUri = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.setAttribute("href", encodedUri);
      link.setAttribute("download", `relatorio_real_${dateRange.start}_a_${dateRange.end}.${exportFormat === 'xlsx' ? 'csv' : exportFormat}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(encodedUri);

      setCopiedNotification(true);
      setTimeout(() => setCopiedNotification(false), 5000);
    } catch (err) {
      console.error("Falha ao exportar relatório da API:", err);
    } finally {
      setIsExporting(false);
    }
  };

  const previewItems = getMappedPreviewData();
  const currentLoading = loadingMap[(activeTab === 'subscriptions' && showNextBillings) ? 'next_billings' : activeTab];

  return (
    <DashboardLayout>
      <div className="animate-fade-in reports-wrapper" style={{ padding: '1rem' }}>
        
        {/* Header */}
        <div className="reports-header-panel" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2rem', fontWeight: 800, color: 'var(--text-main)' }}>Relatórios Customizáveis</h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', marginTop: '0.3rem' }}>
              Configure os módulos, filtre por período e faça exportações integradas diretamente com a API.
            </p>
          </div>
          
          {activeView === 'generator' ? (
            <button 
              className="btn-primary" 
              onClick={handleExport}
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
          ) : (
            <button 
              className="btn-primary" 
              onClick={() => window.print()}
              style={{ 
                display: 'flex', 
                alignItems: 'center', 
                gap: '0.6rem', 
                padding: '0.8rem 1.5rem', 
                borderRadius: '12px',
                fontWeight: 600,
                transition: 'all 0.2s',
                boxShadow: '0 0 15px rgba(101, 131, 154, 0.25)'
              }}
            >
              <FileCheck size={18} />
              Imprimir / Salvar PDF
            </button>
          )}
        </div>

        {/* View Switcher Tabs */}
        <div className="switcher-container" style={{ display: 'flex', gap: '1rem', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem', marginBottom: '2.5rem' }}>
          <button
            onClick={() => setActiveView('generator')}
            style={{
              background: activeView === 'generator' ? 'rgba(101, 131, 154, 0.15)' : 'transparent',
              border: activeView === 'generator' ? '1px solid var(--primary)' : '1px solid transparent',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              color: activeView === 'generator' ? 'var(--primary)' : 'var(--text-dim)',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
          >
            Filtros & Exportações
          </button>
          <button
            onClick={() => setActiveView('presentation')}
            style={{
              background: activeView === 'presentation' ? 'rgba(101, 131, 154, 0.15)' : 'transparent',
              border: activeView === 'presentation' ? '1px solid var(--primary)' : '1px solid transparent',
              padding: '0.6rem 1.2rem',
              borderRadius: '8px',
              color: activeView === 'presentation' ? 'var(--primary)' : 'var(--text-dim)',
              fontWeight: 600,
              fontSize: '0.9rem',
              transition: 'all 0.2s',
              cursor: 'pointer'
            }}
          >
            Apresentação de Usabilidade (Tronnus vs Superfin)
          </button>
        </div>

        {activeView === 'generator' ? (
          <>
            {copiedNotification && (
              <div className="animate-fade-in" style={{ color: 'var(--text-main)', background: 'var(--success)', border: '1px solid rgba(255,255,255,0.1)', padding: '1rem', borderRadius: '12px', marginBottom: '1.5rem', display: 'flex', alignItems: 'center', gap: '0.75rem', fontWeight: 600 }}>
                <CheckCircle size={20} />
                Relatório gerado e baixado com sucesso diretamente da API!
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
                          transition: 'all 0.2s',
                          cursor: 'pointer'
                        }}
                      >
                        {format === 'xlsx' ? 'Excel' : format}
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
                    <h2 style={{ fontSize: '1.2rem', fontWeight: 700 }}>Pré-visualização da API</h2>
                    <p style={{ color: 'var(--text-dim)', fontSize: '0.75rem', marginTop: '0.1rem' }}>Dados reais obtidos através de consultas dinâmicas na API.</p>
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
                        transition: 'all 0.2s',
                        cursor: 'pointer'
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
                              transition: 'all 0.2s',
                              cursor: 'pointer'
                            }}
                          >
                            {labelMap[source] || source}
                          </button>
                        );
                      })}
                    </div>

                    {currentLoading ? (
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '4rem' }}>
                        <Loader2 size={36} className="animate-spin" style={{ color: 'var(--primary)' }} />
                      </div>
                    ) : previewItems.length === 0 ? (
                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', flex: 1, padding: '4rem 1rem', color: 'var(--text-dim)' }}>
                        <FileSpreadsheet size={48} style={{ opacity: 0.3, marginBottom: '1rem' }} />
                        <p style={{ fontSize: '0.95rem' }}>Nenhum registro encontrado na API.</p>
                      </div>
                    ) : (
                      <>
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
                              {previewItems.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid rgba(255,255,255,0.02)', verticalAlign: 'middle' }}>
                                  <td style={{ padding: '1rem', fontWeight: 600, color: 'var(--text-dim)' }}>{item.id}</td>
                                  <td style={{ padding: '1rem' }}>
                                    <div style={{ display: 'flex', flexDirection: 'column' }}>
                                      <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>{item.type}</span>
                                      <span style={{ fontSize: '0.7rem', color: 'var(--text-dim)', marginTop: '0.1rem' }}>{item.extra}</span>
                                    </div>
                                  </td>
                                  <td style={{ padding: '1rem', color: 'var(--text-main)' }}>{item.name}</td>
                                  <td style={{ padding: '1rem', textAlign: 'right', fontWeight: 700, color: item.amount < 0 ? 'var(--danger)' : 'var(--text-main)' }}>{formatCurrency(item.amount)}</td>
                                  <td style={{ padding: '1rem', color: 'var(--text-main)' }}>{item.date}</td>
                                  <td style={{ padding: '1rem' }}>
                                    <span 
                                      style={{ 
                                        padding: '0.2rem 0.5rem', 
                                        borderRadius: '6px', 
                                        fontSize: '0.75rem', 
                                        fontWeight: 600,
                                        color: 'white',
                                        background: ['Aprovada', 'Pago', 'Ativa', 'Processado', 'Antecipado', 'aprovada', 'pago', 'ativa', 'processado', 'antecipado'].includes(item.status.toLowerCase()) ? 'var(--success)' : 
                                                    ['Pendente', 'A liberar', 'Aguardando', 'Agendada', 'pendente', 'a liberar', 'aguardando', 'agendada'].includes(item.status.toLowerCase()) ? 'var(--warning)' : 'var(--danger)'
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
                          <span>Integração 100% ativa. Os dados acima refletem as informações estruturadas retornadas em tempo real pelas chaves configuradas na API.</span>
                        </div>
                      </>
                    )}

                  </>
                )}

              </div>

            </div>
          </>
        ) : (
          /* APRESENTAÇÃO DE USABILIDADE - TRONNUS VS SUPERFIN */
          <div className="presentation-view animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Introdução */}
            <div className="glass-panel presentation-card" style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', borderLeft: '4px solid var(--primary)' }}>
              <h2 style={{ fontSize: '1.3rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '0.5rem' }}>
                🚀 Relatório de Facilidades e Evolução do Painel
              </h2>
              <p style={{ color: 'var(--text-dim)', fontSize: '0.95rem', lineHeight: '1.6' }}>
                Abaixo, apresentamos uma visão clara e objetiva do impacto das otimizações na usabilidade da plataforma. Redesenhamos a interface da <strong>Superfin</strong> sob a marca da <strong>Tronnus</strong> focando em produtividade, leitura rápida e independência operacional para o produtor.
              </p>
            </div>

            {/* Comparativos Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '2rem' }} className="presentation-grid">
              
              {/* Card 1: Vendas em Modal */}
              <div className="glass-panel presentation-card" style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'rgba(101, 131, 154, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
                    <Eye size={20} style={{ color: 'var(--primary)' }} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Análise de Vendas (Detalhes)</h3>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                  <div style={{ background: 'rgba(255, 68, 68, 0.05)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--danger)', display: 'block', marginBottom: '0.5rem' }}>ANTES (Superfin Nativa)</span>
                    <p style={{ color: 'var(--text-dim)' }}>O painel redirecionava o usuário para uma nova página, obrigando-o a redefinir filtros e perder a posição de navegação na lista.</p>
                  </div>
                  <div style={{ background: 'rgba(49, 120, 44, 0.05)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(49, 120, 44, 0.1)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: '0.5rem' }}>AGORA (Tronnus Premium)</span>
                    <p style={{ color: 'var(--text-main)' }}>Abertura imediata dos detalhes em pop-up (modal) sobreposto. Fecha-se em um clique mantendo filtros e posição de rolagem.</p>
                  </div>
                </div>
                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                  💡 Impacto: Economia de tempo imediata. O produtor inspeciona dezenas de transações seguidas em segundos.
                </div>
              </div>

              {/* Card 2: Extrato Financeiro */}
              <div className="glass-panel presentation-card" style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'rgba(101, 131, 154, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
                    <DollarSign size={20} style={{ color: 'var(--primary)' }} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Identificação do Extrato</h3>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                  <div style={{ background: 'rgba(255, 68, 68, 0.05)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--danger)', display: 'block', marginBottom: '0.5rem' }}>ANTES (Superfin Nativa)</span>
                    <p style={{ color: 'var(--text-dim)' }}>Listagem crua indicando apenas "Entrada" ou "Saída", sem discernir o contexto ou tipo da movimentação do saldo.</p>
                  </div>
                  <div style={{ background: 'rgba(49, 120, 44, 0.05)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(49, 120, 44, 0.1)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: '0.5rem' }}>AGORA (Tronnus Premium)</span>
                    <p style={{ color: 'var(--text-main)' }}>Cada movimentação traz o selo descritivo correto (**Venda, Saque, Estorno ou Chargeback**) logo de cara na lista.</p>
                  </div>
                </div>
                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                  💡 Impacto: Conciliação ágil. O produtor entende para onde vai seu fluxo financeiro sem abrir transação por transação.
                </div>
              </div>

              {/* Card 3: Central de Relatórios */}
              <div className="glass-panel presentation-card" style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'rgba(101, 131, 154, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
                    <FileSpreadsheet size={20} style={{ color: 'var(--primary)' }} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Customização de Relatórios</h3>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                  <div style={{ background: 'rgba(255, 68, 68, 0.05)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--danger)', display: 'block', marginBottom: '0.5rem' }}>ANTES (Superfin Nativa)</span>
                    <p style={{ color: 'var(--text-dim)' }}>Não existia módulo dedicado. Dados precisavam ser colhidos de forma manual e individual por tela ou aba.</p>
                  </div>
                  <div style={{ background: 'rgba(49, 120, 44, 0.05)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(49, 120, 44, 0.1)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: '0.5rem' }}>AGORA (Tronnus Premium)</span>
                    <p style={{ color: 'var(--text-main)' }}>Módulo único centralizado. Escolha o que baixar em um único arquivo de forma segmentada e pré-visualize ao vivo.</p>
                  </div>
                </div>
                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                  💡 Impacto: Flexibilidade absoluta. Liberdade para construir planilhas limpas com as fontes exatas que o cliente necessita.
                </div>
              </div>

              {/* Card 4: Controle de Recorrência */}
              <div className="glass-panel presentation-card" style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'rgba(101, 131, 154, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
                    <RefreshCw size={20} style={{ color: 'var(--primary)' }} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Acompanhamento de Cobranças Futuras</h3>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                  <div style={{ background: 'rgba(255, 68, 68, 0.05)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--danger)', display: 'block', marginBottom: '0.5rem' }}>ANTES (Superfin Nativa)</span>
                    <p style={{ color: 'var(--text-dim)' }}>Planos e assinaturas eram expostos de forma crua, sem opção fácil para saber quando ocorreriam as próximas cobranças.</p>
                  </div>
                  <div style={{ background: 'rgba(49, 120, 44, 0.05)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(49, 120, 44, 0.1)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: '0.5rem' }}>AGORA (Tronnus Premium)</span>
                    <p style={{ color: 'var(--text-main)' }}>Seletor dedicado que compõe a agenda das faturas previstas para os próximos dias de forma cronológica.</p>
                  </div>
                </div>
                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                  💡 Impacto: Previsibilidade financeira. Permite ao cliente dimensionar o caixa futuro com faturamento recorrente.
                </div>
              </div>

              {/* Card 5: Filtros com Contraste */}
              <div className="glass-panel presentation-card" style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'rgba(101, 131, 154, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
                    <Calendar size={20} style={{ color: 'var(--primary)' }} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Filtros & Leitura Confortável</h3>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                  <div style={{ background: 'rgba(255, 68, 68, 0.05)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--danger)', display: 'block', marginBottom: '0.5rem' }}>ANTES (Superfin Nativa)</span>
                    <p style={{ color: 'var(--text-dim)' }}>Menus com pouco destaque e opções cinzas em fundo escuro, gerando dificuldade de leitura nos seletores.</p>
                  </div>
                  <div style={{ background: 'rgba(49, 120, 44, 0.05)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(49, 120, 44, 0.1)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: '0.5rem' }}>AGORA (Tronnus Premium)</span>
                    <p style={{ color: 'var(--text-main)' }}>Destaque vibrante nos filtros ativos e texto em alto contraste (branco brilhante) para leitura confortável.</p>
                  </div>
                </div>
                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                  💡 Impacto: Ergonomia visual. Elimina erros por má leitura das faixas de data selecionadas.
                </div>
              </div>

              {/* Card 6: Autonomia no Saque */}
              <div className="glass-panel presentation-card" style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', border: '1px solid var(--border)', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                  <div style={{ background: 'rgba(101, 131, 154, 0.1)', padding: '0.5rem', borderRadius: '8px' }}>
                    <Lock size={20} style={{ color: 'var(--primary)' }} />
                  </div>
                  <h3 style={{ fontSize: '1.1rem', fontWeight: 700 }}>Independência Operacional</h3>
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.85rem' }}>
                  <div style={{ background: 'rgba(255, 68, 68, 0.05)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(239, 68, 68, 0.1)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--danger)', display: 'block', marginBottom: '0.5rem' }}>ANTES (Superfin Nativa)</span>
                    <p style={{ color: 'var(--text-dim)' }}>Impossível ao usuário desfazer solicitações incorretas de saques, gerando tickets e trabalho para o suporte.</p>
                  </div>
                  <div style={{ background: 'rgba(49, 120, 44, 0.05)', padding: '1rem', borderRadius: '10px', border: '1px solid rgba(49, 120, 44, 0.1)' }}>
                    <span style={{ fontWeight: 700, color: 'var(--primary)', display: 'block', marginBottom: '0.5rem' }}>AGORA (Tronnus Premium)</span>
                    <p style={{ color: 'var(--text-main)' }}>Ativação correta da rota de cancelamento autônomo. O próprio usuário desfaz operações em aberto com segurança.</p>
                  </div>
                </div>
                <div style={{ borderTop: '1px dashed var(--border)', paddingTop: '0.75rem', fontSize: '0.8rem', color: 'var(--primary)', fontWeight: 600 }}>
                  💡 Impacto: Diminuição de custos operacionais. Libera a equipe de suporte para focar em tarefas de maior valor.
                </div>
              </div>

            </div>

            {/* Rodapé institucional */}
            <div style={{ textAlign: 'center', color: 'var(--text-dim)', fontSize: '0.8rem', padding: '1rem 0' }}>
              Painel Tronnus Premium White-Label © 2026. Todos os direitos reservados.
            </div>

          </div>
        )}

      </div>

      <style jsx>{`
        .reports-header-panel h1 {
          color: var(--text-main);
        }
        .filter-item {
          color: var(--text-main) !important;
          background: transparent;
          border: none;
          cursor: pointer;
          transition: all 0.2s;
        }
        .filter-item:hover {
          background: var(--surface-hover) !important;
          color: white !important;
        }
        .filter-item.active {
          background: var(--primary) !important;
          color: white !important;
        }

        @media print {
          /* Custom layout overrides for print */
          :global(aside), :global(header), :global(nav), :global(.sidebar), :global(.header-panel), .reports-header-panel button, .switcher-container {
            display: none !important;
          }
          :global(main), :global(.main-content), :global(.dashboard-container) {
            padding: 0 !important;
            margin: 0 !important;
            width: 100% !important;
            max-width: 100% !important;
            background: #ffffff !important;
            color: #000000 !important;
          }
          .reports-wrapper {
            padding: 2rem !important;
            color: #000000 !important;
          }
          .reports-header-panel h1 {
            color: #000000 !important;
            font-size: 2.2rem !important;
          }
          .reports-header-panel p {
            color: #475569 !important;
          }
          .presentation-card {
            background: #ffffff !important;
            border: 1px solid #cbd5e1 !important;
            color: #000000 !important;
            box-shadow: none !important;
            page-break-inside: avoid;
            margin-bottom: 2rem !important;
            padding: 1.5rem !important;
          }
          .presentation-card h2, .presentation-card h3 {
            color: #0f172a !important;
          }
          .presentation-card p {
            color: #334155 !important;
          }
          .presentation-grid {
            display: grid !important;
            grid-template-columns: 1fr !important;
            gap: 1.5rem !important;
          }
          div[style*="rgba(255, 68, 68, 0.05)"] {
            background: #fef2f2 !important;
            border: 1px solid #fee2e2 !important;
            color: #000000 !important;
          }
          div[style*="rgba(49, 120, 44, 0.05)"] {
            background: #f0fdf4 !important;
            border: 1px solid #dcfce7 !important;
            color: #000000 !important;
          }
          div[style*="rgba(49, 120, 44, 0.05)"] span {
            color: #15803d !important;
          }
          div[style*="rgba(255, 68, 68, 0.05)"] span {
            color: #b91c1c !important;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
