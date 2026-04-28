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
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Users2 className="text-primary" /> Colaboradores
          </h1>
          <p className="text-muted">Gerencie as pessoas que têm acesso ao painel</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Novo Colaborador
        </button>
      </div>

      <div className="card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem' }}>
        <div className="search-box" style={{ flex: 1, background: 'var(--background)', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.5rem 1rem', borderRadius: '10px' }}>
          <Search size={18} className="text-muted" />
          <input 
            type="text" 
            placeholder="Buscar por nome ou e-mail..." 
            style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', color: 'var(--text)' }}
          />
        </div>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Colaborador</th>
                <th>Perfil de Acesso</th>
                <th>Status</th>
                <th>Último Acesso</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {collaborators.map(collab => (
                <tr key={collab.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface-hover)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--primary)' }}>
                        {collab.name.charAt(0)}
                      </div>
                      <div>
                        <div className="font-medium">{collab.name}</div>
                        <div className="text-sm text-muted" style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                          <Mail size={12} /> {collab.email}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
                      <Shield size={14} className="text-muted" /> {collab.profileName}
                    </div>
                  </td>
                  <td>
                    <span className={`badge ${collab.status === 'Ativo' ? 'badge-success' : 'badge-warning'}`}>
                      {collab.status}
                    </span>
                  </td>
                  <td className="text-muted text-sm">{collab.lastLogin}</td>
                  <td className="text-right">
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => handleOpenModal(collab)} title="Editar colaborador">
                        <Edit2 size={16} />
                      </button>
                      <button className="btn-icon text-danger" title="Remover colaborador">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {isModalOpen && (
        <div className="modal-overlay" onClick={handleCloseModal}>
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '500px', width: '95%' }}>
            <div className="modal-header">
              <h2 className="text-xl font-bold">{editingCollab ? 'Editar Colaborador' : 'Novo Colaborador'}</h2>
              <button className="btn-icon" onClick={handleCloseModal}><X size={20} /></button>
            </div>
            
            <div className="modal-body">
              <div className="form-group mb-4">
                <label>Nome Completo</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ex: João da Silva" 
                  defaultValue={editingCollab?.name || ''} 
                />
              </div>

              <div className="form-group mb-4">
                <label>E-mail</label>
                <input 
                  type="email" 
                  className="form-control" 
                  placeholder="joao@exemplo.com" 
                  defaultValue={editingCollab?.email || ''} 
                />
              </div>

              <div className="form-group mb-4">
                <label>Perfil de Acesso</label>
                <select className="form-control" defaultValue={editingCollab?.profileId || ''}>
                  <option value="" disabled>Selecione um perfil...</option>
                  {MOCK_PROFILES.map(profile => (
                    <option key={profile.id} value={profile.id}>{profile.name}</option>
                  ))}
                </select>
                {MOCK_PROFILES.length === 0 && (
                  <span className="text-sm text-danger mt-1" style={{ display: 'block' }}>
                    É necessário cadastrar um Perfil primeiro.
                  </span>
                )}
              </div>

              {!editingCollab && (
                <div className="form-group mb-4">
                  <label>Senha Provisória</label>
                  <input 
                    type="password" 
                    className="form-control" 
                    placeholder="••••••••" 
                  />
                </div>
              )}
            </div>

            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <button className="btn-outline" onClick={handleCloseModal}>Cancelar</button>
              <button className="btn-primary" onClick={handleCloseModal} disabled={MOCK_PROFILES.length === 0}>
                Salvar Colaborador
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          backdrop-filter: blur(4px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
          padding: 1rem;
        }
        .modal-content {
          background: var(--surface);
          border-radius: 16px;
          padding: 2rem;
          width: 100%;
          box-shadow: 0 20px 40px rgba(0, 0, 0, 0.2);
          border: 1px solid var(--border);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
        }
        .form-group {
          display: flex;
          flex-direction: column;
          gap: 0.5rem;
        }
        .form-control {
          background: var(--background);
          border: 1px solid var(--border);
          padding: 0.75rem 1rem;
          border-radius: 8px;
          color: var(--text);
          width: 100%;
        }
        .form-control:focus {
          outline: none;
          border-color: var(--primary);
        }
        .mb-4 { margin-bottom: 1rem; }
        .mt-1 { margin-top: 0.25rem; }
        .action-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
        }
      `}</style>
    </DashboardLayout>
  );
}
