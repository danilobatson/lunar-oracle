'use client';

import React from 'react';

interface MysticalLoadingProps {
  message?: string;
  size?: 'sm' | 'md' | 'lg';
}

const MysticalLoading: React.FC<MysticalLoadingProps> = ({
  message = "The Owl peers into the quantum void...",
  size = 'md'
}) => {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-8 h-8',
    lg: 'w-12 h-12'
  };

  return (
    <div className="flex flex-col items-center justify-center p-8 space-y-4">
      <div className={`${sizeClasses[size]} quantum-gradient rounded-full mystical-float quantum-pulse`}>
        <div className="w-full h-full flex items-center justify-center">
          <span className="text-white text-lg">🦉</span>
        </div>
      </div>
      <p className="text-ghost-text text-sm text-center">{message}</p>
      <div className="flex space-x-1">
        <div className="w-2 h-2 bg-quantum-purple rounded-full animate-bounce"></div>
        <div className="w-2 h-2 bg-cosmic-blue rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
        <div className="w-2 h-2 bg-ethereal-cyan rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
      </div>
    </div>
  );
};

export default MysticalLoading;
