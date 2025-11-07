import React, { useEffect, useState, RefObject } from 'react';
import { cn } from '../ui/utils';
import { ArrowUp } from 'lucide-react';

export interface GototopProps {
  top?: number;
  scrollBehavior?: 'auto' | 'smooth';
  type?: 'translate' | 'fade';
  targetRef?: RefObject<HTMLElement | null>;
  className?: string;
  hasGnb?: boolean;
  onClick?: () => void;
}

export const Gototop: React.FC<GototopProps> = ({
  top = 150,
  scrollBehavior = 'smooth',
  type = 'translate',
  targetRef,
  onClick,
  className,
  hasGnb = false,
}) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const target = targetRef?.current || window;

    const handleScroll = () => {
      const scrollPosition = targetRef?.current?.scrollTop ?? window.scrollY;
      setIsVisible(scrollPosition > top);
    };

    // Throttle을 간단하게 구현
    let ticking = false;
    const throttledScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    handleScroll();
    target.addEventListener('scroll', throttledScroll, { passive: true });

    return () => {
      target.removeEventListener('scroll', throttledScroll);
    };
  }, [top, targetRef]);

  const handleClick = (): void => {
    (targetRef?.current || window).scrollTo({ top: 0, behavior: scrollBehavior });
    onClick?.();
  };

  return (
    <div
      className={cn(
        'fixed left-1/2 w-full max-w-[768px] -translate-x-1/2 transition-all duration-300 z-50',
        isVisible
          ? `${type === 'translate' && 'translate-y-0'} opacity-100`
          : `${type === 'translate' && 'translate-y-full'} opacity-0`,
        hasGnb ? 'bottom-20' : 'bottom-4',
        'pc:bottom-6 pc:max-w-none',
        className
      )}
    >
      <div className="absolute bottom-0 right-4 pc:right-6">
        <button
          onClick={handleClick}
          className="flex size-12 items-center justify-center rounded-full bg-indigo-600 text-white shadow-lg hover:bg-indigo-700 transition-colors"
        >
          <ArrowUp className="size-5" />
        </button>
      </div>
    </div>
  );
};

Gototop.displayName = 'Gototop';

