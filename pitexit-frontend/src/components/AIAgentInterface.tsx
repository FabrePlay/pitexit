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
  Bell,
  ChevronDown,
  Save,
  Table,
  GitBranch,
  Video,
  Target,
  TrendingUp,
  Calendar,
  Clock
} from 'lucide-react';
import BusinessDashboard from './BusinessDashboard';
import NotificationCenter from './NotificationCenter';

interface Message {
  id: number;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
  loading?: boolean;
  hasResult?: boolean;
  resultId?: string;
}

interface StructuredResult {
  id: string;
  type: 'hack_analysis' | 'work_plan' | 'content_reel_script' | 'table_comparison' | 'flow_diagram_textual';
  title: string;
  content: any; // JSON estructurado
  createdAt: Date;
  businessName?: string;
}

interface AIAgentInterfaceProps {
  currentUser?: any;
  selectedBusiness?: string | null;
  onBusinessChange?: (business: string) => void;
  onClose?: () => void;
}

// Datos simulados de planes de trabajo
const MOCK_WORK_PLANS = {
  'Café Artesanal': [
    {
      id: 'wp-cafe-1',
      businessName: 'Café Artesanal',
      title: 'Plan de Expansión y Crecimiento',
      description: 'Estrategia integral para expandir el negocio a nuevas ubicaciones y mercados',
      createdAt: new Date('2024-01-15'),
      estimatedDuration: '16 semanas',
      priority: 'high' as const,
      phases: [
        {
          id: 'phase-1',
          title: 'Investigación de Mercado',
          description: 'Análisis detallado del mercado objetivo y competencia',
          status: 'completed' as const,
          estimatedDays: 14,
          tasks: [
            {
              id: 'task-1-1',
              title: 'Análisis de competencia directa',
              description: 'Identificar y analizar competidores principales en Santiago',
              status: 'completed' as const,
              priority: 'high' as const,
              estimatedHours: 8,
              dueDate: new Date('2024-01-20')
            },
            {
              id: 'task-1-2',
              title: 'Estudio de mercado objetivo',
              description: 'Definir perfil de cliente ideal y tamaño de mercado',
              status: 'completed' as const,
              priority: 'high' as const,
              estimatedHours: 12,
              dueDate: new Date('2024-01-25')
            }
          ]
        },
        {
          id: 'phase-2',
          title: 'Búsqueda de Financiamiento',
          description: 'Obtener capital necesario para la expansión',
          status: 'in-progress' as const,
          estimatedDays: 21,
          tasks: [
            {
              id: 'task-2-1',
              title: 'Preparar plan de negocios',
              description: 'Documento completo con proyecciones financieras',
              status: 'in-progress' as const,
              priority: 'high' as const,
              estimatedHours: 20,
              dueDate: new Date('2024-12-30')
            },
            {
              id: 'task-2-2',
              title: 'Postular a fondos CORFO',
              description: 'Aplicar a programa Semilla Inicia',
              status: 'pending' as const,
              priority: 'high' as const,
              estimatedHours: 15,
              dueDate: new Date('2025-01-15')
            }
          ]
        },
        {
          id: 'phase-3',
          title: 'Desarrollo de Productos Retail',
          description: 'Crear línea de productos para venta en supermercados',
          status: 'pending' as const,
          estimatedDays: 28,
          tasks: [
            {
              id: 'task-3-1',
              title: 'Diseño de packaging',
              description: 'Crear identidad visual para productos retail',
              status: 'pending' as const,
              priority: 'medium' as const,
              estimatedHours: 16,
              dueDate: new Date('2025-02-15')
            }
          ]
        }
      ]
    },
    {
      id: 'wp-cafe-2',
      businessName: 'Café Artesanal',
      title: 'Estrategia de Marketing Digital',
      description: 'Plan integral para mejorar presencia online y aumentar ventas',
      createdAt: new Date('2024-02-01'),
      estimatedDuration: '8 semanas',
      priority: 'medium' as const,
      phases: [
        {
          id: 'phase-marketing-1',
          title: 'Optimización de Redes Sociales',
          description: 'Mejorar presencia en Instagram y TikTok',
          status: 'in-progress' as const,
          estimatedDays: 14,
          tasks: [
            {
              id: 'task-m-1-1',
              title: 'Crear calendario de contenido',
              description: 'Planificar posts para 3 meses',
              status: 'in-progress' as const,
              priority: 'high' as const,
              estimatedHours: 10,
              dueDate: new Date('2024-12-28')
            }
          ]
        }
      ]
    }
  ],
  'TechStart': [
    {
      id: 'wp-tech-1',
      businessName: 'TechStart',
      title: 'Desarrollo de MVP y Lanzamiento',
      description: 'Plan completo desde desarrollo hasta go-to-market',
      createdAt: new Date('2024-03-01'),
      estimatedDuration: '20 semanas',
      priority: 'high' as const,
      phases: [
        {
          id: 'phase-tech-1',
          title: 'Desarrollo del MVP',
          description: 'Crear versión mínima viable del producto',
          status: 'in-progress' as const,
          estimatedDays: 42,
          tasks: [
            {
              id: 'task-t-1-1',
              title: 'Arquitectura del sistema',
              description: 'Diseñar estructura técnica de la plataforma',
              status: 'completed' as const,
              priority: 'high' as const,
              estimatedHours: 24,
              dueDate: new Date('2024-03-15')
            },
            {
              id: 'task-t-1-2',
              title: 'Desarrollo del backend',
              description: 'Implementar API y base de datos',
              status: 'in-progress' as const,
              priority: 'high' as const,
              estimatedHours: 80,
              dueDate: new Date('2025-01-10')
            }
          ]
        }
      ]
    }
  ]
};

const STRUCTURED_RESULTS: StructuredResult[] = [
  {
    id: 'hack-fiscal-1',
    type: 'hack_analysis',
    title: 'Hack de Valor: Optimización Fiscal',
    createdAt: new Date('2024-12-20'),
    businessName: 'Café Artesanal',
    content: {
      problema: 'Alto costo de impuestos reduce márgenes de ganancia',
      oportunidad: 'Aprovechar beneficios tributarios para PYMES gastronómicas',
      solucion: 'Implementar estrategia de optimización fiscal legal',
      beneficios: [
        'Reducción del 15-25% en carga tributaria',
        'Mayor flujo de caja disponible',
        'Cumplimiento normativo garantizado'
      ],
      implementacion: [
        'Reestructurar gastos operacionales',
        'Aprovechar depreciación acelerada',
        'Optimizar timing de ingresos y gastos'
      ],
      riesgo: 'Bajo - Estrategias completamente legales',
      impacto: 'Alto - Ahorro estimado $3-5M anuales'
    }
  },
  {
    id: 'work-plan-expansion',
    type: 'work_plan',
    title: 'Plan de Implementación Hack Fiscal',
    createdAt: new Date('2024-12-20'),
    businessName: 'Café Artesanal',
    content: {
      objetivos: [
        'Reducir carga tributaria en 20%',
        'Implementar sistema de control fiscal',
        'Capacitar equipo en nuevos procesos'
      ],
      etapas: [
        {
          nombre: 'Etapa 1: Análisis Inicial',
          duracion: '2 semanas',
          tareas: [
            {
              descripcion: 'Auditoría fiscal actual',
              estado: 'Completado',
              responsable: 'Contador',
              fechaLimite: '2024-12-25'
            },
            {
              descripcion: 'Identificar oportunidades específicas',
              estado: 'En progreso',
              responsable: 'Asesor fiscal',
              fechaLimite: '2024-12-30'
            }
          ]
        },
        {
          nombre: 'Etapa 2: Implementación',
          duracion: '4 semanas',
          tareas: [
            {
              descripcion: 'Reestructurar contabilidad',
              estado: 'Pendiente',
              responsable: 'Contador',
              fechaLimite: '2025-01-15'
            },
            {
              descripcion: 'Implementar nuevos procesos',
              estado: 'Pendiente',
              responsable: 'Administrador',
              fechaLimite: '2025-01-30'
            }
          ]
        }
      ]
    }
  },
  {
    id: 'reel-scripts-1',
    type: 'content_reel_script',
    title: 'Guiones para Reels de Café',
    createdAt: new Date('2024-12-19'),
    businessName: 'Café Artesanal',
    content: {
      reels: [
        {
          titulo: 'El Arte del Café Perfecto',
          duracion: '30 segundos',
          hook: '¿Sabías que el 90% de las personas prepara mal su café?',
          desarrollo: [
            'Mostrar granos de café de origen',
            'Proceso de molienda en tiempo real',
            'Técnica de extracción perfecta',
            'Resultado final en taza'
          ],
          cta: 'Ven y aprende con nuestros baristas expertos',
          hashtags: ['#CaféArtesanal', '#BaristaLife', '#CaféPerfecto', '#Santiago']
        },
        {
          titulo: 'De la Semilla a tu Taza',
          duracion: '45 segundos',
          hook: 'Este café viajó 8,000 km para llegar a tu taza',
          desarrollo: [
            'Mostrar origen del café (video de finca)',
            'Proceso de tostado artesanal',
            'Preparación en nuestra cafetería',
            'Cliente disfrutando'
          ],
          cta: 'Descubre el origen de tu café favorito',
          hashtags: ['#OrigenDelCafé', '#Sostenible', '#CaféArtesanal']
        }
      ]
    }
  },
  {
    id: 'comparison-table-1',
    type: 'table_comparison',
    title: 'Comparativa de Asesoría Fiscal',
    createdAt: new Date('2024-12-18'),
    businessName: 'Café Artesanal',
    content: {
      headers: [
        { id: 'criterio', label: 'Criterio' },
        { id: 'competidor_a', label: 'Asesoría Tradicional' },
        { id: 'competidor_b', label: 'Software Fiscal' },
        { id: 'tu_propuesta', label: 'Tu Propuesta', highlight: true }
      ],
      rows: [
        {
          criterio: 'Costo mensual',
          competidor_a: '$150.000',
          competidor_b: '$50.000',
          tu_propuesta: '$80.000'
        },
        {
          criterio: 'Atención personalizada',
          competidor_a: 'Sí',
          competidor_b: 'No',
          tu_propuesta: 'Sí'
        },
        {
          criterio: 'Optimización fiscal',
          competidor_a: 'Básica',
          competidor_b: 'Automática',
          tu_propuesta: 'Avanzada + Personal'
        },
        {
          criterio: 'Soporte 24/7',
          competidor_a: 'No',
          competidor_b: 'Chat bot',
          tu_propuesta: 'Sí'
        },
        {
          criterio: 'Garantía de ahorro',
          competidor_a: 'No',
          competidor_b: 'No',
          tu_propuesta: 'Sí - 15% mínimo'
        }
      ]
    }
  },
  {
    id: 'flow-gtm-1',
    type: 'flow_diagram_textual',
    title: 'Flujo Go-to-Market TechStart',
    createdAt: new Date('2024-12-17'),
    businessName: 'TechStart',
    content: {
      steps: [
        { id: '1', name: 'Definición de ICP', description: 'Identificar cliente ideal' },
        { id: '2', name: 'MVP Testing', description: 'Validar producto con early adopters' },
        { id: '3', name: 'Propuesta de Valor', description: 'Refinar mensaje principal' },
        { id: '4', name: 'Canales de Adquisición', description: 'Definir estrategia de marketing' },
        { id: '5', name: 'Pricing Strategy', description: 'Establecer modelo de precios' },
        { id: '6', name: 'Launch Campaign', description: 'Ejecutar lanzamiento oficial' }
      ],
      connections: [
        { from: '1', to: '2' },
        { from: '2', to: '3' },
        { from: '3', to: '4' },
        { from: '4', to: '5' },
        { from: '5', to: '6' }
      ]
    }
  }
];

const AGENT_RESPONSES = {
  'hack': {
    text: "He identificado un hack de valor específico para tu negocio. Este análisis incluye una oportunidad de optimización fiscal que podría generar ahorros significativos.",
    resultId: 'hack-fiscal-1'
  },
  'plan': {
    text: "He creado un plan de trabajo detallado para implementar la optimización fiscal. Incluye etapas específicas, tareas asignadas y cronograma de ejecución.",
    resultId: 'work-plan-expansion'
  },
  'contenido': {
    text: "He generado guiones específicos para reels de Instagram que destacarán la calidad artesanal de tu café y conectarán emocionalmente con tu audiencia.",
    resultId: 'reel-scripts-1'
  },
  'comparacion': {
    text: "He preparado una tabla comparativa que muestra cómo tu propuesta de asesoría fiscal se posiciona frente a la competencia, destacando tus ventajas únicas.",
    resultId: 'comparison-table-1'
  },
  'flujo': {
    text: "He diseñado el flujo completo de go-to-market para TechStart, desde la definición del cliente ideal hasta el lanzamiento oficial del producto.",
    resultId: 'flow-gtm-1'
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

function ResultSelector({ 
  results, 
  selectedResultId, 
  onResultChange 
}: {
  results: StructuredResult[];
  selectedResultId: string | null;
  onResultChange: (resultId: string) => void;
}) {
  const [showDropdown, setShowDropdown] = useState(false);
  
  const selectedResult = results.find(r => r.id === selectedResultId);

  if (results.length === 0) return null;

  return (
    <div className="relative">
      <button
        onClick={() => setShowDropdown(!showDropdown)}
        className="flex items-center space-x-2 bg-gray-800 hover:bg-gray-700 rounded-lg px-3 py-2 transition-colors"
      >
        <span className="text-sm text-white">
          {selectedResult?.title || 'Seleccionar resultado'}
        </span>
        <ChevronDown className="w-4 h-4 text-gray-400" />
      </button>

      {showDropdown && (
        <div className="absolute top-full left-0 mt-2 w-80 bg-dark-surface border border-gray-800 rounded-lg shadow-xl z-50">
          <div className="p-2 max-h-64 overflow-y-auto">
            {results.map(result => (
              <button
                key={result.id}
                onClick={() => {
                  onResultChange(result.id);
                  setShowDropdown(false);
                }}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedResultId === result.id
                    ? 'bg-neon-blue/10 text-neon-blue'
                    : 'text-gray-300 hover:bg-gray-800'
                }`}
              >
                <div className="font-medium">{result.title}</div>
                <div className="text-xs text-gray-400 mt-1">
                  {result.createdAt.toLocaleDateString()} • {result.type.replace('_', ' ')}
                </div>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ResultRenderer({ result }: { result: StructuredResult }) {
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'hack_analysis': return <Sparkles className="w-5 h-5 text-purple-500" />;
      case 'work_plan': return <Target className="w-5 h-5 text-blue-500" />;
      case 'content_reel_script': return <Video className="w-5 h-5 text-pink-500" />;
      case 'table_comparison': return <Table className="w-5 h-5 text-green-500" />;
      case 'flow_diagram_textual': return <GitBranch className="w-5 h-5 text-orange-500" />;
      default: return <FileText className="w-5 h-5 text-gray-400" />;
    }
  };

  const renderContent = () => {
    switch (result.type) {
      case 'hack_analysis':
        return (
          <div className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Problema Identificado</h3>
                  <p className="text-gray-300">{result.content.problema}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Oportunidad</h3>
                  <p className="text-gray-300">{result.content.oportunidad}</p>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Solución Propuesta</h3>
                  <p className="text-gray-300">{result.content.solucion}</p>
                </div>
              </div>
              <div className="space-y-4">
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Beneficios Esperados</h3>
                  <ul className="space-y-2">
                    {result.content.beneficios.map((beneficio: string, index: number) => (
                      <li key={index} className="flex items-center text-gray-300">
                        <Check className="w-4 h-4 text-green-500 mr-2" />
                        {beneficio}
                      </li>
                    ))}
                  </ul>
                </div>
                <div>
                  <h3 className="text-lg font-semibold text-white mb-2">Pasos de Implementación</h3>
                  <ol className="space-y-2">
                    {result.content.implementacion.map((paso: string, index: number) => (
                      <li key={index} className="flex items-start text-gray-300">
                        <span className="w-6 h-6 rounded-full bg-neon-blue/10 text-neon-blue text-sm flex items-center justify-center mr-2 mt-0.5">
                          {index + 1}
                        </span>
                        {paso}
                      </li>
                    ))}
                  </ol>
                </div>
              </div>
            </div>
            <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-800">
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Nivel de Riesgo</h3>
                <p className="text-green-400">{result.content.riesgo}</p>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white mb-2">Impacto Esperado</h3>
                <p className="text-neon-blue font-semibold">{result.content.impacto}</p>
              </div>
            </div>
          </div>
        );

      case 'work_plan':
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Objetivos del Plan</h3>
              <ul className="space-y-2">
                {result.content.objetivos.map((objetivo: string, index: number) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <Target className="w-4 h-4 text-neon-blue mr-2" />
                    {objetivo}
                  </li>
                ))}
              </ul>
            </div>
            
            <div>
              <h3 className="text-lg font-semibold text-white mb-4">Etapas de Ejecución</h3>
              <div className="space-y-4">
                {result.content.etapas.map((etapa: any, etapaIndex: number) => (
                  <div key={etapaIndex} className="border border-gray-800 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-white">{etapa.nombre}</h4>
                      <span className="text-sm text-gray-400">{etapa.duracion}</span>
                    </div>
                    <div className="space-y-2">
                      {etapa.tareas.map((tarea: any, tareaIndex: number) => (
                        <div key={tareaIndex} className="flex items-center justify-between p-3 bg-gray-800/30 rounded-lg">
                          <div className="flex items-center space-x-3">
                            <div className={`w-4 h-4 rounded-full ${
                              tarea.estado === 'Completado' ? 'bg-green-500' :
                              tarea.estado === 'En progreso' ? 'bg-yellow-500' : 'bg-gray-600'
                            }`} />
                            <div>
                              <p className="text-white font-medium">{tarea.descripcion}</p>
                              <div className="flex items-center space-x-4 text-xs text-gray-400">
                                <span>👤 {tarea.responsable}</span>
                                <span>📅 {tarea.fechaLimite}</span>
                              </div>
                            </div>
                          </div>
                          <span className={`px-2 py-1 rounded text-xs ${
                            tarea.estado === 'Completado' ? 'bg-green-500/10 text-green-500' :
                            tarea.estado === 'En progreso' ? 'bg-yellow-500/10 text-yellow-500' :
                            'bg-gray-500/10 text-gray-400'
                          }`}>
                            {tarea.estado}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        );

      case 'content_reel_script':
        return (
          <div className="space-y-6">
            {result.content.reels.map((reel: any, index: number) => (
              <div key={index} className="border border-gray-800 rounded-lg p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-semibold text-white">{reel.titulo}</h3>
                  <span className="text-sm text-gray-400">{reel.duracion}</span>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-neon-blue mb-2">🎣 Hook (Gancho)</h4>
                    <p className="text-gray-300 italic">"{reel.hook}"</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-neon-blue mb-2">🎬 Desarrollo</h4>
                    <ol className="space-y-2">
                      {reel.desarrollo.map((paso: string, pasoIndex: number) => (
                        <li key={pasoIndex} className="flex items-start text-gray-300">
                          <span className="w-6 h-6 rounded-full bg-pink-500/10 text-pink-500 text-sm flex items-center justify-center mr-2 mt-0.5">
                            {pasoIndex + 1}
                          </span>
                          {paso}
                        </li>
                      ))}
                    </ol>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-neon-blue mb-2">📢 Call to Action</h4>
                    <p className="text-gray-300">"{reel.cta}"</p>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-neon-blue mb-2"># Hashtags</h4>
                    <div className="flex flex-wrap gap-2">
                      {reel.hashtags.map((hashtag: string, hashIndex: number) => (
                        <span key={hashIndex} className="px-2 py-1 bg-pink-500/10 text-pink-500 rounded text-sm">
                          {hashtag}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        );

      case 'table_comparison':
        return (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse border border-gray-800 rounded-lg">
              <thead>
                <tr className="bg-gray-800/50">
                  {result.content.headers.map((header: any) => (
                    <th key={header.id} className={`border border-gray-700 p-3 text-left font-medium ${
                      header.highlight ? 'bg-neon-blue/10 text-neon-blue' : 'text-white'
                    }`}>
                      {header.label}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {result.content.rows.map((row: any, index: number) => (
                  <tr key={index} className="hover:bg-gray-800/30">
                    <td className="border border-gray-700 p-3 font-medium text-white">{row.criterio}</td>
                    <td className="border border-gray-700 p-3 text-gray-300">{row.competidor_a}</td>
                    <td className="border border-gray-700 p-3 text-gray-300">{row.competidor_b}</td>
                    <td className="border border-gray-700 p-3 bg-neon-blue/5 text-neon-blue font-medium">
                      {row.tu_propuesta}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        );

      case 'flow_diagram_textual':
        return (
          <div className="space-y-6">
            <div className="grid gap-4">
              {result.content.steps.map((step: any, index: number) => {
                const nextStep = result.content.connections.find((conn: any) => conn.from === step.id);
                return (
                  <div key={step.id} className="flex items-center">
                    <div className="flex-1">
                      <div className="flex items-center p-4 bg-gray-800/30 rounded-lg border border-gray-700">
                        <div className="w-8 h-8 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mr-4 font-bold">
                          {step.id}
                        </div>
                        <div>
                          <h4 className="font-medium text-white">{step.name}</h4>
                          <p className="text-gray-400 text-sm">{step.description}</p>
                        </div>
                      </div>
                    </div>
                    {nextStep && (
                      <div className="flex items-center justify-center w-12">
                        <div className="w-6 h-0.5 bg-gray-600"></div>
                        <div className="w-0 h-0 border-l-4 border-l-gray-600 border-t-2 border-t-transparent border-b-2 border-b-transparent ml-1"></div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        );

      default:
        return <div className="text-gray-400">Tipo de resultado no soportado</div>;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-3 pb-4 border-b border-gray-800">
        {getResultIcon(result.type)}
        <div>
          <h2 className="font-semibold text-white">{result.title}</h2>
          <p className="text-sm text-gray-400">
            {result.createdAt.toLocaleDateString()} • {result.businessName}
          </p>
        </div>
      </div>
      {renderContent()}
    </div>
  );
}

export default function AIAgentInterface({ 
  currentUser, 
  selectedBusiness, 
  onBusinessChange, 
  onClose 
}: AIAgentInterfaceProps) {
  const [activeTab, setActiveTab] = useState<'chat' | 'dashboard'>('chat');
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: currentUser 
        ? `¡Hola ${currentUser.firstName || currentUser.username}! Soy tu agente de IA especializado en emprendimiento. Puedo ayudarte a encontrar hacks de valor, crear planes de trabajo o generar contenido específico. ¿En qué te gustaría que te ayude?`
        : "¡Hola! Soy tu agente de IA especializado en emprendimiento. Puedo ayudarte a encontrar hacks de valor, crear planes de trabajo o generar contenido específico. ¿En qué te gustaría que te ayude?",
      sender: 'bot',
      timestamp: new Date()
    }
  ]);
  
  const [inputValue, setInputValue] = useState('');
  const [showResult, setShowResult] = useState(false);
  const [sessionResults, setSessionResults] = useState<StructuredResult[]>([]);
  const [selectedResultId, setSelectedResultId] = useState<string | null>(null);
  const [isResultMaximized, setIsResultMaximized] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [showCreateBusiness, setShowCreateBusiness] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Filtrar resultados por negocio seleccionado
  const businessResults = selectedBusiness 
    ? STRUCTURED_RESULTS.filter(r => r.businessName === selectedBusiness)
    : [];

  // Combinar resultados de la sesión con resultados del negocio
  const allResults = [...sessionResults, ...businessResults];

  // Obtener planes de trabajo para el negocio seleccionado
  const workPlans = selectedBusiness ? (MOCK_WORK_PLANS[selectedBusiness as keyof typeof MOCK_WORK_PLANS] || []) : [];

  // Contar notificaciones urgentes
  const getUrgentNotificationsCount = () => {
    if (!selectedBusiness || !workPlans.length) return 0;
    
    let count = 0;
    const now = new Date();
    
    workPlans.forEach(workPlan => {
      workPlan.phases.forEach(phase => {
        phase.tasks.forEach(task => {
          if (task.dueDate && task.status !== 'completed') {
            const daysUntilDue = Math.ceil((task.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            if (daysUntilDue <= 3) count++;
          }
        });
      });
    });
    
    return count;
  };

  const urgentNotifications = getUrgentNotificationsCount();

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
      let response = AGENT_RESPONSES['hack']; // default
      let hasResult = false;
      let resultId = null;

      if (userInput.includes('hack') || userInput.includes('optimiz') || userInput.includes('fiscal')) {
        response = AGENT_RESPONSES['hack'];
        hasResult = true;
        resultId = response.resultId;
      } else if (userInput.includes('plan') || userInput.includes('trabajo') || userInput.includes('implementa')) {
        response = AGENT_RESPONSES['plan'];
        hasResult = true;
        resultId = response.resultId;
      } else if (userInput.includes('contenido') || userInput.includes('reel') || userInput.includes('social')) {
        response = AGENT_RESPONSES['contenido'];
        hasResult = true;
        resultId = response.resultId;
      } else if (userInput.includes('comparacion') || userInput.includes('tabla') || userInput.includes('competencia')) {
        response = AGENT_RESPONSES['comparacion'];
        hasResult = true;
        resultId = response.resultId;
      } else if (userInput.includes('flujo') || userInput.includes('proceso') || userInput.includes('market')) {
        response = AGENT_RESPONSES['flujo'];
        hasResult = true;
        resultId = response.resultId;
      }

      const botResponse: Message = {
        id: messages.length + 2,
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        hasResult,
        resultId: resultId || undefined
      };

      setMessages(prev => prev.map(msg => 
        msg.id === loadingMessage.id ? botResponse : msg
      ));

      if (hasResult && resultId) {
        // Buscar el resultado en STRUCTURED_RESULTS
        const result = STRUCTURED_RESULTS.find(r => r.id === resultId);
        if (result) {
          // Crear una copia para la sesión actual
          const sessionResult = {
            ...result,
            id: `session-${Date.now()}`,
            createdAt: new Date(),
            businessName: selectedBusiness || result.businessName
          };
          
          setSessionResults(prev => [sessionResult, ...prev]);
          setSelectedResultId(sessionResult.id);
          setShowResult(true);
        }
      }
    }, 2000);
  };

  const handleCopyResult = async () => {
    const currentResult = allResults.find(r => r.id === selectedResultId);
    if (currentResult) {
      await navigator.clipboard.writeText(JSON.stringify(currentResult.content, null, 2));
      setCopiedText(true);
      setTimeout(() => setCopiedText(false), 2000);
    }
  };

  const handleSaveToFirestore = async () => {
    const currentResult = allResults.find(r => r.id === selectedResultId);
    if (currentResult && selectedBusiness) {
      // Simular guardado en Firestore
      console.log('Saving to Firestore:', {
        businessName: selectedBusiness,
        result: currentResult,
        userId: currentUser?.id
      });
      
      // Mostrar confirmación
      alert(`Resultado "${currentResult.title}" guardado en el dashboard de ${selectedBusiness}`);
    }
  };

  const handleCreateBusiness = (businessData: any) => {
    if (currentUser && onBusinessChange) {
      currentUser.businesses.push(businessData.name);
      onBusinessChange(businessData.name);
    }
  };

  const currentResult = allResults.find(r => r.id === selectedResultId);

  if (activeTab === 'dashboard' && selectedBusiness) {
    return (
      <div className="h-screen bg-deep-dark flex flex-col">
        {/* Header */}
        <div className="bg-dark-surface p-6 border-b border-gray-800 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              {onClose && (
                <button
                  onClick={onClose}
                  className="text-gray-400 hover:text-white transition-colors"
                >
                  <ArrowLeft className="w-5 h-5" />
                </button>
              )}
              <div>
                <h1 className="text-xl font-bold gradient-text">Playground - {selectedBusiness}</h1>
                <div className="flex items-center space-x-4 mt-1">
                  <button
                    onClick={() => setActiveTab('chat')}
                    className="text-sm text-gray-400 hover:text-neon-blue transition-colors"
                  >
                    Chat IA
                  </button>
                  <span className="text-gray-600">•</span>
                  <span className="text-sm text-neon-blue">Dashboard</span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              <button
                onClick={() => setShowNotifications(true)}
                className="relative p-2 text-gray-400 hover:text-white transition-colors"
              >
                <Bell className="w-5 h-5" />
                {urgentNotifications > 0 && (
                  <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                    {urgentNotifications}
                  </span>
                )}
              </button>

              {/* Business Selector */}
              {currentUser && (
                <BusinessSelector
                  currentUser={currentUser}
                  selectedBusiness={selectedBusiness}
                  onBusinessChange={onBusinessChange || (() => {})}
                  onCreateBusiness={() => setShowCreateBusiness(true)}
                />
              )}
            </div>
          </div>
        </div>

        {/* Dashboard Content */}
        <div className="flex-1 overflow-y-auto">
          <BusinessDashboard
            businessName={selectedBusiness}
            workPlans={workPlans}
            currentUser={currentUser}
          />
        </div>

        {/* Notifications Modal */}
        {showNotifications && (
          <NotificationCenter
            businessName={selectedBusiness}
            workPlans={workPlans}
            onClose={() => setShowNotifications(false)}
          />
        )}
      </div>
    );
  }

  return (
    <div className="h-screen bg-deep-dark flex overflow-hidden">
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
      <div className={`transition-all duration-500 ease-in-out ${
        showResult && !isResultMaximized ? 'w-1/2' : 'w-full'
      } flex flex-col h-full`}>
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
                <h1 className="text-xl font-bold gradient-text">
                  Playground {selectedBusiness && `- ${selectedBusiness}`}
                </h1>
                <div className="flex items-center space-x-4 mt-1">
                  <span className="text-sm text-neon-blue">Chat IA</span>
                  {selectedBusiness && (
                    <>
                      <span className="text-gray-600">•</span>
                      <button
                        onClick={() => setActiveTab('dashboard')}
                        className="text-sm text-gray-400 hover:text-neon-blue transition-colors"
                      >
                        Dashboard
                      </button>
                    </>
                  )}
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              {/* Notifications */}
              {selectedBusiness && (
                <button
                  onClick={() => setShowNotifications(true)}
                  className="relative p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {urgentNotifications > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {urgentNotifications}
                    </span>
                  )}
                </button>
              )}

              {/* Business Selector */}
              {currentUser && (
                <BusinessSelector
                  currentUser={currentUser}
                  selectedBusiness={selectedBusiness || null}
                  onBusinessChange={onBusinessChange || (() => {})}
                  onCreateBusiness={() => setShowCreateBusiness(true)}
                />
              )}
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
                        {message.hasResult && message.resultId && (
                          <div className="mt-3 pt-3 border-t border-gray-700">
                            <button
                              onClick={() => {
                                const result = allResults.find(r => r.id === message.resultId);
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
                    : "Pregúntame sobre hacks de valor, planes de trabajo o contenido..."
                  }
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
                onClick={() => setInputValue('Identifica un hack de valor para optimizar mi negocio')}
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
          </div>
        </div>
      </div>

      {/* Dynamic Results Panel */}
      <AnimatePresence>
        {showResult && allResults.length > 0 && (
          <motion.div
            initial={{ x: '100%', opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: '100%', opacity: 0 }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className={`${
              isResultMaximized ? 'fixed inset-0 z-50' : 'w-1/2'
            } bg-dark-surface border-l border-gray-800 flex flex-col h-full`}
          >
            {/* Result Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
              <div className="flex items-center space-x-3">
                <ResultSelector
                  results={allResults}
                  selectedResultId={selectedResultId}
                  onResultChange={setSelectedResultId}
                />
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
              {currentResult ? (
                <ResultRenderer result={currentResult} />
              ) : (
                <div className="flex items-center justify-center h-full text-center">
                  <div>
                    <FileText className="w-12 h-12 text-gray-600 mx-auto mb-3" />
                    <p className="text-gray-400">Selecciona un resultado para visualizar</p>
                  </div>
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
                    <Save className="w-4 h-4" />
                    <span>Guardar en Dashboard</span>
                  </button>
                  <button className="px-4 py-2 border border-gray-700 hover:border-neon-blue rounded-lg transition-colors flex items-center space-x-2">
                    <Download className="w-4 h-4" />
                    <span>PDF</span>
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

      {/* Notifications Modal */}
      {showNotifications && (
        <NotificationCenter
          businessName={selectedBusiness}
          workPlans={workPlans}
          onClose={() => setShowNotifications(false)}
        />
      )}
    </div>
  );
}