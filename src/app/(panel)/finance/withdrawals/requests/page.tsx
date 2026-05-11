"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/services/api';
import { 
  Wallet, 
  ArrowUpCircle, 
  Info,
  AlertCircle,
  Clock,
  RefreshCcw
} from 'lucide-react';
import { translateStatus, formatCurrency } from '@/utils/formatters';

export default function WithdrawalRequestsPage() {
  const [availableBalance, setAvailableBalance] = useState<number>(0);
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [pendingRequests, setPendingRequests] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isWithdrawing, setIsWithdrawing] = useState(false);

  const loadData = async () => {
    setIsLoading(true);
    try {
      const [summary, history] = await Promise.all([
        api.receivableSchedules.getSummary(),
        api.withdrawals.list()
      ]);

      if (summary) {
        setAvailableBalance(summary.released || summary.available || 0);
        setTotalBalance(summary.total || summary.amount || 0);
      }

      const historyData = Array.isArray(history) ? history : history.data || history.withdrawals || [];
      const pending = historyData.filter((w: any) => 
        ['pending', 'pendente', 'waiting', 'aguardando'].includes((w.status || '').toLowerCase())
      );
      setPendingRequests(pending);

    } catch (err) {
      console.error("Erro ao carregar dados de saque:", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const handleWithdraw = async () => {
    if (availableBalance < 50) {
      alert("Valor mínimo para saque é R$ 50,00");
      return;
    }
    
    setIsWithdrawing(true);
    try {
      await api.withdrawals.createWithdraw({ amount: availableBalance });
      alert("Saque solicitado com sucesso!");
      loadData();
    } catch (err: any) {
      alert(err.message || "Erro ao solicitar saque. Tente novamente.");
    } finally {
      setIsWithdrawing(false);
    }
  };

  return (
    <DashboardLayout>
      <div className="requests-page animate-fade-in">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Solicitações de Saque</h1>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Gerencie seus pedidos de resgate em aberto</p>
          </div>
          <button className="btn-ghost" onClick={loadData}>
            <RefreshCcw size={18} className={isLoading ? 'animate-spin' : ''} /> Atualizar
          </button>
        </div>

        <div className="stats-grid" style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1.5fr', gap: '1.5rem', marginBottom: '2rem' }}>
          <div className="stat-card" style={{ background: 'linear-gradient(135deg, var(--surface) 0%, #1a2932 100%)', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="stat-title">Disponível para Saque</span>
              <div className="stat-value" style={{ fontSize: '2.2rem' }}>
                {isLoading ? '...' : formatCurrency(availableBalance)}
              </div>
            </div>
            <div style={{ marginTop: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', gap: '0.5rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                <Info size={14} /> Mínimo: R$ 50,00
              </div>
              <button 
                className="btn-primary" 
                style={{ padding: '0.5rem 1rem', fontSize: '0.85rem' }}
                onClick={handleWithdraw}
                disabled={isWithdrawing || isLoading || availableBalance < 50}
              >
                {isWithdrawing ? 'Solicitando...' : <><ArrowUpCircle size={16} /> Novo Saque</>}
              </button>
            </div>
          </div>
          
          <div className="stat-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
            <div>
              <span className="stat-title">Saldo Total (Recebíveis)</span>
              <div className="stat-value" style={{ fontSize: '2.2rem' }}>
                {isLoading ? '...' : formatCurrency(totalBalance)}
              </div>
            </div>
            <p className="text-muted" style={{ fontSize: '0.8rem', marginTop: '1.5rem' }}>Inclui valores pendentes de liberação</p>
          </div>

          <div className="card" style={{ display: 'flex', alignItems: 'center', gap: '1.5rem', background: 'rgba(255, 177, 86, 0.05)', borderColor: 'rgba(255, 177, 86, 0.2)' }}>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'rgba(255, 177, 86, 0.1)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--warning)', flexShrink: 0 }}>
              <AlertCircle size={20} />
            </div>
            <div>
              <h3 style={{ fontSize: '0.95rem', marginBottom: '0.25rem' }}>Informação Importante</h3>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-dim)', maxWidth: '400px', lineHeight: 1.5 }}>
                Os saques são processados exclusivamente via PIX para a chave cadastrada na sua conta. O prazo médio de compensação é de até 2 horas.
              </p>
            </div>
          </div>
        </div>

        <h2 style={{ fontSize: '1.2rem', marginBottom: '1rem', fontWeight: 600 }}>Solicitações Pendentes</h2>
        <div className="table-card">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Data da Solicitação</th>
                <th>Valor Solicitado</th>
                <th>Status</th>
                <th>Previsão</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr><td colSpan={5} style={{ textAlign: 'center', padding: '2rem' }}>Carregando...</td></tr>
              ) : pendingRequests.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)' }}>
                    Nenhuma solicitação pendente no momento.
                  </td>
                </tr>
              ) : pendingRequests.map((item, i) => (
                <tr key={item.id || i}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <Clock size={16} className="text-muted" />
                      {new Date(item.created_at || item.date).toLocaleString('pt-BR')}
                    </div>
                  </td>
                  <td style={{ fontWeight: 600 }}>
                    {formatCurrency(parseFloat(item.amount || 0))}
                  </td>
                  <td>
                    <span className="status-pill aguardando">
                      {translateStatus(item.status)}
                    </span>
                  </td>
                  <td className="text-muted">Processando...</td>
                  <td>
                    <button className="btn-ghost" style={{ color: 'var(--danger)', fontSize: '0.8rem' }}>Cancelar</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <style jsx>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .animate-spin { animation: spin 1s linear infinite; }
        @media (max-width: 768px) {
          .stats-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </DashboardLayout>
  );
}
