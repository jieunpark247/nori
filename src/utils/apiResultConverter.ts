/**
 * API 응답 결과를 voucherCards 형태로 변환하는 유틸리티
 */

import { getVoucherImageUrl } from './imageUrlMapper';

interface ApiResult {
  id?: string;
  type?: string;
  title?: string;
  title_ko?: string;
  location?: string;
  location_ko?: string;
  reservation_number?: string;
  booking_number?: string;
  date?: string;
  time?: string;
  price?: string;
  currency?: string;
  [key: string]: any;
}

interface VoucherCardData {
  id: string;
  type: 'airline' | 'hotel' | 'ticket' | 'transport' | 'tour';
  title: string;
  subtitle: string;
  date: string;
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
    connection?: {
      text: string;
    };
  };
}

/**
 * API 응답의 type을 voucherCard type으로 변환
 */
function convertApiTypeToVoucherType(apiType?: string): 'airline' | 'hotel' | 'ticket' | 'transport' | 'tour' {
  if (!apiType) return 'ticket';
  
  const typeMap: Record<string, 'airline' | 'hotel' | 'ticket' | 'transport' | 'tour'> = {
    'airline': 'airline',
    '항공': 'airline',
    'hotel': 'hotel',
    '숙소': 'hotel',
    'ticket': 'ticket',
    '티켓': 'ticket',
    'transport': 'transport',
    '교통': 'transport',
    'tour': 'tour',
    '투어': 'tour',
  };
  
  return typeMap[apiType.toLowerCase()] || 'ticket';
}

/**
 * API 응답 결과를 VoucherCardData 형태로 변환
 */
export function convertApiResultToVoucherCard(apiResult: ApiResult, index: number): VoucherCardData | null {
  if (!apiResult) return null;
  const id = apiResult.id || `voucher_${index}`;
  const type = convertApiTypeToVoucherType(apiResult.type);
  const title = apiResult.title_ko || apiResult.title || '바우처';
  const subtitle = apiResult.location_ko || apiResult.location || '';
  const date = apiResult.date || new Date().toISOString().split('T')[0];
  

 
  const time = apiResult.voucher.date || '';
  const location = apiResult.voucher.location || '';
  const details = apiResult.voucher.details || `${type} 예약`;
  const bookingNumber = apiResult.bookingNumber || '';
  const price = apiResult.price || '';
  const validity = apiResult.validity || ''
  const notes = apiResult.notes || '';
  const image = apiResult.image || '';

  return {
    id,
    type,
    title,
    subtitle,
    date,
    voucher: {
      ...apiResult.voucher
    },
  };
}

/**
 * API 응답 결과 배열을 VoucherCardData 배열로 변환
 */
export function convertApiResultsToVoucherCards(apiResults: ApiResult[]): VoucherCardData[] {
  return apiResults
    .map((result, index) => convertApiResultToVoucherCard(result, index))
    .filter((card): card is VoucherCardData => card !== null);
}

