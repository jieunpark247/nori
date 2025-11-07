import React from 'react';
import { cn } from '../ui/utils';

export interface DividerProps {
  type?: 'horizontal' | 'vertical';
  size?: 'small' | 'medium' | 'large' | 'extra_low';
  className?: string;
}

export const Divider: React.FC<DividerProps> = ({ type = 'horizontal', size = 'small', className }) => {
  const sizeMap = {
    small: type === 'horizontal' ? 'h-px' : 'w-px',
    medium: type === 'horizontal' ? 'h-0.5' : 'w-0.5',
    large: type === 'horizontal' ? 'h-1' : 'w-1',
    extra_low: type === 'horizontal' ? 'h-[0.5px]' : 'w-[0.5px]',
  };

  return (
    <div
      className={cn(
        'bg-gray-200',
        sizeMap[size],
        type === 'horizontal' ? 'w-full' : 'h-full',
        className
      )}
    />
  );
};

Divider.displayName = 'Divider';

