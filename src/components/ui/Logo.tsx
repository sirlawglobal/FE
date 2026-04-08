import React from 'react';
import { Link } from 'react-router-dom';

interface LogoProps {
  className?: string;
  showText?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Logo: React.FC<LogoProps> = ({ 
  className = '', 
  showText = true, 
  size = 'md' 
}) => {
  const sizeClasses = {
    sm: 'h-8',
    md: 'h-10',
    lg: 'h-14'
  };

  return (
    <Link to="/" className={`flex items-center gap-3 group ${className}`}>
      <div className={`${sizeClasses[size]} aspect-square relative overflow-hidden rounded-xl bg-primary-teal/5 border border-primary-teal/10 p-1.5 transition-transform group-hover:scale-105`}>
        <img 
          src="/logo.jpg" 
          alt="TalentFlow Logo" 
          className="w-full h-full object-contain"
        />
      </div>
      {showText && (
        <span className="text-xl font-display font-bold text-primary-teal tracking-tight">
          TalentFlow
        </span>
      )}
    </Link>
  );
};

export default Logo;
