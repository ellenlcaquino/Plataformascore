import React from 'react';

interface QualityMapLogoProps {
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
  className?: string;
}

export function QualityMapLogo({ size = 'md', showText = false, className = '' }: QualityMapLogoProps) {
  const sizeClasses = {
    sm: 'h-6 w-6',
    md: 'h-8 w-8',
    lg: 'h-10 w-10',
    xl: 'h-12 w-12'
  };

  const textSizeClasses = {
    sm: 'text-sm',
    md: 'text-base',
    lg: 'text-lg',
    xl: 'text-xl'
  };

  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className={`${sizeClasses[size]} relative flex-shrink-0`}>
        <svg viewBox="0 0 48 48" fill="none" xmlns="http://www.w3.org/2000/svg">
          {/* Gradient definitions */}
          <defs>
            <linearGradient id="qualitymap-gradient-1" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#10b981" />
              <stop offset="100%" stopColor="#059669" />
            </linearGradient>
            <linearGradient id="qualitymap-gradient-2" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#3b82f6" />
              <stop offset="100%" stopColor="#2563eb" />
            </linearGradient>
            <linearGradient id="qualitymap-gradient-3" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
          </defs>
          
          {/* Map pin base - representing quality tracking */}
          <path
            d="M24 44C24 44 38 30 38 18C38 10.268 31.732 4 24 4C16.268 4 10 10.268 10 18C10 30 24 44 24 44Z"
            fill="url(#qualitymap-gradient-2)"
            opacity="0.9"
          />
          
          {/* Inner circle - chart representation */}
          <circle
            cx="24"
            cy="18"
            r="8"
            fill="white"
            opacity="0.95"
          />
          
          {/* Chart bars inside */}
          <g opacity="0.9">
            {/* Bar 1 - smallest */}
            <rect
              x="18"
              y="21"
              width="2.5"
              height="4"
              rx="0.5"
              fill="url(#qualitymap-gradient-1)"
            />
            {/* Bar 2 - medium */}
            <rect
              x="22.5"
              y="18"
              width="2.5"
              height="7"
              rx="0.5"
              fill="url(#qualitymap-gradient-2)"
            />
            {/* Bar 3 - tallest */}
            <rect
              x="27"
              y="15"
              width="2.5"
              height="10"
              rx="0.5"
              fill="url(#qualitymap-gradient-3)"
            />
          </g>
          
          {/* Sparkle/star accent for "quality" */}
          <g transform="translate(32, 10)">
            <path
              d="M0,-3 L0.8,-0.8 L3,0 L0.8,0.8 L0,3 L-0.8,0.8 L-3,0 L-0.8,-0.8 Z"
              fill="#fbbf24"
              opacity="0.9"
            />
          </g>
        </svg>
      </div>
      
      {showText && (
        <div className="flex flex-col">
          <span className={`${textSizeClasses[size]} font-bold bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent`}>
            QualityMap
          </span>
          <span className="text-xs text-muted-foreground -mt-1">
            Calculadoras
          </span>
        </div>
      )}
    </div>
  );
}
