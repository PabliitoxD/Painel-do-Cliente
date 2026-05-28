"use client";

import { useState, useEffect } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Plus, Edit2, Trash2, Shield, X } from 'lucide-react';

interface Permission {
  view: boolean;
  add: boolean;
  edit: boolean;
  delete: boolean;
}

interface Profile {
  id: string;
  name: string;
  usersCount: number;
  isDefault: boolean;
  permissions: Record<string, Permission>;
}

const DEFAULT_PROFILES: Profile[] = [
  { 
    id: '1', 
    name: 'Administrador', 
    usersCount: 2, 
    isDefault: true,
    permissions: {
      'Dashboard': { view: true, add: true, edit: true, delete: true },
      'Financeiro (Extratos)': { view: true, add: true, edit: true, delete: true },
      'Financeiro (Saques)': { view: true, add: true, edit: true, delete: true },
      'Vendas': { view: true, add: true, edit: true, delete: true },
      'Recorrência': { view: true, add: true, edit: true, delete: true },
      'Recebedores': { view: true, add: true, edit: true, delete: true },
      'Minha equipe': { view: true, add: true, edit: true, delete: true }
    }
  },
  { 
    id: '2', 
    name: 'Suporte', 
    usersCount: 0, 
    isDefault: false,
    permissions: {
      'Dashboard': { view: true, add: false, edit: false, delete: false },
      'Financeiro (Extratos)': { view: true, add: false, edit: false, delete: false },
      'Financeiro (Saques)': { view: false, add: false, edit: false, delete: false },
      'Vendas': { view: true, add: false, edit: false, delete: false },
      'Recorrência': { view: true, add: false, edit: false, delete: false },
      'Recebedores': { view: false, add: false, edit: false, delete: false },
      'Minha equipe': { view: false, add: false, edit: false, delete: false }
    }
  },
  { 
    id: '3', 
    name: 'Financeiro', 
    usersCount: 1, 
    isDefault: false,
    permissions: {
      'Dashboard': { view: true, add: false, edit: false, delete: false },
      'Financeiro (Extratos)': { view: true, add: true, edit: true, delete: false },
      'Financeiro (Saques)': { view: true, add: true, edit: false, delete: false },
      'Vendas': { view: true, add: false, edit: false, delete: false },
      'Recorrência': { view: true, add: false, edit: false, delete: false },
      'Recebedores': { view: true, add: true, edit: false, delete: false },
      'Minha equipe': { view: false, add: false, edit: false, delete: false }
    }
  },
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
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingProfile, setEditingProfile] = useState<Profile | null>(null);
  
  // State variables for form
  const [profileName, setProfileName] = useState('');
  const [permissionsState, setPermissionsState] = useState<Record<string, Permission>>({});

  // Load profiles from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('tronnus_profiles');
    if (stored) {
      try {
        setProfiles(JSON.parse(stored));
      } catch (e) {
        setProfiles(DEFAULT_PROFILES);
        localStorage.setItem('tronnus_profiles', JSON.stringify(DEFAULT_PROFILES));
      }
    } else {
      setProfiles(DEFAULT_PROFILES);
      localStorage.setItem('tronnus_profiles', JSON.stringify(DEFAULT_PROFILES));
    }
  }, []);

  // Update counts dynamically based on actual users in localStorage
  useEffect(() => {
    if (profiles.length === 0) return;
    const storedCollabs = localStorage.getItem('tronnus_collaborators');
    if (storedCollabs) {
      try {
        const collabs = JSON.parse(storedCollabs);
        const updatedProfiles = profiles.map(p => {
          const count = collabs.filter((c: any) => c.profileId === p.id).length;
          return { ...p, usersCount: count };
        });
        
        // Only trigger update if counts are different to avoid infinite loop
        const countsChanged = updatedProfiles.some((p, i) => p.usersCount !== profiles[i]?.usersCount);
        if (countsChanged) {
          setProfiles(updatedProfiles);
          localStorage.setItem('tronnus_profiles', JSON.stringify(updatedProfiles));
        }
      } catch (e) {
        console.error("Erro ao analisar colaboradores para atualizar contagens:", e);
      }
    }
  }, [profiles]);

  const handleOpenModal = (profile: Profile | null = null) => {
    setEditingProfile(profile);
    if (profile) {
      setProfileName(profile.name);
      setPermissionsState(profile.permissions);
    } else {
      setProfileName('');
      // Initialize with default empty permissions
      const initial: Record<string, Permission> = {};
      MODULES.forEach(mod => {
        initial[mod] = { view: true, add: false, edit: false, delete: false };
      });
      setPermissionsState(initial);
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingProfile(null);
    setIsModalOpen(false);
  };

  const handlePermissionChange = (mod: string, action: keyof Permission, checked: boolean) => {
    setPermissionsState(prev => ({
      ...prev,
      [mod]: {
        ...prev[mod],
        [action]: checked
      }
    }));
  };

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (!profileName.trim()) {
      alert("Por favor, preencha o nome do perfil.");
      return;
    }

    let updatedProfiles: Profile[];

    if (editingProfile) {
      // Edit
      updatedProfiles = profiles.map(p => {
        if (p.id === editingProfile.id) {
          return {
            ...p,
            name: profileName.trim(),
            permissions: permissionsState
          };
        }
        return p;
      });
    } else {
      // Create new
      const newProfile: Profile = {
        id: String(Date.now()),
        name: profileName.trim(),
        usersCount: 0,
        isDefault: false,
        permissions: permissionsState
      };
      updatedProfiles = [...profiles, newProfile];
    }

    setProfiles(updatedProfiles);
    localStorage.setItem('tronnus_profiles', JSON.stringify(updatedProfiles));
    handleCloseModal();
  };

  const handleDeleteProfile = (id: string, name: string) => {
    // Check if any collaborator is using this profile
    const storedCollabs = localStorage.getItem('tronnus_collaborators');
    if (storedCollabs) {
      try {
        const collabs = JSON.parse(storedCollabs);
        const isUsed = collabs.some((c: any) => c.profileId === id);
        if (isUsed) {
          alert(`Não é possível excluir o perfil "${name}" porque existem colaboradores associados a ele. Altere o perfil dos colaboradores primeiro.`);
          return;
        }
      } catch (e) {
        console.error(e);
      }
    }

    if (!confirm(`Tem certeza que deseja excluir o perfil de acesso "${name}"?`)) return;

    const updated = profiles.filter(p => p.id !== id);
    setProfiles(updated);
    localStorage.setItem('tronnus_profiles', JSON.stringify(updated));
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
              {profiles.length === 0 ? (
                <tr>
                  <td colSpan={4} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    Nenhum perfil de acesso cadastrado.
                  </td>
                </tr>
              ) : profiles.map(profile => (
                <tr key={profile.id}>
                  <td style={{ fontWeight: 600 }}>{profile.name} {profile.isDefault && <span style={{ fontSize: '0.7rem', padding: '2px 6px', background: 'rgba(101, 131, 154, 0.15)', color: 'var(--primary)', borderRadius: '4px', marginLeft: '6px' }}>Padrão</span>}</td>
                  <td>{profile.usersCount} colaboradores</td>
                  <td>
                    <span className="status-pill aprovada">Ativo</span>
                  </td>
                  <td style={{ textAlign: 'right' }}>
                    <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem' }}>
                      <button 
                        className="btn-ghost" 
                        onClick={() => handleOpenModal(profile)} 
                        title="Editar perfil" 
                        style={{ padding: '0.4rem', borderRadius: '8px' }}
                      >
                        <Edit2 size={16} />
                      </button>
                      {!profile.isDefault && (
                        <button 
                          className="btn-ghost" 
                          onClick={() => handleDeleteProfile(profile.id, profile.name)}
                          title="Excluir perfil" 
                          style={{ padding: '0.4rem', borderRadius: '8px', color: 'var(--danger)', borderColor: 'rgba(203, 86, 86, 0.2)' }}
                        >
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
            <form className="modal-content" onClick={e => e.stopPropagation()} onSubmit={handleSaveProfile} style={{ maxWidth: '800px', width: '95%' }}>
              <div className="modal-header">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{editingProfile ? 'Editar Perfil' : 'Novo Perfil'}</h2>
                <button type="button" className="btn-ghost" onClick={handleCloseModal} style={{ padding: '0.4rem', borderRadius: '8px' }}><X size={20} /></button>
              </div>
              <div className="modal-body" style={{ maxHeight: '60vh', overflowY: 'auto', paddingRight: '0.5rem' }}>
                <div className="form-group mb-6">
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '0.5rem', display: 'block' }}>Nome do Perfil</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ex: Gerente Financeiro" 
                    value={profileName}
                    onChange={e => setProfileName(e.target.value)}
                    required
                    disabled={editingProfile?.isDefault}
                  />
                </div>

                <h3 style={{ fontSize: '1.1rem', fontWeight: 700, marginBottom: '1rem', marginTop: '1.5rem' }}>Permissões de Acesso</h3>
                <div className="permissions-grid" style={{ minWidth: '550px' }}>
                  <div className="permissions-header" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '1rem', paddingBottom: '0.75rem', borderBottom: '1px solid var(--border)', marginBottom: '0.5rem', fontSize: '0.85rem', color: 'var(--text-dim)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    <div>Módulo</div>
                    <div style={{ textAlign: 'center' }}>Consultar</div>
                    <div style={{ textAlign: 'center' }}>Adicionar</div>
                    <div style={{ textAlign: 'center' }}>Editar</div>
                    <div style={{ textAlign: 'center' }}>Excluir</div>
                  </div>
                  
                  {MODULES.map((mod) => {
                    const perm = permissionsState[mod] || { view: false, add: false, edit: false, delete: false };
                    return (
                      <div key={mod} className="permission-row" style={{ display: 'grid', gridTemplateColumns: '2fr 1fr 1fr 1fr 1fr', gap: '1rem', padding: '1rem 0', borderBottom: '1px solid var(--border)', alignItems: 'center' }}>
                        <div style={{ fontSize: '0.9rem', fontWeight: 500 }}>{mod}</div>
                        <div style={{ textAlign: 'center' }}>
                          <input 
                            type="checkbox" 
                            className="custom-checkbox" 
                            checked={perm.view} 
                            onChange={e => handlePermissionChange(mod, 'view', e.target.checked)}
                          />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <input 
                            type="checkbox" 
                            className="custom-checkbox" 
                            checked={perm.add} 
                            onChange={e => handlePermissionChange(mod, 'add', e.target.checked)}
                          />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <input 
                            type="checkbox" 
                            className="custom-checkbox" 
                            checked={perm.edit} 
                            onChange={e => handlePermissionChange(mod, 'edit', e.target.checked)}
                          />
                        </div>
                        <div style={{ textAlign: 'center' }}>
                          <input 
                            type="checkbox" 
                            className="custom-checkbox" 
                            checked={perm.delete} 
                            onChange={e => handlePermissionChange(mod, 'delete', e.target.checked)}
                          />
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '1.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <button type="button" className="btn-ghost" onClick={handleCloseModal}>Cancelar</button>
                <button type="submit" className="btn-primary">Salvar Perfil</button>
              </div>
            </form>
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
          align-items: flex-start;
          justify-content: center;
          z-index: 1000;
          padding: 2rem 1rem;
          overflow-y: auto;
        }
        .modal-content {
          background: var(--surface);
          border-radius: 20px;
          padding: 2rem;
          width: 100%;
          box-shadow: var(--shadow-lg);
          border: 1px solid var(--border);
          margin-top: auto;
          margin-bottom: auto;
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
