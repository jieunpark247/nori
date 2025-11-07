import React from 'react';
import { cn } from '../ui/utils';

export interface CountBadgeProps {
  className?: string;
  children?: React.ReactNode;
  size?: 'small' | 'medium' | 'large';
}

export const CountBadge: React.FC<CountBadgeProps> = ({ className, children, size = 'medium' }) => {
  const sizeMap = {
    small: 'min-w-[16px] h-4 px-1 text-[10px]',
    medium: 'min-w-[20px] h-5 px-1.5 text-xs',
    large: 'min-w-[24px] h-6 px-2 text-sm',
  };

  return (
    <div
      className={cn(
        'absolute flex items-center justify-center rounded-full bg-red-500 text-white font-bold',
        sizeMap[size],
        className
      )}
    >
      {children}
    </div>
  );
};

CountBadge.displayName = 'CountBadge';

export interface DotBadgeProps {
  className?: string;
  style?: React.CSSProperties;
}

export const DotBadge: React.FC<DotBadgeProps> = ({ className, style }) => {
  return (
    <div
      className={cn('absolute top-0 right-0 size-2 rounded-full bg-red-500', className)}
      style={style}
    />
  );
};

DotBadge.displayName = 'DotBadge';

