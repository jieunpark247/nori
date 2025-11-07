// Mypage 타입 정의 (@weberus/shared-types 대체)

export interface ConvertedMypageResponse {
  isLogin: boolean;
  navigationBar?: {
    cart?: number;
    push?: number;
  };
  widgets?: ConvertedMypageWidget[];
  additionalInfo?: any;
  errorStatusCode?: number;
}

export interface ConvertedMypageWidget {
  type: string;
  status: ConvertedMypageWidgetDataStatus;
  target?: string;
  data?: any;
}

export type ConvertedMypageWidgetDataStatus = 'SUCCESS' | 'FAIL' | 'LOADING';

export interface MypageUserInfoWidgetData {
  user?: {
    nickname?: {
      title?: string;
      action?: {
        app?: string;
        web?: string;
      };
      serverLogMeta?: any;
    };
    shortcut?: {
      title?: string;
      action?: {
        app?: string;
        web?: string;
      };
      serverLogMeta?: any;
    };
  };
  asset?: {
    items?: MypageUserInfoAssetItemData[];
    shortcuts?: MypageUserInfoAssetReviewCouponData[];
  };
  corporate?: {
    title?: string;
    subtitle?: string;
  } | null;
  segmentedBanner?: any;
  membershipBanner?: {
    action?: {
      app?: string;
      web?: string;
    };
    description?: string;
    iconUrl?: string;
    memberClassImageUrl?: string;
    serverLogMeta?: any;
  } | null;
  serverLogMeta?: any;
}

export interface MypageUserInfoAssetItemData {
  title: string;
  type: string;
  status: ConvertedMypageWidgetDataStatus;
  data?: {
    amount?: string;
    action?: {
      app?: string;
      web?: string;
    };
    replacementText?: string | null;
    notice?: string | null;
    tooltip?: string | null;
  };
  retry?: any;
  serverLogMeta?: any;
}

export interface MypageUserInfoAssetReviewCouponData {
  title: string;
  type: string;
  status: ConvertedMypageWidgetDataStatus;
  subtitle?: string;
  action?: {
    app?: string;
    web?: string;
  };
  retry?: any;
  serverLogMeta?: any;
}

export interface ConvertedMypageMenuWidgetData {
  header?: string;
  items?: ConvertedMypageMenuWidgetItem[];
}

export interface ConvertedMypageMenuWidgetItem {
  title: string;
  action?: {
    app?: string;
    web?: string;
  };
  isBullet?: boolean;
  subtitle?: string | null;
  serverLogMeta?: any;
}

