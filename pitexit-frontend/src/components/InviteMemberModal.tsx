import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Users, Mail, UserPlus, Loader2 } from 'lucide-react';
import { Project, Member } from '../lib/supabase';
import { useProjects } from '../hooks/useProjects';

interface InviteMemberModalProps {
  project: Project;
  onClose: () => void;
}

export default function InviteMemberModal({ project, onClose }: InviteMemberModalProps) {
  const { inviteMember } = useProjects();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    role: 'viewer' as Member['role']
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    try {
      const { error } = await inviteMember(project.id, formData.email, formData.role);
      
      if (error) {
        setError(error.message || 'Error al invitar miembro');
      } else {
        setSuccess(`Invitación enviada a ${formData.email}`);
        setFormData({ email: '', role: 'viewer' });
      }
    } catch (err) {
      setError('Error inesperado al enviar la invitación');
    } finally {
      setLoading(false);
    }
  };

  const roleOptions = [
    { value: 'viewer', label: 'Visualizador', description: 'Solo puede ver el contenido' },
    { value: 'editor', label: 'Editor', description: 'Puede editar y crear contenido' },
    { value: 'owner', label: 'Propietario', description: 'Control total del proyecto' }
  ];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-dark-surface w-full max-w-md rounded-xl p-6 relative"
      >
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 rounded-lg bg-neon-blue/10 flex items-center justify-center">
              <Users className="w-5 h-5 text-neon-blue" />
            </div>
            <div>
              <h2 className="text-xl font-bold gradient-text">Invitar Miembro</h2>
              <p className="text-sm text-gray-400">{project.name}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        {success && (
          <div className="mb-4 p-3 bg-green-500/10 border border-green-500 rounded-lg text-green-500 text-sm">
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Email del Usuario *
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-deep-dark border border-gray-800 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-neon-blue transition-colors"
                placeholder="usuario@ejemplo.com"
                required
              />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Rol *
            </label>
            <select
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as Member['role'] })}
              className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-blue transition-colors"
            >
              {roleOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
            <p className="text-xs text-gray-500 mt-1">
              {roleOptions.find(opt => opt.value === formData.role)?.description}
            </p>
          </div>

          <div className="bg-gray-800/30 rounded-lg p-4">
            <h4 className="text-sm font-medium text-white mb-2">Permisos por Rol:</h4>
            <div className="space-y-2 text-xs text-gray-400">
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-gray-500 rounded-full"></div>
                <span><strong>Visualizador:</strong> Solo lectura</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-yellow-500 rounded-full"></div>
                <span><strong>Editor:</strong> Crear y editar contenido</span>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-2 h-2 bg-red-500 rounded-full"></div>
                <span><strong>Propietario:</strong> Control total</span>
              </div>
            </div>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading || !formData.email.trim()}
              className="flex-1 neon-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Enviando...</span>
                </>
              ) : (
                <>
                  <UserPlus className="w-4 h-4" />
                  <span>Enviar Invitación</span>
                </>
              )}
            </button>
            <button
              type="button"
              onClick={onClose}
              disabled={loading}
              className="px-6 py-3 border border-gray-700 hover:border-neon-blue rounded-lg transition-colors disabled:opacity-50"
            >
              Cancelar
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}