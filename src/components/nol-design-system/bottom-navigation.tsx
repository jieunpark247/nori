import React, { ReactElement, cloneElement, useState, useCallback } from 'react';
import { cn } from '../ui/utils';

export interface TabButtonProps extends React.AnchorHTMLAttributes<HTMLAnchorElement> {
  icon?: ReactElement;
  activeIcon?: ReactElement;
  title?: string;
  link?: string;
  isActive?: boolean;
  badge?: ReactElement | null;
}

export const TabButton = React.forwardRef<HTMLAnchorElement, TabButtonProps>(
  ({ icon, activeIcon, title = '', link = '', isActive = false, badge, ...rest }, ref) => {
    const Icon = isActive && activeIcon ? activeIcon : icon;

    return (
      <a
        className="relative flex h-14 items-center justify-center pb-1"
        href={link || undefined}
        ref={ref}
        role="button"
        title={title}
        {...rest}
      >
        <div className="flex w-full flex-col items-center overflow-hidden rounded-xl active:bg-opacity-5">
          <div className="m-auto flex size-6 items-center justify-center pb-1">
            {Icon && React.cloneElement(Icon, { className: cn('transition-all duration-100', Icon.props.className) })}
          </div>
          <span className={cn('text-nowrap text-[10px]', isActive && activeIcon ? 'font-bold' : 'font-normal')}>
            {title}
          </span>
        </div>
        {badge}
      </a>
    );
  }
);

TabButton.displayName = 'TabButton';

export interface BottomNavigationProps {
  onChange?: (event: React.MouseEvent<HTMLElement>, index: number) => void;
  children?: ReactElement<TabButtonProps> | ReactElement<TabButtonProps>[];
}

export const BottomNavigation = React.forwardRef<HTMLDivElement, BottomNavigationProps>(
  ({ children, onChange }, ref) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(-1);

    const handleClick = (index: number, childOnClick?: React.MouseEventHandler) => {
      return (event: React.MouseEvent<HTMLElement>) => {
        childOnClick?.(event);
        onChange?.(event, index);
        setTimeout(() => {
          setSelectedIndex((prev) => (prev === index ? -1 : index));
        }, 100);
      };
    };

    return (
      <>
        <div className="flex h-px border-t border-t-black/10" />
        <nav
          className="mx-auto grid w-full max-w-[768px] grid-cols-[repeat(auto-fit,minmax(0,1fr))] justify-center gap-0 bg-white px-2 pb-[env(safe-area-inset-bottom)]"
          ref={ref}
        >
          {React.Children.map(children, (child, index) =>
            child
              ? cloneElement(child, {
                  ...child.props,
                  onClick: handleClick(index, child.props.onClick),
                  isActive: child.props.isActive ? true : selectedIndex === index,
                })
              : null
          )}
        </nav>
      </>
    );
  }
);

BottomNavigation.displayName = 'BottomNavigation';

