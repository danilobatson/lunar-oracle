'use client';

import React from 'react';

interface QuantumOwlLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  animate?: boolean;
  showText?: boolean;
}

const QuantumOwlLogo: React.FC<QuantumOwlLogoProps> = ({
  size = 'md',
  animate = false,
  showText = true
}) => {
  const sizeClasses = {
    sm: 'w-8 h-8',
    md: 'w-12 h-12',
    lg: 'w-16 h-16',
    xl: 'w-24 h-24'
  };

  const textSizes = {
    sm: 'text-lg',
    md: 'text-xl',
    lg: 'text-2xl',
    xl: 'text-4xl'
  };

  return (
    <div className="flex items-center gap-3">
      <div className={`${sizeClasses[size]} ${animate ? 'mystical-float' : ''}`}>
        <div className="w-full h-full quantum-gradient rounded-full flex items-center justify-center mystical-glow">
          <span className="text-white font-bold text-lg">🦉</span>
        </div>
      </div>
      {showText && (
        <div className="flex flex-col">
          <h1 className={`${textSizes[size]} font-bold quantum-text`}>
            NEXUS
          </h1>
          <p className="text-xs text-ghost-text -mt-1">
            The Quantum Owl
          </p>
        </div>
      )}
    </div>
  );
};

export default QuantumOwlLogo;
