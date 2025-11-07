import React from 'react';
import type { ConvertedMypageMenuWidgetData, ConvertedMypageWidgetDataStatus } from '../../../../types/mypage';
import { EmptyState, TextButton, DotBadge } from '../../../nol-design-system';
import { AlertCircle } from 'lucide-react';

export interface MenuWidgetProps {
  data: ConvertedMypageMenuWidgetData;
  status: ConvertedMypageWidgetDataStatus;
}

export const MenuWidget: React.FC<MenuWidgetProps> = ({ data, status }) => {
  if (!data) {
    return null;
  }

  const { header, items } = data;

  if (!items || items.length === 0) {
    return null;
  }

  if (status === 'FAIL') {
    return (
      <div className="rounded-xl bg-white pb-2.5 pt-2 shadow-sm">
        <div className="flex w-full justify-center">
          <EmptyState
            icon={<AlertCircle className="size-18 text-gray-400" />}
            title="네트워크 연결 상태가 좋지 않아요"
            description="네트워크 연결 상태를 확인하고, 다시 시도해 주세요."
            buttons={[
              {
                content: '다시 시도하기',
                onClick: () => window.location.reload(),
              },
            ]}
          />
        </div>
      </div>
    );
  }

  return (
    <div className="rounded-xl bg-white pb-2.5 pt-2 shadow-sm">
      {/** 메뉴 타이틀 */}
      {header && <div className="mx-4 py-3 pl-1 text-gray-600 text-sm font-medium">{header}</div>}
      {/** 메뉴 리스트 */}
      {items.map((item, index) => {
        return (
          <div key={index} className="mx-4 my-0.5">
            <TextButton
              type="button"
              className="flex w-full items-center justify-between rounded-lg px-1 py-3 text-left"
              mobileSize="medium"
              pcSize="medium"
              weight="regular"
              onClick={() => {
                // 하드코딩된 링크 (동작 없음)
              }}
            >
              <span className="relative flex items-center gap-2 text-left">
                {item.isBullet && (
                  <div className="size-1.5 rounded-full bg-blue-500"></div>
                )}
                <span>{item.title}</span>
              </span>
              {item.subtitle && (
                <span className="text-right text-gray-500 text-xs">
                  {item.subtitle}
                </span>
              )}
            </TextButton>
          </div>
        );
      })}
    </div>
  );
};

