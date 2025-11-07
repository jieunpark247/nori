import React from 'react';
import type {
  ConvertedMypageWidgetDataStatus,
  MypageUserInfoWidgetData,
  MypageUserInfoAssetItemData,
  MypageUserInfoAssetReviewCouponData,
} from '../../../../types/mypage';
import { EmptyState, RectangleButton, TextButton, Divider, cn } from '../../../nol-design-system';
import { AlertCircle, ChevronRight, Building, ShoppingCart } from 'lucide-react';
// import { useNavigate } from 'react-router-dom';
import noriImage from './nori.png';

export interface UserInfoWidgetProps {
  data: MypageUserInfoWidgetData;
  status: ConvertedMypageWidgetDataStatus;
}

// User 컴포넌트
const User: React.FC<{ user: MypageUserInfoWidgetData['user'] }> = ({ user }) => {
  if (!user) return null;

  return (
    <div className="flex items-center justify-between gap-x-6 pb-5 pl-1 pt-1">
      <TextButton
        className="min-h-8 text-left"
        icon={<ChevronRight className="ml-2 h-5 w-5 text-gray-900" />}
        onClick={() => {
          // 하드코딩된 링크 (동작 없음)
        }}
      >
        <span className="text-gray-900 text-xl font-bold">{user.nickname?.title || '사용자'}</span>
      </TextButton>
      {user.shortcut && (
        <RectangleButton
          theme="outlined_basic"
          size="small"
          weight="regular"
          className="min-w-[67px] !rounded-md !px-2.5"
          onClick={() => {
            // 하드코딩된 링크 (동작 없음)
          }}
        >
          {user.shortcut.title}
        </RectangleButton>
      )}
    </div>
  );
};

// MembershipBanner 컴포넌트
const MembershipBanner: React.FC<{ banner: MypageUserInfoWidgetData['membershipBanner'] }> = ({ banner }) => {
  if (!banner) return null;

  const isGoldClass = !!banner.memberClassImageUrl;
  const wrapperClass = isGoldClass ? 'bg-gray-800 text-white' : 'bg-[#E9ECFB] text-gray-900';

  return (
    <div
      className={cn('flex min-h-10 w-full cursor-pointer items-center rounded-xl px-4 py-2.5', wrapperClass)}
      onClick={() => {
        // 하드코딩된 링크 (동작 없음)
      }}
    >
      {isGoldClass && (
        <>
          <span className="text-xl">⭐</span>
          <span className="ml-2 mr-1 text-base font-medium">Gold</span>
          <span className="h-4 w-px bg-white/40 mx-2" />
        </>
      )}
      <span className="flex flex-1 text-sm">{banner.description}</span>
      <ChevronRight className="size-4" color={isGoldClass ? '#FFFFFF' : '#1A1A1A'} />
    </div>
  );
};

// Corporate 컴포넌트
const Corporate: React.FC<{ corporate: MypageUserInfoWidgetData['corporate'] }> = ({ corporate }) => {
  if (!corporate) return null;

  return (
    <div
      className="flex h-8 cursor-pointer items-center pl-4 pr-3"
      onClick={() => {
        // 하드코딩된 링크 (동작 없음)
      }}
    >
      <Building width={16} height={16} className="mr-1" />
      <span className="flex flex-1 truncate text-gray-900 text-sm">{corporate.title}</span>
      <div className="align-center my-2.5 flex min-h-3.5 p-0 text-gray-600 text-xs">
        {corporate.subtitle}
        <ChevronRight className="ml-0.5 text-gray-500" width={14} height={14} />
      </div>
    </div>
  );
};

// AssetItem 컴포넌트
const AssetItem: React.FC<{ item: MypageUserInfoAssetItemData; length: number }> = ({ item, length }) => {
  const { data, status, title } = item;
  const amount = data?.amount || '';
  const isFail = status === 'FAIL';
  const isAvailableClick = !isFail && !!amount;

  return (
    <div style={{ width: `calc(100% / ${length})` }}>
      <div className={cn('flex w-full flex-col items-center gap-x-2 px-1', isAvailableClick && 'cursor-pointer')}>
        {isFail ? (
          <span className="inline-flex h-5 items-center text-gray-400 text-lg font-bold">-</span>
        ) : (
          <span className="!block h-5 max-w-full items-center truncate text-blue-600 text-base font-bold">
            {amount}
          </span>
        )}
        <span className="mt-1 text-center text-gray-900 text-sm">{title}</span>
        {data?.notice && (
          <span className="mt-0.5 whitespace-pre-line text-center text-orange-600 text-xs">
            {data.notice}
          </span>
        )}
      </div>
    </div>
  );
};

// ReviewAndCoupon 컴포넌트
const ReviewAndCoupon: React.FC<{ shortcut: MypageUserInfoAssetReviewCouponData }> = ({ shortcut }) => {
  const { title, subtitle = '', status } = shortcut;

  if (status === 'FAIL') {
    return (
      <div className="inline-flex w-full items-center justify-center gap-1 whitespace-nowrap px-3 text-gray-900 text-sm font-bold">
        {title}
      </div>
    );
  }

  return (
    <TextButton
      pcSize="medium"
      mobileSize="medium"
      weight="bold"
      className="inline-flex w-full gap-1 whitespace-nowrap px-3"
      onClick={() => {
        // 하드코딩된 링크 (동작 없음)
      }}
    >
      {title}
      {subtitle && <span className="truncate text-indigo-600">{subtitle}</span>}
    </TextButton>
  );
};

// Asset 컴포넌트
const Asset: React.FC<{
  asset: MypageUserInfoWidgetData['asset'];
  corporate: MypageUserInfoWidgetData['corporate'];
  className?: string | null;
}> = ({ asset, corporate, className }) => {
  if (!asset) return null;

  const { items, shortcuts } = asset;
  const isCorporateMember = !!corporate;

  return (
    <div className={cn('flex w-full flex-col', { 'pt-0': isCorporateMember }, className)}>
      {/** 기업회원 */}
      {isCorporateMember && <Corporate corporate={corporate} />}

      {!isCorporateMember && <Divider size="large" type="horizontal" className="h-px w-full" />}

      <div className="flex flex-col gap-y-4 px-4 pb-4 pt-4">
        {/** NOL 머니, NOL 포인트, NOL 코인 */}
        {items && items.length > 0 && (
          <div className="flex py-3">
            {items.map((item, index) => (
              <AssetItem key={index} item={item} length={items.length} />
            ))}
          </div>
        )}

        {/** 후기, 쿠폰 */}
        {shortcuts && shortcuts.length > 0 && (
          <div className="flex h-10 w-full items-center rounded-lg border border-gray-200">
            {shortcuts.map((shortcut, index) => (
              <div key={index} className="flex w-[50%] items-center">
                {index !== 0 && <Divider size="medium" className="h-5 w-px" />}
                <ReviewAndCoupon shortcut={shortcut} />
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export const UserInfoWidget: React.FC<UserInfoWidgetProps> = ({ data, status }) => {
  // const navigate = useNavigate();

  if (!data) {
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

  const { asset, corporate, membershipBanner, user } = data;

  return (
    <div className="space-y-4">
      {/** 회원 정보(닉네임,계정관리) */}
      {user && <User user={user} />}

      {/** 멤버십(골드클래스) 배너 */}
      {membershipBanner && <MembershipBanner banner={membershipBanner} />}

      {/** NOL Universe 섹션 */}
      <div className="rounded-xl bg-white shadow-sm">
        {/** NOL Universe 헤더 */}
        <div className="flex items-center justify-between px-4 pt-4">
          <div className="flex items-center gap-2">
            <Building className="size-5 text-gray-700" />
            <span className="text-gray-900 font-bold">놀유니버스</span>
          </div>
          <div
            className="flex cursor-pointer items-center gap-1 text-sm text-gray-600"
            onClick={() => {
              // 쿠폰팩 확인
            }}
          >
            <span>이달의 쿠폰팩 확인</span>
            <ChevronRight className="size-4" />
          </div>
        </div>

        <Asset asset={asset} corporate={corporate} className="mt-0" />
      </div>

      {/** 여름휴가 혜택 배너 */}
      <div className="rounded-xl bg-pink-50 px-4 py-3">
        <div className="flex items-center justify-between">
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">아직 끝나지 않은 여름휴가 특급 혜택</div>
            <div className="mt-1 text-xs text-gray-600">NOL을 켜면, 여행 혜택이 커진다</div>
          </div>
          <div className="ml-4">
            <div className="flex size-12 items-center justify-center rounded-full bg-pink-200">
              <ShoppingCart className="size-6 text-pink-600" />
            </div>
          </div>
        </div>
      </div>

      {/** 여행일정 */}
      <div className="rounded-xl bg-white px-4 py-3 shadow-sm">
        <div className="flex items-center justify-between border-b border-blue-100 pb-3">
          <div className="flex items-center gap-2">
            <div className="flex size-6 items-center justify-center rounded bg-blue-50">
              <span className="text-xs text-blue-600">📅</span>
            </div>
            <span className="text-gray-900 text-sm font-bold">여행 일정</span>
          </div>
          <div
            className="flex cursor-pointer items-center gap-1 text-sm text-gray-500"
            onClick={() => {
              window.location.href = '/nori/plan';
            }}
          >
            <span>일정 리스트</span>
            <ChevronRight className="size-4" />
          </div>
        </div>
        {/** AI 노리 카드 */}
        <div
          className="mt-4 flex cursor-pointer items-center gap-3 rounded-xl bg-gradient-to-r from-purple-50 to-pink-50 px-4 py-3"
          onClick={() => {
            window.location.href = '/nori';
          }}
        >
          <div className="flex size-12 items-center justify-center rounded-full bg-purple-200">
            <span className="text-xl">😊</span>
          </div>
          <div className="flex-1">
            <div className="text-sm font-medium text-gray-900">[AI노리]에게 바우처를 주세요</div>
            <div className="mt-0.5 text-xs text-gray-600">자동으로 일정을 만들어요.</div>
          </div>
          <div className="flex gap-1">
            <div className="size-2 rounded-full bg-gray-300"></div>
            <div className="size-2 rounded-full bg-gray-400"></div>
            <div className="size-2 rounded-full bg-gray-300"></div>
          </div>
        </div>
      </div>
    </div>
  );
};

