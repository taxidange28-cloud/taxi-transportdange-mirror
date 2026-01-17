import React, { useEffect, useState } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

/**
 * NotificationToast Component
 * Displays toast notifications with auto-dismiss and animations
 * 
 * @param {Object} props
 * @param {string} props.type - Type: 'success', 'error', 'info', 'warning'
 * @param {string} props.message - Notification message
 * @param {Function} props.onClose - Callback when notification is closed
 * @param {number} props.duration - Auto-dismiss duration in ms (default: 5000)
 */
const NotificationToast = ({ 
  type = 'info', 
  message, 
  onClose, 
  duration = 5000 
}) => {
  const [isVisible, setIsVisible] = useState(true);
  const [isExiting, setIsExiting] = useState(false);

  const handleClose = () => {
    setIsExiting(true);
    setTimeout(() => {
      setIsVisible(false);
      if (onClose) onClose();
    }, 300); // Match animation duration
  };

  useEffect(() => {
    if (duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [duration]); // eslint-disable-line react-hooks/exhaustive-deps

  if (!isVisible) return null;

  // Type configurations
  const configs = {
    success: {
      bg: 'bg-success',
      icon: CheckCircle,
      iconColor: 'text-white'
    },
    error: {
      bg: 'bg-error',
      icon: AlertCircle,
      iconColor: 'text-white'
    },
    warning: {
      bg: 'bg-warning',
      icon: AlertTriangle,
      iconColor: 'text-white'
    },
    info: {
      bg: 'bg-info',
      icon: Info,
      iconColor: 'text-white'
    }
  };

  const config = configs[type] || configs.info;
  const Icon = config.icon;

  return (
    <div
      className={`
        fixed top-4 right-4 z-50 min-w-80 max-w-md
        ${config.bg} text-white rounded-lg shadow-2xl
        flex items-center p-4 space-x-3
        transition-all duration-300 ease-in-out
        ${isExiting ? 'opacity-0 translate-x-full' : 'opacity-100 translate-x-0'}
        ${!isExiting ? 'animate-slide-in' : ''}
      `}
    >
      <Icon className={`w-6 h-6 ${config.iconColor} flex-shrink-0`} />
      <div className="flex-1 text-sm font-medium">
        {message}
      </div>
      <button
        onClick={handleClose}
        className="flex-shrink-0 hover:bg-white/20 rounded-full p-1 transition-colors"
        aria-label="Fermer"
      >
        <X className="w-5 h-5" />
      </button>
    </div>
  );
};

/**
 * ToastContainer Component
 * Manages multiple toast notifications
 */
export const ToastContainer = ({ toasts, removeToast }) => {
  return (
    <div className="fixed top-4 right-4 z-50 space-y-3">
      {toasts.map((toast) => (
        <NotificationToast
          key={toast.id}
          type={toast.type}
          message={toast.message}
          onClose={() => removeToast(toast.id)}
          duration={toast.duration}
        />
      ))}
    </div>
  );
};

/**
 * Custom hook for managing toasts
 */
export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const showToast = (message, type = 'info', duration = 5000) => {
    const id = Date.now() + Math.random();
    const newToast = { id, message, type, duration };
    setToasts(prev => [...prev, newToast]);
    return id;
  };

  const removeToast = (id) => {
    setToasts(prev => prev.filter(toast => toast.id !== id));
  };

  return { toasts, showToast, removeToast };
};

export default NotificationToast;
