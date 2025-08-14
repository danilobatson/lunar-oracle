'use client';

import React from 'react';
import { AlertCircle, CheckCircle, XCircle, TrendingUp } from 'lucide-react';

interface QuantumAlertProps {
  type: 'success' | 'warning' | 'error' | 'prediction';
  title: string;
  description: string;
  confidence?: number;
  onClose?: () => void;
  showIcon?: boolean;
}

const QuantumAlert: React.FC<QuantumAlertProps> = ({
  type,
  title,
  description,
  confidence,
  onClose,
  showIcon = true
}) => {
  const typeStyles = {
    success: {
      bg: 'bg-emerald-950/50 border-emerald-800',
      text: 'text-emerald-200',
      icon: CheckCircle,
      iconColor: 'text-emerald-400'
    },
    warning: {
      bg: 'bg-amber-950/50 border-amber-800',
      text: 'text-amber-200',
      icon: AlertCircle,
      iconColor: 'text-amber-400'
    },
    error: {
      bg: 'bg-red-950/50 border-red-800',
      text: 'text-red-200',
      icon: XCircle,
      iconColor: 'text-red-400'
    },
    prediction: {
      bg: 'bg-purple-950/50 border-purple-800',
      text: 'text-purple-200',
      icon: TrendingUp,
      iconColor: 'text-purple-400'
    }
  };

  const style = typeStyles[type];
  const Icon = style.icon;

  return (
    <div className={`quantum-card ${style.bg} border p-4 rounded-lg mystical-glow`}>
      <div className="flex items-start gap-3">
        {showIcon && (
          <Icon className={`h-5 w-5 ${style.iconColor} mt-0.5 flex-shrink-0`} />
        )}
        <div className="flex-1">
          <div className="flex items-center justify-between">
            <h3 className={`font-semibold ${style.text}`}>
              🦉 {title}
            </h3>
            {confidence && (
              <span className="owl-badge text-xs">
                {confidence}% confidence
              </span>
            )}
          </div>
          <p className={`text-sm mt-1 ${style.text.replace('200', '300')}`}>
            {description}
          </p>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className={`${style.iconColor} hover:opacity-75 transition-opacity`}
          >
            <XCircle className="h-4 w-4" />
          </button>
        )}
      </div>
    </div>
  );
};

export default QuantumAlert;
