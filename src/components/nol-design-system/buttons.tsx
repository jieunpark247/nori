import React, { ReactElement, cloneElement } from 'react';
import { cn } from '../ui/utils';
import { Button } from '../ui/button';

export interface RectangleButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: 'filled_primary' | 'outlined_basic' | 'outlined_secondary';
  size?: 'small' | 'medium' | 'large' | { mobile?: 'small' | 'medium' | 'large'; pc?: 'small' | 'medium' | 'large' };
  weight?: 'regular' | 'bold';
  icon?: ReactElement;
  direction?: 'left' | 'right';
  fullWidth?: boolean;
}

export const RectangleButton = React.forwardRef<HTMLButtonElement, RectangleButtonProps>(
  (
    {
      theme = 'filled_primary',
      size = 'medium',
      weight = 'bold',
      icon,
      direction = 'left',
      fullWidth = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const sizeClass = typeof size === 'object' ? size.mobile || 'medium' : size;
    const sizeMap = {
      small: 'px-3 py-1.5 text-sm',
      medium: 'px-4 py-2 text-base',
      large: 'px-6 py-3 text-lg',
    };

    const themeMap = {
      filled_primary: 'bg-indigo-600 text-white hover:bg-indigo-700',
      outlined_basic: 'border border-gray-300 text-gray-700 hover:bg-gray-50',
      outlined_secondary: 'border border-indigo-600 text-indigo-600 hover:bg-indigo-50',
    };

    const weightClass = weight === 'bold' ? 'font-bold' : 'font-normal';

    const iconElement = icon
      ? cloneElement(icon, {
          className: cn('size-4', direction === 'left' ? 'mr-2' : 'ml-2', icon.props.className),
        })
      : null;

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center justify-center rounded-lg transition-colors',
          sizeMap[sizeClass],
          themeMap[theme],
          weightClass,
          fullWidth && 'w-full',
          className
        )}
        {...props}
      >
        {direction === 'left' && iconElement}
        {children}
        {direction === 'right' && iconElement}
      </button>
    );
  }
);

RectangleButton.displayName = 'RectangleButton';

export interface TextButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  theme?: 'default' | 'primary';
  mobileSize?: 'small' | 'medium' | 'large';
  pcSize?: 'small' | 'medium' | 'large';
  weight?: 'regular' | 'bold';
  icon?: ReactElement;
  transparent?: boolean;
}

export const TextButton = React.forwardRef<HTMLButtonElement, TextButtonProps>(
  (
    {
      theme = 'default',
      mobileSize = 'medium',
      pcSize = 'large',
      weight = 'regular',
      icon,
      transparent = false,
      className,
      children,
      ...props
    },
    ref
  ) => {
    const sizeMap = {
      small: 'text-sm',
      medium: 'text-base',
      large: 'text-lg',
    };

    const themeMap = {
      default: 'text-gray-700 hover:text-gray-900',
      primary: 'text-indigo-600 hover:text-indigo-700',
    };

    const weightClass = weight === 'bold' ? 'font-bold' : 'font-normal';

    const iconElement = icon
      ? cloneElement(icon, {
          className: cn('size-4 ml-2', icon.props.className),
        })
      : null;

    return (
      <button
        ref={ref}
        className={cn(
          'inline-flex items-center transition-colors',
          sizeMap[mobileSize],
          themeMap[theme],
          weightClass,
          transparent && 'bg-transparent',
          className
        )}
        {...props}
      >
        {children}
        {iconElement}
      </button>
    );
  }
);

TextButton.displayName = 'TextButton';

