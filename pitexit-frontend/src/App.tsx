import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Rocket, MessageSquare, Zap, ChevronRight, Check, Users, Sparkles, Crown, BookOpen, Trophy, Lightbulb, User } from 'lucide-react';
import AIAgentInterface from './components/AIAgentInterface';
import UserProfile from './components/UserProfile';
import AuthModal from './components/AuthModal';
import { useAuth } from './hooks/useAuth';
import { useBusinesses } from './hooks/useBusinesses';

function App() {
  const { user, userProfile, loading: authLoading, signOut } = useAuth();
  const { businesses } = useBusinesses();
  const [showAuth, setShowAuth] = useState(false);
  const [showProfile, setShowProfile] = useState(false);
  const [showPlayground, setShowPlayground] = useState(false);
  const [selectedBusiness, setSelectedBusiness] = useState<string | null>(null);

  const handlePlaygroundClick = () => {
    if (userProfile) {
      setShowPlayground(true);
    } else {
      setShowAuth(true);
    }
  };

  const handleProfileClick = () => {
    if (userProfile) {
      setShowProfile(true);
    } else {
      setShowAuth(true);
    }
  };

  const handleNavigateToPlayground = (businessName: string) => {
    setSelectedBusiness(businessName);
    setShowProfile(false);
    setShowPlayground(true);
  };

  // Debug: Log user state
  console.log('App state:', { user, userProfile, loading: authLoading, businesses });

  // Mostrar Playground
  if (showPlayground && userProfile) {
    return (
      <AIAgentInterface 
        currentUser={userProfile}
        selectedBusiness={selectedBusiness}
        businesses={businesses}
        onBusinessChange={setSelectedBusiness}
        onClose={() => setShowPlayground(false)}
      />
    );
  }

  // Mostrar Perfil
  if (showProfile && userProfile) {
    return (
      <UserProfile 
        user={userProfile}
        businesses={businesses}
        onUpdateUser={updateProfile}
        onClose={() => setShowProfile(false)}
        onNavigateToPlayground={handleNavigateToPlayground}
      />
    );
  }

  return (
    <div className="min-h-screen bg-deep-dark">
      {showAuth && (
        <AuthModal 
          onClose={() => setShowAuth(false)} 
        />
      )}
      
      {/* Navigation Bar */}
      {userProfile && (
        <nav className="fixed top-0 right-0 z-40 p-4">
          <div className="flex items-center space-x-4">
            <button
              onClick={handleProfileClick}
              className="flex items-center space-x-2 bg-dark-surface/80 backdrop-blur-sm border border-gray-800 rounded-lg px-4 py-2 hover:border-neon-blue transition-colors"
            >
              <div className="w-6 h-6 rounded-full bg-neon-blue/10 flex items-center justify-center">
                <User className="w-4 h-4 text-neon-blue" />
              </div>
              <span className="text-sm text-white">{userProfile.username}</span>
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
                {userProfile ? 'Abrir Playground' : 'Probar Playground'} <Bot className="inline ml-2 w-5 h-5" />
              </button>
              <button 
                className="border border-gray-700 hover:border-neon-blue px-8 py-3 rounded-lg transition-all duration-300"
                onClick={() => {
                  if (!userProfile) {
                    setShowAuth(true);
                  } else {
                    handleProfileClick();
                  }
                }}
              >
                {userProfile ? 'Mi Perfil' : 'Iniciar Sesión'} <ChevronRight className="inline ml-2" />
              </button>
              {userProfile && (
                <div className="inline-flex items-center gap-4 mt-4">
                  <span className="text-neon-blue">
                    Plan {userProfile.plan}
                  </span>
                  <button 
                    className="text-gray-400 hover:text-white transition-colors"
                    onClick={signOut}
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
              { step: "4", title: "Genera Contenido", icon:  <Rocket /> }
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
          <p className="text-xl text-gray-400 text-center mb-16 max-w-3xl mx-auto">
            Nuestros planes están diseñados para impulsar tu estrategia y crecimiento, desde tus primeros pasos hasta la gestión de múltiples negocios.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
            <PricingCard
              name="Pitexit Go-Kart"
              subtitle="El Fundamento del Éxito"
              price="Gratis"
              icon={<Sparkles />}
              features={[
                "1 Negocio",
                "1 Hack de Valor / mes",
                "1 Tipo de Contenido / mes",
                "Asesoría IA básica",
                "Plan de Trabajo Básico (3 etapas, 5 tareas)",
                "Dashboard personal",
                "Historial de chat básico",
                "20-30 interacciones IA / mes",
                "Acceso a comunidad"
              ]}
              highlighted={false}
              buttonText="Empezar Ahora Gratis"
            />
            <PricingCard
              name="Pitexit F3"
              subtitle="Tu Impulso Estratégico"
              price="$49"
              icon={<Zap />}
              features={[
                "Hasta 3 Negocios",
                "Hacks de Valor Ilimitados",
                "Contenido Ilimitado (Reels, Carruseles, Historias, Copy, LinkedIn)",
                "Metodologías Avanzadas IA",
                "Framework de Innovación",
                "Modelos de Negocio",
                "Planes de Trabajo Completos",
                "Dashboard avanzado",
                "500-1000 interacciones IA / mes",
                "Soporte por email"
              ]}
              highlighted={true}
              buttonText="Acelerar mi Estrategia"
            />
            <PricingCard
              name="Pitexit F2"
              subtitle="El Motor Acelerado"
              price="$199"
              icon={<Crown />}
              features={[
                "Hasta 10 Negocios",
                "Hacks de Valor Ilimitados",
                "Generación Ilimitada de Contenido",
                "Análisis EVD Profundo con IA",
                "Planes de Trabajo Completos",
                "Dashboard Avanzado",
                "Reportes agregados",
                "Comparativas entre negocios",
                "Interacciones IA muy altas/ilimitadas",
                "Soporte prioritario, chat en vivo"
              ]}
              highlighted={false}
              buttonText="Optimizar mis Negocios"
            />
            <PricingCard
              name="Pitexit F1"
              subtitle="La Cumbre del Rendimiento"
              price="Consultar"
              icon={<Trophy />}
              features={[
                "Grandes Volúmenes a Medida",
                "Múltiples Negocios (límites muy altos)",
                "Funcionalidades IA Ilimitadas",
                "Soporte Dedicado 24/7 y SLA",
                "Personalización Extrema",
                "Integraciones Avanzadas (CRMs, E-commerce)",
                "Ajuste Fino del Agente IA",
                "Desarrollo de características personalizadas",
                "Adaptación a requerimientos específicos"
              ]}
              highlighted={false}
              buttonText="Contactar Ventas F1"
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

function PricingCard({ name, subtitle, price, icon, features, highlighted, buttonText }: { 
  name: string,
  subtitle: string,
  price: string, 
  icon: React.ReactNode,
  features: string[],
  highlighted: boolean,
  buttonText: string
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
        <p className="text-sm text-gray-400 mb-3">{subtitle}</p>
        <div className="text-3xl font-bold text-neon-blue mb-4">
          {price}
          {price !== 'Gratis' && price !== 'Consultar' && <span className="text-sm text-gray-400">/mes</span>}
        </div>
      </div>
      <ul className="space-y-3 mb-6">
        {features.map((feature, index) => (
          <li key={index} className="flex items-start">
            <Check className="w-4 h-4 text-neon-blue mr-2 mt-0.5 flex-shrink-0" />
            <span className="text-gray-300 text-sm">{feature}</span>
          </li>
        ))}
      </ul>
      <button className={`w-full ${highlighted ? 'neon-button' : 'border border-gray-700 hover:border-neon-blue px-8 py-3 rounded-lg transition-all duration-300'}`}>
        {buttonText}
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