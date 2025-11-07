import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Plus, MoreVertical, Info, Sparkles, ArrowLeft, UserCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { getVoucherApiSummary, getVoucherApiResults } from '../utils/imageUrlMapper';

interface Trip {
  id: string;
  title: string;
  location: string;
  dates: string;
  duration: string;
  image: string;
}


// 날짜 포맷팅 함수
const formatDates = (startDate?: string, endDate?: string): string => {
  if (!startDate || !endDate) return '날짜 미정';
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const startMonth = start.getMonth() + 1;
    const startDay = start.getDate();
    const endMonth = end.getMonth() + 1;
    const endDay = end.getDate();
    return `${startMonth.toString().padStart(2, '0')}.${startDay.toString().padStart(2, '0')} - ${endMonth.toString().padStart(2, '0')}.${endDay.toString().padStart(2, '0')}`;
  } catch {
    return '날짜 미정';
  }
};

// 기간 계산 함수
const calculateDuration = (startDate?: string, endDate?: string): string => {
  if (!startDate || !endDate) return '';
  
  try {
    const start = new Date(startDate);
    const end = new Date(endDate);
    const diffTime = Math.abs(end.getTime() - start.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return `${diffDays}days`;
  } catch {
    return '';
  }
};

interface TripListFrameProps {
  onNavigate: (tripIndex: number) => void;
  onCreateNew: () => void;
  onBack?: () => void;
  onMyPage?: () => void;
}


export function TripListFrame({ onNavigate, onCreateNew, onBack, onMyPage }: TripListFrameProps) {
  // voucher_api_summary에서 trips 데이터 가져오기
  const trips = useMemo(() => {
    const summary = getVoucherApiSummary();
    const details = getVoucherApiResults();
    
    // summary가 배열 형태인 경우
    if (Array.isArray(summary) && summary.length > 0) {
      return summary
    }
    
    // details에서 첫 번째 이미지를 사용하여 단일 trip 생성
    if (details && details.length > 0) {
      const firstDetail = details[0];
      return [{
        id: 'trip_1',
        title: summary?.title || summary?.name || '여행 일정',
        location: summary?.location || summary?.destination || firstDetail?.voucher?.location || '',
        dates: formatDates(summary?.startDate, summary?.endDate) || summary?.dates || '날짜 미정',
        duration: calculateDuration(summary?.startDate, summary?.endDate) || summary?.duration || '',
        image: summary?.image || 'https://images.unsplash.com/photo-1601684632403-4ce4a06d8429?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxqYXBhbiUyMHRyYWluJTIwdGlja2V0fGVufDF8fHx8MTc2MjA3MTMzMnww&ixlib=rb-4.1.0&q=80&w=1080'
      }];
    }
    
    return [];
  }, []);
  
  return (
    <div className="size-full bg-gradient-modern overflow-y-auto">
      <div className="w-full px-5 py-6 space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            {onBack && (
              <Button
                onClick={onBack}
                variant="ghost"
                className="text-gray-700 hover:bg-white/60 rounded-xl p-2"
              >
                <ArrowLeft className="size-5 mr-1" />
              </Button>
            )}
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="space-y-2"
            >
              <h1 className="text-gray-900 text-3xl">내 여행</h1>
              <p className="text-gray-600 text-sm">AI가 자동으로 정리한 일정이에요</p>
            </motion.div>
          </div>
          {onMyPage && (
            <Button
              onClick={onMyPage}
              variant="ghost"
              className="text-gray-700 hover:bg-white/60 rounded-xl p-2"
            >
              <UserCircle className="size-5" />
            </Button>
          )}
        </div>

        {/* Trip Cards */}
        <div className="space-y-4">
          {trips.map((trip, index) => (
            <motion.div
              key={trip.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                delay: 0.2 + index * 0.15,
                duration: 0.5,
                ease: [0.4, 0, 0.2, 1],
              }}
              onClick={() => onNavigate(index)}
              className="relative h-52 rounded-3xl overflow-hidden cursor-pointer group shadow-md hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
            >
              {/* Background Image */}
              <ImageWithFallback
                src={trip.image}
                alt={trip.title}
                className="absolute inset-0 w-full h-full object-cover"
              />

              {/* Gradient Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />

              {/* AI Badge */}
              <div className="absolute top-3 left-3 flex items-center gap-1.5 bg-white/95 backdrop-blur-sm px-2.5 py-1.5 rounded-full shadow-sm">
                <div className="size-3.5 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-full flex items-center justify-center">
                  <Sparkles className="size-2 text-white" />
                </div>
                <span className="text-xs text-gray-700">AI 생성됨</span>
              </div>

              {/* Menu Button */}
              <button className="absolute top-3 right-3 size-9 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                <MoreVertical className="size-4.5 text-white" />
              </button>

              {/* Content */}
              <div className="absolute bottom-0 left-0 right-0 p-5">
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <h3 className="text-white text-xl">
                      {trip.title}
                    </h3>
                  </div>
                  <p className="text-white/90 text-sm">{trip.location}</p>
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-white/90 text-sm">
                      <span>{trip.dates}</span>
                      <span>•</span>
                      <span>{trip.duration}</span>
                    </div>
                    <button className="size-7 bg-white/20 backdrop-blur-md hover:bg-white/30 rounded-full flex items-center justify-center transition-colors">
                      <Info className="size-4 text-white" />
                    </button>
                  </div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Create New Button */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.5 }}
          className="pt-4 pb-6"
        >
          <Button
            onClick={onCreateNew}
            className="w-full bg-white text-gray-700 border-2 border-dashed border-indigo-300 hover:border-indigo-400 hover:bg-indigo-50 px-6 py-6 rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 gap-2"
          >
            <Plus className="size-5" />
            새 일정 만들기
          </Button>
        </motion.div>
      </div>
    </div>
  );
}
