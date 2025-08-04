import { ReactNode } from 'react';

interface BadgeProps {
  children: ReactNode;
  color?: 'a' | 'b' | 'c' | 'd' | 'e' | 'f' | 'g' | 'j' | 'l';
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

export default function Badge({ children, color = 'a', size = 'md', className = '' }: BadgeProps) {
  const sizeClasses = {
    sm: 'h-6 w-6 text-xs',
    md: 'h-7 w-7 text-[13px]',
    lg: 'h-8 w-8 text-sm'
  };

  const colorClasses = {
    a: 'bg-subway-a',
    b: 'bg-subway-b',
    c: 'bg-subway-c',
    d: 'bg-subway-d',
    e: 'bg-subway-e',
    f: 'bg-subway-f',
    g: 'bg-subway-g',
    j: 'bg-subway-j',
    l: 'bg-subway-l'
  };

  return (
    <span 
      className={`
        inline-flex items-center justify-center rounded-full 
        ${colorClasses[color]} text-white font-bold
        ${sizeClasses[size]}
        ${className}
      `}
    >
      {children}
    </span>
  );
} 