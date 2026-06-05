"use client";

import { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { api } from '@/services/api';
import { 
  History, 
  CheckCircle2, 
  Clock, 
  XCircle,
  Download,
  Calendar,
  Eye,
  X,
  AlertTriangle
} from 'lucide-react';
import { translateStatus, formatCurrency, getStatusPillClass } from '@/utils/formatters';

export default function WithdrawalHistoryPage() {
  const [history, setHistory] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedDetails, setSelectedDetails] = useState<any>(null);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);

  const loadHistory = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const res = await api.withdrawals.list({ per_page: 1000 });
      const dataRes = res?.withdraws || res?.data?.withdraws || res?.withdrawals || res?.data || (Array.isArray(res) ? res : []);
      const data = Array.isArray(dataRes) ? dataRes : [];
      setHistory(data);
    } catch (err: any) {
      console.warn("Erro ao buscar histórico de saques (silenciado):", err);
      setHistory([]); // Garante que a lista fique vazia em vez de dar erro
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    loadHistory();
  }, []);

  useEffect(() => {
    setPage(1);
  }, [history]);

  const paginatedHistory = useMemo(() => {
    const start = (page - 1) * 50;
    return history.slice(start, start + 50);
  }, [history, page]);

  const totalPages = Math.ceil(history.length / 50) || 1;

  return (
    <DashboardLayout>
      <div className="history-page animate-fade-in">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem' }}>Histórico de Saques</h1>
            <p className="text-muted" style={{ fontSize: '0.9rem' }}>Consulte todos os seus resgates realizados</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button className="btn-ghost" onClick={loadHistory}>
              <Calendar size={18} /> Atualizar
            </button>
            <button className="btn-primary">
              <Download size={18} /> Exportar
            </button>
          </div>
        </div>

        {error && (
          <div className="card" style={{ background: 'rgba(239, 68, 68, 0.1)', border: '1px solid rgba(239, 68, 68, 0.2)', color: '#ef4444', padding: '1rem', marginBottom: '2rem', borderRadius: '12px', display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
            <AlertTriangle size={20} />
            {error}
          </div>
        )}

        <div className="table-card">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Data / Hora</th>
                <th>Valor Solicitado</th>
                <th>Taxa</th>
                <th>Líquido</th>
                <th>Status</th>
                <th>Ações</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    Carregando histórico...
                  </td>
                </tr>
              ) : paginatedHistory.length === 0 ? (
                <tr>
                  <td colSpan={6} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    Nenhum saque encontrado.
                  </td>
                </tr>
              ) : paginatedHistory.map((item, i) => {
                const amount = parseFloat(item.amount || 0);
                const fee = parseFloat(item.taxFee || item.fee || 0);
                const net = amount - fee;
                
                return (
                  <tr key={item.id || i}>
                    <td>
                      <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                        <History size={16} className="text-muted" />
                        {new Date(item.created_at || item.createdAt || item.date).toLocaleString('pt-BR')}
                      </div>
                    </td>
                    <td style={{ fontWeight: 600 }}>{formatCurrency(amount)}</td>
                    <td style={{ color: 'var(--danger)' }}>- {formatCurrency(fee)}</td>
                    <td style={{ fontWeight: 600, color: 'var(--success)' }}>{formatCurrency(net)}</td>
                    <td>
                      <span className={`status-pill ${getStatusPillClass(item.status)}`}>
                        {translateStatus(item.status)}
                      </span>
                    </td>
                    <td>
                      <button 
                        className="btn-ghost" 
                        onClick={() => setSelectedDetails(item)}
                        style={{ padding: '0.4rem', borderRadius: '8px' }}
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Paginação */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem' }}>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>
            Página <strong>{page}</strong> de <strong>{totalPages}</strong>
          </span>
          <div style={{ display: 'flex', gap: '0.25rem' }}>
            <button 
              disabled={page === 1 || isLoading} 
              onClick={() => setPage(prev => Math.max(prev - 1, 1))}
              style={{ 
                opacity: page === 1 ? 0.3 : 1, 
                cursor: page === 1 ? 'not-allowed' : 'pointer', 
                background: 'rgba(255,255,255,0.02)', 
                padding: '0.35rem 0.6rem', 
                borderRadius: '6px', 
                border: '1px solid var(--border)', 
                fontSize: '0.8rem', 
                color: 'var(--text-main)', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '28px',
                height: '28px',
                transition: 'all 0.2s'
              }}
            >
              &lt;
            </button>
            <button 
              disabled={page >= totalPages || isLoading} 
              onClick={() => setPage(prev => Math.min(prev + 1, totalPages))}
              style={{ 
                opacity: page >= totalPages ? 0.3 : 1, 
                cursor: page >= totalPages ? 'not-allowed' : 'pointer', 
                background: 'rgba(255,255,255,0.02)', 
                padding: '0.35rem 0.6rem', 
                borderRadius: '6px', 
                border: '1px solid var(--border)', 
                fontSize: '0.8rem', 
                color: 'var(--text-main)', 
                display: 'flex', 
                alignItems: 'center',
                justifyContent: 'center',
                minWidth: '28px',
                height: '28px',
                transition: 'all 0.2s'
              }}
            >
              &gt;
            </button>
          </div>
        </div>
      </div>

      {selectedDetails && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.7)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
          <div className="glass-panel animate-fade-in" style={{ background: 'var(--surface)', padding: '2rem', borderRadius: '16px', maxWidth: '450px', width: '100%', position: 'relative', border: '1px solid var(--border)' }}>
            <button 
              onClick={() => setSelectedDetails(null)} 
              style={{ position: 'absolute', top: '1.5rem', right: '1.5rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
            >
              <X size={20} />
            </button>
            <h2 style={{ marginBottom: '1.5rem', fontSize: '1.4rem' }}>Detalhes do Saque</h2>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
               <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <span className="text-muted">Data</span>
                <strong>{new Date(selectedDetails.created_at || selectedDetails.date).toLocaleString('pt-BR')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <span className="text-muted">Valor</span>
                <strong>{formatCurrency(parseFloat(selectedDetails.amount || 0))}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid var(--border)', paddingBottom: '0.75rem' }}>
                <span className="text-muted">Status</span>
                <strong style={{ color: 'var(--primary)' }}>{translateStatus(selectedDetails.status)}</strong>
              </div>
              {selectedDetails.bank_account && (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                  <span className="text-muted">Conta de Destino:</span>
                  <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem' }}>
                    {selectedDetails.bank_account.bank_name} - Ag: {selectedDetails.bank_account.agency} Conta: {selectedDetails.bank_account.account}
                  </div>
                </div>
              )}
              {/* {(() => {
                const justification = selectedDetails.justificativa || selectedDetails.justification || selectedDetails.reason || selectedDetails.refusal_reason || selectedDetails.notes || '';
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.25rem', marginTop: '0.5rem' }}>
                    <span className="text-muted">Justificativa:</span>
                    <div style={{ background: 'rgba(0,0,0,0.2)', padding: '1rem', borderRadius: '8px', fontSize: '0.9rem', color: justification ? 'var(--text-main)' : 'var(--text-dim)', fontStyle: justification ? 'normal' : 'italic' }}>
                      {justification || "Nenhuma justificativa fornecida pelo backoffice."}
                    </div>
                  </div>
                );
              })()} */}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
