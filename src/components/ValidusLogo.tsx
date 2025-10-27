import React from 'react';

interface ValidusLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

const sizeClasses = {
  sm: 'h-6 w-6',
  md: 'h-8 w-8', 
  lg: 'h-12 w-12',
  xl: 'h-16 w-16'
};

const textSizeClasses = {
  sm: 'text-sm',
  md: 'text-base',
  lg: 'text-lg', 
  xl: 'text-xl'
};

const subtextSizeClasses = {
  sm: 'text-xs',
  md: 'text-sm',
  lg: 'text-base', 
  xl: 'text-lg'
};

// Logo Icon Component - Blue circle with white target/bullseye pattern
function ValidusIcon({ size }: { size: 'sm' | 'md' | 'lg' | 'xl' }) {
  return (
    <div className={`${sizeClasses[size]} bg-blue-600 rounded-lg flex items-center justify-center flex-shrink-0`}>
      <svg
        className="w-2/3 h-2/3"
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Outer circle */}
        <circle
          cx="12"
          cy="12"
          r="10"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Middle circle */}
        <circle
          cx="12"
          cy="12"
          r="6"
          stroke="white"
          strokeWidth="1.5"
          fill="none"
        />
        {/* Inner circle */}
        <circle
          cx="12"
          cy="12"
          r="2"
          fill="white"
        />
      </svg>
    </div>
  );
}

export function ValidusLogo({ size = 'md', showText = true, className = '' }: ValidusLogoProps) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <ValidusIcon size={size} />
      {showText && (
        <div className="flex flex-col">
          <div className={`font-bold text-gray-900 ${textSizeClasses[size]}`}>
            Validus
          </div>
          <div className={`text-gray-600 font-medium ${subtextSizeClasses[size]}`}>
            QualityScore Framework
          </div>
        </div>
      )}
    </div>
  );
}