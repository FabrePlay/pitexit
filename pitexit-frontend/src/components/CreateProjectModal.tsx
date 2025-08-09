import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X, Building, Globe, Upload, Loader2 } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';

interface CreateProjectModalProps {
  onClose: () => void;
}

export default function CreateProjectModal({ onClose }: CreateProjectModalProps) {
  const { createProject } = useProjects();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    domain: '',
    logo_url: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const projectData = {
        name: formData.name,
        domain: formData.domain || undefined,
        logo_url: formData.logo_url || undefined
      };

      const { error } = await createProject(projectData);
      
      if (error) {
        setError(error.message || 'Error al crear el proyecto');
      } else {
        onClose();
      }
    } catch (err) {
      setError('Error inesperado al crear el proyecto');
    } finally {
      setLoading(false);
    }
  };

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
              <Building className="w-5 h-5 text-neon-blue" />
            </div>
            <h2 className="text-xl font-bold gradient-text">Crear Proyecto</h2>
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

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Nombre del Proyecto *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-3 focus:outline-none focus:border-neon-blue transition-colors"
              placeholder="Mi Proyecto Increíble"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Dominio (Opcional)
            </label>
            <div className="relative">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="text"
                value={formData.domain}
                onChange={(e) => setFormData({ ...formData, domain: e.target.value })}
                className="w-full bg-deep-dark border border-gray-800 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-neon-blue transition-colors"
                placeholder="miproyecto.com"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Dominio personalizado para tu proyecto
            </p>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Logo URL (Opcional)
            </label>
            <div className="relative">
              <Upload className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              <input
                type="url"
                value={formData.logo_url}
                onChange={(e) => setFormData({ ...formData, logo_url: e.target.value })}
                className="w-full bg-deep-dark border border-gray-800 rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-neon-blue transition-colors"
                placeholder="https://ejemplo.com/logo.png"
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              URL de la imagen del logo de tu proyecto
            </p>
          </div>

          <div className="flex space-x-3 pt-4">
            <button
              type="submit"
              disabled={loading || !formData.name.trim()}
              className="flex-1 neon-button disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center space-x-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span>Creando...</span>
                </>
              ) : (
                <>
                  <Building className="w-4 h-4" />
                  <span>Crear Proyecto</span>
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