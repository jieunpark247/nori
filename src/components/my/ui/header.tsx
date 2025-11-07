import React from 'react';
import { cn, TopNavigation, CountBadge } from '../../nol-design-system';
import { ShoppingCart, Bell, ChevronRight } from 'lucide-react';

interface MobileHeaderProps {
  cartCount: number;
  notificationCount: number;
  className?: string;
}

const Header: React.FC<MobileHeaderProps> = ({ cartCount, notificationCount, className }) => {
  const [isScrolled, setIsScrolled] = React.useState(false);

  React.useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 0);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const leftButton = {
    'aria-label': '해우모',
    onClick: () => {
      // 해우모 클릭 시 동작
    },
  };

  const rightButtons = [
    {
      type: 'Icon' as const,
      button: {
        'aria-label': 'Notification',
        icon: <Bell className="text-gray-900" />,
        onClick: () => {
          location.href = '/member/mypage/push';
        },
      },
      badge: notificationCount > 0 ? (
        <CountBadge className="absolute right-1 top-1" size="medium">
          {notificationCount}
        </CountBadge>
      ) : undefined,
    },
    {
      type: 'Icon' as const,
      button: {
        'aria-label': 'Cart',
        icon: <ShoppingCart className="text-gray-900" />,
        onClick: () => {
          const cartLink = '/cart';
          location.href = cartLink;
        },
      },
      badge: cartCount ? (
        <CountBadge className="absolute right-1 top-1" size="medium">
          {cartCount}
        </CountBadge>
      ) : undefined,
    },
  ];

  return (
    <div
      className={cn(
        'fixed left-1/2 right-0 top-0 z-50 w-full -translate-x-1/2 bg-gray-50 pt-[env(safe-area-inset-top)] bg-gray-200'
      )}
    >
      <div className="mx-auto max-w-[768px]">
        <TopNavigation leftButton={leftButton} theme="transparent" pcType="pcLegacySize">
          <div className="flex items-center gap-2">
            <span className="text-gray-900 text-lg font-bold">해우모</span>
            <ChevronRight className="size-4 text-gray-600" />
          </div>
        </TopNavigation>
      </div>
    </div>
  );
};

export default Header;

