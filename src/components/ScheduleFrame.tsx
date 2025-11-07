import { useState, useEffect, useMemo } from 'react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Bell, Sparkles, Plane, Building, Clock, MapPin, ChevronRight, Navigation, Ticket, Castle, TramFront, Train, ArrowLeft } from 'lucide-react';
import { VoucherDetailDialog } from './VoucherDetailDialog';
import voucherCardsData from '../data/voucherCards.json';
import { getVoucherImageUrl, getVoucherApiResults } from '../utils/imageUrlMapper';
import { convertApiResultsToVoucherCards } from '../utils/apiResultConverter';

interface VoucherData {
  title: string;
  image: string;
  date: string;
  time: string;
  location: string;
  details: string;
  bookingNumber: string;
  price: string;
  validity: string;
  notes: string;
  mapUrl: string;
}

interface ScheduleItem {
  id: string;
  icon: 'plane' | 'building' | 'ticket' | 'castle' | 'tram' | 'train';
  iconBg: 'dark' | 'gray';
  title: string;
  time: string;
  location: string;
  details: string;
  connection?: {
    text: string;
  };
  voucher: VoucherData;
}

interface DaySchedule {
  day: string;
  date: string;
  items: ScheduleItem[];
}

interface VoucherCardData {
  id: string;
  type: 'airline' | 'hotel' | 'ticket' | 'transport' | 'tour';
  title: string;
  subtitle: string;
  date: string;
  voucher: VoucherData & {
    connection?: {
      text: string;
    };
  };
}

interface ScheduleFrameProps {
  onNavigate: () => void;
  onNavigateToWallet?: () => void;
  onBack?: () => void;
}

const getIconFromType = (type: string): 'plane' | 'building' | 'ticket' | 'castle' | 'tram' | 'train' => {
  switch (type) {
    case 'airline':
      return 'plane';
    case 'hotel':
      return 'building';
    case 'ticket':
      return 'ticket';
    case 'tour':
      return 'train';
    case 'transport':
      return 'tram';
    default:
      return 'ticket';
  }
};

const getIconComponent = (icon: string) => {
  switch (icon) {
    case 'plane':
      return Plane;
    case 'building':
      return Building;
    case 'ticket':
      return Ticket;
    case 'castle':
      return Castle;
    case 'tram':
      return TramFront;
    case 'train':
      return Train;
    default:
      return Plane;
  }
};

// 날짜를 한국어 형식으로 변환 (예: "2025-11-15" -> "11월 15일 (금)")
// 날짜 형식이 아닌 경우 "날짜 미정" 반환
const formatDate = (dateString: string): string => {
  // 날짜 형식이 아닌 경우 체크
  if (!dateString || dateString === '날짜 미정' || dateString.trim() === '') {
    return '날짜 미정';
  }
  
  // 유효한 날짜 형식인지 확인 (YYYY-MM-DD 형식 또는 유효한 Date 객체)
  const date = new Date(dateString);
  if (isNaN(date.getTime())) {
    return '날짜 미정';
  }
  
  const month = date.getMonth() + 1;
  const day = date.getDate();
  const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
  const weekday = weekdays[date.getDay()];
  return `${month}월 ${day}일 (${weekday})`;
};

// voucherCards를 DaySchedule 형태로 변환
const convertVoucherCardsToSchedule = (voucherCards: VoucherCardData[]): DaySchedule[] => {
  // 날짜별로 그룹화
  const groupedByDate = voucherCards.reduce((acc, card) => {
    const date = card.date;
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(card);
    return acc;
  }, {} as Record<string, VoucherCardData[]>);

  // 날짜를 정렬 (최신 날짜 순)
  // "날짜 미정"은 맨 마지막으로 정렬
  const sortedDates = Object.keys(groupedByDate).sort((a, b) => {
    // 날짜 미정인 경우 맨 마지막으로
    if (a === '날짜 미정' || !a || a.trim() === '') return 1;
    if (b === '날짜 미정' || !b || b.trim() === '') return -1;
    
    const dateA = new Date(a);
    const dateB = new Date(b);
    
    // 유효하지 않은 날짜는 맨 마지막으로
    if (isNaN(dateA.getTime())) return 1;
    if (isNaN(dateB.getTime())) return -1;
    
    return dateA.getTime() - dateB.getTime();
  });

  // 타입별 정렬 순서 정의
  const getTypeOrder = (type: string, isLastDay: boolean): number => {
    if (isLastDay) {
      // 마지막 날: airline이 맨 마지막
      switch (type) {
        case 'hotel': return 1;
        case 'ticket': return 2;
        case 'airline': return 3;
        default: return 4;
      }
    } else {
      // 기본 순서: airline | hotel | ticket
      switch (type) {
        case 'airline': return 1;
        case 'hotel': return 2;
        case 'ticket': return 3;
        default: return 4;
      }
    }
  };

  // DaySchedule 배열 생성
  return sortedDates.map((date, index) => {
    const isLastDay = index === sortedDates.length - 1;
    const cards = groupedByDate[date];
    
    // 같은 날짜 내에서 타입별로 정렬
    const sortedCards = [...cards].sort((a, b) => {
      const orderA = getTypeOrder(a.type, isLastDay);
      const orderB = getTypeOrder(b.type, isLastDay);
      return orderA - orderB;
    });
    const items: ScheduleItem[] = sortedCards.map((card) => ({
      id: card.id,
      icon: getIconFromType(card.type),
      iconBg: 'dark' as const,
      title: card.title,
      time: card.voucher.time,
      location: card.voucher.location,
      details: card.voucher.details,
      connection: card.voucher.connection && card.voucher.connection.text ? card.voucher.connection : undefined,
      voucher: {
        ...card.voucher
      },
    }));

    return {
      day: `Day ${index + 1}`,
      date: formatDate(date),
      items,
    };
  });
};

export function ScheduleFrame({ onNavigate, onNavigateToWallet, onBack }: ScheduleFrameProps) {
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherData | null>(null);
  const [isVisible, setIsVisible] = useState(false);
  
  // API 응답 결과를 가져와서 voucherCards로 변환, 없으면 기본 데이터 사용
  const scheduleData = useMemo(() => {
    const apiResults = getVoucherApiResults();
    let voucherCards: VoucherCardData[];
    // return apiResults
    return convertVoucherCardsToSchedule(apiResults);
  }, []);
  
  useEffect(() => {
    setIsVisible(true);
  }, []);
  
  let itemIndex = 0;
  
  return (
    <div className="size-full bg-gradient-modern overflow-y-auto relative">
      <div className="w-full space-y-6 px-5 py-6 pb-40">
        {/* Header with Back Button */}
        <div className="space-y-3">
          {onBack && (
            <div
              className={`transition-all duration-500 ${
                isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
              }`}
            >
              <Button
                onClick={onBack}
                variant="ghost"
                className="text-gray-700 hover:bg-white/60 rounded-xl p-2 -ml-2"
              >
                <ArrowLeft className="size-5 mr-1" />
                뒤로
              </Button>
            </div>
          )}
          <div
            className={`text-center transition-all duration-500 ${
              isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
            }`}
          >
            <h1 className="text-gray-900 text-2xl px-4">
              AI가 인식한 여행 일정이에요
            </h1>
          </div>
        </div>

        {/* Schedule List */}
        <div className="space-y-6">
          {scheduleData.map((daySchedule, dayIndex) => (
            <div key={dayIndex}>
              {/* Day Header */}
              <div
                className={`flex items-center justify-between mb-4 transition-all duration-500 ${
                  isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                }`}
                style={{
                  transitionDelay: `${300 + dayIndex * 400}ms`,
                }}
              >
                <div className="card-accent text-white px-5 py-2 rounded-full shadow-md text-sm">
                  {daySchedule.day}
                </div>
                <div className="text-gray-600 text-sm">
                  {daySchedule.date}
                </div>
              </div>

              {/* Day Items */}
              <div className="relative">
                {daySchedule.items.map((item, index) => {
                  const currentItemIndex = itemIndex++;
                  const IconComponent = getIconComponent(item.icon);
                  const isLastItemInDay = index === daySchedule.items.length - 1;
                  const isLastDay = dayIndex === scheduleData.length - 1;
                  const showLine = !isLastItemInDay || !isLastDay;
                  
                  return (
                    <div key={item.id}>
                      <div
                        className={`relative flex gap-3 pb-5 transition-all duration-500 ease-out ${
                          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
                        }`}
                        style={{
                          transitionDelay: `${500 + currentItemIndex * 200}ms`,
                          transitionTimingFunction: 'cubic-bezier(0.4, 0, 0.2, 1)',
                        }}
                      >
                        {/* Timeline Icon */}
                        <div className="relative flex flex-col items-center">
                          <div className="size-12 rounded-full flex items-center justify-center shrink-0 z-10 shadow-md bg-indigo-100">
                            <IconComponent className="size-5 text-indigo-600" />
                          </div>
                          {/* Vertical Line */}
                          {showLine && (
                            <div className="absolute top-12 bottom-0 w-0.5 bg-indigo-200" />
                          )}
                        </div>

                        {/* Content */}
                        <div className="flex-1 pt-0.5">
                          <div 
                            className="flex items-start justify-between gap-3 group cursor-pointer"
                            onClick={() => setSelectedVoucher(item.voucher)}
                          >
                            <div className="flex-1 space-y-1.5">
                              <div className="text-gray-900 group-hover:text-indigo-600 transition-colors">
                                {item.title}
                              </div>
                              {/* <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                                <Clock className="size-3.5" />
                                <span>{item.time}</span>
                              </div> */}
                              <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                                <MapPin className="size-3.5" />
                                <span>{item.location}</span>
                              </div>
                              <div className="text-gray-600 text-sm">
                                {item.details}
                              </div>
                            </div>
                            <ChevronRight className="size-5 text-gray-400 mt-0.5 group-hover:text-indigo-600 transition-colors shrink-0" />
                          </div>
                        </div>
                      </div>

                      {/* Connection Info */}
                      {item.connection && (
                        <div
                          className={`relative flex gap-3 pb-5 transition-all duration-500 ${
                            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
                          }`}
                          style={{
                            transitionDelay: `${600 + currentItemIndex * 200}ms`,
                          }}
                        >
                          <div className="w-12 flex justify-center">
                            <div className="w-0.5 bg-indigo-200" />
                          </div>
                          <div className="flex-1">
                            <div className="bg-indigo-50 rounded-xl px-3 py-2.5 flex items-center justify-between gap-3 text-indigo-700 border border-indigo-100 text-sm">
                              <div className="flex items-center gap-2">
                                <Navigation className="size-3.5 shrink-0" />
                                <span className="leading-snug text-sm">{item.connection.text}</span>
                              </div>
                              <div className="flex items-center gap-2 shrink-0">
                                <span className="text-xs flex items-center gap-1">
                                  <Bell className="size-3" />
                                  알림
                                </span>
                                <Switch 
                                  className="data-[state=checked]:bg-indigo-600"
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Subtext */}
        <div
          className={`text-center px-4 transition-all duration-500 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}
          style={{
            transitionDelay: '1500ms',
          }}
        >
          <p className="text-gray-600">
            바우처에서 자동으로 일정이 추가되었습니다.
          </p>
        </div>
      </div>

      {/* Floating Button Group */}
      <div
        className={`fixed bottom-0 left-0 right-0 p-5 bg-gradient-to-t from-white via-white to-transparent transition-all duration-500 ${
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
        }`}
        style={{ 
          backdropFilter: 'blur(8px)',
          transitionDelay: '1800ms',
        }}
      >
        <div className="flex flex-col gap-3">
          <Button
            onClick={onNavigateToWallet || onNavigate}
            className="btn-primary-modern text-white px-6 py-5 border-0 gap-2 w-full shadow-md hover:shadow-lg"
          >
            <Sparkles className="size-5" />
           바우처 지갑 보기
          </Button>
          <Button
            onClick={onNavigate}
            className="bg-white text-gray-700 border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 px-6 py-5 rounded-2xl shadow-md hover:shadow-lg transition-all duration-300 gap-2 w-full"
          >
            <Bell className="size-5" />
            여행 일정 보기
          </Button>
        </div>
      </div>

      {/* Voucher Detail Dialog */}
      {selectedVoucher && (
        <VoucherDetailDialog
          isOpen={!!selectedVoucher}
          onClose={() => setSelectedVoucher(null)}
          voucher={selectedVoucher}
        />
      )}
    </div>
  );
}
