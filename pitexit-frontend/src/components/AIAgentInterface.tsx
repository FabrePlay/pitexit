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
  Zap,
  Building,
  Plus,
  ArrowLeft,
  ChevronDown,
  ChevronRight,
  Bell,
  BarChart3
} from 'lucide-react';
import ResultVisualization from './ResultVisualization';
import BusinessDashboard from './BusinessDashboard';
import NotificationCenter from './NotificationCenter';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  loading?: boolean;
  hasResult?: boolean;
  resultType?: 'hack_analysis' | 'work_plan' | 'content_reel_script' | 'table_comparison' | 'flow_diagram_textual';
}

interface StructuredResult {
  id: string;
  type: 'hack_analysis' | 'work_plan' | 'content_reel_script' | 'table_comparison' | 'flow_diagram_textual';
  title: string;
  content: any;
  createdAt: Date;
  businessName: string;
}

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

interface AIAgentInterfaceProps {
  currentUser?: any;
  selectedBusiness?: string | null;
  onBusinessChange?: (business: string) => void;
  onClose?: () => void;
}

// Datos de prueba para resultados estructurados por negocio
const MOCK_STRUCTURED_RESULTS: { [businessName: string]: StructuredResult[] } = {
  'Café Artesanal': [
    {
      id: 'hack-1',
      type: 'hack_analysis',
      title: 'Hack de Valor: Programa de Fidelización',
      content: {
        problema: 'Los clientes no regresan con frecuencia y la retención es baja (30%)',
        oportunidad: 'Crear un programa de fidelización que incentive compras recurrentes',
        solucion: 'Implementar un sistema de puntos con recompensas exclusivas y experiencias únicas',
        beneficios: [
          'Aumento del 40% en retención de clientes',
          'Incremento del 25% en ticket promedio',
          'Base de datos de clientes para marketing directo',
          'Diferenciación frente a competencia'
        ],
        implementacion: [
          'Diseñar sistema de puntos y recompensas',
          'Desarrollar app móvil o tarjeta física',
          'Capacitar al equipo en el nuevo sistema',
          'Lanzar campaña de comunicación',
          'Medir y optimizar resultados'
        ],
        riesgo: 'Bajo - Inversión moderada con retorno predecible',
        impacto: 'Alto - Mejora significativa en métricas clave'
      },
      createdAt: new Date('2024-01-15'),
      businessName: 'Café Artesanal'
    },
    {
      id: 'work-plan-1',
      type: 'work_plan',
      title: 'Plan de Expansión - Segunda Sucursal',
      content: {
        objetivos: [
          'Abrir segunda sucursal en Las Condes',
          'Mantener calidad y estándares de la marca',
          'Alcanzar punto de equilibrio en 8 meses'
        ],
        etapas: [
          {
            nombre: 'Investigación y Planificación',
            duracion: '4 semanas',
            tareas: [
              {
                descripcion: 'Análisis de mercado en Las Condes',
                responsable: 'Equipo Marketing',
                fechaLimite: '2024-02-15',
                estado: 'Completado'
              },
              {
                descripcion: 'Búsqueda y evaluación de locales',
                responsable: 'Gerente General',
                fechaLimite: '2024-02-20',
                estado: 'En progreso'
              }
            ]
          },
          {
            nombre: 'Preparación y Setup',
            duracion: '6 semanas',
            tareas: [
              {
                descripcion: 'Negociación y firma de contrato',
                responsable: 'Gerente General',
                fechaLimite: '2024-03-01',
                estado: 'Pendiente'
              },
              {
                descripcion: 'Diseño y remodelación del local',
                responsable: 'Arquitecto',
                fechaLimite: '2024-03-15',
                estado: 'Pendiente'
              }
            ]
          }
        ]
      },
      createdAt: new Date('2024-01-10'),
      businessName: 'Café Artesanal'
    },
    {
      id: 'content-reel-1',
      type: 'content_reel_script',
      title: 'Guiones para Reels - Café Artesanal',
      content: {
        reels: [
          {
            titulo: 'El Arte del Café Perfecto',
            duracion: '30 segundos',
            hook: '¿Sabías que el 90% de las personas prepara mal su café?',
            desarrollo: [
              'Mostrar granos de café de origen único',
              'Demostrar la técnica de molienda correcta',
              'Revelar el secreto de la temperatura del agua',
              'Mostrar el resultado final: una taza perfecta'
            ],
            cta: 'Ven a descubrir el verdadero sabor del café en Café Artesanal',
            hashtags: ['#CafeArtesanal', '#CafeDeOrigen', '#BaristaLife', '#CafePerfecto', '#Santiago']
          },
          {
            titulo: 'De la Semilla a tu Taza',
            duracion: '45 segundos',
            hook: 'Este grano viajó 8,000 km para llegar a tu taza',
            desarrollo: [
              'Mostrar el origen del café en finca colombiana',
              'Proceso de selección y tostado artesanal',
              'Preparación por barista experto',
              'Momento de degustación del cliente'
            ],
            cta: 'Vive la experiencia completa del café. Visítanos hoy',
            hashtags: ['#CafeDeOrigen', '#Trazabilidad', '#CafeArtesanal', '#ExperienciaCafe']
          }
        ]
      },
      createdAt: new Date('2024-01-12'),
      businessName: 'Café Artesanal'
    }
  ],
  'TechStart': [
    {
      id: 'hack-2',
      type: 'hack_analysis',
      title: 'Hack de Crecimiento: Freemium con IA',
      content: {
        problema: 'Dificultad para adquirir usuarios en un mercado competitivo',
        oportunidad: 'Ofrecer funcionalidades básicas gratis con IA como diferenciador premium',
        solucion: 'Modelo freemium donde la IA avanzada es el valor premium',
        beneficios: [
          'Reducción del 60% en costo de adquisición',
          'Aumento de conversión del 15% a premium',
          'Mayor volumen de usuarios para feedback',
          'Posicionamiento como líder en IA'
        ],
        implementacion: [
          'Definir funcionalidades free vs premium',
          'Desarrollar onboarding optimizado',
          'Implementar analytics de conversión',
          'Crear contenido educativo sobre IA',
          'Optimizar funnel de conversión'
        ],
        riesgo: 'Medio - Requiere balance entre valor gratuito y premium',
        impacto: 'Muy Alto - Escalabilidad exponencial'
      },
      createdAt: new Date('2024-01-12'),
      businessName: 'TechStart'
    },
    {
      id: 'table-1',
      type: 'table_comparison',
      title: 'Comparativa Competitiva - Gestión de Proyectos',
      content: {
        headers: [
          { id: 'criterio', label: 'Criterio' },
          { id: 'jira', label: 'Jira' },
          { id: 'asana', label: 'Asana' },
          { id: 'tu_propuesta', label: 'TechStart', highlight: true }
        ],
        rows: [
          {
            criterio: 'IA Predictiva',
            jira: 'No disponible',
            asana: 'Básica',
            tu_propuesta: 'IA avanzada con ML'
          },
          {
            criterio: 'Precio (por usuario)',
            jira: '$7-14/mes',
            asana: '$10-24/mes',
            tu_propuesta: '$5-12/mes'
          },
          {
            criterio: 'Facilidad de uso',
            jira: 'Complejo',
            asana: 'Intuitivo',
            tu_propuesta: 'Muy intuitivo + IA'
          },
          {
            criterio: 'Automatización',
            jira: 'Manual',
            asana: 'Básica',
            tu_propuesta: 'IA automática'
          }
        ]
      },
      createdAt: new Date('2024-01-08'),
      businessName: 'TechStart'
    },
    {
      id: 'content-reel-2',
      type: 'content_reel_script',
      title: 'Guiones para Reels - TechStart',
      content: {
        reels: [
          {
            titulo: 'IA que Predice el Futuro de tu Proyecto',
            duracion: '30 segundos',
            hook: '¿Y si pudieras saber si tu proyecto se retrasará antes de que suceda?',
            desarrollo: [
              'Mostrar dashboard con alertas de IA',
              'Demostrar predicción de retrasos en tiempo real',
              'Mostrar sugerencias automáticas de optimización',
              'Resultado: proyecto entregado a tiempo'
            ],
            cta: 'Prueba TechStart gratis y nunca más te retrases',
            hashtags: ['#TechStart', '#IA', '#GestionProyectos', '#Productividad', '#Startup']
          },
          {
            titulo: 'Adiós a las Reuniones Innecesarias',
            duracion: '45 segundos',
            hook: 'Tu equipo pierde 23 horas al mes en reuniones que podrían ser un mensaje',
            desarrollo: [
              'Mostrar calendario lleno de reuniones',
              'Demostrar cómo TechStart automatiza updates',
              'IA genera reportes automáticos de progreso',
              'Equipo enfocado en trabajo real, no reuniones'
            ],
            cta: 'Recupera tu tiempo. Prueba TechStart hoy',
            hashtags: ['#Productividad', '#TechStart', '#IA', '#Automatizacion', '#Eficiencia']
          }
        ]
      },
      createdAt: new Date('2024-01-14'),
      businessName: 'TechStart'
    }
  ]
};

// Datos de prueba para planes de trabajo por negocio
const MOCK_WORK_PLANS: { [businessName: string]: WorkPlan[] } = {
  'Café Artesanal': [
    {
      id: 'wp-cafe-1',
      businessName: 'Café Artesanal',
      title: 'Plan de Expansión 2024',
      description: 'Estrategia para abrir 2 nuevas sucursales y aumentar ventas online',
      phases: [
        {
          id: 'phase-1',
          title: 'Investigación de Mercado',
          description: 'Análisis de ubicaciones y competencia',
          status: 'completed',
          estimatedDays: 30,
          tasks: [
            {
              id: 'task-1',
              title: 'Estudio de mercado Las Condes',
              description: 'Análisis demográfico y competencia en la zona',
              status: 'completed',
              priority: 'high',
              estimatedHours: 40,
              dueDate: new Date('2024-02-15'),
              assignee: 'Equipo Marketing'
            }
          ]
        },
        {
          id: 'phase-2',
          title: 'Búsqueda de Locales',
          description: 'Identificación y evaluación de espacios comerciales',
          status: 'in-progress',
          estimatedDays: 45,
          tasks: [
            {
              id: 'task-2',
              title: 'Visitas a locales en Las Condes',
              description: 'Evaluación de 5 locales preseleccionados',
              status: 'in-progress',
              priority: 'high',
              estimatedHours: 20,
              dueDate: new Date('2024-03-01'),
              assignee: 'Gerente General'
            }
          ]
        }
      ],
      createdAt: new Date('2024-01-10'),
      estimatedDuration: '6 meses',
      priority: 'high'
    }
  ],
  'TechStart': [
    {
      id: 'wp-tech-1',
      businessName: 'TechStart',
      title: 'Desarrollo MVP v2.0',
      description: 'Implementación de funcionalidades IA y optimización UX',
      phases: [
        {
          id: 'phase-tech-1',
          title: 'Desarrollo IA Core',
          description: 'Implementación del motor de IA predictiva',
          status: 'in-progress',
          estimatedDays: 60,
          tasks: [
            {
              id: 'task-tech-1',
              title: 'Algoritmo de predicción de retrasos',
              description: 'Desarrollo del modelo ML para predecir retrasos en proyectos',
              status: 'in-progress',
              priority: 'high',
              estimatedHours: 80,
              dueDate: new Date('2024-03-15'),
              assignee: 'Lead Developer'
            }
          ]
        }
      ],
      createdAt: new Date('2024-01-05'),
      estimatedDuration: '4 meses',
      priority: 'high'
    }
  ]
};

const AGENT_RESPONSES = {
  'hack': {
    text: "He identificado una oportunidad de valor específica para tu negocio. Te he preparado un análisis detallado del hack de valor.",
    resultType: 'hack_analysis' as const
  },
  'plan': {
    text: "He creado un plan de trabajo estructurado con fases y tareas específicas para tu negocio.",
    resultType: 'work_plan' as const
  },
  'contenido': {
    text: "He generado guiones completos para reels de Instagram optimizados para tu audiencia.",
    resultType: 'content_reel_script' as const
  },
  'comparativa': {
    text: "He preparado una tabla comparativa que muestra tus ventajas competitivas.",
    resultType: 'table_comparison' as const
  }
};

function BusinessSelector({ 
  currentUser, 
  selectedBusiness, 
  onBusinessChange, 
  onCreateBusiness 
}: {
  currentUser: any;
  selectedBusiness: string | null;
  onBusinessChange: (business: string) => void;
  onCreateBusiness: () => void;
}) {
  const [showDropdown, setShowDropdown] = useState(false);

  if (!currentUser) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 bg-dark-surface/80 backdrop-blur-sm border border-gray-800 rounded-lg px-4 py-2 hover:border-neon-blue transition-colors"
      >
        <Building className="w-4 h-4 text-neon-blue" />
        <span className="text-sm text-white">
          {selectedBusiness || 'Seleccionar Negocio'}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {showDropdown && (
        <div className="absolute top-full right-0 mt-2 w-64 bg-dark-surface border border-gray-800 rounded-lg shadow-xl z-50">
          <div className="p-2">
            {currentUser.businesses.length === 0 ? (
              <div className="text-center py-4">
                <p className="text-gray-400 text-sm mb-3">No tienes negocios creados</p>
                <button
                  onClick={() => {
                    onCreateBusiness();
                    setShowDropdown(false);
                  }}
                  className="text-neon-blue hover:text-white text-sm flex items-center justify-center space-x-1"
                >
                  <Plus className="w-4 h-4" />
                  <span>Crear Negocio</span>
                </button>
              </div>
            ) : (
              <>
                {currentUser.businesses.map((business: string) => (
                  <button
                    key={business}
                    onClick={() => {
                      onBusinessChange(business);
                      setShowDropdown(false);
                    }}
                    className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                      selectedBusiness === business
                        ? 'bg-neon-blue/10 text-neon-blue'
                        : 'text-gray-300 hover:bg-gray-800'
                    }`}
                  >
                    {business}
                  </button>
                ))}
                <div className="border-t border-gray-800 mt-2 pt-2">
                  <button
                    onClick={() => {
                      onCreateBusiness();
                      setShowDropdown(false);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-neon-blue hover:bg-gray-800 transition-colors flex items-center space-x-2"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Crear Nuevo Negocio</span>
                  </button>
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function AIAgentInterface({ 
  currentUser, 
  selectedBusiness, 
  onBusinessChange, 
  onClose 
}: AIAgentInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: currentUser 
        ? `¡Hola ${currentUser.firstName || currentUser.username}! Soy tu agente de IA especializado en emprendimiento. Puedo ayudarte a encontrar fondos, crear tu modelo de negocio o generar contenido para redes sociales. ¿En qué te gustaría que te ayude?`
        : "¡Hola! Soy tu agente de IA especializado en emprendimiento. Puedo ayudarte a encontrar fondos, crear tu modelo de negocio o generar contenido para redes sociales. ¿En qué te gustaría que te ayude?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [showDashboard, setShowDashboard] = useState(false);
  const [showCreateBusiness, setShowCreateBusiness] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [isResultMaximized, setIsResultMaximized] = useState(false);
  const [isDashboardMaximized, setIsDashboardMaximized] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  
  // Filtrar resultados por negocio seleccionado
  const businessResults = selectedBusiness ? (MOCK_STRUCTURED_RESULTS[selectedBusiness] || []) : [];
  const businessWorkPlans = selectedBusiness ? (MOCK_WORK_PLANS[selectedBusiness] || []) : [];
  
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !selectedBusiness) return;

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
      let response = AGENT_RESPONSES['hack']; // default
      let hasResult = false;

      if (userInput.includes('hack') || userInput.includes('valor')) {
        response = AGENT_RESPONSES['hack'];
        hasResult = true;
      } else if (userInput.includes('plan') || userInput.includes('trabajo')) {
        response = AGENT_RESPONSES['plan'];
        hasResult = true;
      } else if (userInput.includes('contenido') || userInput.includes('reel')) {
        response = AGENT_RESPONSES['contenido'];
        hasResult = true;
      } else if (userInput.includes('comparativa') || userInput.includes('competencia')) {
        response = AGENT_RESPONSES['comparativa'];
        hasResult = true;
      }

      const botResponse: Message = {
        id: messages.length + 2,
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        hasResult,
        resultType: hasResult ? response.resultType : undefined
      };

      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id ? botResponse : msg
      ));

      if (hasResult && businessResults.length > 0) {
        // Mostrar el primer resultado disponible del negocio
        const firstResult = businessResults.find(r => r.type === response.resultType);
        if (firstResult) {
          setSelectedResultId(firstResult.id);
          setShowResult(true);
        }
      }
    }, 2000);
  };

  const handleCopyResult = async () => {
    const currentResult = businessResults.find(r => r.id === selectedResultId);
    if (currentResult) {
      await navigator.clipboard.writeText(JSON.stringify(currentResult.content, null, 2));
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const handleSaveToFirestore = () => {
    const currentResult = businessResults.find(r => r.id === selectedResultId);
    if (currentResult && selectedBusiness) {
      // Simular guardado en Firestore
      console.log('Guardando en Firestore:', {
        businessName: selectedBusiness,
        result: currentResult,
        userId: currentUser?.email
      });
      
      // Mostrar confirmación
      alert(`Resultado "${currentResult.title}" guardado en el dashboard de ${selectedBusiness}`);
    }
  };

  const handleCreateBusiness = (businessData: any) => {
    if (onBusinessChange) {
      onBusinessChange(businessData.name);
    }
  };

  const currentResult = businessResults.find(r => r.id === selectedResultId);

  // Calcular el ancho del chat según qué paneles están abiertos
  const getChatWidth = () => {
    const panelsOpen = (showResult ? 1 : 0) + (showDashboard ? 1 : 0);
    if (panelsOpen === 0) return 'w-full';
    if (panelsOpen === 1) {
      if ((showResult && isResultMaximized) || (showDashboard && isDashboardMaximized)) {
        return 'w-0 hidden';
      }
      return 'w-1/2';
    }
    if (panelsOpen === 2) return 'w-1/3';
    return 'w-full';
  };

  const getPanelWidth = () => {
    const panelsOpen = (showResult ? 1 : 0) + (showDashboard ? 1 : 0);
    if (panelsOpen === 1) {
      if ((showResult && isResultMaximized) || (showDashboard && isDashboardMaximized)) {
        return 'w-full';
      }
      return 'w-1/2';
    }
    if (panelsOpen === 2) return 'w-1/3';
    return 'w-1/2';
  };

  return (
    <div className="h-screen bg-deep-dark flex overflow-hidden">
      {/* Notification Center */}
      {showNotifications && (
        <NotificationCenter
          businessName={selectedBusiness}
          workPlans={businessWorkPlans}
          onClose={() => setShowNotifications(false)}
        />
      )}

      {/* Create Business Modal */}
      {showCreateBusiness && (
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
              Plan actual: {currentUser?.plan || 'Gratis'}
            </p>
            <form onSubmit={(e) => {
              e.preventDefault();
              const formData = new FormData(e.target as HTMLFormElement);
              const businessData = {
                name: formData.get('name') as string,
                description: formData.get('description') as string,
                industry: formData.get('industry') as string,
                stage: formData.get('stage') as string,
                targetMarket: formData.get('targetMarket') as string,
                businessModel: formData.get('businessModel') as string
              };
              handleCreateBusiness(businessData);
              setShowCreateBusiness(false);
            }} className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-400 mb-1">
                    Nombre del Negocio *
                  </label>
                  <input
                    name="name"
                    type="text"
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
                    name="industry"
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
                  name="description"
                  className="w-full bg-deep-dark border border-gray-800 rounded-lg px-4 py-2 focus:outline-none focus:border-neon-blue transition-colors"
                  placeholder="Describe tu negocio en pocas palabras..."
                  rows={3}
                  required
                />
              </div>

              <div className="flex space-x-4 pt-4">
                <button type="submit" className="flex-1 neon-button">
                  Crear Negocio
                </button>
                <button
                  type="button"
                  onClick={() => setShowCreateBusiness(false)}
                  className="flex-1 border border-gray-700 hover:border-neon-blue px-4 py-2 rounded-lg transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </form>
          </motion.div>
        </div>
      )}

      {/* Chat Section */}
      <div className={`transition-all duration-500 ease-in-out ${getChatWidth()} flex flex-col h-full`}>
        {/* Chat Header */}
        <div className="bg-dark-surface p-6 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors mr-2"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div className="w-10 h-10 rounded-full bg-gradient-to-r from-neon-blue to-blue-500 flex items-center justify-center">
                <Bot className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold gradient-text">Playground IA</h1>
                <p className="text-sm text-gray-400">Especialista en Emprendimiento</p>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              {/* Notification Bell */}
              {selectedBusiness && (
                <button
                  onClick={() => setShowNotifications(true)}
                  className="relative p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  <div className="absolute -top-1 -right-1 w-3 h-3 bg-red-500 rounded-full"></div>
                </button>
              )}

              {/* Dashboard Button */}
              {selectedBusiness && (
                <button
                  onClick={() => setShowDashboard(!showDashboard)}
                  className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
                >
                  <BarChart3 className="w-4 h-4 text-neon-blue" />
                  <span className="text-sm text-white">Dashboard</span>
                </button>
              )}

              {/* Panel Toggle Button */}
              {businessResults.length > 0 && (
                <button
                  onClick={() => setShowResult(!showResult)}
                  className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 px-3 py-2 rounded-lg transition-colors"
                >
                  <ChevronRight className={`w-4 h-4 text-gray-400 transition-transform ${showResult ? 'rotate-180' : ''}`} />
                  <span className="text-sm text-white">Panel</span>
                </button>
              )}

              {/* Business Selector */}
              {currentUser && (
                <div className="flex items-center space-x-3">
                  <BusinessSelector
                    currentUser={currentUser}
                    selectedBusiness={selectedBusiness || null}
                    onBusinessChange={onBusinessChange || (() => {})}
                    onCreateBusiness={() => setShowCreateBusiness(true)}
                  />
                  {selectedBusiness && (
                    <span className="text-sm text-neon-blue font-medium">
                      {selectedBusiness}
                    </span>
                  )}
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-6 space-y-6">
          <div className="max-w-4xl mx-auto">
            {!selectedBusiness && currentUser && (
              <div className="bg-yellow-500/10 border border-yellow-500/20 rounded-lg p-4 mb-6">
                <p className="text-yellow-500 text-sm">
                  ⚠️ Selecciona un negocio para comenzar a usar el playground
                </p>
              </div>
            )}

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
                        {message.hasResult && businessResults.length > 0 && (
                          <div className="mt-3 pt-3 border-t border-gray-700">
                            <button
                              onClick={() => {
                                const result = businessResults.find(r => r.type === message.resultType);
                                if (result) {
                                  setSelectedResultId(result.id);
                                  setShowResult(true);
                                }
                              }}
                              className="flex items-center space-x-2 text-neon-blue hover:text-white transition-colors text-sm"
                            >
                              <Sparkles className="w-4 h-4" />
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
        <div className="bg-dark-surface p-6 border-t border-gray-800 flex-shrink-0">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center space-x-4">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleSend()}
                  placeholder={selectedBusiness 
                    ? `Pregúntame sobre ${selectedBusiness}...` 
                    : "Selecciona un negocio para comenzar..."
                  }
                  disabled={!selectedBusiness}
                  className="w-full bg-deep-dark border border-gray-800 rounded-xl px-6 py-4 pr-12 focus:outline-none focus:border-neon-blue transition-colors text-white placeholder-gray-400 disabled:opacity-50"
                />
                <button
                  onClick={handleSend}
                  disabled={!inputValue.trim() || !selectedBusiness}
                  className="absolute right-2 top-1/2 -translate-y-1/2 w-8 h-8 rounded-lg bg-neon-blue text-deep-dark flex items-center justify-center hover:bg-neon-blue/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>
            </div>
            
            {/* Quick Actions */}
            {selectedBusiness && (
              <div className="flex flex-wrap gap-2 mt-4">
                <button
                  onClick={() => setInputValue('Identifica un hack de valor para mi negocio')}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                >
                  💡 Hack de Valor
                </button>
                <button
                  onClick={() => setInputValue('Crea un plan de trabajo detallado')}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                >
                  📋 Plan de Trabajo
                </button>
                <button
                  onClick={() => setInputValue('Genera guiones para reels de Instagram')}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                >
                  🎬 Contenido Reels
                </button>
                <button
                  onClick={() => setInputValue('Crea una tabla comparativa con la competencia')}
                  className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                >
                  📊 Tabla Comparativa
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Dashboard Panel */}
      <AnimatePresence>
        {showDashboard && selectedBusiness && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className={`${
              isDashboardMaximized ? 'fixed inset-0 z-50' : getPanelWidth()
            } bg-dark-surface border-l border-gray-800 flex flex-col h-full`}
          >
            {/* Dashboard Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                  <BarChart3 className="w-5 h-5 text-neon-blue" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">Dashboard</h2>
                  <p className="text-sm text-gray-400">{selectedBusiness}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                <button
                  onClick={() => setIsDashboardMaximized(!isDashboardMaximized)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  title={isDashboardMaximized ? "Minimizar" : "Maximizar"}
                >
                  {isDashboardMaximized ? (
                    <Minimize2 className="w-4 h-4 text-gray-400" />
                  ) : (
                    <Maximize2 className="w-4 h-4 text-gray-400" />
                  )}
                </button>
                <button
                  onClick={() => setShowDashboard(false)}
                  className="p-2 hover:bg-gray-800 rounded-lg transition-colors"
                  title="Cerrar"
                >
                  <X className="w-4 h-4 text-gray-400" />
                </button>
              </div>
            </div>

            {/* Dashboard Content */}
            <div className="flex-1 overflow-y-auto">
              <BusinessDashboard 
                businessName={selectedBusiness}
                workPlans={businessWorkPlans}
                currentUser={currentUser}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Result Panel */}
      <AnimatePresence>
        {showResult && businessResults.length > 0 && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className={`${
              isResultMaximized ? 'fixed inset-0 z-50' : getPanelWidth()
            } bg-dark-surface border-l border-gray-800 flex flex-col h-full`}
          >
            {/* Result Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-3">
                <div className="w-8 h-8 rounded-lg bg-neon-blue/10 flex items-center justify-center">
                  <Sparkles className="w-5 h-5 text-neon-blue" />
                </div>
                <div>
                  <h2 className="font-semibold text-white">Resultados</h2>
                  <p className="text-sm text-gray-400">{selectedBusiness}</p>
                </div>
              </div>
              
              <div className="flex items-center space-x-2">
                {/* Result Selector */}
                {businessResults.length > 1 && (
                  <select
                    value={selectedResultId || ''}
                    onChange={(e) => setSelectedResultId(e.target.value)}
                    className="bg-gray-800 border border-gray-700 rounded-lg px-3 py-1 text-sm text-white focus:outline-none focus:border-neon-blue"
                  >
                    {businessResults.map(result => (
                      <option key={result.id} value={result.id}>
                        {result.title}
                      </option>
                    ))}
                  </select>
                )}
                
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
              {currentResult ? (
                <ResultVisualization result={currentResult} />
              ) : (
                <div className="text-center py-12">
                  <Sparkles className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">No hay resultado seleccionado</h3>
                  <p className="text-gray-400">
                    Selecciona un resultado de la lista para visualizarlo
                  </p>
                </div>
              )}
            </div>

            {/* Result Actions */}
            {currentResult && (
              <div className="p-6 border-t border-gray-800 flex-shrink-0">
                <div className="flex space-x-3">
                  <button 
                    onClick={handleSaveToFirestore}
                    className="flex-1 neon-button flex items-center justify-center space-x-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>Guardar en Dashboard</span>
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
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}