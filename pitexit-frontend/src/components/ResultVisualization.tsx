import React from 'react';
import { 
  Check, 
  Target, 
  Video, 
  Table, 
  GitBranch, 
  Sparkles,
  Calendar,
  User,
  Clock
} from 'lucide-react';

interface StructuredResult {
  id: string;
  type: 'hack_analysis' | 'work_plan' | 'content_reel_script' | 'table_comparison' | 'flow_diagram_textual';
  title: string;
  content: any;
  createdAt: Date;
  businessName?: string;
}

interface ResultVisualizationProps {
  result: StructuredResult;
}

export default function ResultVisualization({ result }: ResultVisualizationProps) {
  const getResultIcon = (type: string) => {
    switch (type) {
      case 'hack_analysis': return <Sparkles className="w-5 h-5 text-purple-500" />;
      case 'work_plan': return <Target className="w-5 h-5 text-blue-500" />;
      case 'content_reel_script': return <Video className="w-5 h-5 text-pink-500" />;
      case 'table_comparison': return <Table className="w-5 h-5 text-green-500" />;
      case 'flow_diagram_textual': return <GitBranch className="w-5 h-5 text-orange-500" />;
      default: return <Sparkles className="w-5 h-5 text-gray-400" />;
    }
  };

  const renderHackAnalysis = () => (
    <div className="space-y-6">
      <div className="grid md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">🎯 Problema Identificado</h3>
            <p className="text-gray-300 bg-red-500/5 border border-red-500/20 rounded-lg p-4">
              {result.content.problema}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">💡 Oportunidad</h3>
            <p className="text-gray-300 bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
              {result.content.oportunidad}
            </p>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">🚀 Solución Propuesta</h3>
            <p className="text-gray-300 bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
              {result.content.solucion}
            </p>
          </div>
        </div>
        <div className="space-y-4">
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">✅ Beneficios Esperados</h3>
            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
              <ul className="space-y-2">
                {result.content.beneficios.map((beneficio: string, index: number) => (
                  <li key={index} className="flex items-center text-gray-300">
                    <Check className="w-4 h-4 text-green-500 mr-2 flex-shrink-0" />
                    {beneficio}
                  </li>
                ))}
              </ul>
            </div>
          </div>
          <div>
            <h3 className="text-lg font-semibold text-white mb-2">📋 Pasos de Implementación</h3>
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
              <ol className="space-y-2">
                {result.content.implementacion.map((paso: string, index: number) => (
                  <li key={index} className="flex items-start text-gray-300">
                    <span className="w-6 h-6 rounded-full bg-neon-blue/10 text-neon-blue text-sm flex items-center justify-center mr-2 mt-0.5 flex-shrink-0">
                      {index + 1}
                    </span>
                    {paso}
                  </li>
                ))}
              </ol>
            </div>
          </div>
        </div>
      </div>
      <div className="grid md:grid-cols-2 gap-6 pt-6 border-t border-gray-800">
        <div className="bg-gray-800/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">⚠️ Nivel de Riesgo</h3>
          <p className="text-green-400 font-medium">{result.content.riesgo}</p>
        </div>
        <div className="bg-gray-800/30 rounded-lg p-4">
          <h3 className="text-lg font-semibold text-white mb-2">📈 Impacto Esperado</h3>
          <p className="text-neon-blue font-semibold">{result.content.impacto}</p>
        </div>
      </div>
    </div>
  );

  const renderWorkPlan = () => (
    <div className="space-y-6">
      <div className="bg-neon-blue/5 border border-neon-blue/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Target className="w-5 h-5 text-neon-blue mr-2" />
          Objetivos del Plan
        </h3>
        <ul className="space-y-2">
          {result.content.objetivos.map((objetivo: string, index: number) => (
            <li key={index} className="flex items-center text-gray-300">
              <div className="w-2 h-2 bg-neon-blue rounded-full mr-3" />
              {objetivo}
            </li>
          ))}
        </ul>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold text-white mb-4 flex items-center">
          <Calendar className="w-5 h-5 text-blue-500 mr-2" />
          Etapas de Ejecución
        </h3>
        <div className="space-y-4">
          {result.content.etapas.map((etapa: any, etapaIndex: number) => (
            <div key={etapaIndex} className="border border-gray-800 rounded-lg overflow-hidden">
              <div className="bg-gray-800/50 p-4 border-b border-gray-800">
                <div className="flex items-center justify-between">
                  <h4 className="font-medium text-white flex items-center">
                    <span className="w-8 h-8 rounded-full bg-blue-500/10 text-blue-500 flex items-center justify-center mr-3 text-sm font-bold">
                      {etapaIndex + 1}
                    </span>
                    {etapa.nombre}
                  </h4>
                  <span className="text-sm text-gray-400 bg-gray-700 px-2 py-1 rounded">
                    {etapa.duracion}
                  </span>
                </div>
              </div>
              <div className="p-4">
                <div className="space-y-3">
                  {etapa.tareas.map((tarea: any, tareaIndex: number) => (
                    <div key={tareaIndex} className="bg-gray-800/30 rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-start space-x-3">
                          <div className={`w-4 h-4 rounded-full mt-0.5 ${
                            tarea.estado === 'Completado' ? 'bg-green-500' :
                            tarea.estado === 'En progreso' ? 'bg-yellow-500' : 'bg-gray-600'
                          }`} />
                          <div className="flex-1">
                            <p className="text-white font-medium">{tarea.descripcion}</p>
                            <div className="flex items-center space-x-4 mt-1 text-xs text-gray-400">
                              <span className="flex items-center">
                                <User className="w-3 h-3 mr-1" />
                                {tarea.responsable}
                              </span>
                              <span className="flex items-center">
                                <Calendar className="w-3 h-3 mr-1" />
                                {tarea.fechaLimite}
                              </span>
                            </div>
                          </div>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          tarea.estado === 'Completado' ? 'bg-green-500/10 text-green-500' :
                          tarea.estado === 'En progreso' ? 'bg-yellow-500/10 text-yellow-500' :
                          'bg-gray-500/10 text-gray-400'
                        }`}>
                          {tarea.estado}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );

  const renderContentReelScript = () => (
    <div className="space-y-6">
      {result.content.reels.map((reel: any, index: number) => (
        <div key={index} className="border border-gray-800 rounded-lg overflow-hidden">
          <div className="bg-gradient-to-r from-pink-500/10 to-purple-500/10 border-b border-gray-800 p-4">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-semibold text-white flex items-center">
                <Video className="w-5 h-5 text-pink-500 mr-2" />
                {reel.titulo}
              </h3>
              <span className="text-sm text-gray-400 bg-gray-800 px-2 py-1 rounded flex items-center">
                <Clock className="w-3 h-3 mr-1" />
                {reel.duracion}
              </span>
            </div>
          </div>
          
          <div className="p-6 space-y-6">
            <div className="bg-yellow-500/5 border border-yellow-500/20 rounded-lg p-4">
              <h4 className="font-medium text-yellow-500 mb-2 flex items-center">
                🎣 Hook (Gancho)
              </h4>
              <p className="text-gray-300 italic text-lg">"{reel.hook}"</p>
            </div>
            
            <div className="bg-blue-500/5 border border-blue-500/20 rounded-lg p-4">
              <h4 className="font-medium text-blue-500 mb-3 flex items-center">
                🎬 Desarrollo del Contenido
              </h4>
              <ol className="space-y-3">
                {reel.desarrollo.map((paso: string, pasoIndex: number) => (
                  <li key={pasoIndex} className="flex items-start">
                    <span className="w-6 h-6 rounded-full bg-blue-500/10 text-blue-500 text-sm flex items-center justify-center mr-3 mt-0.5 font-bold">
                      {pasoIndex + 1}
                    </span>
                    <span className="text-gray-300">{paso}</span>
                  </li>
                ))}
              </ol>
            </div>
            
            <div className="bg-green-500/5 border border-green-500/20 rounded-lg p-4">
              <h4 className="font-medium text-green-500 mb-2 flex items-center">
                📢 Call to Action
              </h4>
              <p className="text-gray-300 font-medium">"{reel.cta}"</p>
            </div>
            
            <div className="bg-purple-500/5 border border-purple-500/20 rounded-lg p-4">
              <h4 className="font-medium text-purple-500 mb-3 flex items-center">
                # Hashtags Recomendados
              </h4>
              <div className="flex flex-wrap gap-2">
                {reel.hashtags.map((hashtag: string, hashIndex: number) => (
                  <span key={hashIndex} className="px-3 py-1 bg-purple-500/10 text-purple-500 rounded-full text-sm font-medium">
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

  const renderTableComparison = () => (
    <div className="overflow-x-auto">
      <div className="bg-gray-800/30 rounded-lg p-4 mb-4">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
          <Table className="w-5 h-5 text-green-500 mr-2" />
          Análisis Comparativo
        </h3>
        <p className="text-gray-400 text-sm">
          Esta tabla muestra cómo tu propuesta se posiciona frente a la competencia
        </p>
      </div>
      
      <div className="border border-gray-800 rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="bg-gray-800/50">
              {result.content.headers.map((header: any) => (
                <th key={header.id} className={`border-r border-gray-700 p-4 text-left font-medium ${
                  header.highlight 
                    ? 'bg-neon-blue/10 text-neon-blue' 
                    : 'text-white'
                }`}>
                  {header.highlight && <span className="mr-2">⭐</span>}
                  {header.label}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {result.content.rows.map((row: any, index: number) => (
              <tr key={index} className="hover:bg-gray-800/30 transition-colors">
                <td className="border-r border-gray-700 p-4 font-medium text-white bg-gray-800/20">
                  {row.criterio}
                </td>
                <td className="border-r border-gray-700 p-4 text-gray-300">
                  {row.competidor_a}
                </td>
                <td className="border-r border-gray-700 p-4 text-gray-300">
                  {row.competidor_b}
                </td>
                <td className="p-4 bg-neon-blue/5 text-neon-blue font-medium border-l-2 border-neon-blue/30">
                  <div className="flex items-center">
                    <Check className="w-4 h-4 mr-2" />
                    {row.tu_propuesta}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );

  const renderFlowDiagram = () => (
    <div className="space-y-6">
      <div className="bg-orange-500/5 border border-orange-500/20 rounded-lg p-4">
        <h3 className="text-lg font-semibold text-white mb-2 flex items-center">
          <GitBranch className="w-5 h-5 text-orange-500 mr-2" />
          Flujo de Proceso
        </h3>
        <p className="text-gray-400 text-sm">
          Secuencia de pasos para ejecutar la estrategia
        </p>
      </div>
      
      <div className="space-y-4">
        {result.content.steps.map((step: any, index: number) => {
          const nextStep = result.content.connections.find((conn: any) => conn.from === step.id);
          const isLastStep = !nextStep;
          
          return (
            <div key={step.id} className="flex items-center">
              <div className="flex-1">
                <div className="flex items-center p-4 bg-gray-800/30 rounded-lg border border-gray-700 hover:border-orange-500/50 transition-colors">
                  <div className="w-10 h-10 rounded-full bg-orange-500/10 text-orange-500 flex items-center justify-center mr-4 font-bold text-lg">
                    {step.id}
                  </div>
                  <div className="flex-1">
                    <h4 className="font-medium text-white text-lg">{step.name}</h4>
                    <p className="text-gray-400 text-sm mt-1">{step.description}</p>
                  </div>
                  {isLastStep && (
                    <div className="ml-4 px-3 py-1 bg-green-500/10 text-green-500 rounded-full text-xs font-medium">
                      Final
                    </div>
                  )}
                </div>
              </div>
              {!isLastStep && (
                <div className="flex flex-col items-center justify-center w-16 py-2">
                  <div className="w-0.5 h-6 bg-orange-500/30"></div>
                  <div className="w-0 h-0 border-l-4 border-l-transparent border-r-4 border-r-transparent border-t-6 border-t-orange-500/50"></div>
                  <div className="w-0.5 h-6 bg-orange-500/30"></div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );

  const renderContent = () => {
    switch (result.type) {
      case 'hack_analysis': return renderHackAnalysis();
      case 'work_plan': return renderWorkPlan();
      case 'content_reel_script': return renderContentReelScript();
      case 'table_comparison': return renderTableComparison();
      case 'flow_diagram_textual': return renderFlowDiagram();
      default: return <div className="text-gray-400">Tipo de resultado no soportado</div>;
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