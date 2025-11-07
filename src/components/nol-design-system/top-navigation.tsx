import React from 'react';
import { cn } from '../ui/utils';
import { ArrowLeft, ShoppingCart, Bell } from 'lucide-react';
import { CountBadge } from './badges';

export interface TopNavigationRightButtonProps {
  type: 'Text' | 'Icon';
  button: {
    'aria-label': string;
    icon?: JSX.Element;
    onClick: () => void;
    href?: string;
  };
  badge?: JSX.Element | null;
  text?: string;
}

export interface TopNavigationProps {
  title?: string;
  leftButton: {
    'aria-label': string;
    onClick: () => void;
    href?: string;
  };
  rightButtons?: TopNavigationRightButtonProps[];
  theme?: 'ghost' | 'transparent';
  pcType?: 'pcSize' | 'pcLegacySize';
  className?: string;
  children?: JSX.Element | null;
}

export const TopNavigation = ({
  title = '',
  leftButton,
  rightButtons,
  theme,
  pcType = 'pcSize',
  className,
  children,
}) => {
  const isTransparent = theme === 'transparent';
  const isGhost = theme === 'ghost';

  return (
    <div
      className={cn(
        'flex min-h-[52px] flex-row items-center gap-2 bg-white px-1.5 py-1',
        {
          'min-h-[76px] gap-4 px-2.5': pcType === 'pcSize',
          'bg-transparent': isTransparent || isGhost,
        },
        className
      )}
    >
      <div className="flex w-full items-center gap-2">
        <button
          aria-label={leftButton['aria-label']}
          onClick={leftButton.onClick}
          className="flex size-10 items-center justify-center rounded-lg hover:bg-gray-100"
        >
          <ArrowLeft className="size-5" />
        </button>
        {children || <span className="flex-1 text-center text-lg font-bold text-gray-900">{title}</span>}
        <div className="flex items-center gap-1">
          {rightButtons?.map((rightButton, index) => (
            <div key={index} className="relative">
              <button
                aria-label={rightButton.button['aria-label']}
                onClick={rightButton.button.onClick}
                className="flex size-10 items-center justify-center rounded-lg hover:bg-gray-100"
              >
                {rightButton.button.icon || (rightButton.type === 'Icon' ? <Bell className="size-5" /> : null)}
              </button>
              {rightButton.badge}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

TopNavigation.displayName = 'TopNavigation';

