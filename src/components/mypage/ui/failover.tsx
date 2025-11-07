import React from 'react';
import { TextButton } from '../../nol-design-system';

export const Failover = () => {
  const reservationItems = [
    { title: '국내숙소/레저/교통/해외패키지', hasBullet: true },
    { title: '공연/전시', hasBullet: false },
    { title: '항공', hasBullet: true },
    { title: '해외숙소', hasBullet: true },
    { title: '해외투어티켓', hasBullet: false },
    { title: '여행자 보험', hasBullet: false },
  ];

  return (
    <div className="rounded-xl bg-white p-4 shadow-sm w-full mt-4">
      {/* 메뉴 타이틀 */}
      <div className="mx-4 py-3 pl-1 text-sm font-medium w-full" style={{ color: 'oklch(.55 .03 256.802)' }}>예약 내역</div>
      {/* 메뉴 리스트 */}
      {reservationItems.map((item, index) => {
        return (
          <div key={index} className="py-3" style={{marginTop: '17px',marginBottom: '17px'}}>
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
               <div className="relative flex items-center text-left text-sm font-bold">
                {item.hasBullet && (
                  <div className="rounded-full bg-blue-500"></div>
                )}
                <div>{item.title}</div>
              </div>
            </TextButton>
          </div>
        );
      })}
    </div>
  );
};

