import React from 'react';
import { BottomNavigation, TabButton, cn } from '../../nol-design-system';
import { Search, Home, Heart, User, MapPin } from 'lucide-react';

export default function Gnb({ className }: { className?: string }) {
  const isMypage = window.location.pathname === '/mypage';

  const handleClickMy = (e: React.MouseEvent<HTMLAnchorElement>) => {
    e.preventDefault();

    if (isMypage) {
      window?.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      window.location.href = '/mypage';
    }
  };

  return (
    <div className={cn('fixed bottom-0 left-0 w-full z-50 bg-white', className)}>
      <BottomNavigation>
        <TabButton icon={<Search />} activeIcon={<Search />} title="검색" link="/search" aria-label="검색" />
        <TabButton
          activeIcon={<MapPin />}
          icon={<MapPin />}
          title="내주변"
          link="/local/list?type=around&shortcut=recommend"
          aria-label="내주변"
        />
        <TabButton icon={<Home />} activeIcon={<Home />} title="홈" link="/" aria-label="홈" />
        <TabButton activeIcon={<Heart />} icon={<Heart />} title="찜" link="/wishlist" aria-label="찜" />
        <TabButton
          activeIcon={<User />}
          icon={<User />}
          title="마이"
          link="/mypage"
          aria-label="마이"
          isActive={isMypage}
          onClick={handleClickMy}
        />
      </BottomNavigation>
    </div>
  );
}

