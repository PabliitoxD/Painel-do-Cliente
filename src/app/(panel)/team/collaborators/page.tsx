"use client";

import { useState, useEffect, useMemo } from 'react';
import { DashboardLayout } from '@/components/layout/DashboardLayout';
import { Search, Plus, Edit2, Trash2, Users2, Mail, Shield, X } from 'lucide-react';

interface Profile {
  id: string;
  name: string;
  isDefault: boolean;
}

interface Collaborator {
  id: string;
  name: string;
  email: string;
  profileId: string;
  status: 'Ativo' | 'Inativo';
  lastLogin: string;
}

const DEFAULT_COLLABORATORS: Collaborator[] = [
  { id: '1', name: 'João Silva', email: 'joao@tronnus.com', profileId: '1', status: 'Ativo', lastLogin: '28/05/2026 - 11:30' },
  { id: '2', name: 'Maria Souza', email: 'maria@tronnus.com', profileId: '3', status: 'Ativo', lastLogin: '27/05/2026 - 14:15' },
];

export default function CollaboratorsPage() {
  const [collaborators, setCollaborators] = useState<Collaborator[]>([]);
  const [profiles, setProfiles] = useState<Profile[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingCollab, setEditingCollab] = useState<Collaborator | null>(null);
  
  // Search state
  const [searchQuery, setSearchQuery] = useState('');

  // Form states
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [profileId, setProfileId] = useState('');
  const [status, setStatus] = useState<'Ativo' | 'Inativo'>('Ativo');
  const [password, setPassword] = useState('');

  // Load collaborators and profiles on mount
  useEffect(() => {
    // 1. Profiles
    const storedProfiles = localStorage.getItem('tronnus_profiles');
    let loadedProfiles: Profile[] = [];
    if (storedProfiles) {
      try {
        loadedProfiles = JSON.parse(storedProfiles);
      } catch (e) {
        console.error(e);
      }
    }
    setProfiles(loadedProfiles);

    // 2. Collaborators
    const storedCollabs = localStorage.getItem('tronnus_collaborators');
    if (storedCollabs) {
      try {
        setCollaborators(JSON.parse(storedCollabs));
      } catch (e) {
        setCollaborators(DEFAULT_COLLABORATORS);
        localStorage.setItem('tronnus_collaborators', JSON.stringify(DEFAULT_COLLABORATORS));
      }
    } else {
      setCollaborators(DEFAULT_COLLABORATORS);
      localStorage.setItem('tronnus_collaborators', JSON.stringify(DEFAULT_COLLABORATORS));
    }
  }, []);

  const handleOpenModal = (collab: Collaborator | null = null) => {
    setEditingCollab(collab);
    if (collab) {
      setName(collab.name);
      setEmail(collab.email);
      setProfileId(collab.profileId);
      setStatus(collab.status);
      setPassword('');
    } else {
      setName('');
      setEmail('');
      setProfileId(profiles[0]?.id || '');
      setStatus('Ativo');
      setPassword('');
    }
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setEditingCollab(null);
    setIsModalOpen(false);
  };

  const handleSaveCollab = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim() || !profileId) {
      alert("Por favor, preencha todos os campos obrigatórios.");
      return;
    }

    let updated: Collaborator[];

    if (editingCollab) {
      // Edit
      updated = collaborators.map(c => {
        if (c.id === editingCollab.id) {
          return {
            ...c,
            name: name.trim(),
            email: email.trim(),
            profileId,
            status
          };
        }
        return c;
      });
    } else {
      // Create new
      const newCollab: Collaborator = {
        id: String(Date.now()),
        name: name.trim(),
        email: email.trim(),
        profileId,
        status,
        lastLogin: 'Nunca'
      };
      updated = [...collaborators, newCollab];
    }

    setCollaborators(updated);
    localStorage.setItem('tronnus_collaborators', JSON.stringify(updated));
    handleCloseModal();
  };

  const handleDeleteCollab = (id: string, name: string) => {
    if (!confirm(`Tem certeza que deseja remover o acesso do colaborador "${name}"?`)) return;

    const updated = collaborators.filter(c => c.id !== id);
    setCollaborators(updated);
    localStorage.setItem('tronnus_collaborators', JSON.stringify(updated));
  };

  // Filtered list
  const filteredCollaborators = useMemo(() => {
    return collaborators.filter(c => 
      c.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.email.toLowerCase().includes(searchQuery.toLowerCase())
    );
  }, [collaborators, searchQuery]);

  // Helper to find profile name
  const getProfileName = (pId: string) => {
    const prof = profiles.find(p => p.id === pId);
    return prof ? prof.name : 'Desconhecido';
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
          <button 
            className="btn-primary" 
            onClick={() => handleOpenModal()} 
            style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}
            disabled={profiles.length === 0}
          >
            <Plus size={18} /> Novo Colaborador
          </button>
        </div>

        <div className="table-filters card" style={{ marginBottom: '1.5rem', display: 'flex', gap: '1rem', alignItems: 'center', padding: '1rem' }}>
          <div className="search-box" style={{ flex: 1, background: 'var(--background)', display: 'flex', alignItems: 'center', gap: '0.75rem', padding: '0.6rem 1rem', borderRadius: '10px' }}>
            <Search size={18} className="text-muted" />
            <input 
              type="text" 
              placeholder="Buscar por nome ou e-mail..." 
              value={searchQuery}
              onChange={e => setSearchQuery(e.target.value)}
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
              {filteredCollaborators.length === 0 ? (
                <tr>
                  <td colSpan={5} style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-dim)' }}>
                    Nenhum colaborador encontrado.
                  </td>
                </tr>
              ) : filteredCollaborators.map(collab => (
                <tr key={collab.id}>
                  <td>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: 'var(--surface-hover)', border: '1px solid var(--border)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold', color: 'var(--primary)', fontSize: '0.9rem' }}>
                        {collab.name.charAt(0).toUpperCase()}
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
                      <Shield size={14} className="text-primary" /> {getProfileName(collab.profileId)}
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
                      <button 
                        className="btn-ghost" 
                        onClick={() => handleOpenModal(collab)} 
                        title="Editar colaborador" 
                        style={{ padding: '0.4rem', borderRadius: '8px' }}
                      >
                        <Edit2 size={16} />
                      </button>
                      <button 
                        className="btn-ghost" 
                        onClick={() => handleDeleteCollab(collab.id, collab.name)}
                        title="Remover colaborador" 
                        style={{ padding: '0.4rem', borderRadius: '8px', color: 'var(--danger)', borderColor: 'rgba(203, 86, 86, 0.2)' }}
                      >
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
            <form className="modal-content" onClick={e => e.stopPropagation()} onSubmit={handleSaveCollab} style={{ maxWidth: '500px', width: '95%' }}>
              <div className="modal-header">
                <h2 style={{ fontSize: '1.25rem', fontWeight: 700 }}>{editingCollab ? 'Editar Colaborador' : 'Novo Colaborador'}</h2>
                <button type="button" className="btn-ghost" onClick={handleCloseModal} style={{ padding: '0.4rem', borderRadius: '8px' }}><X size={20} /></button>
              </div>
              
              <div className="modal-body">
                <div className="form-group">
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '0.5rem', display: 'block' }}>Nome Completo</label>
                  <input 
                    type="text" 
                    className="form-control" 
                    placeholder="Ex: João da Silva" 
                    value={name}
                    onChange={e => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '0.5rem', display: 'block' }}>E-mail</label>
                  <input 
                    type="email" 
                    className="form-control" 
                    placeholder="joao@exemplo.com" 
                    value={email}
                    onChange={e => setEmail(e.target.value)}
                    required
                  />
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '0.5rem', display: 'block' }}>Perfil de Acesso</label>
                  <select 
                    className="form-control" 
                    value={profileId}
                    onChange={e => setProfileId(e.target.value)}
                    required
                  >
                    <option value="" disabled>Selecione um perfil...</option>
                    {profiles.map(profile => (
                      <option key={profile.id} value={profile.id}>{profile.name}</option>
                    ))}
                  </select>
                </div>

                <div className="form-group">
                  <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '0.5rem', display: 'block' }}>Status</label>
                  <select 
                    className="form-control" 
                    value={status}
                    onChange={e => setStatus(e.target.value as 'Ativo' | 'Inativo')}
                    required
                  >
                    <option value="Ativo">Ativo</option>
                    <option value="Inativo">Inativo</option>
                  </select>
                </div>

                {!editingCollab && (
                  <div className="form-group">
                    <label style={{ fontSize: '0.9rem', color: 'var(--text-dim)', marginBottom: '0.5rem', display: 'block' }}>Senha Provisória</label>
                    <input 
                      type="password" 
                      className="form-control" 
                      placeholder="••••••••" 
                      value={password}
                      onChange={e => setPassword(e.target.value)}
                      required
                    />
                  </div>
                )}
              </div>

              <div className="modal-footer" style={{ display: 'flex', justifyContent: 'flex-end', gap: '1rem', marginTop: '2rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border)' }}>
                <button type="button" className="btn-ghost" onClick={handleCloseModal}>Cancelar</button>
                <button type="submit" className="btn-primary" disabled={profiles.length === 0}>
                  Salvar Colaborador
                </button>
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
