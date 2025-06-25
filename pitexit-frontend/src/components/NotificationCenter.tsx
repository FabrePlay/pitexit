import React from 'react';
import { motion } from 'framer-motion';
import {
  X,
  Bell,
  Clock,
  AlertTriangle,
  CheckCircle,
  Calendar,
  Target,
  TrendingUp
} from 'lucide-react';

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

interface Notification {
  id: string;
  type: 'deadline' | 'overdue' | 'completed' | 'milestone' | 'reminder';
  title: string;
  message: string;
  timestamp: Date;
  priority: 'high' | 'medium' | 'low';
  taskId?: string;
  phaseId?: string;
  workPlanId?: string;
}

interface NotificationCenterProps {
  businessName: string | null;
  workPlans: WorkPlan[];
  onClose: () => void;
}

export default function NotificationCenter({ businessName, workPlans, onClose }: NotificationCenterProps) {
  // Generar notificaciones basadas en los planes de trabajo
  const generateNotifications = (): Notification[] => {
    const notifications: Notification[] = [];
    const now = new Date();

    workPlans.forEach(workPlan => {
      workPlan.phases.forEach(phase => {
        phase.tasks.forEach(task => {
          if (task.dueDate && task.status !== 'completed') {
            const daysUntilDue = Math.ceil((task.dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
            
            if (daysUntilDue < 0) {
              // Tarea vencida
              notifications.push({
                id: `overdue-${task.id}`,
                type: 'overdue',
                title: 'Tarea Vencida',
                message: `"${task.title}" venció hace ${Math.abs(daysUntilDue)} días`,
                timestamp: task.dueDate,
                priority: 'high',
                taskId: task.id,
                phaseId: phase.id,
                workPlanId: workPlan.id
              });
            } else if (daysUntilDue <= 3) {
              // Tarea próxima a vencer
              notifications.push({
                id: `deadline-${task.id}`,
                type: 'deadline',
                title: 'Fecha Límite Próxima',
                message: `"${task.title}" vence en ${daysUntilDue} días`,
                timestamp: new Date(now.getTime() - Math.random() * 24 * 60 * 60 * 1000),
                priority: daysUntilDue <= 1 ? 'high' : 'medium',
                taskId: task.id,
                phaseId: phase.id,
                workPlanId: workPlan.id
              });
            }
          }

          // Tareas completadas recientemente
          if (task.status === 'completed') {
            const completedRecently = Math.random() > 0.7; // 30% de probabilidad
            if (completedRecently) {
              notifications.push({
                id: `completed-${task.id}`,
                type: 'completed',
                title: 'Tarea Completada',
                message: `¡Excelente! Completaste "${task.title}"`,
                timestamp: new Date(now.getTime() - Math.random() * 7 * 24 * 60 * 60 * 1000),
                priority: 'low',
                taskId: task.id,
                phaseId: phase.id,
                workPlanId: workPlan.id
              });
            }
          }
        });

        // Fases completadas
        if (phase.status === 'completed') {
          const completedRecently = Math.random() > 0.8; // 20% de probabilidad
          if (completedRecently) {
            notifications.push({
              id: `milestone-${phase.id}`,
              type: 'milestone',
              title: 'Fase Completada',
              message: `¡Felicitaciones! Completaste la fase "${phase.title}"`,
              timestamp: new Date(now.getTime() - Math.random() * 3 * 24 * 60 * 60 * 1000),
              priority: 'medium',
              phaseId: phase.id,
              workPlanId: workPlan.id
            });
          }
        }
      });

      // Recordatorios de planes de trabajo
      const daysSinceCreated = Math.ceil((now.getTime() - workPlan.createdAt.getTime()) / (1000 * 60 * 60 * 24));
      if (daysSinceCreated === 7 || daysSinceCreated === 14) {
        notifications.push({
          id: `reminder-${workPlan.id}`,
          type: 'reminder',
          title: 'Recordatorio de Plan',
          message: `Revisa el progreso de "${workPlan.title}"`,
          timestamp: new Date(now.getTime() - Math.random() * 12 * 60 * 60 * 1000),
          priority: 'low',
          workPlanId: workPlan.id
        });
      }
    });

    // Ordenar por prioridad y fecha
    return notifications.sort((a, b) => {
      const priorityOrder = { high: 3, medium: 2, low: 1 };
      if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
        return priorityOrder[b.priority] - priorityOrder[a.priority];
      }
      return b.timestamp.getTime() - a.timestamp.getTime();
    });
  };

  const notifications = generateNotifications();

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'deadline': return <Clock className="w-5 h-5 text-yellow-500" />;
      case 'overdue': return <AlertTriangle className="w-5 h-5 text-red-500" />;
      case 'completed': return <CheckCircle className="w-5 h-5 text-green-500" />;
      case 'milestone': return <Target className="w-5 h-5 text-purple-500" />;
      case 'reminder': return <Bell className="w-5 h-5 text-blue-500" />;
      default: return <Bell className="w-5 h-5 text-gray-400" />;
    }
  };

  const getNotificationColor = (type: string, priority: string) => {
    if (type === 'overdue') return 'border-red-500/20 bg-red-500/5';
    if (priority === 'high') return 'border-yellow-500/20 bg-yellow-500/5';
    if (type === 'completed' || type === 'milestone') return 'border-green-500/20 bg-green-500/5';
    return 'border-gray-800 bg-gray-800/30';
  };

  const formatTimeAgo = (date: Date) => {
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Hace unos minutos';
    if (diffInHours < 24) return `Hace ${diffInHours} horas`;
    
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays === 1) return 'Hace 1 día';
    if (diffInDays < 7) return `Hace ${diffInDays} días`;
    
    return date.toLocaleDateString();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center p-4 z-50">
      <motion.div
        initial={{ opacity: 0, scale: 0.95, x: 300 }}
        animate={{ opacity: 1, scale: 1, x: 0 }}
        exit={{ opacity: 0, scale: 0.95, x: 300 }}
        className="bg-dark-surface w-full max-w-md h-[80vh] rounded-xl flex flex-col overflow-hidden"
      >
        {/* Header */}
        <div className="p-6 border-b border-gray-800 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-8 h-8 rounded-lg bg-neon-blue/10 flex items-center justify-center">
              <Bell className="w-5 h-5 text-neon-blue" />
            </div>
            <div>
              <h2 className="font-semibold text-white">Notificaciones</h2>
              {businessName && (
                <p className="text-sm text-gray-400">{businessName}</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Notifications List */}
        <div className="flex-1 overflow-y-auto">
          {notifications.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <Bell className="w-12 h-12 text-gray-600 mb-3" />
              <h3 className="text-lg font-semibold text-white mb-2">No hay notificaciones</h3>
              <p className="text-gray-400 text-sm">
                {businessName 
                  ? 'Todas las tareas están al día'
                  : 'Selecciona un negocio para ver notificaciones'
                }
              </p>
            </div>
          ) : (
            <div className="p-4 space-y-3">
              {notifications.map(notification => (
                <div
                  key={notification.id}
                  className={`p-4 rounded-lg border transition-colors hover:bg-gray-800/50 ${getNotificationColor(notification.type, notification.priority)}`}
                >
                  <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-0.5">
                      {getNotificationIcon(notification.type)}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between mb-1">
                        <h4 className="text-sm font-medium text-white truncate">
                          {notification.title}
                        </h4>
                        <span className={`px-2 py-1 rounded text-xs ${
                          notification.priority === 'high' 
                            ? 'bg-red-500/10 text-red-500'
                            : notification.priority === 'medium'
                            ? 'bg-yellow-500/10 text-yellow-500'
                            : 'bg-gray-500/10 text-gray-400'
                        }`}>
                          {notification.priority}
                        </span>
                      </div>
                      <p className="text-sm text-gray-300 mb-2">
                        {notification.message}
                      </p>
                      <div className="flex items-center text-xs text-gray-500">
                        <Calendar className="w-3 h-3 mr-1" />
                        {formatTimeAgo(notification.timestamp)}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer */}
        {notifications.length > 0 && (
          <div className="p-4 border-t border-gray-800">
            <div className="flex items-center justify-between text-sm">
              <span className="text-gray-400">
                {notifications.length} notificaciones
              </span>
              <button className="text-neon-blue hover:text-white transition-colors">
                Marcar todas como leídas
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}