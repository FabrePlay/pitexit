import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Rocket, MessageSquare, Zap, ChevronRight, Check, Users, Sparkles, Crown, BookOpen, Trophy, Lightbulb, Send, Building, ArrowLeft, Mail, Lock, Eye, EyeOff, User, Plus } from 'lucide-react';
import AIAgentInterface from './components/AIAgentInterface';
import UserProfile from './components/UserProfile';

// Límites de negocios por plan
const BUSINESS_LIMITS = {
  'Gratis': 1,
  'Básico': 1,
  'Pro': 3,
  'Premium': 10,
  'Agencia Básica': 10,
  'Agencia Pro': 50,
  'Agencia Premium': 100
};

// Usuarios ficticios para cada plan con más campos
const MOCK_USERS = {
  free: {
    email: 'free@example.com',
    password: 'password123',
    username: 'emprendedor_free',
    firstName: 'Juan',
    lastName: 'Pérez',
    phone: '+56 9 1234 5678',
    country: 'Chile',
    city: 'Santiago',
    industry: 'Tecnología',
    experience: 'Principiante',
    plan: 'Gratis',
    businesses: []
  },
  basic: {
    email: 'basic@example.com',
    password: 'password123',
    username: 'emprendedor_basic',
    firstName: 'María',
    lastName: 'González',
    phone: '+56 9 8765 4321',
    country: 'Chile',
    city: 'Valparaíso',
    industry: 'Alimentación',
    experience: 'Intermedio',
    plan: 'Básico',
    businesses: ['Café Artesanal']
  },
  pro: {
    email: 'pro@example.com',
    password: 'password123',
    username: 'emprendedor_pro',
    firstName: 'Carlos',
    lastName: 'Rodríguez',
    phone: '+56 9 5555 1234',
    country: 'Chile',
    city: 'Concepción',
    industry: 'Tecnología',
    experience: 'Avanzado',
    plan: 'Pro',
    businesses: ['TechStart', 'EcoShop', 'Digital Marketing']
  },
  premium: {
    email: 'premium@example.com',
    password: 'password123',
    username: 'emprendedor_premium',
    firstName: 'Ana',
    lastName: 'Silva',
    phone: '+56 9 9999 8888',
    country: 'Chile',
    city: 'La Serena',
    industry: 'Consultoría',
    experience: 'Experto',
    plan: 'Premium',
    businesses: ['Café Artesanal', 'TechStart', 'EcoShop', 'Digital Agency']
  },
  agencyBasic: {
    email: 'agency.basic@example.com',
    password: 'password123',
    username: 'agencia_basic',
    firstName: 'Roberto',
    lastName: 'Martínez',
    phone: '+56 9 7777 6666',
    country: 'Chile',
    city: 'Antofagasta',
    industry: 'Marketing',
    experience: 'Avanzado',
    plan: 'Agencia Básica',
    businesses: ['Cliente 1', 'Cliente 2', 'Cliente 3']
  },
  agencyPro: {
    email: 'agency.pro@example.com',
    password: 'password123',
    username: 'agencia_pro',
    firstName: 'Patricia',
    lastName: 'López',
    phone: '+56 9 4444 3333',
    country: 'Chile',
    city: 'Temuco',
    industry: 'Marketing',
    experience: 'Experto',
    plan: 'Agencia Pro',
    businesses: ['Cliente 1', 'Cliente 2', 'Cliente 3', 'Cliente 4']
  },
  agencyPremium: {
    email: 'agency.premium@example.com',
    password: 'password123',
    username: 'agencia_premium',
    firstName: 'Diego',
    lastName: 'Morales',
    phone: '+56 9 2222 1111',
    country: 'Chile',
    city: 'Iquique',
    industry: 'Marketing',
    experience: 'Experto',
    plan: 'Agencia Premium',
    businesses: ['Cliente 1', 'Cliente 2', 'Cliente 3', 'Cliente 4', 'Cliente 5']
  }
};

// Perfiles detallados de negocios
const BUSINESS_PROFILES = {
  'Café Artesanal': {
    name: 'Café Artesanal',
    description: 'Cafetería especializada en café de origen único y métodos de preparación artesanales',
    industry: 'Alimentación y Bebidas',
    stage: 'Operando',
    foundedDate: '2023-01-15',
    employees: 5,
    location: 'Santiago, Chile',
    website: 'www.cafeartesanal.cl',
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

function UpgradeModal({ onClose, currentPlan }: { onClose: () => void, currentPlan: string }) {
  const nextPlan = {
    'Gratis': 'Básico',
    'Básico': 'Pro',
    'Pro': 'Premium',
    'Agencia Básica': 'Agencia Pro',
    'Agencia Pro': 'Agencia Premium'
  }[currentPlan];

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-dark-surface w-full max-w-md rounded-xl p-6 relative"
      >
        <h2 className="text-2xl font-bold mb-4 gradient-text">
          Aumenta tu límite de negocios
        </h2>
        <p className="text-gray-400 mb-6">
          Has alcanzado el límite de negocios para tu plan actual ({currentPlan}). 
          Actualiza al plan {nextPlan} para crear más negocios y acceder a más funcionalidades.
        </p>
        <div className="space-y-4">
          <button className="w-full neon-button">
            Actualizar a {nextPlan}
          </button>
          <button 
            onClick={onClose}
            className="w-full border border-gray-700 hover:border-neon-blue px-4 py-2 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </div>
      </motion.div>
    </div>
  );
}

function CreateBusinessModal({ onClose, onCreate, currentPlan }: { 
  onClose: () => void, 
  onCreate: (businessData: any) => void,
  currentPlan: string
}) {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    industry: '',
    stage: 'Idea',
    targetMarket: '',
    businessModel: ''
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) {
      setError('El nombre del negocio es requerido');
      return;
    }
    if (!formData.description.trim()) {
      setError('La descripción es requerida');
      return;
    }
    
    const businessData = {
      ...formData,
      foundedDate: new Date().toISOString().split('T')[0],
      employees: 1,
      location: 'Chile',
      website: '',
      revenue: '$0',
      keyProducts: [],
      competitors: [],
      uniqueValue: '',
      challenges: [],
      goals: []
    };
    
    onCreate(businessData);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-dark-surface w-full max-w-2xl rounded-xl p-6 relative max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-4 gradient-text">
          Crear Nuevo Negocio
        </h2>
        <p className="text-gray-400 mb-6">
          Plan actual: {currentPlan}
        </p>
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Nombre del Negocio *
              </label>
              <input
                type="text"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                placeholder="Mi Negocio"
                required
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
                <option value="Alimentación">Alimentación</option>
                <option value="Retail">Retail</option>
                <option value="Servicios">Servicios</option>
                <option value="Salud">Salud</option>
                <option value="Educación">Educación</option>
                <option value="Fintech">Fintech</option>
                <option value="Marketing">Marketing</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Descripción *
            </label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
              placeholder="Describe tu negocio en pocas palabras..."
              rows={3}
              required
            />
          </div>

          <div className="grid md:grid-cols-2 gap-4">
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
                Modelo de Negocio
              </label>
              <select
                value={formData.businessModel}
                onChange={(e) => setFormData({ ...formData, businessModel: e.target.value })}
                className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
              >
                <option value="">Seleccionar modelo</option>
                <option value="B2C">B2C - Directo al consumidor</option>
                <option value="B2B">B2B - Empresa a empresa</option>
                <option value="SaaS">SaaS - Software como servicio</option>
                <option value="Marketplace">Marketplace</option>
                <option value="Suscripción">Suscripción</option>
                <option value="Freemium">Freemium</option>
                <option value="Otro">Otro</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Mercado Objetivo
            </label>
            <input
              type="text"
              value={formData.targetMarket}
              onChange={(e) => setFormData({ ...formData, targetMarket: e.target.value })}
              className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
              placeholder="Ej: Profesionales jóvenes, empresas medianas..."
            />
          </div>

          <div className="flex space-x-4 pt-4">
            <button type="submit" className="flex-1 neon-button">
              Crear Negocio
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

function AuthModal({ onClose, onAuth }: { onClose: () => void, onAuth: (user: any) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: '',
    firstName: '',
    lastName: '',
    phone: '',
    country: 'Chile',
    city: '',
    industry: '',
    experience: 'Principiante'
  });
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setError('');

    if (isLogin) {
      // Simulación de inicio de sesión
      const user = Object.values(MOCK_USERS).find(u => u.email === formData.email && u.password === formData.password);
      if (user) {
        onAuth(user);
        onClose();
      } else {
        setError('Email o contraseña incorrectos');
      }
    } else {
      // Validaciones de registro
      if (formData.password !== formData.confirmPassword) {
        setError('Las contraseñas no coinciden');
        return;
      }
      if (formData.password.length < 8) {
        setError('La contraseña debe tener al menos 8 caracteres');
        return;
      }
      if (!formData.username || !formData.firstName || !formData.lastName) {
        setError('Todos los campos obligatorios deben ser completados');
        return;
      }
      
      // Verificar si el email ya está en uso
      const existingUser = Object.values(MOCK_USERS).find(u => u.email === formData.email);
      if (existingUser) {
        setError('Este email ya está registrado');
        return;
      }

      // Crear nuevo usuario con plan gratuito
      const newUser = {
        email: formData.email,
        password: formData.password,
        username: formData.username,
        firstName: formData.firstName,
        lastName: formData.lastName,
        phone: formData.phone,
        country: formData.country,
        city: formData.city,
        industry: formData.industry,
        experience: formData.experience,
        plan: 'Gratis',
        businesses: []
      };

      // Simular registro exitoso
      onAuth(newUser);
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-dark-surface w-full max-w-2xl rounded-xl p-6 relative max-h-[90vh] overflow-y-auto"
      >
        <h2 className="text-2xl font-bold mb-6 gradient-text">
          {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
        </h2>
        
        {error && (
          <div className="mb-4 p-3 bg-red-500/10 border border-red-500 rounded-lg text-red-500 text-sm">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          {!isLogin && (
            <>
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Nombre *
                  </label>
                  <input
                    type="text"
                    value={formData.firstName}
                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                    className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                    placeholder="Juan"
                    required
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Apellido *
                  </label>
                  <input
                    type="text"
                    value={formData.lastName}
                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                    className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                    placeholder="Pérez"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Nombre de Usuario *
                </label>
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                  placeholder="usuario123"
                  required
                />
              </div>
            </>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Email *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
              placeholder="tu@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Contraseña *
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 pr-10 focus:outline-none focus:border-neon-blue transition-colors"
                placeholder="••••••••"
                required
                minLength={8}
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300"
              >
                {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">
                  Confirmar Contraseña *
                </label>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Teléfono
                  </label>
                  <input
                    type="tel"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                    placeholder="+56 9 1234 5678"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Ciudad
                  </label>
                  <input
                    type="text"
                    value={formData.city}
                    onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                    className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                    placeholder="Santiago"
                  />
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Industria
                  </label>
                  <select
                    value={formData.industry}
                    onChange={(e) => setFormData({ ...formData, industry: e.target.value })}
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
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Experiencia
                  </label>
                  <select
                    value={formData.experience}
                    onChange={(e) => setFormData({ ...formData, experience: e.target.value })}
                    className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                  >
                    <option value="Principiante">Principiante</option>
                    <option value="Intermedio">Intermedio</option>
                    <option value="Avanzado">Avanzado</option>
                    <option value="Experto">Experto</option>
                  </select>
                </div>
              </div>
            </>
          )}

          <button type="submit" className="w-full neon-button mt-6">
            {isLogin ? 'Iniciar Sesión' : 'Crear Cuenta'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => {
              setIsLogin(!isLogin);
              setError('');
              setFormData({ 
                email: '', 
                password: '', 
                confirmPassword: '', 
                username: '',
                firstName: '',
                lastName: '',
                phone: '',
                country: 'Chile',
                city: '',
                industry: '',
                experience: 'Principiante'
              });
            }}
            className="text-neon-blue hover:text-white transition-colors text-sm"
          >
            {isLogin ? '¿No tienes cuenta? Regístrate' : '¿Ya tienes cuenta? Inicia sesión'}
          </button>
        </div>

        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-white"
        >
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </motion.div>
    </div>
  );
}

function App() {
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPlayground, setShowPlayground] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<any | null>(null);

  const handlePlaygroundClick = () => {
    if (currentUser) {
      setShowPlayground(true);
    } else {
      setShowAuth(true);
    }
  };

  const handleProfileClick = () => {
    if (currentUser) {
      setShowProfile(true);
    } else {
      setShowAuth(true);
    }
  };

  // Mostrar Playground
  if (showPlayground && currentUser) {
    return (
      <AIAgentInterface 
        currentUser={currentUser}
        selectedBusiness={selectedBusiness}
        onBusinessChange={setSelectedBusiness}
        onClose={() => setShowPlayground(false)}
      />
    );
  }

  // Mostrar Perfil
  if (showProfile && currentUser) {
    return (
      <UserProfile 
        user={currentUser}
        onClose={() => setShowProfile(false)}
        onUpdateUser={(updatedUser) => setCurrentUser(updatedUser)}
        businessProfiles={BUSINESS_PROFILES}
      />
    );
  }

  return (
    <div className="min-h-screen bg-deep-dark">
      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)} 
          onAuth={(user) => setCurrentUser(user)}
        />
      )}
      
      {/* Navigation Bar */}
      {currentUser && (
        <nav className="fixed top-0 right-0 z-40 p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-2 bg-dark-surface/80 backdrop-blur-sm border border-gray-800 rounded-lg px-4 py-2 hover:border-neon-blue transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-neon-blue/10 flex items-center justify-center">
                <User className="w-4 h-4 text-neon-blue" />
              </div>
              <span className="text-sm text-white">{currentUser.username}</span>
            </button>
          </div>
        </nav>
      )}

      {/* Hero Section */}
      <header className="relative min-h-screen flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(0,242,254,0.1)_0%,transparent_70%)]" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">Automatiza y Potencia</span>
              <br />
              Tu Negocio con IA
            </h1>
            <p className="text-xl md:text-2xl text-gray-400 mb-8 max-w-3xl mx-auto">
              Pit Exit te ayuda a encontrar fondos, estructurar tu negocio y generar contenido
              con inteligencia artificial.
            </p>
            <div className="space-x-4">
              <button 
                className="neon-button"
                onClick={handlePlaygroundClick}
              >
                {currentUser ? 'Abrir Playground' : 'Probar Playground'} <Bot className="inline ml-2 w-5 h-5" />
              </button>
              <button 
                className="border border-gray-700 hover:border-neon-blue px-8 py-3 rounded-lg transition-all duration-300"
                onClick={() => {
                  if (!currentUser) {
                    setShowAuth(true);
                  } else {
                    handleProfileClick();
                  }
                }}
              >
                {currentUser ? 'Mi Perfil' : 'Iniciar Sesión'} <ChevronRight className="inline ml-2" />
              </button>
              {currentUser && (
                <div className="inline-flex items-center gap-4 mt-4">
                  <span className="text-neon-blue">
                    Plan {currentUser.plan}
                  </span>
                  <button 
                    className="text-gray-400 hover:text-white transition-colors"
                    onClick={() => setCurrentUser(null)}
                  >
                    Cerrar Sesión
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </header>

      {/* Features Section */}
      <section className="py-20 bg-dark-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="gradient-text">Beneficios Clave</span>
          </h2>
          <div className="grid md:grid-cols-3 gap-8">
            <FeatureCard
              icon={<Rocket className="w-8 h-8 text-neon-blue" />}
              title="Encuentra Fondos Públicos"
              description="Descubre y postula a fondos que se ajusten perfectamente a tu negocio."
            />
            <FeatureCard
              icon={<Bot className="w-8 h-8 text-neon-blue" />}
              title="Crea tu Propuesta de Valor"
              description="Estructura tu modelo de negocio en minutos con ayuda de IA."
            />
            <FeatureCard
              icon={<MessageSquare className="w-8 h-8 text-neon-blue" />}
              title="Genera Contenido"
              description="Crea contenido atractivo para redes sociales automáticamente."
            />
          </div>
        </div>
      </section>

      {/* How it Works Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-16">
            <span className="gradient-text">¿Cómo Funciona?</span>
          </h2>
          <div className="grid md:grid-cols-4 gap-8">
            {[
              { step: "1", title: "Describe tu Negocio", icon: <MessageSquare /> },
              { step: "2", title: "Descubre Fondos", icon: <Zap /> },
              { step: "3", title: "Estructura tu Modelo", icon: <Bot /> },
              { step: "4", title: "Genera Contenido", icon: <Rocket /> }
            ].map((item, index) => (
              <div key={index} className="feature-card text-center">
                <div className="w-12 h-12 rounded-full bg-neon-blue/10 flex items-center justify-center mx-auto mb-4">
                  {React.cloneElement(item.icon, { className: "w-6 h-6 text-neon-blue" })}
                </div>
                <div className="text-2xl font-bold text-neon-blue mb-2">Paso {item.step}</div>
                <h3 className="text-xl font-semibold mb-2">{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pricing Section */}
      <section className="py-20 bg-dark-surface">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="gradient-text">Planes y Precios</span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Elige el plan que mejor se adapte a tus necesidades
          </p>
          
          {/* Individual Plans */}
          <h3 className="text-2xl font-semibold mb-8 text-center">Para Emprendedores</h3>
          <div className="grid md:grid-cols-4 gap-8 mb-20">
            <PricingCard
              name="Gratis"
              price="$0"
              icon={<Sparkles />}
              features={[
                "1 Negocio",
                "50 Tokens",
                "Acceso a Fondos Públicos",
                "Chat con IA"
              ]}
              highlighted={false}
            />
            <PricingCard
              name="Básico"
              price="$19"
              icon={<Bot />}
              features={[
                "1 Negocio",
                "300 Tokens",
                "Fondos Públicos",
                "Redes Sociales",
                "Instagram Automation"
              ]}
              highlighted={false}
            />
            <PricingCard
              name="Pro"
              price="$49"
              icon={<Crown />}
              features={[
                "3 Negocios",
                "700 Tokens",
                "Todos los Agentes",
                "Prioridad en Soporte",
                "Analytics Avanzados"
              ]}
              highlighted={true}
            />
            <PricingCard
              name="Premium"
              price="$99"
              icon={<Trophy />}
              features={[
                "10 Negocios",
                "1500 Tokens",
                "Uso Ilimitado",
                "Soporte 24/7",
                "API Access"
              ]}
              highlighted={false}
            />
          </div>

          {/* Agency Plans */}
          <h3 className="text-2xl font-semibold mb-8 text-center">Para Agencias</h3>
          <div className="grid md:grid-cols-3 gap-8">
            <PricingCard
              name="Básica"
              price="$49"
              icon={<Users />}
              features={[
                "10 Clientes",
                "7000 Tokens",
                "Fondos + Redes",
                "Dashboard de Clientes",
                "Reportes Básicos"
              ]}
              highlighted={false}
            />
            <PricingCard
              name="Pro"
              price="$99"
              icon={<Crown />}
              features={[
                "50 Clientes",
                "20000 Tokens",
                "Todos los Agentes",
                "Analytics Avanzados",
                "API Access"
              ]}
              highlighted={true}
            />
            <PricingCard
              name="Premium"
              price="$199"
              icon={<Trophy />}
              features={[
                "100 Clientes",
                "50000 Tokens",
                "Uso Ilimitado",
                "Soporte Prioritario",
                "White Label"
              ]}
              highlighted={false}
            />
          </div>
        </div>
      </section>

      {/* Blog/Resources Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <h2 className="text-4xl font-bold text-center mb-4">
            <span className="gradient-text">Recursos y Guías</span>
          </h2>
          <p className="text-xl text-gray-400 text-center mb-16 max-w-2xl mx-auto">
            Aprende a potenciar tu negocio con nuestros recursos
          </p>
          
          <div className="grid md:grid-cols-3 gap-8">
            <BlogCard
              title="Cómo un emprendedor consiguió financiamiento con Pit Exit"
              description="Descubre cómo Juan transformó su startup utilizando nuestra plataforma para obtener fondos públicos."
              category="Caso de Éxito"
              icon={<Trophy />}
              image="https://images.unsplash.com/photo-1553729459-efe14ef6055d?auto=format&fit=crop&w=800"
            />
            <BlogCard
              title="Guía para postular a fondos públicos"
              description="Aprende los secretos para crear una postulación exitosa y maximizar tus posibilidades de obtener financiamiento."
              category="Guía"
              icon={<BookOpen />}
              image="https://images.unsplash.com/photo-1454165804606-c3d57bc86b40?auto=format&fit=crop&w=800"
            />
            <BlogCard
              title="Estrategias de IA para redes sociales"
              description="Optimiza tu presencia en redes sociales utilizando las últimas tecnologías de inteligencia artificial."
              category="Estrategia"
              icon={<Lightbulb />}
              image="https://images.unsplash.com/photo-1611162617474-5b21e879e113?auto=format&fit=crop&w=800"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

function FeatureCard({ icon, title, description }: { icon: React.ReactNode, title: string, description: string }) {
  return (
    <motion.div
      className="feature-card"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="mb-4">{icon}</div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-400">{description}</p>
    </motion.div>
  );
}

function PricingCard({ name, price, icon, features, highlighted }: { 
  name: string, 
  price: string, 
  icon: React.ReactNode,
  features: string[],
  highlighted: boolean 
}) {
  return (
    <motion.div
      className={`feature-card relative ${highlighted ? 'border-neon-blue shadow-[0_0_30px_rgba(0,242,254,0.2)]' : ''}`}
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      {highlighted && (
        <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
          <span className="bg-neon-blue text-deep-dark px-4 py-1 rounded-full text-sm font-semibold">
            Más Popular
          </span>
        </div>
      )}
      <div className="text-center mb-6">
        <div className="w-16 h-16 rounded-full bg-neon-blue/10 flex items-center justify-center mx-auto mb-4">
          {React.cloneElement(icon as any, { className: "w-8 h-8 text-neon-blue" })}
        </div>
        <h3 className="text-2xl font-bold mb-1">{name}</h3>
        <div className="text-3xl font-bold text-neon-blue mb-4">{price}<span className="text-sm text-gray-400">/mes</span></div>
      </div>
      <ul className="space-y-3">
        {features.map((feature, index) => (
          <li key={index} className="flex items-center">
            <Check className="w-5 h-5 text-neon-blue mr-2" />
            <span className="text-gray-300">{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full mt-6 ${highlighted ? 'neon-button' : 'border border-gray-700 hover:border-neon-blue px-8 py-3 rounded-lg transition-all duration-300'}`}>
        Empezar Ahora
      </button>
    </motion.div>
  );
}

function BlogCard({ title, description, category, icon, image }: {
  title: string,
  description: string,
  category: string,
  icon: React.ReactNode,
  image: string
}) {
  return (
    <motion.div
      className="feature-card overflow-hidden"
      whileHover={{ y: -5 }}
      transition={{ duration: 0.3 }}
    >
      <div className="relative h-48 -mx-6 -mt-6 mb-6">
        <img src={image} alt={title} className="w-full h-full object-cover" />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-card to-transparent" />
      </div>
      <div className="flex items-center mb-4">
        <div className="w-8 h-8 rounded-full bg-neon-blue/10 flex items-center justify-center mr-3">
          {React.cloneElement(icon as any, { className: "w-4 h-4 text-neon-blue" })}
        </div>
        <span className="text-sm text-neon-blue">{category}</span>
      </div>
      <h3 className="text-xl font-semibold mb-3">{title}</h3>
      <p className="text-gray-400 mb-4">{description}</p>
      <button className="text-neon-blue hover:text-white transition-colors duration-300 flex items-center">
        Leer más <ChevronRight className="w-4 h-4 ml-1" />
      </button>
    </motion.div>
  );
}

export default App;