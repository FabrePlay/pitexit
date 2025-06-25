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
  Globe,
  DollarSign,
  Users,
  Calendar as CalendarIcon,
  ExternalLink
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
  onUpdateUser: (updatedUser: any) => void;
  businessProfiles?: any;
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

function BusinessProfileModal({ business, businessData, onClose, onSave }: {
  business: string;
  businessData: any;
  onClose: () => void;
  onSave: (data: any) => void;
}) {
  const [formData, setFormData] = useState(businessData || {
    name: business,
    description: '',
    industry: '',
    stage: 'Idea',
    foundedDate: '',
    employees: 1,
    location: '',
    website: '',
    revenue: '',
    targetMarket: '',
    businessModel: '',
    keyProducts: [],
    competitors: [],
    uniqueValue: '',
    challenges: [],
    goals: []
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-dark-surface w-full max-w-4xl rounded-xl p-6 relative max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold gradient-text">Perfil del Negocio</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {/* Información Básica */}
          <div className="feature-card">
            <h3 className="text-lg font-semibold mb-4">Información Básica</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Nombre del Negocio
                </label>
                <input
                  type="text"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Industria
                </label>
                <select
                  value={formData.industry}
                  onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
                  className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                >
                  <option value="">Seleccionar industria</option>
                  <option value="Tecnología">Tecnología</option>
                  <option value="Alimentación y Bebidas">Alimentación y Bebidas</option>
                  <option value="Retail">Retail</option>
                  <option value="Servicios">Servicios</option>
                  <option value="Salud">Salud</option>
                  <option value="Educación">Educación</option>
                  <option value="Fintech">Fintech</option>
                  <option value="Marketing">Marketing</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Etapa del Negocio
                </label>
                <select
                  value={formData.stage}
                  onChange={(e) => setFormData({ ...formData, stage: e.target.value })}
                  className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                >
                  <option value="Idea">Idea</option>
                  <option value="MVP">MVP</option>
                  <option value="Operando">Operando</option>
                  <option value="Crecimiento">Crecimiento</option>
                  <option value="Escalando">Escalando</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Fecha de Fundación
                </label>
                <input
                  type="date"
                  value={formData.foundedDate}
                  onChange={(e) => setFormData({ ...formData, foundedDate: e.target.value })}
                  className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Número de Empleados
                </label>
                <input
                  type="number"
                  value={formData.employees}
                  onChange={(e) => setFormData({ ...formData, employees: parseInt(e.target.value) })}
                  className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                  min="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Ubicación
                </label>
                <input
                  type="text"
                  value={formData.location}
                  onChange={(e) => setFormData({ ...formData, location: e.target.value })}
                  className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                  placeholder="Ciudad, País"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Sitio Web
                </label>
                <input
                  type="url"
                  value={formData.website}
                  onChange={(e) => setFormData({ ...formData, website: e.target.value })}
                  className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                  placeholder="https://www.ejemplo.com"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Ingresos Anuales
                </label>
                <input
                  type="text"
                  value={formData.revenue}
                  onChange={(e) => setFormData({ ...formData, revenue: e.target.value })}
                  className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                  placeholder="$0 - $1.000.000"
                />
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Descripción del Negocio
              </label>
              <textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                rows={3}
                placeholder="Describe tu negocio, qué hace y cómo genera valor..."
              />
            </div>
          </div>

          {/* Modelo de Negocio */}
          <div className="feature-card">
            <h3 className="text-lg font-semibold mb-4">Modelo de Negocio</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Mercado Objetivo
                </label>
                <textarea
                  value={formData.targetMarket}
                  onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
                  className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                  rows={2}
                  placeholder="Describe tu mercado objetivo..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Modelo de Negocio
                </label>
                <select
                  value={formData.businessModel}
                  onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                  className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                >
                  <option value="">Seleccionar modelo</option>
                  <option value="B2C - Venta directa">B2C - Venta directa</option>
                  <option value="B2B - Empresa a empresa">B2B - Empresa a empresa</option>
                  <option value="SaaS - Software como servicio">SaaS - Software como servicio</option>
                  <option value="Marketplace">Marketplace</option>
                  <option value="Suscripción">Suscripción</option>
                  <option value="Freemium">Freemium</option>
                  <option value="Otro">Otro</option>
                </select>
              </div>
            </div>

            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Propuesta de Valor Única
              </label>
              <textarea
                value={formData.uniqueValue}
                onChange={(e) => setFormData({ ...formData, uniqueValue: e.target.value })}
                className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                rows={2}
                placeholder="¿Qué te diferencia de la competencia?"
              />
            </div>
          </div>

          {/* Productos y Competencia */}
          <div className="feature-card">
            <h3 className="text-lg font-semibold mb-4">Productos y Competencia</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Productos/Servicios Clave
                </label>
                <textarea
                  value={Array.isArray(formData.keyProducts) ? formData.keyProducts.join(', ') : formData.keyProducts}
                  onChange={(e) => setFormData({ ...formData, keyProducts: e.target.value.split(', ').filter(p => p.trim()) })}
                  className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                  rows={3}
                  placeholder="Producto 1, Producto 2, Servicio 1..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Principales Competidores
                </label>
                <textarea
                  value={Array.isArray(formData.competitors) ? formData.competitors.join(', ') : formData.competitors}
                  onChange={(e) => setFormData({ ...formData, competitors: e.target.value.split(', ').filter(c => c.trim()) })}
                  className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                  rows={3}
                  placeholder="Competidor 1, Competidor 2..."
                />
              </div>
            </div>
          </div>

          {/* Desafíos y Objetivos */}
          <div className="feature-card">
            <h3 className="text-lg font-semibold mb-4">Desafíos y Objetivos</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Principales Desafíos
                </label>
                <textarea
                  value={Array.isArray(formData.challenges) ? formData.challenges.join(', ') : formData.challenges}
                  onChange={(e) => setFormData({ ...formData, challenges: e.target.value.split(', ').filter(c => c.trim()) })}
                  className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                  rows={3}
                  placeholder="Desafío 1, Desafío 2..."
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Objetivos a Corto Plazo
                </label>
                <textarea
                  value={Array.isArray(formData.goals) ? formData.goals.join(', ') : formData.goals}
                  onChange={(e) => setFormData({ ...formData, goals: e.target.value.split(', ').filter(g => g.trim()) })}
                  className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                  rows={3}
                  placeholder="Objetivo 1, Objetivo 2..."
                />
              </div>
            </div>
          </div>

          <div className="flex space-x-4 pt-4">
            <button type="submit" className="flex-1 neon-button">
              Guardar Perfil
            </button>
            <button
              type="button"
              onClick={onClose}
              className="flex-1 border border-gray-700 hover:border-neon-blue px-4 py-2 rounded-lg transition-colors"
            >
              Cancelar
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default function UserProfile({ user, onClose, onUpdateUser, businessProfiles = {} }: UserProfileProps) {
  const [activeTab, setActiveTab] = useState('profile');
  const [isEditing, setIsEditing] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
  const [editForm, setEditForm] = useState({
    username: user.username,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email,
    phone: user.phone || '',
    country: user.country || 'Chile',
    city: user.city || '',
    industry: user.industry || '',
    experience: user.experience || 'Principiante',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
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
      businessesCreated: user.businesses.length,
      maxBusinesses: planInfo.businesses,
      fundsFound: Math.floor(Math.random() * 15) + 3,
      contentGenerated: Math.floor(Math.random() * 50) + 10,
      successRate: Math.floor(Math.random() * 30) + 65
    };
  };

  const stats = getStatsForPlan(user.plan);
  const planInfo = PLAN_FEATURES[user.plan as keyof typeof PLAN_FEATURES];

  const handleSaveProfile = () => {
    // Validaciones
    if (editForm.newPassword && editForm.newPassword !== editForm.confirmPassword) {
      alert('Las contraseñas no coinciden');
      return;
    }

    // Actualizar usuario
    const updatedUser = {
      ...user,
      username: editForm.username,
      firstName: editForm.firstName,
      lastName: editForm.lastName,
      email: editForm.email,
      phone: editForm.phone,
      country: editForm.country,
      city: editForm.city,
      industry: editForm.industry,
      experience: editForm.experience,
      ...(editForm.newPassword && { password: editForm.newPassword })
    };

    onUpdateUser(updatedUser);
    setIsEditing(false);
    setEditForm({ ...editForm, currentPassword: '', newPassword: '', confirmPassword: '' });
  };

  const handleDeleteBusiness = (businessName: string) => {
    const updatedUser = {
      ...user,
      businesses: user.businesses.filter(b => b !== businessName)
    };
    onUpdateUser(updatedUser);
  };

  const handleSaveBusinessProfile = (businessName: string, businessData: any) => {
    // Aquí se guardaría el perfil del negocio
    // Por ahora solo cerramos el modal
    setSelectedBusiness(null);
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
      {/* Business Profile Modal */}
      {selectedBusiness && (
        <BusinessProfileModal
          business={selectedBusiness}
          businessData={businessProfiles[selectedBusiness]}
          onClose={() => setSelectedBusiness(null)}
          onSave={(data) => handleSaveBusinessProfile(selectedBusiness, data)}
        />
      )}

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
                            firstName: user.firstName || '',
                            lastName: user.lastName || '',
                            email: user.email,
                            phone: user.phone || '',
                            country: user.country || 'Chile',
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
                        />
                      ) : (
                        <p className="text-white">{user.lastName || 'No especificado'}</p>
                      )}
                    </div>

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
                        />
                      ) : (
                        <p className="text-white">{user.phone || 'No especificado'}</p>
                      )}
                    </div>

                    <div>
                      <label className="block text-sm font-medium text-gray-400 mb-2">
                        País
                      </label>
                      {isEditing ? (
                        <select
                          value={editForm.country}
                          onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                          className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                        >
                          <option value="Chile">Chile</option>
                          <option value="Argentina">Argentina</option>
                          <option value="Colombia">Colombia</option>
                          <option value="Perú">Perú</option>
                          <option value="México">México</option>
                          <option value="España">España</option>
                          <option value="Otro">Otro</option>
                        </select>
                      ) : (
                        <p className="text-white">{user.country || 'No especificado'}</p>
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
                        />
                      ) : (
                        <p className="text-white">{user.city || 'No especificado'}</p>
                      )}
                    </div>

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
                          <option value="Consultoría">Consultoría</option>
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
                        <p className="text-white">{user.experience || 'No especificado'}</p>
                      )}
                    </div>
                  </div>

                  {isEditing && (
                    <div className="border-t border-gray-800 pt-6">
                      <h3 className="text-lg font-semibold mb-4">Cambiar Contraseña</h3>
                      <div className="space-y-4">
                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Contraseña Actual
                          </label>
                          <div className="relative">
                            <input
                              type={showPassword ? 'text' : 'password'}
                              value={editForm.currentPassword}
                              onChange={(e) => setEditForm({ ...editForm, currentPassword: e.target.value })}
                              className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-neon-blue transition-colors"
                            />
                            <button
                              type="button"
                              onClick={() => setShowPassword(!showPassword)}
                              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                            >
                              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Nueva Contraseña
                          </label>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={editForm.newPassword}
                            onChange={(e) => setEditForm({ ...editForm, newPassword: e.target.value })}
                            className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                          />
                        </div>

                        <div>
                          <label className="block text-sm font-medium text-gray-400 mb-2">
                            Confirmar Nueva Contraseña
                          </label>
                          <input
                            type={showPassword ? 'text' : 'password'}
                            value={editForm.confirmPassword}
                            onChange={(e) => setEditForm({ ...editForm, confirmPassword: e.target.value })}
                            className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                          />
                        </div>
                      </div>
                    </div>
                  )}
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
                    {user.businesses.length} de {planInfo.businesses} negocios
                  </div>
                </div>

                {user.businesses.length === 0 ? (
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
                    {user.businesses.map((business, index) => {
                      const businessData = businessProfiles[business];
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
                                  {businessData?.industry || 'Industria no especificada'}
                                </p>
                              </div>
                            </div>
                            <div className="flex space-x-2">
                              <button
                                onClick={() => setSelectedBusiness(business)}
                                className="text-gray-400 hover:text-neon-blue transition-colors"
                                title="Editar perfil"
                              >
                                <Edit3 className="w-4 h-4" />
                              </button>
                              <button
                                onClick={() => handleDeleteBusiness(business)}
                                className="text-gray-400 hover:text-red-500 transition-colors"
                                title="Eliminar negocio"
                              >
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                          
                          {businessData && (
                            <div className="space-y-2 text-sm">
                              <div className="flex items-center space-x-2">
                                <CalendarIcon className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-400">Etapa:</span>
                                <span className="text-white">{businessData.stage}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Users className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-400">Empleados:</span>
                                <span className="text-white">{businessData.employees}</span>
                              </div>
                              <div className="flex items-center space-x-2">
                                <MapPin className="w-4 h-4 text-gray-400" />
                                <span className="text-gray-400">Ubicación:</span>
                                <span className="text-white">{businessData.location}</span>
                              </div>
                              {businessData.website && (
                                <div className="flex items-center space-x-2">
                                  <ExternalLink className="w-4 h-4 text-gray-400" />
                                  <a 
                                    href={businessData.website} 
                                    target="_blank" 
                                    rel="noopener noreferrer"
                                    className="text-neon-blue hover:text-white transition-colors"
                                  >
                                    Sitio Web
                                  </a>
                                </div>
                              )}
                            </div>
                          )}
                          
                          <div className="mt-4 pt-4 border-t border-gray-800">
                            <div className="grid grid-cols-3 gap-4 text-center">
                              <div>
                                <p className="text-lg font-semibold text-white">{Math.floor(Math.random() * 8) + 2}</p>
                                <p className="text-xs text-gray-400">Fondos</p>
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-white">{Math.floor(Math.random() * 25) + 5}</p>
                                <p className="text-xs text-gray-400">Contenido</p>
                              </div>
                              <div>
                                <p className="text-lg font-semibold text-white">{Math.floor(Math.random() * 7) + 1}d</p>
                                <p className="text-xs text-gray-400">Última actividad</p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                    
                    {user.businesses.length < planInfo.businesses && (
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
                        <div className="w-8 h-8 rounded-full bg-gold/10 flex items-center justify-center">
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