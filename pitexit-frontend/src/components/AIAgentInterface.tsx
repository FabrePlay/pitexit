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
  BarChart3,
  Target,
  CheckCircle,
  Clock,
  AlertCircle,
  TrendingUp,
  Calendar,
  Users,
  DollarSign,
  Bell
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
  resultType?: 'document' | 'analysis' | 'strategy' | 'content' | 'workplan';
  businessContext?: string;
}

interface AgentResult {
  type: 'document' | 'analysis' | 'strategy' | 'content' | 'workplan';
  title: string;
  content: string;
  metadata?: {
    wordCount?: number;
    readingTime?: string;
    tags?: string[];
  };
  workPlan?: WorkPlan;
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

// Simulación de conversaciones por negocio
const BUSINESS_CONVERSATIONS: { [key: string]: Message[] } = {};

// Simulación de planes de trabajo por negocio con datos de prueba
const BUSINESS_WORKPLANS: { [key: string]: WorkPlan[] } = {
  // Planes para Café Artesanal
  'basic@example.com-Café Artesanal': [
    {
      id: 'wp-cafe-001',
      businessName: 'Café Artesanal',
      title: 'Plan de Expansión y Crecimiento',
      description: 'Estrategia integral para expandir el negocio a 3 sucursales y lanzar productos retail',
      estimatedDuration: '16 semanas',
      priority: 'high',
      createdAt: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000), // Hace 7 días
      phases: [
        {
          id: 'phase-cafe-1',
          title: 'Investigación y Validación de Mercado',
          description: 'Análisis profundo del mercado y validación de nuevas ubicaciones',
          status: 'completed',
          estimatedDays: 21,
          tasks: [
            {
              id: 'task-cafe-1-1',
              title: 'Estudio de mercado para nuevas ubicaciones',
              description: 'Analizar zonas potenciales para las nuevas sucursales',
              status: 'completed',
              priority: 'high',
              estimatedHours: 24,
              dueDate: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000)
            },
            {
              id: 'task-cafe-1-2',
              title: 'Análisis de competencia local',
              description: 'Evaluar competidores en las zonas seleccionadas',
              status: 'completed',
              priority: 'medium',
              estimatedHours: 16,
              dueDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000)
            },
            {
              id: 'task-cafe-1-3',
              title: 'Encuestas a clientes potenciales',
              description: 'Realizar encuestas para validar demanda en nuevas ubicaciones',
              status: 'completed',
              priority: 'high',
              estimatedHours: 20,
              dueDate: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
            }
          ]
        },
        {
          id: 'phase-cafe-2',
          title: 'Búsqueda de Financiamiento',
          description: 'Obtener capital necesario para la expansión',
          status: 'in-progress',
          estimatedDays: 28,
          tasks: [
            {
              id: 'task-cafe-2-1',
              title: 'Preparar plan de negocios detallado',
              description: 'Crear plan de negocios completo para presentar a inversionistas',
              status: 'completed',
              priority: 'high',
              estimatedHours: 32,
              dueDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000)
            },
            {
              id: 'task-cafe-2-2',
              title: 'Postular a fondo CORFO',
              description: 'Completar postulación a fondo CORFO para emprendimiento',
              status: 'in-progress',
              priority: 'high',
              estimatedHours: 16,
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            },
            {
              id: 'task-cafe-2-3',
              title: 'Contactar inversionistas ángeles',
              description: 'Presentar proyecto a red de inversionistas ángeles',
              status: 'pending',
              priority: 'medium',
              estimatedHours: 20,
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
            }
          ]
        },
        {
          id: 'phase-cafe-3',
          title: 'Desarrollo de Productos Retail',
          description: 'Crear línea de productos para venta en retail',
          status: 'pending',
          estimatedDays: 35,
          tasks: [
            {
              id: 'task-cafe-3-1',
              title: 'Diseño de packaging',
              description: 'Crear diseño atractivo para productos retail',
              status: 'pending',
              priority: 'medium',
              estimatedHours: 24,
              dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
            },
            {
              id: 'task-cafe-3-2',
              title: 'Certificaciones de calidad',
              description: 'Obtener certificaciones necesarias para retail',
              status: 'pending',
              priority: 'high',
              estimatedHours: 40,
              dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
            },
            {
              id: 'task-cafe-3-3',
              title: 'Negociación con retailers',
              description: 'Establecer acuerdos con cadenas de retail',
              status: 'pending',
              priority: 'high',
              estimatedHours: 28,
              dueDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000)
            }
          ]
        },
        {
          id: 'phase-cafe-4',
          title: 'Apertura de Nuevas Sucursales',
          description: 'Implementación y apertura de las nuevas ubicaciones',
          status: 'pending',
          estimatedDays: 42,
          tasks: [
            {
              id: 'task-cafe-4-1',
              title: 'Adecuación de locales',
              description: 'Remodelación y equipamiento de nuevos locales',
              status: 'pending',
              priority: 'high',
              estimatedHours: 80,
              dueDate: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000)
            },
            {
              id: 'task-cafe-4-2',
              title: 'Contratación y capacitación de personal',
              description: 'Reclutar y entrenar personal para nuevas sucursales',
              status: 'pending',
              priority: 'high',
              estimatedHours: 60,
              dueDate: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000)
            },
            {
              id: 'task-cafe-4-3',
              title: 'Campaña de lanzamiento',
              description: 'Ejecutar campaña de marketing para apertura',
              status: 'pending',
              priority: 'medium',
              estimatedHours: 32,
              dueDate: new Date(Date.now() + 84 * 24 * 60 * 60 * 1000)
            }
          ]
        }
      ]
    },
    {
      id: 'wp-cafe-002',
      businessName: 'Café Artesanal',
      title: 'Estrategia de Marketing Digital',
      description: 'Plan integral para fortalecer presencia digital y aumentar ventas online',
      estimatedDuration: '8 semanas',
      priority: 'medium',
      createdAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000), // Hace 3 días
      phases: [
        {
          id: 'phase-cafe-marketing-1',
          title: 'Optimización de Redes Sociales',
          description: 'Mejorar presencia en Instagram, Facebook y TikTok',
          status: 'in-progress',
          estimatedDays: 14,
          tasks: [
            {
              id: 'task-cafe-m-1-1',
              title: 'Audit de redes sociales actuales',
              description: 'Evaluar performance actual en todas las plataformas',
              status: 'completed',
              priority: 'high',
              estimatedHours: 8,
              dueDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000)
            },
            {
              id: 'task-cafe-m-1-2',
              title: 'Crear calendario de contenido',
              description: 'Planificar contenido para 3 meses',
              status: 'in-progress',
              priority: 'high',
              estimatedHours: 16,
              dueDate: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000)
            },
            {
              id: 'task-cafe-m-1-3',
              title: 'Implementar estrategia de hashtags',
              description: 'Optimizar uso de hashtags para mayor alcance',
              status: 'pending',
              priority: 'medium',
              estimatedHours: 6,
              dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
            }
          ]
        },
        {
          id: 'phase-cafe-marketing-2',
          title: 'E-commerce y Ventas Online',
          description: 'Desarrollar canal de ventas online',
          status: 'pending',
          estimatedDays: 21,
          tasks: [
            {
              id: 'task-cafe-m-2-1',
              title: 'Configurar tienda online',
              description: 'Implementar sistema de e-commerce',
              status: 'pending',
              priority: 'high',
              estimatedHours: 32,
              dueDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000)
            },
            {
              id: 'task-cafe-m-2-2',
              title: 'Integrar sistema de pagos',
              description: 'Configurar pasarelas de pago seguras',
              status: 'pending',
              priority: 'high',
              estimatedHours: 16,
              dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
            }
          ]
        }
      ]
    }
  ],
  // Planes para TechStart
  'pro@example.com-TechStart': [
    {
      id: 'wp-tech-001',
      businessName: 'TechStart',
      title: 'Desarrollo de MVP y Lanzamiento',
      description: 'Plan completo para desarrollar MVP, conseguir primeros usuarios y ronda de inversión',
      estimatedDuration: '20 semanas',
      priority: 'high',
      createdAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000), // Hace 5 días
      phases: [
        {
          id: 'phase-tech-1',
          title: 'Desarrollo del MVP',
          description: 'Crear versión mínima viable de la plataforma',
          status: 'in-progress',
          estimatedDays: 42,
          tasks: [
            {
              id: 'task-tech-1-1',
              title: 'Arquitectura del sistema',
              description: 'Diseñar arquitectura técnica de la plataforma',
              status: 'completed',
              priority: 'high',
              estimatedHours: 40,
              dueDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000)
            },
            {
              id: 'task-tech-1-2',
              title: 'Desarrollo del backend',
              description: 'Implementar API y lógica de negocio',
              status: 'in-progress',
              priority: 'high',
              estimatedHours: 120,
              dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
            },
            {
              id: 'task-tech-1-3',
              title: 'Desarrollo del frontend',
              description: 'Crear interfaz de usuario intuitiva',
              status: 'in-progress',
              priority: 'high',
              estimatedHours: 100,
              dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000)
            },
            {
              id: 'task-tech-1-4',
              title: 'Integración de IA',
              description: 'Implementar algoritmos de IA para predicciones',
              status: 'pending',
              priority: 'high',
              estimatedHours: 80,
              dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
            }
          ]
        },
        {
          id: 'phase-tech-2',
          title: 'Testing y Validación',
          description: 'Pruebas exhaustivas y validación con usuarios beta',
          status: 'pending',
          estimatedDays: 21,
          tasks: [
            {
              id: 'task-tech-2-1',
              title: 'Testing automatizado',
              description: 'Implementar suite de tests automatizados',
              status: 'pending',
              priority: 'high',
              estimatedHours: 32,
              dueDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000)
            },
            {
              id: 'task-tech-2-2',
              title: 'Programa beta',
              description: 'Reclutar y gestionar usuarios beta',
              status: 'pending',
              priority: 'medium',
              estimatedHours: 24,
              dueDate: new Date(Date.now() + 49 * 24 * 60 * 60 * 1000)
            },
            {
              id: 'task-tech-2-3',
              title: 'Optimización basada en feedback',
              description: 'Mejorar producto según feedback de usuarios beta',
              status: 'pending',
              priority: 'high',
              estimatedHours: 40,
              dueDate: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000)
            }
          ]
        },
        {
          id: 'phase-tech-3',
          title: 'Estrategia de Go-to-Market',
          description: 'Preparar lanzamiento y estrategia de adquisición',
          status: 'pending',
          estimatedDays: 28,
          tasks: [
            {
              id: 'task-tech-3-1',
              title: 'Estrategia de pricing',
              description: 'Definir modelo de precios y planes',
              status: 'pending',
              priority: 'high',
              estimatedHours: 16,
              dueDate: new Date(Date.now() + 63 * 24 * 60 * 60 * 1000)
            },
            {
              id: 'task-tech-3-2',
              title: 'Campaña de lanzamiento',
              description: 'Ejecutar campaña de marketing para lanzamiento',
              status: 'pending',
              priority: 'high',
              estimatedHours: 32,
              dueDate: new Date(Date.now() + 77 * 24 * 60 * 60 * 1000)
            },
            {
              id: 'task-tech-3-3',
              title: 'Partnerships estratégicos',
              description: 'Establecer alianzas con empresas complementarias',
              status: 'pending',
              priority: 'medium',
              estimatedHours: 24,
              dueDate: new Date(Date.now() + 84 * 24 * 60 * 60 * 1000)
            }
          ]
        },
        {
          id: 'phase-tech-4',
          title: 'Ronda de Inversión Serie A',
          description: 'Preparar y ejecutar ronda de inversión',
          status: 'pending',
          estimatedDays: 35,
          tasks: [
            {
              id: 'task-tech-4-1',
              title: 'Preparar pitch deck',
              description: 'Crear presentación profesional para inversionistas',
              status: 'pending',
              priority: 'high',
              estimatedHours: 24,
              dueDate: new Date(Date.now() + 91 * 24 * 60 * 60 * 1000)
            },
            {
              id: 'task-tech-4-2',
              title: 'Due diligence preparation',
              description: 'Preparar documentación para due diligence',
              status: 'pending',
              priority: 'high',
              estimatedHours: 32,
              dueDate: new Date(Date.now() + 105 * 24 * 60 * 60 * 1000)
            },
            {
              id: 'task-tech-4-3',
              title: 'Roadshow con inversionistas',
              description: 'Presentar a fondos de inversión y VCs',
              status: 'pending',
              priority: 'high',
              estimatedHours: 40,
              dueDate: new Date(Date.now() + 126 * 24 * 60 * 60 * 1000)
            }
          ]
        }
      ]
    }
  ]
};

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
      title: 'Business Model Canvas',
      content: `# Business Model Canvas

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
      content: `# Estrategia de Contenido

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
  },
  'plan': {
    text: "He creado un plan de trabajo completo para tu negocio. Este plan incluye todas las fases necesarias para alcanzar tus objetivos.",
    result: {
      type: 'workplan' as const,
      title: 'Plan de Trabajo Estratégico',
      content: `# Plan de Trabajo Estratégico

## 📋 Resumen Ejecutivo
Este plan de trabajo está diseñado para llevar tu negocio al siguiente nivel a través de una estrategia estructurada y medible.

## 🎯 Objetivos Principales
1. Obtener financiamiento inicial
2. Validar el modelo de negocio
3. Desarrollar estrategia de marketing
4. Establecer operaciones escalables

## ⏱️ Duración Estimada: 12 semanas

## 📊 Fases del Proyecto
### Fase 1: Preparación y Validación (3 semanas)
### Fase 2: Búsqueda de Financiamiento (4 semanas)  
### Fase 3: Desarrollo de Marketing (3 semanas)
### Fase 4: Implementación y Lanzamiento (2 semanas)

## 🚀 Próximos Pasos
1. Revisar y aprobar el plan
2. Asignar responsables a cada tarea
3. Establecer fechas de seguimiento
4. Comenzar con la Fase 1`,
      metadata: {
        wordCount: 150,
        readingTime: '2 min',
        tags: ['Plan de Trabajo', 'Estrategia', 'Gestión de Proyectos']
      },
      workPlan: {
        id: 'wp-001',
        businessName: '',
        title: 'Plan de Trabajo Estratégico',
        description: 'Plan completo para el desarrollo y crecimiento del negocio',
        estimatedDuration: '12 semanas',
        priority: 'high',
        createdAt: new Date(),
        phases: [
          {
            id: 'phase-1',
            title: 'Preparación y Validación',
            description: 'Validar el modelo de negocio y preparar documentación',
            status: 'pending',
            estimatedDays: 21,
            tasks: [
              {
                id: 'task-1-1',
                title: 'Investigación de mercado',
                description: 'Analizar competencia y validar demanda del mercado',
                status: 'pending',
                priority: 'high',
                estimatedHours: 16,
                dueDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)
              },
              {
                id: 'task-1-2',
                title: 'Definir propuesta de valor',
                description: 'Crear una propuesta de valor clara y diferenciada',
                status: 'pending',
                priority: 'high',
                estimatedHours: 12,
                dueDate: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000)
              },
              {
                id: 'task-1-3',
                title: 'Crear MVP',
                description: 'Desarrollar versión mínima viable del producto',
                status: 'pending',
                priority: 'medium',
                estimatedHours: 40,
                dueDate: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000)
              }
            ]
          },
          {
            id: 'phase-2',
            title: 'Búsqueda de Financiamiento',
            description: 'Preparar y ejecutar estrategia de financiamiento',
            status: 'pending',
            estimatedDays: 28,
            tasks: [
              {
                id: 'task-2-1',
                title: 'Crear pitch deck',
                description: 'Desarrollar presentación profesional para inversionistas',
                status: 'pending',
                priority: 'high',
                estimatedHours: 20,
                dueDate: new Date(Date.now() + 28 * 24 * 60 * 60 * 1000)
              },
              {
                id: 'task-2-2',
                title: 'Postular a fondos CORFO',
                description: 'Completar postulación a fondos públicos',
                status: 'pending',
                priority: 'high',
                estimatedHours: 24,
                dueDate: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000)
              },
              {
                id: 'task-2-3',
                title: 'Networking con inversionistas',
                description: 'Contactar y presentar a inversionistas potenciales',
                status: 'pending',
                priority: 'medium',
                estimatedHours: 16,
                dueDate: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000)
              }
            ]
          },
          {
            id: 'phase-3',
            title: 'Desarrollo de Marketing',
            description: 'Crear y ejecutar estrategia de marketing digital',
            status: 'pending',
            estimatedDays: 21,
            tasks: [
              {
                id: 'task-3-1',
                title: 'Estrategia de contenido',
                description: 'Desarrollar calendario y estrategia de contenido',
                status: 'pending',
                priority: 'medium',
                estimatedHours: 12,
                dueDate: new Date(Date.now() + 49 * 24 * 60 * 60 * 1000)
              },
              {
                id: 'task-3-2',
                title: 'Configurar redes sociales',
                description: 'Crear y optimizar perfiles en redes sociales',
                status: 'pending',
                priority: 'medium',
                estimatedHours: 8,
                dueDate: new Date(Date.now() + 56 * 24 * 60 * 60 * 1000)
              },
              {
                id: 'task-3-3',
                title: 'Campaña de lanzamiento',
                description: 'Ejecutar campaña de marketing para el lanzamiento',
                status: 'pending',
                priority: 'high',
                estimatedHours: 20,
                dueDate: new Date(Date.now() + 63 * 24 * 60 * 60 * 1000)
              }
            ]
          },
          {
            id: 'phase-4',
            title: 'Implementación y Lanzamiento',
            description: 'Lanzar producto y establecer operaciones',
            status: 'pending',
            estimatedDays: 14,
            tasks: [
              {
                id: 'task-4-1',
                title: 'Lanzamiento oficial',
                description: 'Ejecutar lanzamiento oficial del producto',
                status: 'pending',
                priority: 'high',
                estimatedHours: 16,
                dueDate: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000)
              },
              {
                id: 'task-4-2',
                title: 'Monitoreo y optimización',
                description: 'Monitorear métricas y optimizar procesos',
                status: 'pending',
                priority: 'medium',
                estimatedHours: 12,
                dueDate: new Date(Date.now() + 77 * 24 * 60 * 60 * 1000)
              },
              {
                id: 'task-4-3',
                title: 'Evaluación de resultados',
                description: 'Evaluar resultados y planificar siguientes pasos',
                status: 'pending',
                priority: 'medium',
                estimatedHours: 8,
                dueDate: new Date(Date.now() + 84 * 24 * 60 * 60 * 1000)
              }
            ]
          }
        ]
      }
    }
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
    <div className="flex items-center space-x-4">
      {/* Nombre del negocio seleccionado */}
      {selectedBusiness && (
        <div className="flex items-center space-x-2 bg-neon-blue/10 border border-neon-blue/20 rounded-lg px-4 py-2">
          <Building className="w-4 h-4 text-neon-blue" />
          <span className="text-sm font-medium text-neon-blue">{selectedBusiness}</span>
        </div>
      )}

      {/* Selector de negocios */}
      <div className="relative">
        <button
          onClick={() => setShowDropdown(!showDropdown)}
          className="flex items-center space-x-2 bg-dark-surface/80 backdrop-blur-sm border border-gray-800 rounded-lg px-4 py-2 hover:border-neon-blue transition-colors"
        >
          <span className="text-sm text-white">
            {selectedBusiness ? 'Cambiar' : 'Seleccionar Negocio'}
          </span>
          <svg className="w-4 h-4 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
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
    </div>
  );
}

export default function AIAgentInterface({ 
  currentUser, 
  selectedBusiness, 
  onBusinessChange, 
  onClose 
}: AIAgentInterfaceProps) {
  const [activeView, setActiveView] = useState<'chat' | 'dashboard'>('chat');
  const [showResult, setShowResult] = useState(false);
  const [currentResult, setCurrentResult] = useState<AgentResult | null>(null);
  const [isResultMaximized, setIsResultMaximized] = useState(false);
  const [copiedText, setCopiedText] = useState(false);
  const [showCreateBusiness, setShowCreateBusiness] = useState(false);
  const [showNotifications, setShowNotifications] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Obtener conversación específica del negocio
  const getBusinessMessages = (businessName: string | null): Message[] => {
    if (!businessName) {
      return [{
        id: 1,
        text: currentUser 
          ? `¡Hola ${currentUser.firstName || currentUser.username}! Selecciona un negocio para comenzar a trabajar en su Playground.`
          : "¡Hola! Selecciona un negocio para comenzar a trabajar en su Playground.",
        sender: 'bot',
        timestamp: new Date()
      }];
    }

    const conversationKey = `${currentUser?.email || 'guest'}-${businessName}`;
    
    if (!BUSINESS_CONVERSATIONS[conversationKey]) {
      BUSINESS_CONVERSATIONS[conversationKey] = [{
        id: 1,
        text: `¡Hola! Bienvenido al Playground de ${businessName}. Puedo ayudarte a encontrar fondos, crear estrategias, generar contenido y crear planes de trabajo específicos para este negocio. ¿En qué te gustaría que te ayude?`,
        sender: 'bot',
        timestamp: new Date(),
        businessContext: businessName
      }];
    }

    return BUSINESS_CONVERSATIONS[conversationKey];
  };

  const [messages, setMessages] = useState<Message[]>(getBusinessMessages(selectedBusiness));

  // Actualizar mensajes cuando cambie el negocio
  useEffect(() => {
    setMessages(getBusinessMessages(selectedBusiness));
    setShowResult(false);
    setCurrentResult(null);
  }, [selectedBusiness, currentUser]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!inputValue.trim() || !selectedBusiness) return;

    const conversationKey = `${currentUser?.email || 'guest'}-${selectedBusiness}`;
    
    const newUserMessage: Message = {
      id: Date.now(),
      text: inputValue,
      sender: 'user',
      timestamp: new Date(),
      businessContext: selectedBusiness
    };

    // Actualizar conversación específica del negocio
    BUSINESS_CONVERSATIONS[conversationKey] = [...(BUSINESS_CONVERSATIONS[conversationKey] || []), newUserMessage];
    setMessages(BUSINESS_CONVERSATIONS[conversationKey]);
    
    const userInput = inputValue.toLowerCase();
    setInputValue('');

    // Simular respuesta del bot con loading
    const loadingMessage: Message = {
      id: Date.now() + 1,
      text: 'Analizando tu solicitud...',
      sender: 'bot',
      timestamp: new Date(),
      loading: true,
      businessContext: selectedBusiness
    };

    BUSINESS_CONVERSATIONS[conversationKey] = [...BUSINESS_CONVERSATIONS[conversationKey], loadingMessage];
    setMessages(BUSINESS_CONVERSATIONS[conversationKey]);

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
      } else if (userInput.includes('plan') || userInput.includes('trabajo') || userInput.includes('tarea') || userInput.includes('estrategia')) {
        response = AGENT_RESPONSES['plan'];
        hasResult = true;
        
        // Crear plan de trabajo para este negocio
        if (response.result.workPlan) {
          const workPlan = { ...response.result.workPlan };
          workPlan.businessName = selectedBusiness;
          workPlan.id = `wp-${selectedBusiness}-${Date.now()}`;
          
          const workPlanKey = `${currentUser?.email || 'guest'}-${selectedBusiness}`;
          if (!BUSINESS_WORKPLANS[workPlanKey]) {
            BUSINESS_WORKPLANS[workPlanKey] = [];
          }
          BUSINESS_WORKPLANS[workPlanKey].push(workPlan);
        }
      }

      const botResponse: Message = {
        id: Date.now() + 2,
        text: response.text,
        sender: 'bot',
        timestamp: new Date(),
        hasResult,
        resultType: hasResult ? response.result.type : undefined,
        businessContext: selectedBusiness
      };

      // Actualizar conversación
      BUSINESS_CONVERSATIONS[conversationKey] = BUSINESS_CONVERSATIONS[conversationKey].map(msg => 
        msg.id === loadingMessage.id ? botResponse : msg
      );
      setMessages(BUSINESS_CONVERSATIONS[conversationKey]);

      if (hasResult) {
        const resultWithBusiness = { ...response.result };
        if (resultWithBusiness.workPlan) {
          resultWithBusiness.workPlan.businessName = selectedBusiness;
        }
        setCurrentResult(resultWithBusiness);
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
      case 'workplan': return <Target className="w-5 h-5" />;
      default: return <FileText className="w-5 h-5" />;
    }
  };

  const handleCreateBusiness = (businessData: any) => {
    if (currentUser && onBusinessChange) {
      // Agregar el negocio al usuario actual
      currentUser.businesses.push(businessData.name);
      onBusinessChange(businessData.name);
    }
  };

  // Obtener planes de trabajo del negocio actual
  const getBusinessWorkPlans = (): WorkPlan[] => {
    if (!selectedBusiness || !currentUser) return [];
    const workPlanKey = `${currentUser.email}-${selectedBusiness}`;
    return BUSINESS_WORKPLANS[workPlanKey] || [];
  };

  // Contar notificaciones pendientes
  const getNotificationCount = (): number => {
    if (!selectedBusiness || !currentUser) return 0;
    const workPlans = getBusinessWorkPlans();
    let count = 0;
    
    workPlans.forEach(plan => {
      plan.phases.forEach(phase => {
        phase.tasks.forEach(task => {
          if (task.dueDate && task.status !== 'completed') {
            const daysUntilDue = Math.ceil((task.dueDate.getTime() - Date.now()) / (1000 * 60 * 60 * 24));
            if (daysUntilDue <= 3) count++; // Tareas que vencen en 3 días o menos
          }
        });
      });
    });
    
    return count;
  };

  return (
    <div className="h-screen bg-deep-dark flex overflow-hidden">
      {/* Notification Center */}
      {showNotifications && (
        <NotificationCenter
          businessName={selectedBusiness}
          workPlans={getBusinessWorkPlans()}
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

      {/* Main Content */}
      <div className={`transition-all duration-500 ease-in-out ${
        showResult && !isResultMaximized ? 'w-1/2' : 'w-full'
      } flex flex-col h-full`}>
        {/* Header */}
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
            
            <div className="flex items-center space-x-4">
              {/* Notification Bell */}
              {selectedBusiness && (
                <button
                  onClick={() => setShowNotifications(true)}
                  className="relative p-2 text-gray-400 hover:text-white transition-colors"
                >
                  <Bell className="w-5 h-5" />
                  {getNotificationCount() > 0 && (
                    <span className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 text-white text-xs rounded-full flex items-center justify-center">
                      {getNotificationCount()}
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

          {/* Navigation Tabs */}
          {selectedBusiness && (
            <div className="flex space-x-4 mt-4">
              <button
                onClick={() => setActiveView('chat')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeView === 'chat'
                    ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <Bot className="w-4 h-4 inline mr-2" />
                Chat IA
              </button>
              <button
                onClick={() => setActiveView('dashboard')}
                className={`px-4 py-2 rounded-lg transition-colors ${
                  activeView === 'dashboard'
                    ? 'bg-neon-blue/10 text-neon-blue border border-neon-blue/20'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Dashboard
              </button>
            </div>
          )}
        </div>

        {/* Content Area */}
        {activeView === 'chat' ? (
          <>
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
                                      const result = { ...AGENT_RESPONSES[resultKey as keyof typeof AGENT_RESPONSES].result };
                                      if (result.workPlan && selectedBusiness) {
                                        result.workPlan.businessName = selectedBusiness;
                                      }
                                      setCurrentResult(result);
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
                    <button
                      onClick={() => setInputValue('Crea un plan de trabajo para mi negocio')}
                      className="px-4 py-2 bg-gray-800 hover:bg-gray-700 rounded-lg text-sm transition-colors"
                    >
                      📋 Plan de Trabajo
                    </button>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          /* Dashboard View */
          <div className="flex-1 overflow-y-auto">
            {selectedBusiness ? (
              <BusinessDashboard 
                businessName={selectedBusiness}
                workPlans={getBusinessWorkPlans()}
                currentUser={currentUser}
              />
            ) : (
              <div className="flex items-center justify-center h-full">
                <div className="text-center">
                  <Building className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold mb-2">Selecciona un Negocio</h3>
                  <p className="text-gray-400">Elige un negocio para ver su dashboard</p>
                </div>
              </div>
            )}
          </div>
        )}
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
            } bg-dark-surface border-l border-gray-800 flex flex-col h-full overflow-hidden`}
          >
            {/* Result Header */}
            <div className="p-6 border-b border-gray-800 flex items-center justify-between flex-shrink-0">
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
            <div className="p-6 border-t border-gray-800 flex-shrink-0">
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