import React from 'react';
import qualityMapLogoFull from 'figma:asset/7a536606d3bd3953db71cadcf94b98714993a30c.png';
import qualityMapLogoIcon from 'figma:asset/40b4b7cff5804112217388ee080615bcec949282.png';

interface QualityMapAppLogoProps {
  className?: string;
  size?: 'sm' | 'md' | 'lg' | 'xl' | '5xl';
  showText?: boolean;
}

export function QualityMapAppLogo({ className = '', size = 'md', showText = true }: QualityMapAppLogoProps) {
  const logoSizeClasses = {
    sm: showText ? 'h-6' : 'h-6 w-6',
    md: showText ? 'h-8' : 'h-8 w-8',
    lg: showText ? 'h-10' : 'h-10 w-10',
    xl: showText ? 'h-14' : 'h-12 w-12',
    '5xl': showText ? 'h-64' : 'h-64 w-64'
  };

  return (
    <div className={`flex items-center ${className}`}>
      <img 
        src={showText ? qualityMapLogoFull : qualityMapLogoIcon}
        alt="QualityMap App"
        className={`${logoSizeClasses[size]} object-contain`}
      />
    </div>
  );
}
