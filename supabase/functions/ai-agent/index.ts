import { serve } from "https://deno.land/std@0.168.0/http/server.ts"

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
}

interface AIRequest {
  prompt: string;
  businessId: string;
  businessName: string;
  businessDescription?: string;
  requestType?: 'hack_analysis' | 'work_plan' | 'content_reel_script' | 'table_comparison' | 'flow_diagram_textual';
}

interface AIResponse {
  success: boolean;
  data?: any;
  error?: string;
  type?: string;
}

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders })
  }

  try {
    const { prompt, businessId, businessName, businessDescription, requestType }: AIRequest = await req.json()

    // Validate required fields
    if (!prompt || !businessId || !businessName) {
      return new Response(
        JSON.stringify({ 
          success: false, 
          error: 'Missing required fields: prompt, businessId, businessName' 
        }),
        { 
          status: 400, 
          headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
        }
      )
    }

    // Determine the type of AI response based on the prompt
    const responseType = determineResponseType(prompt, requestType)
    
    // Generate AI response based on type
    const aiResult = await generateAIResponse(responseType, {
      prompt,
      businessName,
      businessDescription: businessDescription || '',
    })

    const response: AIResponse = {
      success: true,
      data: aiResult,
      type: responseType
    }

    return new Response(
      JSON.stringify(response),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )

  } catch (error) {
    console.error('AI Agent Error:', error)
    
    return new Response(
      JSON.stringify({ 
        success: false, 
        error: 'Internal server error' 
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    )
  }
})

function determineResponseType(prompt: string, requestType?: string): string {
  if (requestType) return requestType
  
  const lowerPrompt = prompt.toLowerCase()
  
  if (lowerPrompt.includes('hack') || lowerPrompt.includes('valor')) {
    return 'hack_analysis'
  } else if (lowerPrompt.includes('plan') || lowerPrompt.includes('trabajo')) {
    return 'work_plan'
  } else if (lowerPrompt.includes('contenido') || lowerPrompt.includes('reel') || lowerPrompt.includes('instagram')) {
    return 'content_reel_script'
  } else if (lowerPrompt.includes('comparativa') || lowerPrompt.includes('competencia') || lowerPrompt.includes('tabla')) {
    return 'table_comparison'
  } else if (lowerPrompt.includes('flujo') || lowerPrompt.includes('proceso') || lowerPrompt.includes('diagrama')) {
    return 'flow_diagram_textual'
  }
  
  return 'hack_analysis' // default
}

async function generateAIResponse(type: string, context: { prompt: string, businessName: string, businessDescription: string }) {
  // In a real implementation, this would call an external AI service like OpenAI, Anthropic, etc.
  // For now, we'll return structured mock data based on the type
  
  switch (type) {
    case 'hack_analysis':
      return generateHackAnalysis(context)
    case 'work_plan':
      return generateWorkPlan(context)
    case 'content_reel_script':
      return generateContentReelScript(context)
    case 'table_comparison':
      return generateTableComparison(context)
    case 'flow_diagram_textual':
      return generateFlowDiagram(context)
    default:
      return generateHackAnalysis(context)
  }
}

function generateHackAnalysis(context: { businessName: string, businessDescription: string }) {
  return {
    title: `Hack de Valor para ${context.businessName}`,
    problema: `Análisis del problema principal identificado para ${context.businessName}: ${context.businessDescription}`,
    oportunidad: `Oportunidad de mejora específica basada en el análisis de mercado y las características únicas de ${context.businessName}`,
    solucion: `Solución estratégica personalizada que aprovecha las fortalezas de ${context.businessName} para abordar el problema identificado`,
    beneficios: [
      `Incremento estimado del 25-40% en la métrica clave del negocio`,
      `Mejora en la diferenciación competitiva de ${context.businessName}`,
      `Optimización de recursos existentes`,
      `Creación de ventaja competitiva sostenible`
    ],
    implementacion: [
      `Análisis detallado de la situación actual de ${context.businessName}`,
      `Diseño de la estrategia específica`,
      `Implementación piloto en segmento controlado`,
      `Medición y optimización de resultados`,
      `Escalamiento a toda la operación`
    ],
    riesgo: 'Medio - Requiere inversión moderada con retorno medible',
    impacto: 'Alto - Transformación significativa en métricas clave'
  }
}

function generateWorkPlan(context: { businessName: string, businessDescription: string }) {
  return {
    title: `Plan de Trabajo Estratégico - ${context.businessName}`,
    objetivos: [
      `Optimizar las operaciones principales de ${context.businessName}`,
      `Implementar mejoras basadas en análisis de datos`,
      `Establecer métricas de seguimiento y control`,
      `Crear plan de crecimiento sostenible`
    ],
    etapas: [
      {
        nombre: 'Análisis y Diagnóstico',
        duracion: '2-3 semanas',
        tareas: [
          {
            descripcion: `Evaluación completa del estado actual de ${context.businessName}`,
            responsable: 'Equipo de Análisis',
            fechaLimite: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            estado: 'Pendiente'
          },
          {
            descripcion: 'Identificación de oportunidades de mejora',
            responsable: 'Consultor Senior',
            fechaLimite: new Date(Date.now() + 21 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            estado: 'Pendiente'
          }
        ]
      },
      {
        nombre: 'Diseño de Estrategia',
        duracion: '3-4 semanas',
        tareas: [
          {
            descripcion: 'Desarrollo de estrategia personalizada',
            responsable: 'Director de Estrategia',
            fechaLimite: new Date(Date.now() + 35 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            estado: 'Pendiente'
          },
          {
            descripcion: 'Validación con stakeholders clave',
            responsable: 'Gerente de Proyecto',
            fechaLimite: new Date(Date.now() + 42 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            estado: 'Pendiente'
          }
        ]
      },
      {
        nombre: 'Implementación',
        duracion: '6-8 semanas',
        tareas: [
          {
            descripcion: 'Ejecución de plan piloto',
            responsable: 'Equipo de Implementación',
            fechaLimite: new Date(Date.now() + 70 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            estado: 'Pendiente'
          },
          {
            descripcion: 'Monitoreo y ajustes',
            responsable: 'Analista de Datos',
            fechaLimite: new Date(Date.now() + 84 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            estado: 'Pendiente'
          }
        ]
      }
    ]
  }
}

function generateContentReelScript(context: { businessName: string, businessDescription: string }) {
  return {
    reels: [
      {
        titulo: `El Secreto de ${context.businessName}`,
        duracion: '30 segundos',
        hook: `¿Sabías que ${context.businessName} tiene un enfoque único que la mayoría no conoce?`,
        desarrollo: [
          `Mostrar el problema común en la industria`,
          `Revelar cómo ${context.businessName} lo resuelve diferente`,
          `Demostrar el resultado/beneficio único`,
          `Mostrar testimonial o caso de éxito`
        ],
        cta: `Descubre más sobre ${context.businessName} y cómo puede ayudarte`,
        hashtags: [`#${context.businessName.replace(/\s+/g, '')}`, '#Innovacion', '#Solucion', '#Emprendimiento', '#Chile']
      },
      {
        titulo: `Un Día en ${context.businessName}`,
        duracion: '45 segundos',
        hook: `Te mostramos cómo ${context.businessName} transforma vidas todos los días`,
        desarrollo: [
          `Mostrar el proceso desde adentro`,
          `Destacar el equipo y la pasión`,
          `Mostrar el impacto en los clientes`,
          `Revelar los valores de la empresa`
        ],
        cta: `Únete a la comunidad de ${context.businessName}`,
        hashtags: [`#${context.businessName.replace(/\s+/g, '')}`, '#DetrasDeEscena', '#Equipo', '#Valores', '#Comunidad']
      }
    ]
  }
}

function generateTableComparison(context: { businessName: string, businessDescription: string }) {
  return {
    headers: [
      { id: 'criterio', label: 'Criterio' },
      { id: 'competidor_a', label: 'Competidor A' },
      { id: 'competidor_b', label: 'Competidor B' },
      { id: 'tu_propuesta', label: context.businessName, highlight: true }
    ],
    rows: [
      {
        criterio: 'Propuesta de Valor',
        competidor_a: 'Estándar del mercado',
        competidor_b: 'Enfoque tradicional',
        tu_propuesta: 'Solución innovadora y personalizada'
      },
      {
        criterio: 'Precio',
        competidor_a: 'Premium',
        competidor_b: 'Competitivo',
        tu_propuesta: 'Valor excepcional'
      },
      {
        criterio: 'Experiencia del Cliente',
        competidor_a: 'Básica',
        competidor_b: 'Mejorada',
        tu_propuesta: 'Excepcional y personalizada'
      },
      {
        criterio: 'Innovación',
        competidor_a: 'Limitada',
        competidor_b: 'Moderada',
        tu_propuesta: 'Líder en innovación'
      }
    ]
  }
}

function generateFlowDiagram(context: { businessName: string, businessDescription: string }) {
  return {
    steps: [
      {
        id: '1',
        name: 'Identificación de Oportunidad',
        description: `Análisis inicial para ${context.businessName}`
      },
      {
        id: '2',
        name: 'Evaluación de Viabilidad',
        description: 'Estudio de factibilidad técnica y comercial'
      },
      {
        id: '3',
        name: 'Diseño de Solución',
        description: 'Desarrollo de propuesta personalizada'
      },
      {
        id: '4',
        name: 'Implementación',
        description: 'Ejecución del plan estratégico'
      },
      {
        id: '5',
        name: 'Medición y Optimización',
        description: 'Seguimiento de resultados y mejora continua'
      }
    ],
    connections: [
      { from: '1', to: '2' },
      { from: '2', to: '3' },
      { from: '3', to: '4' },
      { from: '4', to: '5' }
    ]
  }
}