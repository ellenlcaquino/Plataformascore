import React from 'react';
import qoraLogoFull from 'figma:asset/d5ef8c213f83fbce8f260cef04b13a1d18b374d9.png';
import qoraLogoIcon from 'figma:asset/1d7dbd4edec0abe7748935d6ff4472bd4dcca71c.png';

interface QoraLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl';
  showText?: boolean;
}

export function QoraLogo({ className = '', size = 'md', showText = true }: QoraLogoProps) {
  const logoSizeClasses = {
    sm: showText ? 'h-6' : 'h-6 w-6',
    md: showText ? 'h-8' : 'h-8 w-8',
    lg: showText ? 'h-12' : 'h-12 w-12',
    xl: showText ? 'h-16' : 'h-16 w-16'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={showText ? qoraLogoFull : qoraLogoIcon}
        alt="QORA"
        className={`${logoSizeClasses[size]} object-contain`}
      />
    </div>
  );
}