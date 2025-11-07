import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Switch } from './ui/switch';
import { Tabs, TabsList, TabsTrigger, TabsContent } from './ui/tabs';
import { ArrowLeft, Bell, Sparkles, Plane, Building, Clock, MapPin, ChevronRight, Navigation, Ticket, Castle, TramFront, Train, CreditCard } from 'lucide-react';
import { VoucherDetailDialog } from './VoucherDetailDialog';
import { ImageWithFallback } from './figma/ImageWithFallback';
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

interface VoucherCardData {
  id: string;
  type: 'airline' | 'hotel' | 'ticket' | 'transport' | 'tour';
  title: string;
  subtitle: string;
  date: string;
  group_id?: string;
  voucher: VoucherData & {
    connection?: {
      text: string;
    };
  };
}

// 기본 voucherCards (API 응답이 없을 때 사용)
const defaultVoucherCards = voucherCardsData as VoucherCardData[];

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


// group_id 기준으로 voucherCards를 그룹화하여 배열로 반환
const groupIdMap = (voucherCards: VoucherCardData[]) => {
  // group_id 기준으로 그룹화
  const groupedByGroupId = voucherCards.reduce((acc, card) => {
    const groupId = card.group_id || card.id; // group_id가 없으면 id를 사용
    if (!acc[groupId]) {
      acc[groupId] = [];
    }
    acc[groupId].push(card);
    return acc;
  }, {} as Record<string, VoucherCardData[]>);
  
  // 각 그룹의 첫 번째 카드의 voucher.date를 기준으로 정렬
  // "날짜 미정"은 맨 마지막으로 정렬
  const sortedGroups = Object.entries(groupedByGroupId).sort((a, b) => {
    const dateA = a[1][0]?.voucher?.date || a[1][0]?.date || '';
    const dateB = b[1][0]?.voucher?.date || b[1][0]?.date || '';
    
    // 날짜 미정인 경우 맨 마지막으로
    if (dateA === '날짜 미정' || !dateA || dateA.trim() === '') return 1;
    if (dateB === '날짜 미정' || !dateB || dateB.trim() === '') return -1;
    
    const dateAObj = new Date(dateA);
    const dateBObj = new Date(dateB);
    
    // 유효하지 않은 날짜는 맨 마지막으로
    if (isNaN(dateAObj.getTime())) return 1;
    if (isNaN(dateBObj.getTime())) return -1;
    
    return dateAObj.getTime() - dateBObj.getTime();
  });
  
  // 배열 형태로 반환: [{ groupId, cards, date }, ...]
  return sortedGroups.map(([groupId, cards]) => ({
    groupId,
    cards,
    date: cards[0]?.voucher?.date || cards[0]?.date || '날짜 미정',
  }));
};
// voucherCards를 DaySchedule 형태로 변환
const convertVoucherCardsToSchedule = (voucherCards: VoucherCardData[]): DaySchedule[] => {
  // group_id 기준으로 그룹화
  const groupedByGroupId = voucherCards.reduce((acc, card) => {
    const groupId = card.group_id || card.id; // group_id가 없으면 id를 사용
    if (!acc[groupId]) {
      acc[groupId] = [];
    }
    acc[groupId].push(card);
    return acc;
  }, {} as Record<string, VoucherCardData[]>);

  // 각 그룹의 첫 번째 카드의 voucher.date를 기준으로 정렬
  // "날짜 미정"은 맨 마지막으로 정렬
  const sortedGroups = Object.entries(groupedByGroupId).sort((a, b) => {
    const dateA = a[1][0]?.voucher?.date || a[1][0]?.date || '';
    const dateB = b[1][0]?.voucher?.date || b[1][0]?.date || '';
    
    // 날짜 미정인 경우 맨 마지막으로
    if (dateA === '날짜 미정' || !dateA || dateA.trim() === '') return 1;
    if (dateB === '날짜 미정' || !dateB || dateB.trim() === '') return -1;
    
    const dateAObj = new Date(dateA);
    const dateBObj = new Date(dateB);
    
    // 유효하지 않은 날짜는 맨 마지막으로
    if (isNaN(dateAObj.getTime())) return 1;
    if (isNaN(dateBObj.getTime())) return -1;
    
    return dateAObj.getTime() - dateBObj.getTime();
  });

  // DaySchedule 배열 생성
  return sortedGroups.map(([groupId, cards], index) => {
    // 같은 group_id를 가진 카드들을 하나의 리스트로 묶기
    const items: ScheduleItem[] = cards.map((card) => ({
      id: card.id,
      icon: getIconFromType(card.type),
      iconBg: 'dark' as const,
      title: card.title,
      time: card.voucher.time,
      location: card.voucher.location,
      details: card.voucher.details,
      connection: card.voucher.connection && card.voucher.connection.text ? card.voucher.connection : undefined,
      voucher: {
        title: card.voucher.title,
        image: card.voucher.image,
        date: card.voucher.date,
        time: card.voucher.time,
        location: card.voucher.location,
        details: card.voucher.details,
        bookingNumber: card.voucher.bookingNumber,
        price: card.voucher.price,
        validity: card.voucher.validity,
        notes: card.voucher.notes,
        mapUrl: card.voucher.mapUrl,
      },
    }));

    // 첫 번째 카드의 voucher.date를 사용
    const displayDate = cards[0]?.voucher?.date || cards[0]?.date || '';
    
    return {
      day: `Day ${index + 1}`,
      date: displayDate ? formatDate(displayDate) : `${index + 1}일차`,
      items,
    };
  });
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

const getVoucherColor = (type: VoucherCardData['type']) => {
  switch (type) {
    case 'airline':
      return 'from-blue-500 to-blue-600';
    case 'hotel':
      return 'from-purple-500 to-purple-600';
    case 'ticket':
      return 'from-orange-500 to-orange-600';
    case 'transport':
      return 'from-cyan-500 to-cyan-600';
    case 'tour':
      return 'from-teal-500 to-teal-600';
    default:
      return 'from-indigo-500 to-indigo-600';
  }
};

const getVoucherIcon = (type: VoucherCardData['type']) => {
  switch (type) {
    case 'airline':
      return Plane;
    case 'hotel':
      return Building;
    case 'ticket':
      return Ticket;
    case 'transport':
      return Train;
    case 'tour':
      return Castle;
    default:
      return CreditCard;
  }
};

interface TripDetailFrameProps {
  onBack: () => void;
  tripIndex?: number | null;
  initialTab?: 'schedule' | 'wallet';
}

export function TripDetailFrame({ onBack, tripIndex, initialTab = 'schedule' }: TripDetailFrameProps) {
  const [selectedTab, setSelectedTab] = useState(initialTab);
  const [selectedVoucher, setSelectedVoucher] = useState<VoucherData | null>(null);

  // 가장 최근 세션 인덱스 찾기
  const getLatestSessionIndex = (): number | null => {
    let maxIndex = 0;
    for (let i = 1; i <= 100; i++) { // 최대 100개까지 체크
      const sessionData = sessionStorage.getItem(`voucher_api_summary_${i}`);
      if (sessionData) {
        maxIndex = i;
      }
    }
    return maxIndex > 0 ? maxIndex - 1 : null; // tripIndex는 0부터 시작하므로 -1
  };

  // 선택된 trip의 summary에서 title 가져오기
  const tripTitle = useMemo(() => {
    // tripIndex가 없으면 가장 최근 세션 사용
    const effectiveTripIndex = tripIndex !== null && tripIndex !== undefined ? tripIndex : getLatestSessionIndex();
    
    if (effectiveTripIndex !== null && effectiveTripIndex !== undefined) {
      // tripIndex는 0부터 시작하므로 +1을 해서 sessionStorage 키 생성
      const sessionKey = `voucher_api_summary_${effectiveTripIndex + 1}`;
      const sessionData = sessionStorage.getItem(sessionKey);
      if (sessionData) {
        try {
          const summary = JSON.parse(sessionData);
          return summary.title || summary.name || '여행 일정';
        } catch {
          // 파싱 오류 시 기본값
        }
      }
    }
    // tripIndex가 없거나 데이터를 찾을 수 없으면 기본값
    return '오사카 여행 8박 9일';
  }, [tripIndex]);
  
  // API 응답 결과를 가져와서 voucherCards로 변환, 없으면 기본 데이터 사용
  const voucherCards = useMemo(() => {
    const apiResults = getVoucherApiResults();
    return apiResults;
  }, []);
  
  // voucherCards를 DaySchedule 형태로 변환
  const tripDetailScheduleData = useMemo(() => {
    return convertVoucherCardsToSchedule(voucherCards);
  }, [voucherCards]);
  
  // group_id 기준으로 묶은 데이터
  const groupedVoucherCards = useMemo(() => {
    return groupIdMap(voucherCards);
  }, [voucherCards]);
  

  let itemIndex = 0;

  return (
    <div className="bg-gradient-modern flex flex-col">
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="px-5 pt-6 pb-4 space-y-3"
      >
        <Button
          onClick={onBack}
          variant="ghost"
          className="text-gray-700 hover:bg-white/60 rounded-xl p-2 -ml-2"
        >
          <ArrowLeft className="size-5 mr-1" />
          내 여행으로
        </Button>
        <div>
          <h1 className="text-gray-900 text-2xl">{tripTitle}</h1>
          <p className="text-gray-600 text-sm mt-1">AI가 자동으로 생성한 일정이에요</p>
        </div>
      </motion.div>

      {/* Tabs */}
      <Tabs value={selectedTab} onValueChange={setSelectedTab} className="flex-1 flex flex-col px-5">
        <TabsList className="w-full grid grid-cols-2 h-11 bg-gray-100/80 backdrop-blur-sm">
          <TabsTrigger value="schedule" className="rounded-lg">
            일정
          </TabsTrigger>
          <TabsTrigger value="wallet" className="rounded-lg">
            바우처 지갑
          </TabsTrigger>
        </TabsList>

        {/* Schedule Tab Content */}
        <TabsContent value="schedule" className="flex-1 overflow-y-auto mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key="schedule"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              transition={{ duration: 0.4 }}
              className="space-y-6 pb-6"
            >
              {tripDetailScheduleData.map((daySchedule, dayIndex) => (
                <div key={dayIndex}>
                  {/* Day Header */}
                  <div className="flex items-center justify-between mb-4">
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
                      const isLastDay = dayIndex === tripDetailScheduleData.length - 1;
                      const showLine = !isLastItemInDay || !isLastDay;

                      return (
                        <div key={item.id}>
                          <div className="relative flex gap-3 pb-5">
                            {/* Timeline Icon */}
                            <div className="relative flex flex-col items-center">
                              <div className="size-12 rounded-full flex items-center justify-center shrink-0 z-10 shadow-md bg-indigo-100">
                                <IconComponent className="size-5 text-indigo-600" />
                              </div>
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
                                  <div className="flex items-center gap-1.5 text-gray-500 text-sm">
                                    <Clock className="size-3.5" />
                                    <span>{item.time}</span>
                                  </div>
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
                            <div className="relative flex gap-3 pb-5">
                              <div className="w-12 flex justify-center">
                                <div className="w-0.5 bg-indigo-200" />
                              </div>
                              <div className="flex-1">
                                <div className="bg-indigo-50 rounded-xl px-3 py-2.5 flex items-center justify-between gap-3 text-indigo-700 border border-indigo-100 text-sm">
                                  <div className="flex items-center gap-2">
                                    <Navigation className="size-3.5 shrink-0" />
                                    <span className="leading-snug">{item.connection.text}</span>
                                  </div>
                                  <div className="flex items-center gap-2 shrink-0">
                                    <span className="text-xs flex items-center gap-1">
                                      <Bell className="size-3" />
                                      알림
                                    </span>
                                    <Switch className="data-[state=checked]:bg-indigo-600" />
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
            </motion.div>
          </AnimatePresence>
        </TabsContent>

        {/* Wallet Tab Content */}
        <TabsContent value="wallet" className="flex-1 overflow-y-auto mt-4">
          <AnimatePresence mode="wait">
            <motion.div
              key="wallet"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="space-y-3 pb-6"
            >
              {groupedVoucherCards.map((group, index) => {
                // 그룹의 첫 번째 카드를 대표로 사용
                const card = group.cards[0];
                const IconComponent = getVoucherIcon(card.type);
                const cardCount = group.cards.length;
                
                return (
                  <motion.div
                    key={group.groupId}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{
                      delay: index * 0.1,
                      duration: 0.4,
                    }}
                    onClick={() => setSelectedVoucher(card.voucher)}
                    className="relative h-48 rounded-3xl overflow-hidden cursor-pointer shadow-[0_-4px_6px_rgba(0,0,0,0.1)] hover:shadow-[0_-6px_8px_rgba(0,0,0,0.15)] transition-all duration-300 hover:-translate-y-2 hover:scale-[1.02]"
                    style={{
                      marginTop: index > 0 ? '-110px' : '0', // h-48 (192px)의 절반인 96px만큼 겹치도록
                      zIndex: index + 1,
                    }}
                  >
                    {/* Background Gradient */}
                    <div className={`absolute inset-0 bg-gradient-to-br border border-white ${getVoucherColor(card.type)}`} />

                    {/* Card Content */}
                    <div className="relative h-full p-6 flex flex-col justify-between text-white">
                      <div className="flex items-start justify-between">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <IconComponent className="size-5" />
                            <span className="text-xs uppercase tracking-wider opacity-90">
                              {card.type === 'airline' && '항공권'}
                              {card.type === 'hotel' && '숙소'}
                              {card.type === 'ticket' && '티켓'}
                              {card.type === 'transport' && '교통'}
                              {card.type === 'tour' && '투어'}
                              {cardCount > 1 && ` (${cardCount}개)`}
                            </span>
                          </div>
                          <h3 className="text-xl">{card.title}</h3>
                          <p className="text-sm opacity-90">{card.subtitle}</p>
                        </div>
                        <div className="size-10 bg-white/20 backdrop-blur-sm rounded-full flex items-center justify-center">
                          {cardCount > 1 ? (
                            <span className="text-sm font-bold">{cardCount}</span>
                          ) : (
                            <ChevronRight className="size-5" />
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <div className="h-px bg-white/20" />
                        <div className="flex items-center justify-between text-sm">
                          <span className="opacity-90">{group.date}</span>
                          <div className="flex items-center gap-1.5">
                            <Sparkles className="size-3.5" />
                            <span className="text-xs">AI 자동 추가</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </motion.div>
          </AnimatePresence>
        </TabsContent>
      </Tabs>

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
