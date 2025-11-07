import React from 'react';
import { motion } from 'motion/react';
import { X, MapPin, Download, ExternalLink } from 'lucide-react';
import { Button } from './ui/button';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface VoucherDetailDialogProps {
  isOpen: boolean;
  onClose: () => void;
  voucher: {
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
  };
}

export function VoucherDetailDialog({ isOpen, onClose, voucher }: VoucherDetailDialogProps) {
  if (!isOpen) return null;

  const handleDownload = async () => {
    try {
      if (!voucher.image) {
        alert('다운로드할 이미지가 없습니다.');
        return;
      }
      // blob URL에서 이미지 가져오기
      const response = await fetch(voucher.image);
      if (!response.ok) {
        throw new Error('이미지를 가져올 수 없습니다.');
      }

      const blob = await response.blob();
      
      // Blob URL 생성
      const blobUrl = URL.createObjectURL(blob);
      
      // 다운로드 링크 생성
      const link = document.createElement('a');
      link.href = blobUrl;
      link.download = `${voucher.title || 'voucher'}.png`; // 파일명 설정
      document.body.appendChild(link);
      
      // 다운로드 트리거
      link.click();
      
      // 정리
      document.body.removeChild(link);
      URL.revokeObjectURL(blobUrl);
      
      console.log('바우처 다운로드 완료:', voucher.title);
    } catch (error) {
      console.error('다운로드 오류:', error);
      alert(`다운로드 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`);
    }
  };
  
  console.log('VoucherDetailDialog - voucher:', voucher);
  const handleOpenMap = () => {
    window.open(voucher.mapUrl, '_blank');
  };
  
  // 디버깅: blob URL 확인
  React.useEffect(() => {
    if (voucher.image) {
      console.log('VoucherDetailDialog - image URL:', voucher.image);
      console.log('VoucherDetailDialog - is blob URL:', voucher.image.startsWith('blob:'));
      
      // blob URL이 유효한지 확인
      if (voucher.image.startsWith('blob:')) {
        fetch(voucher.image)
          .then(response => {
            console.log('Blob URL 응답 상태:', response.status);
            if (!response.ok) {
              console.error('Blob URL이 유효하지 않습니다:', response.status);
            }
          })
          .catch(error => {
            console.error('Blob URL fetch 오류:', error);
          });
      }
    }
  }, [voucher.image]);
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        transition={{ duration: 0.2 }}
        onClick={(e) => e.stopPropagation()}
        className="bg-white rounded-3xl shadow-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto"
      >
        {/* Header */}
        <div className="sticky top-0 card-accent text-white px-6 py-4 flex items-center justify-between rounded-t-3xl shadow-md">
          <h2 className="text-white text-2xl">바우처 상세</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-full transition-colors"
          >
            <X className="size-5 text-white" />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Voucher Image */}
          <div className="rounded-2xl overflow-hidden bg-indigo-50 border-2 border-indigo-100">
            <ImageWithFallback
              src={voucher.image}
              alt={voucher.title}
              className="w-full h-64 object-cover"
              onError={(e) => {
                console.error('이미지 로딩 오류:', voucher.image, e);
              }}
              onClick={() => {
                window.open(voucher.image, '_blank');
              }}
            />
          </div>

          {/* Title */}
          <div>
            <h3 className="text-gray-900 text-2xl mb-2">{voucher.title}</h3>
            <div className="flex items-center gap-2 text-gray-600">
              <MapPin className="size-4" />
              <span>{voucher.location}</span>
            </div>
          </div>

          {/* Details Grid */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <div className="text-indigo-600 text-sm mb-1">날짜</div>
              <div className="text-gray-900">{voucher.date}</div>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <div className="text-indigo-600 text-sm mb-1">시간</div>
              <div className="text-gray-900">{voucher.time}</div>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <div className="text-indigo-600 text-sm mb-1">예약번호</div>
              <div className="text-gray-900">{voucher.bookingNumber}</div>
            </div>
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4">
              <div className="text-indigo-600 text-sm mb-1">결제금액</div>
              <div className="text-gray-900">{voucher.price}</div>
            </div>
          </div>

          {/* Additional Info */}
          <div className="space-y-4">
            <div>
              <div className="text-gray-600 mb-2">상세 정보</div>
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-gray-900">
                {voucher.details}
              </div>
            </div>
            
            <div>
              <div className="text-gray-600 mb-2">유효기간</div>
              <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 text-gray-900">
                {voucher.validity}
              </div>
            </div>

            <div>
              <div className="text-gray-600 mb-2">주의사항</div>
              <div className="bg-amber-50 border-2 border-amber-300 rounded-xl p-4 text-amber-900">
                {voucher.notes}
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4">
            <Button
              onClick={handleOpenMap}
              className="flex-1 bg-white text-gray-700 border-2 border-indigo-200 hover:border-indigo-300 hover:bg-indigo-50 px-5 py-6 text-sm rounded-2xl shadow-sm hover:shadow-md transition-all duration-300 gap-2"
            >
              <ExternalLink className="size-5" />
              구글맵으로 보기
            </Button>
            <Button
              onClick={handleDownload}
              className="flex-1 btn-primary-modern text-white px-5 py-6 text-sm border-0 gap-2"
            >
              <Download className="size-5" />
              바우처 다운로드
            </Button>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}
