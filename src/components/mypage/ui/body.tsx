import React from 'react';
import type { ConvertedMypageWidget } from '../../../types/mypage';
import { cn, TextButton, Divider } from '../../nol-design-system';
import WidgetOrdering from './widget-ordering';
import { FileStack, ChevronRight } from 'lucide-react';

interface BodyProps {
  hasGnb: boolean;
  widgets: ConvertedMypageWidget[];
}

const Body: React.FC<BodyProps> = ({ hasGnb =true, widgets }) => {
  return (
    <div
      style={{marginTop: '70px', marginBottom: '20px'}}
      className={
        'flex min-h-screen w-full max-w-[768px] flex-col gap-y-4 px-4 pt-52'
      }
    >
      {/* NOL Universe 카드 */}
      <div className="rounded-xl bg-white shadow-sm">
        {/* 헤더 */}
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-2">
            <FileStack className="size-5 text-amber-700" />
            <span className="text-gray-900 font-bold">놀유니버스</span>
          </div>
          <div
            className="flex cursor-pointer items-center gap-1 text-sm text-gray-600"
            onClick={() => {
              // 쿠폰팩 확인
            }}
          >
            <span>이달의 쿠폰팩 확인</span>
            <ChevronRight className="size-4 text-pink-500" />
          </div>
        </div>

        {/* 자산 표시 섹션 */}
        <div className="flex flex-col gap-y-4 px-4 pb-4 pt-4">
          {/* NOL 머니, NOL 포인트, NOL 코인 */}
          <div className="flex py-3">
            <div className="flex w-full flex-col items-center gap-x-2 px-1">
              <span className="block h-5 max-w-full items-center truncate text-indigo-600 text-base font-bold">
                10,000
              </span>
              <span className="mt-1 text-center text-gray-900 text-sm">NOL 머니</span>
            </div>
            <div className="flex w-full flex-col items-center gap-x-2 px-1">
              <span className="block h-5 max-w-full items-center truncate text-indigo-600 text-base font-bold">
                3,000
              </span>
              <span className="mt-1 text-center text-gray-900 text-sm">NOL 포인트</span>
            </div>
            <div className="flex w-full flex-col items-center gap-x-2 px-1">
              <span className="block h-5 max-w-full items-center truncate text-indigo-600 text-base font-bold">
                2,300
              </span>
              <span className="mt-1 text-center text-gray-900 text-sm">NOL 코인</span>
            </div>
          </div>

          {/* 하단 네비게이션 바 */}
          <div className="flex h-10 w-full items-center rounded-lg border border-gray-200 mt-5 px-8 justify-between
">
            <div className="flex w-[50%] items-center">
              <TextButton
                pcSize="medium"
                mobileSize="medium"
                weight="bold"
                className="inline-flex w-full gap-1 whitespace-nowrap"
                onClick={() => {
                  // 내 후기
                }}
              >
                내 후기
              </TextButton>
            </div>
            <Divider size="medium" className="h-5 w-px" />
            <div className="flex w-[50%] items-center">
              <TextButton
                pcSize="medium"
                mobileSize="medium"
                weight="bold"
                className="inline-flex w-full gap-1 whitespace-nowrap px-3"
                onClick={() => {
                  // 쿠폰
                }}
              >
                쿠폰 <span className="truncate text-indigo-600">7</span>
              </TextButton>
            </div>
          </div>
        </div>
      </div>


    </div>
  );
};

export default Body;

