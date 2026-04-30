"use client";

import { useState } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Plus, Edit2, Trash2, Shield, X, Check } from 'lucide-react';

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
      <div className="team-page animate-fade-in">
        <div className="page-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <div>
            <h1 style={{ fontSize: '1.8rem', fontWeight: 700, marginBottom: '0.25rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Shield size={24} className="text-primary" /> Perfis de Acesso
            </h1>
            <p style={{ color: 'var(--text-dim)', fontSize: '0.9rem' }}>Gerencie os perfis e permissões da sua equipe</p>
          </div>
          <button className="btn-primary" onClick={() => handleOpenModal()} style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <Plus size={18} /> Novo Perfil
          </button>
        </div>

        <div className="table-card">
          <table className="transactions-table">
            <thead>
              <tr>
                <th>Nome do Perfil</th>
                <th>Colaboradores</th>
                <th>Status</th>
                <th style={{ textAlign: 'right' }}>Ações</th>
              </tr>
            </thead>
            <tbody>
              {profiles.map(profile => (
                <tr key={profile.id}>
                  <td style={{ fontWeight: 600 }}>{profile.name}</td>
                  <td>{profile.usersCount} usuários</td>
                  <td>
                    <span className="status-pill aprovada">Ativo</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button className="btn-ghost" onClick={() => handleOpenModal(profile)} title="Editar perfil" style={{ padding: '0.4rem', borderRadius: '8px' }}>
                        <Edit2 size={16} />
                      </button>
                      {!profile.isDefault && (
                        <button className="btn-ghost" title="Excluir perfil" style={{ padding: '0.4rem', borderRadius: '8px', color: 'var(--danger)', borderColor: 'rgba(203, 86, 86, 0.2)' }}>
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

        {isModalOpen && (
          <div className="modal-overlay" onClick={handleCloseModal}>
            <div className="modal-content" onClick={e => e.stopPropagation()} style={{ maxWidth: '800px', width: '95%' }}>
              <div className="modal-header">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{editingProfile ? 'Editar Perfil' : 'Novo Perfil'}</h2>
                <button className="btn-ghost" onClick={handleCloseModal} style={{ padding: '0.4rem', borderRadius: '8px' }}><X size={20} /></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '70vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                <div className="form-group mb-6">
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '0.5rem', display: 'block' }}>Nome do Perfil</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ex: Gerente Financeiro" 
                    defaultValue={editingProfile?.name || ''} 
                  />
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', marginTop: '1.5rem' }}>Permissões de Acesso</h3>
                <div className="permissions-grid">
                  <div className="permissions-header" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <div>Módulo</div>
                    <div style={{ textAlign: 'center' }}>Consultar</div>
                    <div style={{ textAlign: 'center' }}>Adicionar</div>
                    <div style={{ textAlign: 'center' }}>Editar</div>
                    <div style={{ textAlign: 'center' }}>Excluir</div>
                  </div>
                  
                  {MODULES.map((mod, index) => (
                    <div key={index} className="permission-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                      <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{mod}</div>
                      <div style={{ textAlign: 'center' }}><input type="checkbox" className="custom-checkbox" defaultChecked /></div>
                      <div style={{ textAlign: 'center' }}><input type="checkbox" className="custom-checkbox" /></div>
                      <div style={{ textAlign: 'center' }}><input type="checkbox" className="custom-checkbox" /></div>
                      <div style={{ textAlign: 'center' }}><input type="checkbox" className="custom-checkbox" /></div>
                    </div>
                  ))}
                </div>
              </div>
              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <button className="btn-ghost" onClick={handleCloseModal}>Cancelar</button>
                <button className="btn-primary" onClick={handleCloseModal}>Salvar Perfil</button>
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
        .custom-checkbox {
          width: 18px;
          height: 18px;
          cursor: pointer;
          accent-color: var(--primary);
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
