import React from 'react';
import type { ConvertedMypageWidget } from '../../../types/mypage';
import { UserInfoWidget } from './widgets/user-info-widget';
import { MenuWidget } from './widgets/menu-widget';

interface WidgetOrderingProps {
  widgets?: ConvertedMypageWidget[];
}

export default function WidgetOrdering({ widgets = [] }: WidgetOrderingProps) {
  if (!widgets || widgets.length === 0) {
    return null;
  }

  return (
    <>
      {widgets.map((item, idx) => {
        if (!item || !item.data || !item.type) {
          return null;
        }

        if (item.type === 'YDM__NOL_MY_USER_INFORMATION__V1') {
          return (
            <UserInfoWidget
              key={idx}
              data={item.data as any}
              status={item.status}
            />
          );
        }

        if (
          item.type === 'YDM__NOL_MY_CUSTOMER_SERVICE__V1' ||
          item.type === 'YDM__NOL_MY_ETC__V1' ||
          item.type === 'YDM__NOL_MY_EVENT__V1' ||
          item.type === 'YDM__NOL_MY_RESERVATION_LIST__V1' ||
          item.type === 'YDM__NOL_MY_SERVICE_MANAGEMENT__V1'
        ) {
          return (
            <MenuWidget
              key={idx}
              data={item.data as any}
              status={item.status}
            />
          );
        }

        return null;
      })}
    </>
  );
}

