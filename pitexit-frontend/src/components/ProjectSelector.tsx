import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building, 
  ChevronDown, 
  Plus, 
  Users, 
  Settings,
  Check
} from 'lucide-react';
import { Project } from '../lib/supabase';
import { useProjects } from '../hooks/useProjects';

interface ProjectSelectorProps {
  onCreateProject: () => void;
  onManageMembers: (project: Project) => void;
}

export default function ProjectSelector({ onCreateProject, onManageMembers }: ProjectSelectorProps) {
  const { projects, currentProject, switchProject, loading } = useProjects();
  const [showDropdown, setShowDropdown] = useState(false);

  if (loading) {
    return (
      <div className="flex items-center space-x-2 bg-dark-surface/80 backdrop-blur-sm border border-gray-800 rounded-lg px-4 py-2">
        <Building className="w-4 h-4 text-neon-blue animate-pulse" />
        <span className="text-sm text-gray-400">Cargando...</span>
      </div>
    );
  }

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 bg-dark-surface/80 backdrop-blur-sm border border-gray-800 rounded-lg px-4 py-2 hover:border-neon-blue transition-colors"
      >
        <Building className="w-4 h-4 text-neon-blue" />
        <span className="text-sm text-white">
          {currentProject?.name || 'Seleccionar Proyecto'}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      <AnimatePresence>
        {showDropdown && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="absolute top-full right-0 mt-2 w-80 bg-dark-surface border border-gray-800 rounded-lg shadow-xl z-50"
          >
            <div className="p-2">
              {projects.length === 0 ? (
                <div className="text-center py-6">
                  <Building className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                  <p className="text-gray-400 text-sm mb-3">No tienes proyectos</p>
                  <button
                    onClick={() => {
                      onCreateProject();
                      setShowDropdown(false);
                    }}
                    className="text-neon-blue hover:text-white text-sm flex items-center justify-center space-x-1 mx-auto"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Crear Primer Proyecto</span>
                  </button>
                </div>
              ) : (
                <>
                  <div className="max-h-60 overflow-y-auto">
                    {projects.map((project) => (
                      <div key={project.id} className="group">
                        <button
                          onClick={() => {
                            switchProject(project);
                            setShowDropdown(false);
                          }}
                          className={`w-full text-left px-3 py-3 rounded-lg transition-colors flex items-center justify-between ${
                            currentProject?.id === project.id
                              ? 'bg-neon-blue/10 text-neon-blue'
                              : 'text-gray-300 hover:bg-gray-800'
                          }`}
                        >
                          <div className="flex items-center space-x-3">
                            {project.logo_url ? (
                              <img 
                                src={project.logo_url} 
                                alt={project.name}
                                className="w-8 h-8 rounded-lg object-cover"
                              />
                            ) : (
                              <div className="w-8 h-8 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                                <Building className="w-4 h-4 text-neon-blue" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium">{project.name}</p>
                              {project.domain && (
                                <p className="text-xs text-gray-500">{project.domain}</p>
                              )}
                            </div>
                          </div>
                          <div className="flex items-center space-x-2">
                            {currentProject?.id === project.id && (
                              <Check className="w-4 h-4 text-neon-blue" />
                            )}
                            <button
                              onClick={(e) => {
                                e.stopPropagation();
                                onManageMembers(project);
                                setShowDropdown(false);
                              }}
                              className="opacity-0 group-hover:opacity-100 p-1 hover:bg-gray-700 rounded transition-all"
                              title="Gestionar miembros"
                            >
                              <Users className="w-3 h-3" />
                            </button>
                          </div>
                        </button>
                      </div>
                    ))}
                  </div>
                  
                  <div className="border-t border-gray-800 mt-2 pt-2">
                    <button
                      onClick={() => {
                        onCreateProject();
                        setShowDropdown(false);
                      }}
                      className="w-full text-left px-3 py-2 rounded-lg text-neon-blue hover:bg-gray-800 transition-colors flex items-center space-x-2"
                    >
                      <Plus className="w-4 h-4" />
                      <span>Crear Nuevo Proyecto</span>
                    </button>
                  </div>
                </>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}