import { useState, useEffect } from 'react';
import { supabase, Project, Member } from '../lib/supabase';
import { useAuth } from './useAuth';

export function useProjects() {
  const { user } = useAuth();
  const [projects, setProjects] = useState<Project[]>([]);
  const [currentProject, setCurrentProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (user) {
      fetchMyProjects();
      loadCurrentProject();
    } else {
      setProjects([]);
      setCurrentProject(null);
      setLoading(false);
    }
  }, [user]);

  const fetchMyProjects = async () => {
    if (!user) return;

    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('projects')
        .select(`
          *,
          members!inner(role)
        `)
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching projects:', error);
      } else {
        setProjects(data || []);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    } finally {
      setLoading(false);
    }
  };

  const createProject = async (projectData: {
    name: string;
    domain?: string;
    logo_url?: string;
  }) => {
    if (!user) return { data: null, error: new Error('No user found') };

    try {
      const { data, error } = await supabase
        .from('projects')
        .insert([projectData])
        .select()
        .single();

      if (error) throw error;

      setProjects(prev => [data, ...prev]);
      setCurrentProject(data);
      saveCurrentProject(data);
      
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const inviteMember = async (projectId: string, email: string, role: Member['role']) => {
    if (!user) return { data: null, error: new Error('No user found') };

    try {
      const { data, error } = await supabase
        .from('members')
        .insert([{
          project_id: projectId,
          invited_email: email,
          role
        }])
        .select()
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const getProjectMembers = async (projectId: string) => {
    try {
      const { data, error } = await supabase
        .from('members')
        .select(`
          *,
          users:user_id(email)
        `)
        .eq('project_id', projectId);

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  const switchProject = (project: Project) => {
    setCurrentProject(project);
    saveCurrentProject(project);
  };

  const saveCurrentProject = (project: Project) => {
    localStorage.setItem('currentProject', JSON.stringify(project));
  };

  const loadCurrentProject = () => {
    try {
      const saved = localStorage.getItem('currentProject');
      if (saved) {
        const project = JSON.parse(saved);
        setCurrentProject(project);
      }
    } catch (error) {
      console.error('Error loading current project:', error);
    }
  };

  const getCurrentProjectByDomain = async (domain: string) => {
    try {
      const { data, error } = await supabase
        .from('projects')
        .select('*')
        .eq('domain', domain)
        .single();

      if (error) throw error;
      return { data, error: null };
    } catch (error) {
      return { data: null, error };
    }
  };

  return {
    projects,
    currentProject,
    loading,
    createProject,
    inviteMember,
    getProjectMembers,
    switchProject,
    getCurrentProjectByDomain,
    refetch: fetchMyProjects,
  };
}