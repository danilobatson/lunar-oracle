'use client';

import React from 'react';

interface QuantumBadgeProps {
  variant: 'recommendation' | 'confidence' | 'tier' | 'status';
  value: string;
  confidence?: number;
  glow?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

const QuantumBadge: React.FC<QuantumBadgeProps> = ({
  variant,
  value,
  confidence,
  glow = false,
  size = 'md'
}) => {
  const getRecommendationStyle = (rec: string) => {
    switch (rec.toUpperCase()) {
      case 'BUY': return 'rec-buy';
      case 'SELL': return 'rec-sell';
      case 'HOLD': return 'rec-hold';
      default: return 'owl-badge';
    }
  };

  const getConfidenceStyle = (conf: number) => {
    if (conf >= 90) return 'confidence-high';
    if (conf >= 70) return 'confidence-medium';
    return 'confidence-low';
  };

  const sizeClasses = {
    sm: 'text-xs px-2 py-1',
    md: 'text-sm px-3 py-1',
    lg: 'text-base px-4 py-2'
  };

  let badgeClass = `${sizeClasses[size]} rounded-full font-semibold`;

  if (variant === 'recommendation') {
    badgeClass += ` ${getRecommendationStyle(value)}`;
  } else if (variant === 'confidence' && confidence) {
    badgeClass += ` owl-badge ${getConfidenceStyle(confidence)}`;
  } else if (variant === 'tier') {
    badgeClass += ' quantum-gradient text-white';
  } else {
    badgeClass += ' owl-badge';
  }

  if (glow) {
    badgeClass += ' mystical-glow';
  }

  const displayText = variant === 'recommendation'
    ? `${value === 'BUY' ? '✅' : value === 'SELL' ? '❌' : '⏸️'} ${value}`
    : variant === 'confidence'
    ? `🎯 ${confidence}%`
    : variant === 'tier'
    ? `🦉 ${value}`
    : value;

  return (
    <span className={badgeClass}>
      {displayText}
    </span>
  );
};

export default QuantumBadge;
