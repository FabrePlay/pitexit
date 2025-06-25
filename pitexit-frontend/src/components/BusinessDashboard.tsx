import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Building,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  BarChart3,
  Edit3,
  Plus,
  ChevronRight,
  ChevronDown,
  Star,
  MapPin,
  Briefcase,
  Globe,
  Phone,
  Mail
} from 'lucide-react';

interface WorkPlan {
  id: string;
  businessName: string;
  title: string;
  description: string;
  phases: WorkPhase[];
  createdAt: Date;
  estimatedDuration: string;
  priority: 'high' | 'medium' | 'low';
}

interface WorkPhase {
  id: string;
  title: string;
  description: string;
  tasks: Task[];
  status: 'pending' | 'in-progress' | 'completed';
  estimatedDays: number;
}

interface Task {
  id: string;
  title: string;
  description: string;
  status: 'pending' | 'in-progress' | 'completed';
  priority: 'high' | 'medium' | 'low';
  estimatedHours: number;
  dueDate?: Date;
  assignee?: string;
}

interface BusinessDashboardProps {
  businessName: string;
  workPlans: WorkPlan[];
  currentUser: any;
}

// Datos simulados del perfil de empresa
const getBusinessProfile = (businessName: string) => {
  const profiles: { [key: string]: any } = {
    'Café Artesanal': {
      name: 'Café Artesanal',
      description: 'Cafetería especializada en café de origen único y métodos de preparación artesanales',
      industry: 'Alimentación y Bebidas',
      stage: 'Operando',
      foundedDate: '2023-01-15',
      employees: 5,
      location: 'Santiago, Chile',
      website: 'www.cafeartesanal.cl',
      email: 'contacto@cafeartesanal.cl',
      phone: '+56 9 8765 4321',
      revenue: '$15.000.000',
      targetMarket: 'Amantes del café premium, profesionales urbanos',
      businessModel: 'B2C - Venta directa y suscripciones',
      keyProducts: ['Café de origen', 'Métodos de preparación', 'Cursos de barista'],
      competitors: ['Starbucks', 'Juan Valdez', 'Café Altura'],
      uniqueValue: 'Experiencia completa del café desde el grano hasta la taza',
      challenges: ['Competencia con grandes cadenas', 'Costos de importación', 'Educación del mercado'],
      goals: ['Expandir a 3 sucursales', 'Lanzar línea de productos retail', 'Certificación orgánica']
    },
    'TechStart': {
      name: 'TechStart',
      description: 'Plataforma SaaS para gestión de proyectos con IA integrada',
      industry: 'Tecnología',
      stage: 'MVP',
      foundedDate: '2024-03-01',
      employees: 3,
      location: 'Santiago, Chile',
      website: 'www.techstart.cl',
      email: 'hello@techstart.cl',
      phone: '+56 9 5555 1234',
      revenue: '$2.000.000',
      targetMarket: 'Equipos de desarrollo, startups, empresas medianas',
      businessModel: 'SaaS - Suscripción mensual',
      keyProducts: ['Gestión de proyectos', 'IA para estimaciones', 'Analytics avanzados'],
      competitors: ['Jira', 'Asana', 'Monday.com'],
      uniqueValue: 'IA que predice retrasos y optimiza recursos automáticamente',
      challenges: ['Competencia establecida', 'Adquisición de usuarios', 'Desarrollo de IA'],
      goals: ['100 usuarios pagos', 'Ronda de inversión Serie A', 'Expansión regional']
    }
  };

  return profiles[businessName] || {
    name: businessName,
    description: 'Descripción no disponible',
    industry: 'No especificada',
    stage: 'Idea',
    foundedDate: new Date().toISOString().split('T')[0],
    employees: 1,
    location: 'Chile',
    website: '',
    email: '',
    phone: '',
    revenue: '$0',
    targetMarket: 'No definido',
    businessModel: 'No definido',
    keyProducts: [],
    competitors: [],
    uniqueValue: '',
    challenges: [],
    goals: []
  };
};

// Datos simulados de métricas
const getBusinessMetrics = (businessName: string) => {
  return {
    totalTasks: Math.floor(Math.random() * 50) + 20,
    completedTasks: Math.floor(Math.random() * 30) + 10,
    inProgressTasks: Math.floor(Math.random() * 10) + 5,
    overdueTasks: Math.floor(Math.random() * 5) + 1,
    completionRate: Math.floor(Math.random() * 40) + 60,
    avgTaskTime: Math.floor(Math.random() * 10) + 5,
    activeWorkPlans: Math.floor(Math.random() * 3) + 1,
    upcomingDeadlines: Math.floor(Math.random() * 8) + 2
  };
};

export default function BusinessDashboard({ businessName, workPlans, currentUser }: BusinessDashboardProps) {
  const [expandedPhases, setExpandedPhases] = useState<{ [key: string]: boolean }>({});
  const [selectedWorkPlan, setSelectedWorkPlan] = useState<string | null>(
    workPlans.length > 0 ? workPlans[0].id : null
  );

  const businessProfile = getBusinessProfile(businessName);
  const metrics = getBusinessMetrics(businessName);

  const togglePhase = (phaseId: string) => {
    setExpandedPhases(prev => ({
      ...prev,
      [phaseId]: !prev[phaseId]
    }));
  };

  const updateTaskStatus = (workPlanId: string, phaseId: string, taskId: string, newStatus: Task['status']) => {
    // En una implementación real, esto actualizaría el estado global
    console.log('Updating task status:', { workPlanId, phaseId, taskId, newStatus });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'text-green-500';
      case 'in-progress': return 'text-yellow-500';
      case 'pending': return 'text-gray-400';
      default: return 'text-gray-400';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'in-progress': return <Clock className="w-4 h-4" />;
      case 'pending': return <AlertCircle className="w-4 h-4" />;
      default: return <AlertCircle className="w-4 h-4" />;
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'text-red-500 bg-red-500/10';
      case 'medium': return 'text-yellow-500 bg-yellow-500/10';
      case 'low': return 'text-green-500 bg-green-500/10';
      default: return 'text-gray-500 bg-gray-500/10';
    }
  };

  const currentWorkPlan = workPlans.find(wp => wp.id === selectedWorkPlan);

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold gradient-text">Dashboard - {businessName}</h1>
          <p className="text-gray-400 mt-1">Gestiona el progreso y las tareas de tu negocio</p>
        </div>
        <div className="flex items-center space-x-3">
          <div className="text-right">
            <p className="text-sm text-gray-400">Última actualización</p>
            <p className="text-white font-medium">Hace 2 horas</p>
          </div>
        </div>
      </div>

      {/* Business Profile Card */}
      <div className="feature-card">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-4">
            <div className="w-16 h-16 rounded-xl bg-neon-blue/10 flex items-center justify-center">
              <Building className="w-8 h-8 text-neon-blue" />
            </div>
            <div>
              <h2 className="text-xl font-bold text-white">{businessProfile.name}</h2>
              <p className="text-gray-400">{businessProfile.description}</p>
              <div className="flex items-center space-x-4 mt-2 text-sm text-gray-400">
                <span className="flex items-center">
                  <Briefcase className="w-3 h-3 mr-1" />
                  {businessProfile.industry}
                </span>
                <span className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {businessProfile.location}
                </span>
                <span className="flex items-center">
                  <Star className="w-3 h-3 mr-1" />
                  {businessProfile.stage}
                </span>
              </div>
            </div>
          </div>
          <button className="text-gray-400 hover:text-white transition-colors">
            <Edit3 className="w-5 h-5" />
          </button>
        </div>

        <div className="grid md:grid-cols-3 gap-4 text-sm">
          <div>
            <p className="text-gray-400">Modelo de Negocio</p>
            <p className="text-white font-medium">{businessProfile.businessModel}</p>
          </div>
          <div>
            <p className="text-gray-400">Mercado Objetivo</p>
            <p className="text-white font-medium">{businessProfile.targetMarket}</p>
          </div>
          <div>
            <p className="text-gray-400">Ingresos Actuales</p>
            <p className="text-white font-medium">{businessProfile.revenue}</p>
          </div>
        </div>

        {businessProfile.website && (
          <div className="flex items-center space-x-4 mt-4 pt-4 border-t border-gray-800 text-sm">
            {businessProfile.website && (
              <a href={`https://${businessProfile.website}`} target="_blank" rel="noopener noreferrer" 
                 className="flex items-center text-neon-blue hover:text-white transition-colors">
                <Globe className="w-3 h-3 mr-1" />
                {businessProfile.website}
              </a>
            )}
            {businessProfile.email && (
              <a href={`mailto:${businessProfile.email}`} 
                 className="flex items-center text-gray-400 hover:text-white transition-colors">
                <Mail className="w-3 h-3 mr-1" />
                {businessProfile.email}
              </a>
            )}
            {businessProfile.phone && (
              <span className="flex items-center text-gray-400">
                <Phone className="w-3 h-3 mr-1" />
                {businessProfile.phone}
              </span>
            )}
          </div>
        )}
      </div>

      {/* Metrics Overview */}
      <div className="grid md:grid-cols-4 gap-6">
        <div className="feature-card text-center">
          <div className="w-12 h-12 rounded-full bg-neon-blue/10 flex items-center justify-center mx-auto mb-3">
            <Target className="w-6 h-6 text-neon-blue" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{metrics.totalTasks}</h3>
          <p className="text-gray-400 text-sm">Tareas Totales</p>
        </div>

        <div className="feature-card text-center">
          <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
            <CheckCircle className="w-6 h-6 text-green-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{metrics.completedTasks}</h3>
          <p className="text-gray-400 text-sm">Completadas</p>
        </div>

        <div className="feature-card text-center">
          <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-3">
            <Clock className="w-6 h-6 text-yellow-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{metrics.inProgressTasks}</h3>
          <p className="text-gray-400 text-sm">En Progreso</p>
        </div>

        <div className="feature-card text-center">
          <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
            <TrendingUp className="w-6 h-6 text-purple-500" />
          </div>
          <h3 className="text-2xl font-bold text-white mb-1">{metrics.completionRate}%</h3>
          <p className="text-gray-400 text-sm">Tasa de Éxito</p>
        </div>
      </div>

      {/* Work Plans Section */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Work Plans List */}
        <div className="lg:col-span-1">
          <div className="feature-card">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold">Planes de Trabajo</h3>
              <button className="text-neon-blue hover:text-white transition-colors">
                <Plus className="w-5 h-5" />
              </button>
            </div>

            {workPlans.length === 0 ? (
              <div className="text-center py-8">
                <Target className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                <p className="text-gray-400 text-sm mb-4">No hay planes de trabajo</p>
                <p className="text-gray-500 text-xs">
                  Usa el chat IA para crear un plan de trabajo personalizado
                </p>
              </div>
            ) : (
              <div className="space-y-3">
                {workPlans.map(workPlan => (
                  <button
                    key={workPlan.id}
                    onClick={() => setSelectedWorkPlan(workPlan.id)}
                    className={`w-full text-left p-4 rounded-lg border transition-colors ${
                      selectedWorkPlan === workPlan.id
                        ? 'border-neon-blue bg-neon-blue/5'
                        : 'border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between mb-2">
                      <h4 className="font-medium text-white">{workPlan.title}</h4>
                      <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(workPlan.priority)}`}>
                        {workPlan.priority}
                      </span>
                    </div>
                    <p className="text-gray-400 text-sm mb-2">{workPlan.description}</p>
                    <div className="flex items-center justify-between text-xs text-gray-500">
                      <span>{workPlan.phases.length} fases</span>
                      <span>{workPlan.estimatedDuration}</span>
                    </div>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Work Plan Details */}
        <div className="lg:col-span-2">
          {currentWorkPlan ? (
            <div className="feature-card">
              <div className="flex items-center justify-between mb-6">
                <div>
                  <h3 className="text-xl font-bold text-white">{currentWorkPlan.title}</h3>
                  <p className="text-gray-400">{currentWorkPlan.description}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-400">Duración estimada</p>
                  <p className="text-white font-medium">{currentWorkPlan.estimatedDuration}</p>
                </div>
              </div>

              {/* Phases */}
              <div className="space-y-4">
                {currentWorkPlan.phases.map((phase, phaseIndex) => (
                  <div key={phase.id} className="border border-gray-800 rounded-lg">
                    <button
                      onClick={() => togglePhase(phase.id)}
                      className="w-full flex items-center justify-between p-4 text-left hover:bg-gray-800/50 transition-colors"
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full flex items-center justify-center ${getStatusColor(phase.status)}`}>
                          {getStatusIcon(phase.status)}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">
                            Fase {phaseIndex + 1}: {phase.title}
                          </h4>
                          <p className="text-gray-400 text-sm">{phase.description}</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <span className="text-sm text-gray-400">{phase.tasks.length} tareas</span>
                        {expandedPhases[phase.id] ? (
                          <ChevronDown className="w-4 h-4 text-gray-400" />
                        ) : (
                          <ChevronRight className="w-4 h-4 text-gray-400" />
                        )}
                      </div>
                    </button>

                    {expandedPhases[phase.id] && (
                      <div className="border-t border-gray-800 p-4">
                        <div className="space-y-3">
                          {phase.tasks.map(task => (
                            <div key={task.id} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                              <div className="flex items-center space-x-3">
                                <button
                                  onClick={() => {
                                    const newStatus = task.status === 'completed' ? 'pending' : 
                                                   task.status === 'pending' ? 'in-progress' : 'completed';
                                    updateTaskStatus(currentWorkPlan.id, phase.id, task.id, newStatus);
                                  }}
                                  className={`w-6 h-6 rounded-full flex items-center justify-center transition-colors ${
                                    task.status === 'completed' 
                                      ? 'bg-green-500 text-white' 
                                      : 'border-2 border-gray-600 hover:border-neon-blue'
                                  }`}
                                >
                                  {task.status === 'completed' && <CheckCircle className="w-4 h-4" />}
                                </button>
                                <div>
                                  <h5 className={`font-medium ${
                                    task.status === 'completed' ? 'text-gray-400 line-through' : 'text-white'
                                  }`}>
                                    {task.title}
                                  </h5>
                                  <p className="text-gray-400 text-sm">{task.description}</p>
                                  <div className="flex items-center space-x-4 mt-1 text-xs text-gray-500">
                                    <span>{task.estimatedHours}h estimadas</span>
                                    {task.dueDate && (
                                      <span className="flex items-center">
                                        <Calendar className="w-3 h-3 mr-1" />
                                        {task.dueDate.toLocaleDateString()}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className={`px-2 py-1 rounded text-xs ${getPriorityColor(task.priority)}`}>
                                  {task.priority}
                                </span>
                                <div className={`w-2 h-2 rounded-full ${getStatusColor(task.status)}`} />
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          ) : (
            <div className="feature-card">
              <div className="text-center py-12">
                <BarChart3 className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold mb-2">No hay plan seleccionado</h3>
                <p className="text-gray-400">
                  {workPlans.length === 0 
                    ? 'Crea tu primer plan de trabajo usando el chat IA'
                    : 'Selecciona un plan de trabajo para ver los detalles'
                  }
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}