"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Search, Plus, Edit2, Trash2, Shield, Check, X } from 'lucide-react';

// Mock data for profiles
const MOCK_PROFILES = [
  { id: 1, name: 'Administrador', usersCount: 2, isDefault: true },
  { id: 2, name: 'Suporte', usersCount: 5, isDefault: false },
  { id: 3, name: 'Financeiro', usersCount: 1, isDefault: false },
];

const MODULES = [
  'Dashboard',
  'Financeiro (Extratos)',
  'Financeiro (Saques)',
  'Vendas',
  'Recorrência',
  'Recebedores',
  'Minha equipe'
];

export default function ProfilesPage() {
  const [profiles, setProfiles] = useState(MOCK_PROFILES);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<any>(null);

  const handleOpenModal = (profile: any = null) => {
    setEditingProfile(profile);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProfile(null);
    setIsModalOpen(false);
  };

  return (
    <DashboardLayout>
      <div className="page-header">
        <div>
          <h1 className="text-2xl font-bold" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Shield className="text-primary" /> Perfis de Acesso
          </h1>
          <p className="text-muted">Gerencie os perfis e permissões da sua equipe</p>
        </div>
        <button className="btn-primary" onClick={() => handleOpenModal()}>
          <Plus size={18} /> Novo Perfil
        </button>
      </div>

      <div className="card">
        <div className="table-responsive">
          <table className="data-table">
            <thead>
              <tr>
                <th>Nome do Perfil</th>
                <th>Colaboradores</th>
                <th>Status</th>
                <th className="text-right">Ações</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map(profile => (
                <tr key={profile.id}>
                  <td className="font-medium">{profile.name}</td>
                  <td>{profile.usersCount} usuários</td>
                  <td>
                    <span className="badge badge-success">Ativo</span>
                  </td>
                  <td className="text-right">
                    <div className="action-buttons">
                      <button className="btn-icon" onClick={() => handleOpenModal(profile)} title="Editar perfil">
                        <Edit2 size={16} />
                      </button>
                      {!profile.isDefault && (
                        <button className="btn-icon text-danger" title="Excluir perfil">
                          <Trash2 size={16} />
                        </button>
                      )}
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
          <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '95%' }}>
            <div className="modal-header">
              <h2 className="text-xl font-bold">{editingProfile ? 'Editar Perfil' : 'Novo Perfil'}</h2>
              <button className="btn-icon" onClick={handleCloseModal}><X size={20} /></button>
            </div>
            <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto' }}>
              <div className="form-group mb-6">
                <label>Nome do Perfil</label>
                <input 
                  type="text" 
                  className="form-control" 
                  placeholder="Ex: Gerente Financeiro" 
                  defaultValue={editingProfile?.name || ''} 
                />
              </div>

              <h3 className="text-lg font-bold mb-4">Permissões de Acesso</h3>
              <div className="permissions-grid">
                <div className="permissions-header" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '1rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border)', marginBottom: '1rem', fontWeight: 'bold' }}>
                  <div>Módulo</div>
                  <div className="text-center">Consultar</div>
                  <div className="text-center">Adicionar</div>
                  <div className="text-center">Editar</div>
                  <div className="text-center">Excluir</div>
                </div>
                
                {MODULES.map((mod, index) => (
                  <div key={index} className="permission-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '1rem', padding: '0.75rem 0', borderBottom: '1px solid var(--border)' }}>
                    <div style={{ display: 'flex', alignItems: 'center' }}>{mod}</div>
                    <div className="text-center"><input type="checkbox" className="custom-checkbox" defaultChecked /></div>
                    <div className="text-center"><input type="checkbox" className="custom-checkbox" /></div>
                    <div className="text-center"><input type="checkbox" className="custom-checkbox" /></div>
                    <div className="text-center"><input type="checkbox" className="custom-checkbox" /></div>
                  </div>
                ))}
              </div>
            </div>
            <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
              <button className="btn-outline" onClick={handleCloseModal}>Cancelar</button>
              <button className="btn-primary" onClick={handleCloseModal}>Salvar Perfil</button>
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
        .custom-checkbox {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: var(--primary);
        }
        .action-buttons {
          display: flex;
          justify-content: flex-end;
          gap: 0.5rem;
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
        .mb-6 { margin-bottom: 1.5rem; }
        .mb-4 { margin-bottom: 1rem; }
      `}</style>
    </DashboardLayout>
  );
}
