import React, { useState, useEffect } from 'react';
import type { ConvertedMypageResponse } from '../../types/mypage';
import { Gototop, cn } from '../nol-design-system';
import Header from './ui/header';
import Body from './ui/body';
import Gnb from './ui/gnb';
import { Failover } from './ui/failover';
import noriInfoImage from './ui/nori_info.svg';
// import { useRouter } from 'next/navigation';
import { ChevronRight } from 'lucide-react';


export interface MyPageProps {
  data: ConvertedMypageResponse;
}

export const MyPageInfo: React.FC<MyPageProps> = ({ data }) => {
  // const router = useRouter();
  
  // 화면 너비 상태 관리
  const [windowWidth, setWindowWidth] = useState(typeof window !== 'undefined' ? window.innerWidth : 0);

  useEffect(() => {
    const handleResize = () => {
      setWindowWidth(window.innerWidth);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // 하드코딩된 props
  const isAppDevice = false;

  /**
   * GNB 노출 여부
   * 노출 : 하이브리드 페이지
   * 미노출 : PC web or mobile web
   */
  const isApp = isAppDevice || false;

  const { widgets = [], navigationBar, errorStatusCode } = data || {};
  const { cart: cartCount = 0, push: notificationCount = 0 } = navigationBar || {};

  return (
    <div
      className={cn(
        'bg-gray-200  relative flex flex-col items-center pt-[env(safe-area-inset-top)] z-50'
      )}
      style= {{height: '100%vh'}}
    >
      <Header
        cartCount={cartCount}
        notificationCount={notificationCount}
        className={errorStatusCode ? 'bg-white' : ''}
      />
       <Body hasGnb={!isApp} widgets={widgets} />

    <div className="rounded-12 pb-10 pt-8 px-4 w-full">
       <div className="relative mt-[16px] w-full cursor-pointer overflow-hidden rounded-12"  onClick={(e) => {
     // 세션, 로컬 스토리지 전체 remove 
      e.preventDefault();
      e.stopPropagation();
     sessionStorage.clear();
     localStorage.clear();
     alert('완료')
    }}>
        <img
          src="https://image6.yanolja.com/cx-ydm/dGHDW7Vzun2JzZ65"
          alt="멤버십 아이콘1"
          className="w-full object-cover"
          style={windowWidth < 700 ? { height: '52px' } : undefined}
        />
      </div>
      {/** 자산, 기업회원, 후기, 쿠폰 */}

      {/** 여행일정 */}
      <div className="mt-5 gap-x-12 rounded-12 bg-white px-16 py-12 shadow-1">
        <div
          className="flex min-h-36 w-full cursor-pointer items-center px-4 py-5"
          onClick={() => {
            window.location.href = '/nori/plan';
          }}>
          <div className="flex flex-1 flex-col gap-y-2">
            <span className="text-gray-900 text-[20px] font-bold">내 여행</span>
          </div>
          <div className="flex items-center text-gray-500 text-sm">
            일정 리스트
            <ChevronRight className="ml-2 h-4 w-4" />
          </div>
        </div>
        <div className="mx-4 relative w-full cursor-pointer overflow-hidden rounded-12 pb-4"  onClick={() => {
            window.location.href = '/nori';
          }}>
          <img src={noriInfoImage} alt="AI 노리 아이콘" className="w-full object-cover px-4" />
        </div>
      </div>
      </div>
      <div className="w-full px-4">
        <Failover/>
      </div>
      {/* {errorStatusCode ? <Failover errorStatusCode={errorStatusCode} /> : <Body hasGnb={!isApp} widgets={widgets} />}
      {!isApp ? <Gnb /> : null}
      <Gototop
        hasGnb={!isApp}
        className="max-w-none legacy-pc:bottom-80 pc:bottom-80 [&>div]:bottom-[env(safe-area-inset-bottom)]"
      /> */}
    </div>
  );
};

