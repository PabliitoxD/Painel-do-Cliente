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
  const [perPage, setPerPage] = useState(50);
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
  }, [history, perPage]);

  const paginatedHistory = useMemo(() => {
    const start = (page - 1) * perPage;
    return history.slice(start, start + perPage);
  }, [history, page, perPage]);

  const totalPages = Math.ceil(history.length / perPage) || 1;

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
        <div style={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '0.75rem', marginTop: '1.5rem', flexWrap: 'wrap' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', marginRight: '1rem' }}>
            <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Itens por página:</span>
            <select 
              value={perPage} 
              onChange={(e) => { setPerPage(Number(e.target.value)); setPage(1); }}
              style={{
                background: 'rgba(0,0,0,0.2)',
                border: '1px solid var(--border)',
                borderRadius: '6px',
                padding: '0.25rem 0.5rem',
                fontSize: '0.8rem',
                color: 'var(--text-main)',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              {[10, 20, 30, 50, 100].map(val => (
                <option key={val} value={val} style={{ background: 'var(--surface)', color: 'white' }}>{val}</option>
              ))}
            </select>
          </div>
          <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)', marginRight: '0.5rem' }}>
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
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.8)', zIndex: 999, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', backdropFilter: 'blur(4px)' }}>
          <div className="glass-panel animate-fade-in" style={{ background: 'var(--surface)', padding: '2.5rem 2rem 2rem 2rem', borderRadius: '20px', maxWidth: '460px', width: '100%', position: 'relative', border: '1px solid var(--border)', boxShadow: '0 20px 40px rgba(0,0,0,0.5)' }}>
            <button 
              onClick={() => setSelectedDetails(null)} 
              style={{ position: 'absolute', top: '1.25rem', right: '1.25rem', background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', transition: 'color 0.2s' }}
              onMouseEnter={(e) => e.currentTarget.style.color = 'var(--text-main)'}
              onMouseLeave={(e) => e.currentTarget.style.color = 'var(--text-muted)'}
            >
              <X size={20} />
            </button>

            <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
              <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: '48px', height: '48px', borderRadius: '50%', background: 'rgba(255,255,255,0.03)', border: '1px solid var(--border)', marginBottom: '0.75rem', color: 'var(--primary)' }}>
                <History size={24} />
              </div>
              <h2 style={{ fontSize: '1.2rem', fontWeight: 600, letterSpacing: '0.5px', textTransform: 'uppercase', color: 'var(--text-main)', margin: 0 }}>Comprovante de Saque</h2>
              <span style={{ fontSize: '0.8rem', color: 'var(--text-dim)' }}>Superfin Sandbox Panel</span>
            </div>

            {/* Dotted separator */}
            <div style={{ borderTop: '2px dashed var(--border)', margin: '1rem 0', opacity: 0.6 }}></div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem', fontSize: '0.9rem' }}>
              {selectedDetails.id && (
                <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                  <span className="text-muted">ID da Transação</span>
                  <span style={{ fontFamily: 'monospace', fontSize: '0.8rem', color: 'var(--text-dim)' }}>#{selectedDetails.id.slice(0, 18)}...</span>
                </div>
              )}
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Data / Hora</span>
                <strong style={{ color: 'var(--text-main)' }}>{new Date(selectedDetails.created_at || selectedDetails.createdAt || selectedDetails.date).toLocaleString('pt-BR')}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Valor Solicitado</span>
                <strong style={{ color: 'var(--text-main)' }}>{formatCurrency(parseFloat(selectedDetails.amount || 0))}</strong>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span className="text-muted">Taxa de Saque</span>
                <strong style={{ color: 'var(--danger)' }}>- {formatCurrency(parseFloat(selectedDetails.taxFee || selectedDetails.fee || 0))}</strong>
              </div>
              
              <div style={{ borderTop: '1px solid var(--border)', paddingTop: '0.5rem', margin: '0.25rem 0' }}></div>
              
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>Valor Líquido</span>
                <strong style={{ color: 'var(--success)', fontSize: '1.2rem' }}>
                  {formatCurrency(parseFloat(selectedDetails.amount || 0) - parseFloat(selectedDetails.taxFee || selectedDetails.fee || 0))}
                </strong>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="text-muted">Status</span>
                <span className={`status-pill ${getStatusPillClass(selectedDetails.status)}`} style={{ fontSize: '0.8rem', padding: '0.25rem 0.75rem' }}>
                  {translateStatus(selectedDetails.status)}
                </span>
              </div>

              {/* Dotted separator */}
              <div style={{ borderTop: '2px dashed var(--border)', margin: '1rem 0', opacity: 0.6 }}></div>

              {selectedDetails.bank_account ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <span className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Conta de Destino</span>
                  <div style={{ background: 'rgba(0,0,0,0.15)', padding: '0.8rem', borderRadius: '10px', fontSize: '0.85rem', border: '1px solid var(--border)', color: 'var(--text-main)' }}>
                    <div style={{ fontWeight: 600 }}>{selectedDetails.bank_account.bank_name}</div>
                    <div className="text-muted" style={{ marginTop: '0.2rem', fontSize: '0.8rem' }}>
                      Agência: {selectedDetails.bank_account.agency} | Conta: {selectedDetails.bank_account.account}
                    </div>
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
                  <span className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Chave PIX de Destino</span>
                  <div style={{ background: 'rgba(0,0,0,0.15)', padding: '0.8rem', borderRadius: '10px', fontSize: '0.85rem', border: '1px solid var(--border)', color: 'var(--text-main)', fontFamily: 'monospace' }}>
                    Chave PIX cadastrada na conta
                  </div>
                </div>
              )}

              {(() => {
                const justification = selectedDetails.justificativa || selectedDetails.justification || selectedDetails.reason || selectedDetails.refusal_reason || selectedDetails.notes || selectedDetails.motivo || '';
                return (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', marginTop: '0.5rem' }}>
                    <span className="text-muted" style={{ fontSize: '0.8rem', fontWeight: 600, textTransform: 'uppercase' }}>Motivo / Observação</span>
                    <div style={{ 
                      background: justification ? 'rgba(255, 177, 86, 0.03)' : 'rgba(0,0,0,0.15)', 
                      padding: '0.8rem', 
                      borderRadius: '10px', 
                      fontSize: '0.85rem', 
                      border: justification ? '1px solid rgba(255, 177, 86, 0.15)' : '1px solid var(--border)', 
                      color: justification ? 'var(--text-main)' : 'var(--text-dim)', 
                      fontStyle: justification ? 'normal' : 'italic',
                      lineHeight: '1.4'
                    }}>
                      {justification || "Nenhuma observação ou motivo registrado pelo backoffice."}
                    </div>
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}
    </DashboardLayout>
  );
}
