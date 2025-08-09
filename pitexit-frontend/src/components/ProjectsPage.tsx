import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Building, 
  Plus, 
  Users, 
  Calendar, 
  Globe,
  MoreVertical,
  Edit3,
  Trash2,
  UserPlus
} from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { Project } from '../lib/supabase';
import CreateProjectModal from './CreateProjectModal';
import InviteMemberModal from './InviteMemberModal';

interface ProjectsPageProps {
  onClose: () => void;
}

export default function ProjectsPage({ onClose }: ProjectsPageProps) {
  const { projects, currentProject, switchProject, loading } = useProjects();
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showInviteModal, setShowInviteModal] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  const handleInviteMembers = (project: Project) => {
    setSelectedProject(project);
    setShowInviteModal(true);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-deep-dark flex items-center justify-center">
        <div className="text-center">
          <Building className="w-12 h-12 text-neon-blue mx-auto mb-4 animate-pulse" />
          <p className="text-gray-400">Cargando proyectos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-deep-dark">
      {/* Modals */}
      {showCreateModal && (
        <CreateProjectModal onClose={() => setShowCreateModal(false)} />
      )}
      
      {showInviteModal && selectedProject && (
        <InviteMemberModal 
          project={selectedProject}
          onClose={() => {
            setShowInviteModal(false);
            setSelectedProject(null);
          }}
        />
      )}

      {/* Header */}
      <div className="bg-dark-surface border-b border-gray-800 p-6">
        <div className="max-w-6xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              ←
            </button>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                <Building className="w-5 h-5 text-neon-blue" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">Mis Proyectos</h1>
                <p className="text-gray-400">Gestiona todos tus proyectos desde aquí</p>
              </div>
            </div>
          </div>
          <button
            onClick={() => setShowCreateModal(true)}
            className="neon-button flex items-center space-x-2"
          >
            <Plus className="w-4 h-4" />
            <span>Nuevo Proyecto</span>
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        {projects.length === 0 ? (
          <div className="text-center py-20">
            <Building className="w-20 h-20 text-gray-600 mx-auto mb-6" />
            <h2 className="text-2xl font-bold text-white mb-4">No tienes proyectos</h2>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Crea tu primer proyecto para comenzar a organizar tu trabajo y colaborar con tu equipo.
            </p>
            <button
              onClick={() => setShowCreateModal(true)}
              className="neon-button flex items-center space-x-2 mx-auto"
            >
              <Plus className="w-4 h-4" />
              <span>Crear Primer Proyecto</span>
            </button>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {projects.map((project) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className={`feature-card cursor-pointer transition-all duration-300 ${
                  currentProject?.id === project.id
                    ? 'border-neon-blue shadow-[0_0_30px_rgba(0,242,254,0.2)]'
                    : 'hover:border-gray-700'
                }`}
                onClick={() => switchProject(project)}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center space-x-3">
                    {project.logo_url ? (
                      <img 
                        src={project.logo_url} 
                        alt={project.name}
                        className="w-12 h-12 rounded-lg object-cover"
                      />
                    ) : (
                      <div className="w-12 h-12 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                        <Building className="w-6 h-6 text-neon-blue" />
                      </div>
                    )}
                    <div>
                      <h3 className="font-semibold text-white">{project.name}</h3>
                      {project.domain && (
                        <div className="flex items-center text-sm text-gray-400 mt-1">
                          <Globe className="w-3 h-3 mr-1" />
                          {project.domain}
                        </div>
                      )}
                    </div>
                  </div>
                  
                  {currentProject?.id === project.id && (
                    <div className="px-2 py-1 bg-neon-blue/10 text-neon-blue rounded text-xs font-medium">
                      Actual
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-between text-sm text-gray-400 mb-4">
                  <div className="flex items-center">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(project.created_at).toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Users className="w-4 h-4 mr-1" />
                    {Math.floor(Math.random() * 5) + 1} miembros
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInviteMembers(project);
                    }}
                    className="flex-1 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors flex items-center justify-center space-x-2 text-sm"
                  >
                    <UserPlus className="w-4 h-4" />
                    <span>Invitar</span>
                  </button>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      // Handle project settings
                    }}
                    className="p-2 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors"
                  >
                    <MoreVertical className="w-4 h-4" />
                  </button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}