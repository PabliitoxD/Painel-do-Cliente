"use client";

import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Key, BookOpen, Copy, CheckCircle2, RotateCcw, Eye, EyeOff, Terminal, ExternalLink } from 'lucide-react';
import { useState } from 'react';

export default function ApiSettingsPage() {
  const [copiedKey, setCopiedKey] = useState<string | null>(null);
  const [showLiveKey, setShowLiveKey] = useState(false);
  const [showTestKey, setShowTestKey] = useState(false);

  const LIVE_KEY = "live_prod_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";
  const TEST_KEY = "test_sandbox_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx";

  const handleCopy = (text: string, type: string) => {
    navigator.clipboard.writeText(text);
    setCopiedKey(type);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <DashboardLayout>
      <div className="api-settings animate-fade-in">
        <div className="page-header">
          <div>
            <h1>Integração via API</h1>
            <p className="text-muted">Gerencie suas chaves de API e acesse a documentação para desenvolvedores</p>
          </div>
          <button className="btn-primary" style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <BookOpen size={18} /> Documentação Completa <ExternalLink size={14} />
          </button>
        </div>

        <div className="settings-grid">
          {/* Coluna Esquerda: Chaves de API */}
          <div className="keys-section">
            <div className="settings-panel card glass-panel" style={{ marginBottom: '1.5rem' }}>
              <div className="panel-header">
                <div className="header-title">
                  <Key size={20} className="text-primary" />
                  <h2>Chaves de Produção</h2>
                </div>
                <span className="status-badge live">Ambiente Real</span>
              </div>
              <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Utilize esta chave para transações reais. <strong>Nunca compartilhe</strong> ou exponha esta chave no código frontend.
              </p>
              
              <div className="key-box">
                <div className="key-input-wrapper">
                  <input 
                    type={showLiveKey ? "text" : "password"} 
                    value={LIVE_KEY} 
                    readOnly 
                    className="key-input"
                  />
                  <button className="btn-icon" onClick={() => setShowLiveKey(!showLiveKey)}>
                    {showLiveKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="key-actions">
                  <button className="btn-secondary" onClick={() => handleCopy(LIVE_KEY, 'live')}>
                    {copiedKey === 'live' ? <CheckCircle2 size={18} className="text-success" /> : <Copy size={18} />}
                    {copiedKey === 'live' ? 'Copiado!' : 'Copiar'}
                  </button>
                  <button className="btn-ghost text-danger">
                    <RotateCcw size={18} /> Substituir
                  </button>
                </div>
              </div>
            </div>

            <div className="settings-panel card glass-panel">
              <div className="panel-header">
                <div className="header-title">
                  <Key size={20} className="text-muted" />
                  <h2>Chaves de Teste (Sandbox)</h2>
                </div>
                <span className="status-badge test">Ambiente de Teste</span>
              </div>
              <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Utilize esta chave para testar sua integração. Transações criadas com esta chave não movem dinheiro real.
              </p>
              
              <div className="key-box">
                <div className="key-input-wrapper">
                  <input 
                    type={showTestKey ? "text" : "password"} 
                    value={TEST_KEY} 
                    readOnly 
                    className="key-input"
                  />
                  <button className="btn-icon" onClick={() => setShowTestKey(!showTestKey)}>
                    {showTestKey ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
                <div className="key-actions">
                  <button className="btn-secondary" onClick={() => handleCopy(TEST_KEY, 'test')}>
                    {copiedKey === 'test' ? <CheckCircle2 size={18} className="text-success" /> : <Copy size={18} />}
                    {copiedKey === 'test' ? 'Copiado!' : 'Copiar'}
                  </button>
                  <button className="btn-ghost text-danger">
                    <RotateCcw size={18} /> Substituir
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Coluna Direita: Quick Start / Snippets */}
          <div className="quickstart-section">
            <div className="settings-panel card glass-panel quickstart-panel">
              <div className="panel-header">
                <div className="header-title">
                  <Terminal size={20} className="text-primary" />
                  <h2>Quick Start</h2>
                </div>
              </div>
              
              <p className="text-muted" style={{ marginBottom: '1.5rem', fontSize: '0.9rem' }}>
                Faça sua primeira requisição para criar uma transação PIX. Substitua <code>SUA_CHAVE_AQUI</code> pela sua chave de API.
              </p>

              <div className="code-block">
                <div className="code-header">
                  <span>cURL</span>
                  <button className="btn-icon-small" onClick={() => handleCopy("curl -X POST...", "code")}>
                    {copiedKey === 'code' ? <CheckCircle2 size={14} className="text-success" /> : <Copy size={14} />}
                  </button>
                </div>
                <pre>
{`curl -X POST "https://api.tronnus.com/v1/transactions" \\
  -H "Authorization: Bearer SUA_CHAVE_AQUI" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 15000,
    "payment_method": "pix",
    "customer": {
      "name": "João da Silva",
      "email": "joao@email.com",
      "document": "12345678909"
    }
  }'`}
                </pre>
              </div>

              <div className="help-links" style={{ marginTop: '2rem' }}>
                <h3>Recursos Úteis</h3>
                <ul>
                  <li>
                    <a href="#"><BookOpen size={16} /> Referência da API</a>
                  </li>
                  <li>
                    <a href="#"><ExternalLink size={16} /> Coleção Postman</a>
                  </li>
                  <li>
                    <a href="#"><ExternalLink size={16} /> Bibliotecas Oficiais (SDKs)</a>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .page-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 1.8rem;
          margin-bottom: 0.25rem;
        }

        .text-muted {
          color: var(--text-muted);
        }

        .text-primary {
          color: var(--primary);
        }

        .text-success {
          color: var(--success);
        }

        .text-danger {
          color: var(--danger);
        }

        .settings-grid {
          display: grid;
          grid-template-columns: 1fr 450px;
          gap: 1.5rem;
          align-items: start;
        }

        .settings-panel {
          padding: 1.5rem;
        }

        .panel-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding-bottom: 1rem;
          border-bottom: 1px solid var(--border);
        }

        .header-title {
          display: flex;
          align-items: center;
          gap: 0.75rem;
        }

        .header-title h2 {
          font-size: 1.25rem;
          font-weight: 600;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .status-badge.live {
          background: rgba(34, 197, 94, 0.15);
          color: #22c55e;
          border: 1px solid rgba(34, 197, 94, 0.3);
        }

        .status-badge.test {
          background: rgba(245, 158, 11, 0.15);
          color: #f59e0b;
          border: 1px solid rgba(245, 158, 11, 0.3);
        }

        .key-box {
          display: flex;
          flex-direction: column;
          gap: 1rem;
        }

        .key-input-wrapper {
          display: flex;
          align-items: center;
          background: rgba(0,0,0,0.2);
          border: 1px solid var(--border);
          border-radius: 8px;
          padding: 0.5rem 1rem;
        }

        .key-input {
          flex: 1;
          background: transparent;
          border: none;
          color: var(--text-main);
          font-family: monospace;
          font-size: 1rem;
          outline: none;
        }

        .key-actions {
          display: flex;
          gap: 1rem;
        }

        .btn-secondary {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: rgba(255,255,255,0.1);
          border: 1px solid var(--border);
          color: var(--text-main);
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-secondary:hover {
          background: rgba(255,255,255,0.15);
        }

        .btn-ghost {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          background: transparent;
          border: none;
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          transition: all 0.2s;
        }

        .btn-ghost.text-danger:hover {
          background: rgba(239, 68, 68, 0.1);
        }

        .btn-icon {
          background: transparent;
          border: none;
          color: var(--text-muted);
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .btn-icon:hover {
          color: var(--text-main);
        }

        .btn-icon-small {
          background: transparent;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          padding: 0.25rem;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 4px;
        }

        .btn-icon-small:hover {
          background: rgba(255,255,255,0.1);
          color: white;
        }

        /* Quick Start Section */
        .quickstart-panel {
          position: sticky;
          top: 100px;
        }

        .code-block {
          background: #0f172a;
          border: 1px solid #1e293b;
          border-radius: 8px;
          overflow: hidden;
        }

        .code-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 1rem;
          background: #1e293b;
          font-size: 0.8rem;
          font-family: monospace;
          color: #94a3b8;
          border-bottom: 1px solid #334155;
        }

        .code-block pre {
          margin: 0;
          padding: 1rem;
          font-family: monospace;
          font-size: 0.85rem;
          color: #e2e8f0;
          overflow-x: auto;
          line-height: 1.5;
        }

        .help-links h3 {
          font-size: 0.95rem;
          color: var(--text-main);
          margin-bottom: 0.75rem;
        }

        .help-links ul {
          list-style: none;
          padding: 0;
          margin: 0;
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }

        .help-links a {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          color: var(--text-muted);
          text-decoration: none;
          font-size: 0.9rem;
          transition: color 0.2s;
        }

        .help-links a:hover {
          color: var(--primary);
        }

        @media (max-width: 1024px) {
          .settings-grid {
            grid-template-columns: 1fr;
          }
          .quickstart-panel {
            position: static;
          }
        }

        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          .key-actions {
            flex-direction: column;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
