import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'warning' | 'info';

export interface ToastProps {
  id: string;
  type: ToastType;
  title: string;
  message?: string;
  duration?: number;
  onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({
  id,
  type,
  title,
  message,
  duration = 5000,
  onClose
}) => {
  useEffect(() => {
    const timer = setTimeout(() => {
      onClose(id);
    }, duration);

    return () => clearTimeout(timer);
  }, [id, duration, onClose]);

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5" />;
      case 'error':
        return <AlertCircle className="h-5 w-5" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5" />;
      case 'info':
        return <Info className="h-5 w-5" />;
      default:
        return <Info className="h-5 w-5" />;
    }
  };

  const getColors = () => {
    switch (type) {
      case 'success':
        return {
          bg: 'bg-green-50',
          border: 'border-green-200',
          iconBg: 'bg-green-100',
          iconColor: 'text-green-600',
          titleColor: 'text-green-900',
          messageColor: 'text-green-700',
          closeButton: 'text-green-400 hover:text-green-600'
        };
      case 'error':
        return {
          bg: 'bg-red-50',
          border: 'border-red-200',
          iconBg: 'bg-red-100',
          iconColor: 'text-red-600',
          titleColor: 'text-red-900',
          messageColor: 'text-red-700',
          closeButton: 'text-red-400 hover:text-red-600'
        };
      case 'warning':
        return {
          bg: 'bg-amber-50',
          border: 'border-amber-200',
          iconBg: 'bg-amber-100',
          iconColor: 'text-amber-600',
          titleColor: 'text-amber-900',
          messageColor: 'text-amber-700',
          closeButton: 'text-amber-400 hover:text-amber-600'
        };
      case 'info':
      default:
        return {
          bg: 'bg-blue-50',
          border: 'border-blue-200',
          iconBg: 'bg-blue-100',
          iconColor: 'text-blue-600',
          titleColor: 'text-blue-900',
          messageColor: 'text-blue-700',
          closeButton: 'text-blue-400 hover:text-blue-600'
        };
    }
  };

  const colors = getColors();

  return (
    <div
      className={`
        ${colors.bg} ${colors.border}
        rounded-lg border shadow-lg p-4 mb-3
        transform transition-all duration-300
        animate-in slide-in-from-right-5 fade-in
        hover:shadow-xl
        max-w-sm w-full
      `}
    >
      <div className="flex items-start">
        {/* Icon */}
        <div className={`flex-shrink-0 ${colors.iconBg} rounded-full p-1`}>
          <div className={colors.iconColor}>
            {getIcon()}
          </div>
        </div>

        {/* Content */}
        <div className="ml-3 flex-1">
          <div className="flex items-center justify-between">
            <h4 className={`text-sm font-semibold ${colors.titleColor}`}>
              {title}
            </h4>
            <button
              onClick={() => onClose(id)}
              className={`flex-shrink-0 ml-2 ${colors.closeButton} transition-colors`}
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          {message && (
            <p className={`mt-1 text-sm ${colors.messageColor}`}>
              {message}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default Toast;