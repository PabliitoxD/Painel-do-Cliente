"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Search, Plus, Edit2, Trash2, Users2, Mail, Shield, X } from 'lucide-react';

// Mock data
const MOCK_PROFILES = [
  { id: 1, name: 'Administrador' },
  { id: 2, name: 'Suporte' },
  { id: 3, name: 'Financeiro' },
];

const MOCK_COLLABORATORS = [
  { id: 1, name: 'João Silva', email: 'joao.silva@exemplo.com', profileId: 1, profileName: 'Administrador', status: 'Ativo', lastLogin: 'Hoje, 14:30' },
  { id: 2, name: 'Maria Souza', email: 'maria.souza@exemplo.com', profileId: 2, profileName: 'Suporte', status: 'Ativo', lastLogin: 'Ontem, 09:15' },
  { id: 3, name: 'Carlos Santos', email: 'carlos.santos@exemplo.com', profileId: 3, profileName: 'Financeiro', status: 'Inativo', lastLogin: '25/04/2026' },
];

export default function CollaboratorsPage() {
  const [collaborators, setCollaborators] = useState(MOCK_COLLABORATORS);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollab, setEditingCollab] = useState<any>(null);

  const handleOpenModal = (collab: any = null) => {
    setEditingCollab(collab);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingCollab(null);
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="team-page animate-fade-in">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Users2 size={24} className="text-primary" /> Colaboradores
            </h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Gerencie as pessoas que têm acesso ao painel</p>
          </div>
          <button className="btn-primary" onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Novo Colaborador
          </button>
        </div>

        <div className="table-filters card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem' }}>
          <div className="search-box" style={{ flex: 1, background: 'var(--background)', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', borderRadius: '10px' }}>
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou e-mail..." 
              style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text-main)', fontSize: '0.95rem' }}
            />
          </div>
        </div>

        <div className="table-card">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>Perfil de Acesso</th>
                <th>Status</th>
                <th>Último Acesso</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {collaborators.map(collab => (
                <tr key={collab.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface-hover)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--primary)', fontSize: '0.9rem' }}>
                        {collab.name.charAt(0)}
                      </div>
                      <div>
                        <div style={{ fontWeight: 600, color: 'var(--text-main)', fontSize: '0.95rem' }}>{collab.name}</div>
                        <div style={{ fontSize: '0.8rem', color: 'var(--text-dim)', display: 'flex', alignItems: 'center', gap: '0.25rem', marginTop: '0.1rem' }}>
                          <Mail size={12} /> {collab.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-main)', fontSize: '0.85rem' }}>
                      <Shield size={14} className="text-primary" /> {collab.profileName}
                    </div>
                  </td>
                  <td>
                    <span className={`status-pill ${collab.status === 'Ativo' ? 'aprovada' : 'recusada'}`}>
                      {collab.status}
                    </span>
                  </td>
                  <td style={{ color: 'var(--text-dim)', fontSize: '0.85rem' }}>{collab.lastLogin}</td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button className="btn-ghost" onClick={() => handleOpenModal(collab)} title="Editar colaborador" style={{ padding: '0.4rem', borderRadius: '8px' }}>
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-ghost" title="Remover colaborador" style={{ padding: '0.4rem', borderRadius: '8px', color: 'var(--danger)', borderColor: 'rgba(203, 86, 86, 0.2)' }}>
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {isModalOpen && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '95%' }}>
              <div className="modal-header">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{editingCollab ? 'Editar Colaborador' : 'Novo Colaborador'}</h2>
                <button className="btn-ghost" onClick={handleCloseModal} style={{ padding: '0.4rem', borderRadius: '8px' }}><X size={20} /></button>
              </div>
              
              <div className="modal-body">
                <div className="form-group">
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '0.5rem', display: 'block' }}>Nome Completo</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ex: João da Silva" 
                    defaultValue={editingCollab?.name || ''} 
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '0.5rem', display: 'block' }}>E-mail</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="joao@exemplo.com" 
                    defaultValue={editingCollab?.email || ''} 
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '0.5rem', display: 'block' }}>Perfil de Acesso</label>
                  <select className="form-control" defaultValue={editingCollab?.profileId || ''}>
                    <option value="" disabled>Selecione um perfil...</option>
                    {MOCK_PROFILES.map(profile => (
                      <option key={profile.id} value={profile.id}>{profile.name}</option>
                    ))}
                  </select>
                  {MOCK_PROFILES.length === 0 && (
                    <span style={{ fontSize: '0.8rem', color: 'var(--danger)', display: 'block', marginTop: '0.25rem' }}>
                      É necessário cadastrar um Perfil primeiro.
                    </span>
                  )}
                </div>

                {!editingCollab && (
                  <div className="form-group">
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '0.5rem', display: 'block' }}>Senha Provisória</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="••••••••" 
                    />
                  </div>
                )}
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <button className="btn-ghost" onClick={handleCloseModal}>Cancelar</button>
                <button className="btn-primary" onClick={handleCloseModal} disabled={MOCK_PROFILES.length === 0}>
                  Salvar Colaborador
                </button>
              </div>
            </div>
          </div>
        )}
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.6);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        .modal-content {
          background: var(--surface);
          border-radius: 20px;
          padding: 2rem;
          width: 100%;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .form-group {
          margin-bottom: 1.25rem;
        }
        .form-control {
          background: var(--background);
          border: 1px solid var(--border);
          padding: 0.8rem 1rem;
          border-radius: 10px;
          color: var(--text-main);
          width: 100%;
          font-family: inherit;
          font-size: 0.95rem;
          transition: all 0.2s;
        }
        .form-control:focus {
          outline: none;
          border-color: var(--primary);
          box-shadow: 0 0 0 2px rgba(101, 131, 154, 0.2);
        }
        @media (max-width: 768px) {
          .page-header {
            flex-direction: column;
            align-items: flex-start !important;
            gap: 1.5rem;
          }
          .page-header button {
            width: 100%;
            justify-content: center;
          }
        }
      `}</style>
    </DashboardLayout>
  );
}
