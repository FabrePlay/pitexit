import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Send, 
  Bot, 
  User, 
  Sparkles, 
  FileText, 
  Download, 
  Copy, 
  Check,
  X,
  Maximize2,
  Minimize2,
  RefreshCw,
  Zap
} from 'lucide-react';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  loading?: boolean;
  hasResult?: boolean;
  resultType?: 'document' | 'analysis' | 'strategy' | 'content';
}

interface AgentResult {
  type: 'document' | 'analysis' | 'strategy' | 'content';
  title: string;
  content: string;
  metadata?: {
    wordCount?: number;
    readingTime?: string;
    tags?: string[];
  };
}

const AGENT_RESPONSES = {
  'fondo': {
    text: "He encontrado varios fondos que se ajustan a tu perfil. Te he preparado un análisis detallado con las mejores opciones.",
    result: {
      type: 'analysis' as const,
      title: 'Análisis de Fondos Disponibles',
      content: `# Fondos Recomendados para tu Startup

## 🎯 CORFO Semilla Inicia
**Monto:** Hasta $25.000.000
**Plazo:** 12 meses
**Requisitos:**
- Empresa constituida hace menos de 2 años
- Facturación anual menor a $200.000.000
- Equipo fundador con al menos 2 personas

**Probabilidad de éxito:** 85% (basado en tu perfil)

## 🚀 Start-Up Chile
**Monto:** USD $40.000 + aceleración
**Plazo:** 6 meses
**Requisitos:**
- Startup innovadora
- Equipo internacional bienvenido
- Modelo de negocio escalable

**Probabilidad de éxito:** 72%

## 💡 INNOVA CORFO
**Monto:** Hasta $200.000.000
**Plazo:** 24 meses
**Requisitos:**
- Proyecto de innovación tecnológica
- Cofinanciamiento 50%
- Plan de comercialización

**Probabilidad de éxito:** 68%

## 📋 Próximos Pasos
1. Preparar documentación para CORFO Semilla
2. Desarrollar pitch deck para Start-Up Chile
3. Validar modelo de negocio
4. Preparar plan financiero detallado`,
      metadata: {
        wordCount: 180,
        readingTime: '2 min',
        tags: ['Fondos', 'CORFO', 'Start-Up Chile', 'Financiamiento']
      }
    }
  },
  'modelo': {
    text: "He creado tu Business Model Canvas completo basado en la información que me proporcionaste.",
    result: {
      type: 'strategy' as const,
      title: 'Business Model Canvas - Pit Exit',
      content: `# Business Model Canvas - Pit Exit

## 🤝 Socios Clave
- Proveedores de IA (OpenAI, Google)
- Instituciones financieras
- Aceleradoras y fondos
- Partners tecnológicos

## 🎯 Actividades Clave
- Desarrollo de algoritmos de IA
- Análisis de fondos y oportunidades
- Generación de contenido automatizado
- Soporte y consultoría

## 🔑 Recursos Clave
- Plataforma tecnológica
- Base de datos de fondos
- Equipo de desarrollo
- Algoritmos propietarios

## 💰 Propuesta de Valor
**Para Emprendedores:**
- Automatización de búsqueda de fondos
- Generación de contenido con IA
- Estructuración de modelos de negocio
- Ahorro de tiempo y recursos

## 👥 Relación con Clientes
- Soporte 24/7 con chatbot
- Comunidad de emprendedores
- Webinars y capacitaciones
- Consultoría personalizada

## 📢 Canales
- Plataforma web
- Redes sociales
- Marketing de contenidos
- Partnerships estratégicos

## 🎯 Segmentos de Clientes
- Emprendedores early-stage
- Startups en crecimiento
- Agencias de marketing
- Consultoras de negocios

## 💵 Estructura de Costos
- Desarrollo y mantenimiento
- Costos de IA y APIs
- Marketing y adquisición
- Equipo y operaciones

## 💸 Fuentes de Ingresos
- Suscripciones mensuales
- Planes premium
- Servicios de consultoría
- Comisiones por fondos obtenidos`,
      metadata: {
        wordCount: 245,
        readingTime: '3 min',
        tags: ['Business Model', 'Canvas', 'Estrategia', 'Modelo de Negocio']
      }
    }
  },
  'contenido': {
    text: "He generado una estrategia completa de contenido para tus redes sociales con posts listos para publicar.",
    result: {
      type: 'content' as const,
      title: 'Estrategia de Contenido - Redes Sociales',
      content: `# Estrategia de Contenido para Pit Exit

## 📱 Instagram Posts

### Post 1: Educativo
**Caption:**
"🚀 ¿Sabías que el 90% de los emprendedores no sabe cómo encontrar fondos para su startup?

Con Pit Exit, nuestra IA analiza tu perfil y te conecta automáticamente con los fondos que mejor se ajustan a tu proyecto.

✨ Resultados en minutos, no en meses
🎯 Fondos personalizados para tu industria
📊 Análisis de probabilidad de éxito

#Emprendimiento #Startups #Fondos #IA #PitExit"

**Hashtags:** #emprendimiento #startups #fondos #inteligenciaartificial #financiamiento

### Post 2: Testimonial
**Caption:**
"💬 'Gracias a Pit Exit conseguí financiamiento de $50M en solo 3 semanas. Su IA me ayudó a encontrar el fondo perfecto y a preparar toda la documentación.' - María González, CEO de EcoTech

¿Listo para transformar tu idea en realidad?

#TestimonioReal #ExitoEmprendedor #PitExit"

## 🐦 Twitter Threads

### Thread: Fondos en Chile
"🧵 HILO: Los 5 fondos más accesibles para startups en Chile (2024)

1/6 CORFO Semilla Inicia
💰 Hasta $25M
⏰ Proceso: 3 meses
✅ 85% tasa de aprobación para perfiles tech

2/6 Start-Up Chile
💰 USD $40K + aceleración
🌍 Abierto a extranjeros
✅ Red global de mentores

[continúa...]"

## 📺 LinkedIn Articles

### "Cómo la IA está revolucionando la búsqueda de financiamiento"
- Introducción al problema
- Solución tecnológica
- Casos de éxito
- Futuro del financiamiento

## 📊 Calendario de Publicación
- **Lunes:** Tips educativos
- **Miércoles:** Casos de éxito
- **Viernes:** Tendencias del mercado
- **Domingo:** Inspiración emprendedora`,
      metadata: {
        wordCount: 320,
        readingTime: '4 min',
        tags: ['Contenido', 'Redes Sociales', 'Marketing', 'Instagram', 'LinkedIn']
      }
    }
  }
};

export default function AIAgentInterface() {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "¡Hola! Soy tu agente de IA especializado en emprendimiento. Puedo ayudarte a encontrar fondos, crear tu modelo de negocio o generar contenido para redes sociales. ¿En qué te gustaría que te ayude?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [currentResult, setCurrentResult] = useState<AgentResult | null>(null);
  const [isResultMaximized, setIsResultMaximized] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim()) return;

    const newUserMessage: Message = {
      id: messages.length + 1,
      text: inputValue,
      sender: 'user',
      timestamp: new Date()
    };

    setMessages(prev => [...prev, newUserMessage]);
    const userInput = inputValue.toLowerCase();
    setInputValue('');

    // Simular respuesta del bot con loading
    const loadingMessage: Message = {
      id: messages.length + 2,
      text: 'Analizando tu solicitud...',
      sender: 'bot',
      timestamp: new Date(),
      loading: true
    };

    setMessages(prev => [...prev, loadingMessage]);

    // Simular delay y respuesta
    setTimeout(() => {
      let response = AGENT_RESPONSES['fondo']; // default
      let hasResult = false;

      if (userInput.includes('fondo') || userInput.includes('financiamiento')) {
        response = AGENT_RESPONSES['fondo'];
        hasResult = true;
      } else if (userInput.includes('modelo') || userInput.includes('canvas') || userInput.includes('negocio')) {
        response = AGENT_RESPONSES['modelo'];
        hasResult = true;
      } else if (userInput.includes('contenido') || userInput.includes('redes') || userInput.includes('social')) {
        response = AGENT_RESPONSES['contenido'];
        hasResult = true;
      }

      const botResponse: Message = {
        id: messages.length + 2,
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        hasResult,
        resultType: hasResult ? response.result.type : undefined
      };

      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id ? botResponse : msg
      ));

      if (hasResult) {
        setCurrentResult(response.result);
        setShowResult(true);
      }
    }, 2000);
  };

  const handleCopyResult = async () => {
    if (currentResult) {
      await navigator.clipboard.writeText(currentResult.content);
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const getResultIcon = (type: string) => {
    switch (type) {
      case 'document': return <FileText className="w-5 h-5" />;
      case 'analysis': return <Sparkles className="w-5 h-5" />;
      case 'strategy': return <Zap className="w-5 h-5" />;
      case 'content': return <Bot className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  return (
    <div className="min-h-screen bg-deep-dark flex">
      {/* Chat Section */}
      <div className={`transition-all duration-500 ease-in-out ${
        showResult && !isResultMaximized ? 'w-1/2' : 'w-full'
      } flex flex-col`}>
        {/* Chat Header */}
        <div className="bg-dark-surface p-6 border-b border-gray-800">
          <div className="flex items-center justify-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-blue to-blue-500 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Agente IA Pit Exit</h1>
                <p className="text-sm text-gray-400">Especialista en Emprendimiento</p>
              </div>
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="max-w-4xl mx-auto">
            {messages.map(message => (
              <div
                key={message.id}
                className={`flex items-start space-x-4 ${
                  message.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
                }`}
              >
                {/* Avatar */}
                <div className={`w-10 h-10 rounded-full flex items-center justify-center flex-shrink-0 ${
                  message.sender === 'user' 
                    ? 'bg-neon-blue' 
                    : 'bg-gradient-to-r from-purple-500 to-pink-500'
                }`}>
                  {message.sender === 'user' ? (
                    <User className="w-5 h-5 text-deep-dark" />
                  ) : (
                    <Bot className="w-5 h-5 text-white" />
                  )}
                </div>

                {/* Message Content */}
                <div className={`flex-1 max-w-2xl ${
                  message.sender === 'user' ? 'text-right' : ''
                }`}>
                  <div className={`inline-block p-4 rounded-2xl ${
                    message.sender === 'user'
                      ? 'bg-neon-blue text-deep-dark'
                      : 'bg-dark-surface border border-gray-800'
                  }`}>
                    {message.loading ? (
                      <div className="flex items-center space-x-2">
                        <div className="flex space-x-1">
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
                          <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
                        </div>
                        <RefreshCw className="w-4 h-4 animate-spin text-gray-400" />
                      </div>
                    ) : (
                      <>
                        <p className="text-sm leading-relaxed">{message.text}</p>
                        {message.hasResult && (
                          <div className="mt-3 pt-3 border-t border-gray-700">
                            <button
                              onClick={() => {
                                setShowResult(true);
                                // Find and set the corresponding result
                                const resultKey = Object.keys(AGENT_RESPONSES).find(key => 
                                  AGENT_RESPONSES[key as keyof typeof AGENT_RESPONSES].result.type === message.resultType
                                );
                                if (resultKey) {
                                  setCurrentResult(AGENT_RESPONSES[resultKey as keyof typeof AGENT_RESPONSES].result);
                                }
                              }}
                              className="flex items-center space-x-2 text-neon-blue hover:text-white transition-colors text-sm"
                            >
                              {getResultIcon(message.resultType || 'document')}
                              <span>Ver resultado completo</span>
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                  <div className="mt-1 text-xs text-gray-500">
                    {message.timestamp.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                  </div>
                </div>
              </div>
            ))}
            <div ref={messagesEndRef} />
          </div>
        </div>

        {/* Chat Input */}
        <div className="bg-dark-surface p-6 border-t border-gray-800">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder="Pregúntame sobre fondos, modelos de negocio o contenido..."
                  className="w-full bg-deep-dark border border-gray-800 rounded-xl px-6 py-4 pr-12 focus:outline-none focus:border-neon-blue transition-colors text-white placeholder-gray-400"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim()}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-neon-blue text-deep-dark flex items-center justify-center hover:bg-neon-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-4">
              <button
                onClick={() => setInputValue('Ayúdame a encontrar fondos para mi startup')}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
              >
                🎯 Encontrar Fondos
              </button>
              <button
                onClick={() => setInputValue('Crea mi modelo de negocio')}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
              >
                📊 Modelo de Negocio
              </button>
              <button
                onClick={() => setInputValue('Genera contenido para redes sociales')}
                className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
              >
                📱 Contenido Social
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Result Panel */}
      <AnimatePresence>
        {showResult && currentResult && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className={`${
              isResultMaximized ? 'fixed inset-0 z-50' : 'w-1/2'
            } bg-dark-surface border-l border-gray-800 flex flex-col`}
          >
            {/* Result Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                  {getResultIcon(currentResult.type)}
                </div>
                <div>
                  <h2 className="font-semibold text-white">{currentResult.title}</h2>
                  {currentResult.metadata && (
                    <div className="flex items-center space-x-4 text-xs text-gray-400 mt-1">
                      {currentResult.metadata.wordCount && (
                        <span>{currentResult.metadata.wordCount} palabras</span>
                      )}
                      {currentResult.metadata.readingTime && (
                        <span>{currentResult.metadata.readingTime} lectura</span>
                      )}
                    </div>
                  )}
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={handleCopyResult}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  title="Copiar contenido"
                >
                  {copiedText ? (
                    <Check className="w-4 h-4 text-green-500" />
                  ) : (
                    <Copy className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => setIsResultMaximized(!isResultMaximized)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  title={isResultMaximized ? "Minimizar" : "Maximizar"}
                >
                  {isResultMaximized ? (
                    <Minimize2 className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => setShowResult(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  title="Cerrar"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Result Content */}
            <div className="flex-1 overflow-y-auto p-6">
              <div className="prose prose-invert max-w-none">
                <div 
                  className="text-gray-300 leading-relaxed whitespace-pre-line"
                  dangerouslySetInnerHTML={{ 
                    __html: currentResult.content
                      .replace(/^# (.*$)/gm, '<h1 class="text-2xl font-bold text-white mb-4 gradient-text">$1</h1>')
                      .replace(/^## (.*$)/gm, '<h2 class="text-xl font-semibold text-white mb-3 mt-6">$1</h2>')
                      .replace(/^### (.*$)/gm, '<h3 class="text-lg font-medium text-white mb-2 mt-4">$1</h3>')
                      .replace(/^\*\*(.*?)\*\*/gm, '<strong class="text-white font-semibold">$1</strong>')
                      .replace(/^- (.*$)/gm, '<li class="ml-4 mb-1">$1</li>')
                      .replace(/^(\d+)\. (.*$)/gm, '<li class="ml-4 mb-1">$2</li>')
                  }}
                />
              </div>

              {/* Tags */}
              {currentResult.metadata?.tags && (
                <div className="mt-8 pt-6 border-t border-gray-800">
                  <div className="flex flex-wrap gap-2">
                    {currentResult.metadata.tags.map((tag, index) => (
                      <span
                        key={index}
                        className="px-3 py-1 bg-neon-blue/10 text-neon-blue rounded-full text-sm"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Result Actions */}
            <div className="p-6 border-t border-gray-800">
              <div className="flex space-x-3">
                <button className="flex-1 neon-button flex items-center justify-center space-x-2">
                  <Download className="w-4 h-4" />
                  <span>Descargar PDF</span>
                </button>
                <button 
                  onClick={handleCopyResult}
                  className="px-4 py-2 border border-gray-700 hover:border-neon-blue rounded-lg transition-colors flex items-center space-x-2"
                >
                  {copiedText ? (
                    <>
                      <Check className="w-4 h-4 text-green-500" />
                      <span className="text-green-500">Copiado</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-4 h-4" />
                      <span>Copiar</span>
                    </>
                  )}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}