import type { ConvertedMypageResponse, MypageUserInfoWidgetData } from '../../types/mypage';

// 하드코딩된 mypage 데이터
export const mockMypageData: ConvertedMypageResponse = {
  isLogin: true,
  navigationBar: {
    cart: 5,
    push: 0,
  },
  widgets: [
    {
      type: 'YDM__NOL_MY_USER_INFORMATION__V1',
      status: 'SUCCESS',
      target: 'MY_PAGE',
      data: {
        user: {
          nickname: {
            title: '홍길동',
            action: {
              app: 'yanolja://profile',
              web: '/member/profile',
            },
            serverLogMeta: {},
          },
          shortcut: {
            title: '계정 관리',
            action: {
              app: 'yanolja://account',
              web: '/member/account',
            },
            serverLogMeta: {},
          },
        },
        asset: {
          items: [
            {
              title: 'NOL 머니',
              type: 'NOL_MONEY',
              status: 'SUCCESS',
              data: {
                amount: '3,000',
                action: {
                  app: 'yanolja://nol-money',
                  web: '/member/nol-money',
                },
                replacementText: null,
                notice: null,
                tooltip: null,
              },
              retry: null,
              serverLogMeta: {},
            },
            {
              title: 'NOL 포인트',
              type: 'NOL_POINT',
              status: 'SUCCESS',
              data: {
                amount: '3,000',
                action: {
                  app: 'yanolja://point',
                  web: '/member/point',
                },
                replacementText: null,
                notice: null,
                tooltip: null,
              },
              retry: null,
              serverLogMeta: {},
            },
            {
              title: 'NOL 코인',
              type: 'NOL_COIN',
              status: 'SUCCESS',
              data: {
                amount: '3,000',
                action: {
                  app: 'yanolja://coin',
                  web: '/member/coin',
                },
                replacementText: null,
                notice: null,
                tooltip: null,
              },
              retry: null,
              serverLogMeta: {},
            },
          ],
          shortcuts: [
            {
              title: '내 후기',
              type: 'REVIEW',
              status: 'SUCCESS',
              subtitle: '',
              action: {
                app: 'yanolja://review',
                web: '/member/review',
              },
              retry: null,
              serverLogMeta: {},
            },
            {
              title: '쿠폰',
              type: 'COUPON',
              status: 'SUCCESS',
              subtitle: '7',
              action: {
                app: 'yanolja://coupon',
                web: '/member/coupon',
              },
              retry: null,
              serverLogMeta: {},
            },
          ],
        },
        corporate: null,
        segmentedBanner: null,
        membershipBanner: {
          action: {
            app: 'yanolja://membership',
            web: '/member/membership',
          },
          description: '회원님은 Gold 특별가로 이용 중이에요',
          iconUrl: 'https://yaimg.yanolja.com/joy/sunny/static/images/icon-goldclass.png',
          memberClassImageUrl: 'https://yaimg.yanolja.com/joy/sunny/static/images/gold-class-badge.png',
          serverLogMeta: {},
        },
        serverLogMeta: {},
      } as MypageUserInfoWidgetData,
    },
    {
      type: 'YDM__NOL_MY_CUSTOMER_SERVICE__V1',
      status: 'SUCCESS',
      target: 'MY_PAGE',
      data: {
        header: '고객센터',
        items: [
          {
            title: '공지사항',
            action: {
              app: 'yanolja://notice',
              web: '/member/notice',
            },
            isBullet: false,
            subtitle: null,
            serverLogMeta: {},
          },
          {
            title: '자주 묻는 질문',
            action: {
              app: 'yanolja://faq',
              web: '/member/faq',
            },
            isBullet: false,
            subtitle: null,
            serverLogMeta: {},
          },
          {
            title: '1:1 문의',
            action: {
              app: 'yanolja://inquiry',
              web: '/member/inquiry',
            },
            isBullet: false,
            subtitle: null,
            serverLogMeta: {},
          },
        ],
      },
    },
    {
      type: 'YDM__NOL_MY_RESERVATION_LIST__V1',
      status: 'SUCCESS',
      target: 'MY_PAGE',
      data: {
        header: '예약',
        items: [
          {
            title: '숙소 예약',
            action: {
              app: 'yanolja://reservation/stay',
              web: '/member/reservation/stay',
            },
            isBullet: false,
            subtitle: null,
            serverLogMeta: {},
          },
          {
            title: '레저 예약',
            action: {
              app: 'yanolja://reservation/leisure',
              web: '/member/reservation/leisure',
            },
            isBullet: false,
            subtitle: null,
            serverLogMeta: {},
          },
        ],
      },
    },
    {
      type: 'YDM__NOL_MY_SERVICE_MANAGEMENT__V1',
      status: 'SUCCESS',
      target: 'MY_PAGE',
      data: {
        header: '서비스 관리',
        items: [
          {
            title: '알림 설정',
            action: {
              app: 'yanolja://notification',
              web: '/member/notification',
            },
            isBullet: false,
            subtitle: null,
            serverLogMeta: {},
          },
          {
            title: '위치 설정',
            action: {
              app: 'yanolja://location',
              web: '/member/location',
            },
            isBullet: false,
            subtitle: null,
            serverLogMeta: {},
          },
        ],
      },
    },
  ],
  additionalInfo: null,
};

