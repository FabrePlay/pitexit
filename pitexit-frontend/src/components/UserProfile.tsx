import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  Mail, 
  Calendar, 
  Building, 
  Crown, 
  Settings, 
  Bell, 
  Shield, 
  CreditCard, 
  BarChart3,
  ArrowLeft,
  Edit3,
  Save,
  X,
  Plus,
  Trash2,
  Eye,
  EyeOff,
  Check,
  AlertCircle,
  Zap,
  Target,
  TrendingUp,
  Award,
  Phone,
  MapPin,
  Briefcase,
  Star
} from 'lucide-react';

interface UserProfileProps {
  user: {
    email: string;
    password: string;
    username: string;
    firstName?: string;
    lastName?: string;
    phone?: string;
    country?: string;
    city?: string;
    industry?: string;
    experience?: string;
    plan: string;
    businesses: string[];
  };
  onClose: () => void;
  onUpdateUser: (updates: Partial<User>) => Promise<{ data: User | null; error: Error | null; }>;
  businessProfiles?: any;
  onNavigateToPlayground?: (businessName: string) => void;
}

interface ProfileStats {
  totalTokensUsed: number;
  totalTokensAvailable: number;
  businessesCreated: number;
  maxBusinesses: number;
  fundsFound: number;
  contentGenerated: number;
  successRate: number;
}

const PLAN_FEATURES = {
  'Gratis': {
    tokens: 50,
    businesses: 1,
    features: ['Chat con IA', 'Acceso a Fondos Públicos'],
    color: 'text-gray-400',
    bgColor: 'bg-gray-500/10'
  },
  'Básico': {
    tokens: 300,
    businesses: 1,
    features: ['Fondos Públicos', 'Redes Sociales', 'Instagram Automation'],
    color: 'text-blue-400',
    bgColor: 'bg-blue-500/10'
  },
  'Pro': {
    tokens: 700,
    businesses: 3,
    features: ['Todos los Agentes', 'Prioridad en Soporte', 'Analytics Avanzados'],
    color: 'text-neon-blue',
    bgColor: 'bg-neon-blue/10'
  },
  'Premium': {
    tokens: 1500,
    businesses: 10,
    features: ['Uso Ilimitado', 'Soporte 24/7', 'API Access'],
    color: 'text-purple-400',
    bgColor: 'bg-purple-500/10'
  },
  'Agencia Básica': {
    tokens: 7000,
    businesses: 10,
    features: ['Dashboard de Clientes', 'Reportes Básicos'],
    color: 'text-green-400',
    bgColor: 'bg-green-500/10'
  },
  'Agencia Pro': {
    tokens: 20000,
    businesses: 50,
    features: ['Analytics Avanzados', 'API Access'],
    color: 'text-yellow-400',
    bgColor: 'bg-yellow-500/10'
  },
  'Agencia Premium': {
    tokens: 50000,
    businesses: 100,
    features: ['Soporte Prioritario', 'White Label'],
    color: 'text-red-400',
    bgColor: 'bg-red-500/10'
  }
};

export default function UserProfile({ 
  user, 
  onClose, 
  onUpdateUser, 
  businessProfiles,
  onNavigateToPlayground 
}: UserProfileProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [editForm, setEditForm] = useState({
    username: user.username,
    email: user.email,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    phone: user.phone || '',
    city: user.city || '',
    industry: user.industry || '',
    experience: user.experience || 'Principiante',
  });
  const [notifications, setNotifications] = useState({
    emailUpdates: true,
    fundAlerts: true,
    contentReminders: false,
    weeklyReports: true
  });

  // Estadísticas simuladas basadas en el plan del usuario
  const getStatsForPlan = (plan: string): ProfileStats => {
    const planInfo = PLAN_FEATURES[plan as keyof typeof PLAN_FEATURES];
    const usagePercentage = Math.random() * 0.7 + 0.1; // 10-80% de uso
    
    return {
      totalTokensUsed: Math.floor(planInfo.tokens * usagePercentage),
      totalTokensAvailable: planInfo.tokens,
      businessesCreated: user.businesses?.length || 0,
      maxBusinesses: planInfo.businesses,
      fundsFound: Math.floor(Math.random() * 15) + 3,
      contentGenerated: Math.floor(Math.random() * 50) + 10,
      successRate: Math.floor(Math.random() * 30) + 65
    };
  };

  const stats = getStatsForPlan(user.plan);
  const planInfo = PLAN_FEATURES[user.plan as keyof typeof PLAN_FEATURES];

  const handleSaveProfile = () => {
    const updatesToSend = {
      username: editForm.username,
      first_name: editForm.firstName,
      last_name: editForm.lastName,
      phone: editForm.phone,
      city: editForm.city,
      industry: editForm.industry,
      experience: editForm.experience,
    };

    console.log('Saving profile updates:', updatesToSend);
    
    onUpdateUser(updatesToSend).then(result => {
      if (result.error) {
        console.error('Error updating profile:', result.error);
        alert('Error al guardar los cambios: ' + result.error.message);
      } else {
        console.log('Profile updated successfully:', result.data);
        alert('Perfil actualizado correctamente');
      }
    }).catch(error => {
      console.error('Error updating profile:', error);
      alert('Error inesperado al guardar los cambios');
    });
    
    setIsEditing(false);
  };

  const handleDeleteBusiness = (businessName: string) => {
    const updatedUser = {
      ...user,
      businesses: user.businesses.filter(b => b !== businessName)
    };
    onUpdateUser(updatedUser);
  };

  const tabs = [
    { id: 'profile', label: 'Perfil', icon: User },
    { id: 'plan', label: 'Plan', icon: Crown },
    { id: 'businesses', label: 'Negocios', icon: Building },
    { id: 'stats', label: 'Estadísticas', icon: BarChart3 },
    { id: 'settings', label: 'Configuración', icon: Settings }
  ];

  return (
    <div className="fixed inset-0 bg-deep-dark z-50 overflow-hidden">
      <div className="h-full flex">
        {/* Sidebar */}
        <div className="w-64 bg-dark-surface border-r border-gray-800 flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold gradient-text">Mi Perfil</h1>
              <button
                onClick={onClose}
                className="text-gray-400 hover:text-white transition-colors"
              >
                <ArrowLeft className="w-5 h-5" />
              </button>
            </div>
          </div>

          {/* User Info */}
          <div className="p-6 border-b border-gray-800">
            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 rounded-full bg-neon-blue/10 flex items-center justify-center">
                <User className="w-6 h-6 text-neon-blue" />
              </div>
              <div>
                <h2 className="font-semibold text-white">
                  {user.firstName && user.lastName 
                    ? `${user.firstName} ${user.lastName}` 
                    : user.username
                  }
                </h2>
                <p className="text-sm text-gray-400">{user.email}</p>
              </div>
            </div>
            <div className={`mt-3 inline-flex items-center px-3 py-1 rounded-full text-xs font-medium ${planInfo.bgColor} ${planInfo.color}`}>
              <Crown className="w-3 h-3 mr-1" />
              Plan {user.plan}
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4">
            <div className="space-y-2">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                    activeTab === tab.id
                      ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                      : 'text-gray-400 hover:text-white hover:bg-gray-800'
                  }`}
                >
                  <tab.icon className="w-5 h-5" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </nav>
        </div>

        {/* Main Content */}
        <div className="flex-1 overflow-y-auto">
          <div className="p-8">
            {/* Profile Tab */}
            {activeTab === 'profile' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Información Personal</h2>
                  {!isEditing ? (
                    <button
                      onClick={() => setIsEditing(true)}
                      className="neon-button inline-flex items-center"
                    >
                      <Edit3 className="w-4 h-4 mr-2" />
                      Editar
                    </button>
                  ) : (
                    <div className="flex space-x-2">
                      <button
                        onClick={handleSaveProfile}
                        className="neon-button inline-flex items-center"
                      >
                        <Save className="w-4 h-4 mr-2" />
                        Guardar
                      </button>
                      <button
                        onClick={() => {
                          setIsEditing(false);
                          setEditForm({
                            username: user.username,
                            email: user.email,
                            firstName: user.firstName || '',
                            lastName: user.lastName || '',
                            phone: user.phone || '',
                            city: user.city || '',
                            industry: user.industry || '',
                            experience: user.experience || 'Principiante',
                            currentPassword: '',
                            newPassword: '',
                            confirmPassword: ''
                          });
                        }}
                        className="border border-gray-700 hover:border-red-500 px-4 py-2 rounded-lg transition-colors"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>

                <div className="feature-card space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Nombre
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.firstName}
                          onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                          className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                          placeholder="Juan"
                        />
                      ) : (
                        <p className="text-white">{user.firstName || 'No especificado'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Apellido
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.lastName}
                          onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                          className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                          placeholder="Pérez"
                        />
                      ) : (
                        <p className="text-white">{user.lastName || 'No especificado'}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Nombre de Usuario
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.username}
                          onChange={(e) => setEditForm({ ...editForm, username: e.target.value })}
                          className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                        />
                      ) : (
                        <p className="text-white">{user.username}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Email
                      </label>
                      {isEditing ? (
                        <input
                          type="email"
                          value={editForm.email}
                          onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                          className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                        />
                      ) : (
                        <p className="text-white">{user.email}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Teléfono
                      </label>
                      {isEditing ? (
                        <input
                          type="tel"
                          value={editForm.phone}
                          onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                          className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                          placeholder="+56 9 1234 5678"
                        />
                      ) : (
                        <p className="text-white">{user.phone || 'No especificado'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Ciudad
                      </label>
                      {isEditing ? (
                        <input
                          type="text"
                          value={editForm.city}
                          onChange={(e) => setEditForm({ ...editForm, city: e.target.value })}
                          className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                          placeholder="Santiago"
                        />
                      ) : (
                        <p className="text-white">{user.city || 'No especificado'}</p>
                      )}
                    </div>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Industria
                      </label>
                      {isEditing ? (
                        <select
                          value={editForm.industry}
                          onChange={(e) => setEditForm({ ...editForm, industry: e.target.value })}
                          className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                        >
                          <option value="">Seleccionar</option>
                          <option value="Tecnología">Tecnología</option>
                          <option value="Alimentación">Alimentación</option>
                          <option value="Retail">Retail</option>
                          <option value="Servicios">Servicios</option>
                          <option value="Salud">Salud</option>
                          <option value="Educación">Educación</option>
                          <option value="Fintech">Fintech</option>
                          <option value="Marketing">Marketing</option>
                          <option value="Otro">Otro</option>
                        </select>
                      ) : (
                        <p className="text-white">{user.industry || 'No especificado'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        Experiencia
                      </label>
                      {isEditing ? (
                        <select
                          value={editForm.experience}
                          onChange={(e) => setEditForm({ ...editForm, experience: e.target.value })}
                          className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                        >
                          <option value="Principiante">Principiante</option>
                          <option value="Intermedio">Intermedio</option>
                          <option value="Avanzado">Avanzado</option>
                          <option value="Experto">Experto</option>
                        </select>
                      ) : (
                        <p className="text-white">{user.experience || 'Principiante'}</p>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Plan Tab */}
            {activeTab === 'plan' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl"
              >
                <h2 className="text-2xl font-bold mb-6">Mi Plan</h2>
                
                <div className="grid md:grid-cols-2 gap-6 mb-8">
                  <div className="feature-card">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-semibold">Plan Actual</h3>
                      <div className={`px-3 py-1 rounded-full text-sm font-medium ${planInfo.bgColor} ${planInfo.color}`}>
                        {user.plan}
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-400">Tokens disponibles</span>
                        <span className="text-white">{planInfo.tokens.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-400">Negocios máximos</span>
                        <span className="text-white">{planInfo.businesses}</span>
                      </div>
                    </div>
                  </div>

                  <div className="feature-card">
                    <h3 className="text-lg font-semibold mb-4">Uso Actual</h3>
                    <div className="space-y-4">
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Tokens usados</span>
                          <span className="text-white">{stats.totalTokensUsed.toLocaleString()} / {stats.totalTokensAvailable.toLocaleString()}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div 
                            className="bg-neon-blue h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(stats.totalTokensUsed / stats.totalTokensAvailable) * 100}%` }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="flex justify-between mb-2">
                          <span className="text-gray-400">Negocios creados</span>
                          <span className="text-white">{stats.businessesCreated} / {stats.maxBusinesses}</span>
                        </div>
                        <div className="w-full bg-gray-800 rounded-full h-2">
                          <div 
                            className="bg-green-500 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${(stats.businessesCreated / stats.maxBusinesses) * 100}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="feature-card">
                  <h3 className="text-lg font-semibold mb-4">Características del Plan</h3>
                  <div className="grid md:grid-cols-2 gap-4">
                    {planInfo.features.map((feature, index) => (
                      <div key={index} className="flex items-center space-x-2">
                        <Check className="w-4 h-4 text-green-500" />
                        <span className="text-gray-300">{feature}</span>
                      </div>
                    ))}
                  </div>
                  <div className="mt-6 pt-6 border-t border-gray-800">
                    <button className="neon-button">
                      Actualizar Plan
                    </button>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Businesses Tab */}
            {activeTab === 'businesses' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-4xl"
              >
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-2xl font-bold">Mis Negocios</h2>
                  <div className="text-sm text-gray-400">
                    {user.businesses?.length || 0} de {planInfo.businesses} negocios
                  </div>
                </div>
                {(user.businesses?.length || 0) === 0 ? (
                  <div className="feature-card text-center py-12">
                    <Building className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                    <h3 className="text-lg font-semibold mb-2">No tienes negocios creados</h3>
                    <p className="text-gray-400 mb-6">Crea tu primer negocio para comenzar a usar Pit Exit</p>
                    <button className="neon-button inline-flex items-center">
                      <Plus className="w-4 h-4 mr-2" />
                      Crear Primer Negocio
                    </button>
                  </div>
                ) : (
                  <div className="grid md:grid-cols-2 gap-6">
                    {(user.businesses || []).map((business, index) => {
                      const businessProfile = businessProfiles?.[business];
                      return (
                        <div key={index} className="feature-card">
                          <div className="flex items-start justify-between mb-4">
                            <div className="flex items-center space-x-3">
                              <div className="w-10 h-10 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                                <Building className="w-5 h-5 text-neon-blue" />
                              </div>
                              <div>
                                <h3 className="font-semibold text-white">{business}</h3>
                                <p className="text-sm text-gray-400">
                                  {businessProfile?.industry || 'Industria no especificada'}
                                </p>
                              </div>
                            </div>
                            <button
                              onClick={() => handleDeleteBusiness(business)}
                              className="text-gray-400 hover:text-red-500 transition-colors"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>
                          
                          {businessProfile && (
                            <div className="space-y-2 text-sm mb-4">
                              <p className="text-gray-300">{businessProfile.description}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-400">
                                <span className="flex items-center">
                                  <Briefcase className="w-3 h-3 mr-1" />
                                  {businessProfile.stage}
                                </span>
                                <span className="flex items-center">
                                  <MapPin className="w-3 h-3 mr-1" />
                                  {businessProfile.location}
                                </span>
                              </div>
                            </div>
                          )}
                          
                          <div className="space-y-2 text-sm">
                            <div className="flex justify-between">
                              <span className="text-gray-400">Fondos encontrados</span>
                              <span className="text-white">{Math.floor(Math.random() * 8) + 2}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Contenido generado</span>
                              <span className="text-white">{Math.floor(Math.random() * 25) + 5}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400">Última actividad</span>
                              <span className="text-white">Hace {Math.floor(Math.random() * 7) + 1} días</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {(user.businesses?.length || 0) < planInfo.businesses && (
                      <div className="feature-card border-dashed border-gray-600 flex items-center justify-center py-12">
                        <button className="text-center">
                          <Plus className="w-8 h-8 text-gray-600 mx-auto mb-2" />
                          <p className="text-gray-400">Agregar Nuevo Negocio</p>
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </motion.div>
            )}

            {/* Stats Tab */}
            {activeTab === 'stats' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-6xl"
              >
                <h2 className="text-2xl font-bold mb-6">Estadísticas</h2>
                
                <div className="grid md:grid-cols-4 gap-6 mb-8">
                  <div className="feature-card text-center">
                    <div className="w-12 h-12 rounded-full bg-neon-blue/10 flex items-center justify-center mx-auto mb-3">
                      <Zap className="w-6 h-6 text-neon-blue" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{stats.totalTokensUsed.toLocaleString()}</h3>
                    <p className="text-gray-400 text-sm">Tokens Usados</p>
                  </div>

                  <div className="feature-card text-center">
                    <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-3">
                      <Target className="w-6 h-6 text-green-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{stats.fundsFound}</h3>
                    <p className="text-gray-400 text-sm">Fondos Encontrados</p>
                  </div>

                  <div className="feature-card text-center">
                    <div className="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-3">
                      <TrendingUp className="w-6 h-6 text-purple-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{stats.contentGenerated}</h3>
                    <p className="text-gray-400 text-sm">Contenido Generado</p>
                  </div>

                  <div className="feature-card text-center">
                    <div className="w-12 h-12 rounded-full bg-yellow-500/10 flex items-center justify-center mx-auto mb-3">
                      <Award className="w-6 h-6 text-yellow-500" />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-1">{stats.successRate}%</h3>
                    <p className="text-gray-400 text-sm">Tasa de Éxito</p>
                  </div>
                </div>

                <div className="grid md:grid-cols-2 gap-6">
                  <div className="feature-card">
                    <h3 className="text-lg font-semibold mb-4">Actividad Reciente</h3>
                    <div className="space-y-3">
                      {[
                        { action: 'Fondo encontrado', business: user.businesses[0] || 'Mi Negocio', time: '2 horas' },
                        { action: 'Contenido generado', business: user.businesses[0] || 'Mi Negocio', time: '1 día' },
                        { action: 'Modelo de negocio creado', business: user.businesses[1] || 'Otro Negocio', time: '3 días' },
                        { action: 'Análisis completado', business: user.businesses[0] || 'Mi Negocio', time: '5 días' }
                      ].map((activity, index) => (
                        <div key={index} className="flex items-center justify-between py-2 border-b border-gray-800 last:border-b-0">
                          <div>
                            <p className="text-white text-sm">{activity.action}</p>
                            <p className="text-gray-400 text-xs">{activity.business}</p>
                          </div>
                          <span className="text-gray-400 text-xs">Hace {activity.time}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="feature-card">
                    <h3 className="text-lg font-semibold mb-4">Logros</h3>
                    <div className="space-y-3">
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-yellow-500/10 flex items-center justify-center">
                          <Award className="w-4 h-4 text-yellow-500" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">Primer Negocio</p>
                          <p className="text-gray-400 text-xs">Creaste tu primer negocio</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3">
                        <div className="w-8 h-8 rounded-full bg-neon-blue/10 flex items-center justify-center">
                          <Target className="w-4 h-4 text-neon-blue" />
                        </div>
                        <div>
                          <p className="text-white text-sm font-medium">Explorador de Fondos</p>
                          <p className="text-gray-400 text-xs">Encontraste más de 5 fondos</p>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 opacity-50">
                        <div className="w-8 h-8 rounded-full bg-gray-600 flex items-center justify-center">
                          <Crown className="w-4 h-4 text-gray-400" />
                        </div>
                        <div>
                          <p className="text-gray-400 text-sm font-medium">Emprendedor Pro</p>
                          <p className="text-gray-500 text-xs">Crea 3 negocios exitosos</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Settings Tab */}
            {activeTab === 'settings' && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="max-w-2xl"
              >
                <h2 className="text-2xl font-bold mb-6">Configuración</h2>
                
                <div className="space-y-6">
                  <div className="feature-card">
                    <h3 className="text-lg font-semibold mb-4">Notificaciones</h3>
                    <div className="space-y-4">
                      {Object.entries(notifications).map(([key, value]) => (
                        <div key={key} className="flex items-center justify-between">
                          <div>
                            <p className="text-white font-medium">
                              {key === 'emailUpdates' && 'Actualizaciones por Email'}
                              {key === 'fundAlerts' && 'Alertas de Fondos'}
                              {key === 'contentReminders' && 'Recordatorios de Contenido'}
                              {key === 'weeklyReports' && 'Reportes Semanales'}
                            </p>
                            <p className="text-gray-400 text-sm">
                              {key === 'emailUpdates' && 'Recibe noticias y actualizaciones'}
                              {key === 'fundAlerts' && 'Notificaciones de nuevos fondos'}
                              {key === 'contentReminders' && 'Recordatorios para generar contenido'}
                              {key === 'weeklyReports' && 'Resumen semanal de actividad'}
                            </p>
                          </div>
                          <button
                            onClick={() => setNotifications({ ...notifications, [key]: !value })}
                            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                              value ? 'bg-neon-blue' : 'bg-gray-600'
                            }`}
                          >
                            <span
                              className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                                value ? 'translate-x-6' : 'translate-x-1'
                              }`}
                            />
                          </button>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="feature-card">
                    <h3 className="text-lg font-semibold mb-4">Privacidad y Seguridad</h3>
                    <div className="space-y-4">
                      <button className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                        <div className="flex items-center space-x-3">
                          <Shield className="w-5 h-5 text-gray-400" />
                          <span>Autenticación de Dos Factores</span>
                        </div>
                        <span className="text-gray-400 text-sm">Configurar</span>
                      </button>
                      
                      <button className="w-full flex items-center justify-between p-3 bg-gray-800 hover:bg-gray-700 rounded-lg transition-colors">
                        <div className="flex items-center space-x-3">
                          <Eye className="w-5 h-5 text-gray-400" />
                          <span>Descargar mis Datos</span>
                        </div>
                        <span className="text-gray-400 text-sm">Solicitar</span>
                      </button>
                    </div>
                  </div>

                  <div className="feature-card border-red-500/20">
                    <h3 className="text-lg font-semibold mb-4 text-red-400">Zona de Peligro</h3>
                    <div className="space-y-4">
                      <button className="w-full flex items-center justify-center space-x-2 p-3 bg-red-500/10 hover:bg-red-500/20 border border-red-500/20 rounded-lg transition-colors text-red-400">
                        <AlertCircle className="w-5 h-5" />
                        <span>Eliminar Cuenta</span>
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}