import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Rocket, MessageSquare, Zap, ChevronRight, Check, Users, Sparkles, Crown, BookOpen, Trophy, Lightbulb, Send, Building, ArrowLeft, Mail, Lock, Eye, EyeOff, User, Plus } from 'lucide-react';
import AIAgentInterface from './components/AIAgentInterface';

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

// Usuarios ficticios para cada plan
const MOCK_USERS = {
  free: {
    email: 'free@example.com',
    password: 'password123',
    username: 'emprendedor_free',
    plan: 'Gratis',
    businesses: []
  },
  basic: {
    email: 'basic@example.com',
    password: 'password123',
    username: 'emprendedor_basic',
    plan: 'Básico',
    businesses: ['Café Artesanal']
  },
  pro: {
    email: 'pro@example.com',
    password: 'password123',
    username: 'emprendedor_pro',
    plan: 'Pro',
    businesses: ['TechStart', 'EcoShop', 'Digital Marketing']
  },
  premium: {
    email: 'premium@example.com',
    password: 'password123',
    username: 'emprendedor_premium',
    plan: 'Premium',
    businesses: ['Café Artesanal', 'TechStart', 'EcoShop', 'Digital Agency']
  },
  agencyBasic: {
    email: 'agency.basic@example.com',
    password: 'password123',
    username: 'agencia_basic',
    plan: 'Agencia Básica',
    businesses: ['Cliente 1', 'Cliente 2', 'Cliente 3']
  },
  agencyPro: {
    email: 'agency.pro@example.com',
    password: 'password123',
    username: 'agencia_pro',
    plan: 'Agencia Pro',
    businesses: ['Cliente 1', 'Cliente 2', 'Cliente 3', 'Cliente 4']
  },
  agencyPremium: {
    email: 'agency.premium@example.com',
    password: 'password123',
    username: 'agencia_premium',
    plan: 'Agencia Premium',
    businesses: ['Cliente 1', 'Cliente 2', 'Cliente 3', 'Cliente 4', 'Cliente 5']
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
  onCreate: (name: string) => void,
  currentPlan: string
}) {
  const [businessName, setBusinessName] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!businessName.trim()) {
      setError('El nombre del negocio es requerido');
      return;
    }
    onCreate(businessName);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-dark-surface w-full max-w-md rounded-xl p-6 relative"
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
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Nombre del Negocio
            </label>
            <input
              type="text"
              value={businessName}
              onChange={(e) => setBusinessName(e.target.value)}
              className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
              placeholder="Mi Negocio"
            />
          </div>
          <button type="submit" className="w-full neon-button">
            Crear Negocio
          </button>
          <button
            type="button"
            onClick={onClose}
            className="w-full border border-gray-700 hover:border-neon-blue px-4 py-2 rounded-lg transition-colors"
          >
            Cancelar
          </button>
        </form>
      </motion.div>
    </div>
  );
}

function AuthModal({ onClose, onAuth }: { onClose: () => void, onAuth: (user: typeof MOCK_USERS.free) => void }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    confirmPassword: '',
    username: ''
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
      if (!formData.username) {
        setError('El nombre de usuario es requerido');
        return;
      }
      if (!formData.email) {
        setError('El email es requerido');
        return;
      }
      
      // Verificar si el email ya está en uso
      const existingUser = Object.values(MOCK_USERS).find(u => u.email === formData.email);
      if (existingUser) {
        setError('Este email ya está registrado');
        return;
      }

      // Verificar si el nombre de usuario ya está en uso
      const existingUsername = Object.values(MOCK_USERS).find(u => u.username === formData.username);
      if (existingUsername) {
        setError('Este nombre de usuario ya está en uso');
        return;
      }

      // Crear nuevo usuario con plan gratuito
      const newUser = {
        email: formData.email,
        password: formData.password,
        username: formData.username,
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
        className="bg-dark-surface w-full max-w-md rounded-xl p-6 relative"
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
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Nombre de Usuario
              </label>
              <div className="relative">
                <input
                  type="text"
                  value={formData.username}
                  onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                  className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:border-neon-blue transition-colors"
                  placeholder="usuario123"
                  required
                />
                <User className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Email
            </label>
            <div className="relative">
              <input
                type="email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 pl-10 focus:outline-none focus:border-neon-blue transition-colors"
                placeholder="tu@email.com"
                required
              />
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">
              Contraseña
            </label>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 pl-10 pr-10 focus:outline-none focus:border-neon-blue transition-colors"
                placeholder="••••••••"
                required
                minLength={8}
              />
              <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
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
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">
                Confirmar Contraseña
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                  className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 pl-10 pr-10 focus:outline-none focus:border-neon-blue transition-colors"
                  placeholder="••••••••"
                  required
                  minLength={8}
                />
                <Lock className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
              </div>
            </div>
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
              setFormData({ email: '', password: '', confirmPassword: '', username: '' });
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
  const [showChat, setShowChat] = useState(false);
  const [showAuth, setShowAuth] = useState(false);
  const [showAIAgent, setShowAIAgent] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);
  const [currentUser, setCurrentUser] = useState<(typeof MOCK_USERS.free & { businesses: string[] }) | null>(null);

  const handleChatClick = () => {
    if (currentUser) {
      setShowChat(true);
    } else {
      setShowAuth(true);
    }
  };

  const handleAIAgentClick = () => {
    setShowAIAgent(true);
  };

  if (showAIAgent) {
    return <AIAgentInterface />;
  }

  return (
    <div className="min-h-screen bg-deep-dark">
      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)} 
          onAuth={(user) => setCurrentUser(user)}
        />
      )}
      
      {showChat ? (
        <ChatInterface 
          onClose={() => setShowChat(false)}
          selectedBusiness={selectedBusiness}
          onBusinessChange={setSelectedBusiness}
          currentUser={currentUser}
        />
      ) : (
        <>
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
                    onClick={handleAIAgentClick}
                  >
                    Probar Agente IA <Bot className="inline ml-2 w-5 h-5" />
                  </button>
                  <button 
                    className="border border-gray-700 hover:border-neon-blue px-8 py-3 rounded-lg transition-all duration-300"
                    onClick={handleChatClick}
                  >
                    {currentUser ? 'Chat Básico' : 'Iniciar Sesión'} <ChevronRight className="inline ml-2" />
                  </button>
                  {currentUser && (
                    <div className="inline-flex items-center gap-4 mt-4">
                      <span className="text-neon-blue">
                        {currentUser.username} - Plan {currentUser.plan}
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
        </>
      )}
    </div>
  );
}

function ChatInterface({ onClose, selectedBusiness, onBusinessChange, currentUser }: {
  onClose: () => void;
  selectedBusiness: string | null;
  onBusinessChange: (business: string) => void;
  currentUser: (typeof MOCK_USERS.free & { businesses: string[] }) | null;
}) {
  const [messages, setMessages] = useState<Array<{
    id: number;
    text: string;
    sender: 'user' | 'bot';
    loading?: boolean;
  }>>([
    {
      id: 1,
      text: "¡Hola! Soy Pit Exit, tu asistente de IA. ¿En qué puedo ayudarte hoy?",
      sender: 'bot'
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const [showBusinessSelector, setShowBusinessSelector] = useState(!selectedBusiness);
  const [showCreateBusiness, setShowCreateBusiness] = useState(false);
  const [showUpgradeModal, setShowUpgradeModal] = useState(false);

  const handleCreateBusiness = (name: string) => {
    if (!currentUser) return;

    const businessLimit = BUSINESS_LIMITS[currentUser.plan as keyof typeof BUSINESS_LIMITS];
    if (currentUser.businesses.length >= businessLimit) {
      setShowUpgradeModal(true);
      return;
    }

    currentUser.businesses.push(name);
    onBusinessChange(name);
    setShowBusinessSelector(false);
  };

  const messagesEndRef = React.useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  React.useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newUserMessage = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user' as const
    };

    setMessages(prev => [...prev, newUserMessage]);
    setInputValue('');

    // Simular respuesta del bot
    const loadingMessage = {
      id: messages.length + 2,
      text: '...',
      sender: 'bot' as const,
      loading: true
    };

    setMessages(prev => [...prev, loadingMessage]);

    // Simular delay y respuesta
    setTimeout(() => {
      const botResponse = {
        id: messages.length + 2,
        text: getBotResponse(inputValue),
        sender: 'bot' as const
      };

      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id ? botResponse : msg
      ));
    }, 1500);
  };

  const getBotResponse = (input: string) => {
    const lowerInput = input.toLowerCase();
    if (lowerInput.includes('fondo') || lowerInput.includes('financiamiento')) {
      return "Basado en tu descripción, te recomiendo explorar el fondo CORFO Semilla. Este fondo ofrece hasta $25.000.000 para startups innovadoras. ¿Te gustaría conocer más detalles sobre los requisitos?";
    } else if (lowerInput.includes('modelo') || lowerInput.includes('negocio')) {
      return "Puedo ayudarte a estructurar tu modelo de negocio usando el Canvas. ¿Empezamos por definir tu propuesta de valor?";
    } else if (lowerInput.includes('contenido') || lowerInput.includes('redes')) {
      return "Puedo ayudarte a generar contenido para redes sociales. ¿Para qué plataforma necesitas contenido? Tengo templates optimizados para Instagram, LinkedIn y Twitter.";
    }
    return "Cuéntame más sobre tu negocio para poder ayudarte mejor. ¿Qué tipo de ayuda necesitas específicamente?";
  };

  if (showUpgradeModal) {
    return (
      <UpgradeModal
        onClose={() => setShowUpgradeModal(false)}
        currentPlan={currentUser?.plan || 'Gratis'}
      />
    );
  }

  if (showCreateBusiness) {
    return (
      <CreateBusinessModal
        onClose={() => setShowCreateBusiness(false)}
        onCreate={handleCreateBusiness}
        currentPlan={currentUser?.plan || 'Gratis'}
      />
    );
  }

  if (showBusinessSelector) {
    return (
      <div className="fixed inset-0 bg-deep-dark flex items-center justify-center p-4">
        <div className="bg-dark-surface w-full max-w-2xl rounded-xl p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold gradient-text">Gestionar Negocios</h2>
            <button 
              onClick={onClose}
              className="text-gray-400 hover:text-white transition-colors"
            >
              <ArrowLeft />
            </button>
          </div>

          {currentUser?.businesses.length === 0 ? (
            <div className="text-center py-8">
              <Building className="w-16 h-16 text-gray-600 mx-auto mb-4" />
              <p className="text-gray-400 mb-6">Aún no tienes negocios creados</p>
              <button
                className="neon-button inline-flex items-center"
                onClick={() => setShowCreateBusiness(true)}
              >
                <Plus className="w-5 h-5 mr-2" />
                Crear Primer Negocio
              </button>
            </div>
          ) : (
            <>
              <div className="grid gap-4 mb-6">
                {currentUser?.businesses.map(business => (
                  <button
                    key={business}
                    className="feature-card flex items-center p-4 text-left"
                    onClick={() => {
                      onBusinessChange(business);
                      setShowBusinessSelector(false);
                    }}
                  >
                    <div className="w-12 h-12 rounded-full bg-neon-blue/10 flex items-center justify-center mr-4">
                      <Building className="w-6 h-6 text-neon-blue" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-lg">{business}</h3>
                    </div>
                  </button>
                ))}
              </div>
              <div className="flex justify-between items-center">
                <p className="text-sm text-gray-400">
                  {currentUser?.businesses.length} de {BUSINESS_LIMITS[currentUser?.plan as keyof typeof BUSINESS_LIMITS]} negocios
                </p>
                <button
                  className="neon-button inline-flex items-center"
                  onClick={() => setShowCreateBusiness(true)}
                >
                  <Plus className="w-5 h-5 mr-2" />
                  Crear Nuevo Negocio
                </button>
              </div>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-deep-dark flex flex-col">
      {/* Chat Header */}
      <div className="bg-dark-surface p-4 flex items-center justify-between border-b border-gray-800">
        <div className="flex items-center">
          <button 
            onClick={onClose}
            className="mr-4 text-gray-400 hover:text-white transition-colors"
          >
            <ArrowLeft />
          </button>
          <div>
            <h2 className="font-semibold">Chat con Pit Exit</h2>
            <p className="text-sm text-gray-400">
              {currentUser?.username} - Plan {currentUser?.plan}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-4">
          {selectedBusiness ? (
            <>
              <div className="flex items-center gap-2">
                <Building className="w-4 h-4 text-neon-blue" />
                <span className="text-neon-blue font-medium">
                  {selectedBusiness}
                </span>
              </div>
              <button
                onClick={() => setShowBusinessSelector(true)}
                className="text-gray-400 hover:text-white transition-colors text-sm"
              >
                Cambiar Negocio
              </button>
            </>
          ) : (
            <button
              onClick={() => setShowCreateBusiness(true)}
              className="neon-button inline-flex items-center text-sm py-2"
            >
              <Plus className="w-4 h-4 mr-2" />
              Crear Negocio
            </button>
          )}
        </div>
      </div>

      {/* Chat Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map(message => (
          <div
            key={message.id}
            className={`flex ${message.sender === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] md:max-w-[60%] rounded-lg p-4 ${
                message.sender === 'user'
                  ? 'bg-neon-blue text-deep-dark ml-4'
                  : 'bg-dark-surface border border-gray-800'
              }`}
            >
              {message.loading ? (
                <div className="flex space-x-2">
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                  <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                </div>
              ) : (
                <p>{message.text}</p>
              )}
            </div>
          </div>
        ))}
        <div ref={messagesEndRef} />
      </div>

      {/* Chat Input */}
      <div className="bg-dark-surface p-4 border-t border-gray-800">
        <div className="flex items-center space-x-4">
          <input
            type="text"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && handleSend()}
            placeholder="Escribe tu mensaje..."
            className="flex-1 bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
          />
          <button
            onClick={handleSend}
            className="w-10 h-10 rounded-lg bg-neon-blue text-deep-dark flex items-center justify-center hover:bg-neon-blue/90 transition-colors"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
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