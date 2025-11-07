/**
 * 로컬 이미지 URL 매핑 유틸리티
 * API 응답과 로컬 이미지 URL을 매핑하여 voucher.image에 사용
 */

/**
 * localStorage에서 voucher 이미지 URL 가져오기
 * @param key 식별 키 (API 응답의 id, reservation_number, booking_number 등)
 * @returns 로컬 이미지 URL 또는 null
 */
export function getLocalImageUrl(key: string): string | null {
  if (!key) return null;
  return localStorage.getItem(`voucher_image_${key}`);
}

/**
 * localStorage에서 API 응답 데이터 가져오기
 * @param id API 응답의 id
 * @returns API 응답 데이터 또는 null
 */
export function getVoucherApiResponse(id: string): any | null {
  if (!id) return null;
  const data = localStorage.getItem(`voucher_data_${id}`);
  return data ? JSON.parse(data) : null;
}

/**
 * 모든 API 응답 데이터 가져오기
 * @returns id를 key로 하는 API 응답 Map
 */
export function getAllVoucherApiResponses(): Map<string, any> {
  const data = localStorage.getItem('voucher_api_responses');
  if (!data) return new Map();
  
  try {
    const entries = JSON.parse(data);
    return new Map(entries);
  } catch {
    return new Map();
  }
}

/**
 * API 응답 결과 배열 가져오기 (voucherCards 대신 사용)
 * @returns API 응답 결과 배열
 */
export function getVoucherApiResults(): any[] {
  const data = localStorage.getItem('voucher_api_results');
  if (!data) return [];
  
  try {
    return JSON.parse(data);
  } catch {
    return [];
  }
}

/**
 * API 응답 summary 가져오기
 * @returns API 응답 summary 객체 또는 배열 (sessionStorage의 모든 summary 포함)
 */
export function getVoucherApiSummary(): any | null {
  const summaries: any[] = [];
  
  // localStorage에서 최신 summary 가져오기
  const localData = localStorage.getItem('voucher_api_summary');
  // if (localData) {
  //   try {
  //     summaries.push(JSON.parse(localData));
  //   } catch {
  //     // 파싱 오류 무시
  //   }
  // }
  
  // sessionStorage에서 모든 summary 가져오기
  let sessionIndex = 1;
  while (true) {
    const sessionData = sessionStorage.getItem(`voucher_api_summary_${sessionIndex}`);
    if (!sessionData) break;
    
    try {
      summaries.push(JSON.parse(sessionData));
    } catch {
      // 파싱 오류 무시
    }
    sessionIndex++;
  }
  
  // 데이터가 없으면 null 반환
  if (summaries.length === 0) {
    return null;
  }
  
  // 하나만 있으면 객체로 반환, 여러 개면 배열로 반환
  return summaries.length === 1 ? summaries[0] : summaries;
}

/**
 * voucher 데이터에서 이미지 URL 가져오기
 * API 응답의 id를 key로 사용하여 로컬 이미지를 찾음
 * @param voucher voucher 데이터
 * @returns 이미지 URL
 */
export function getVoucherImageUrl(voucher: {
  image?: string;
  id?: string;
  bookingNumber?: string;
  reservation_number?: string;
}): string {
  // API 응답의 id를 우선적으로 사용
  if (voucher.id) {
    const localUrl = getLocalImageUrl(voucher.id);
    if (localUrl) {
      return localUrl;
    }
  }
  
  // id가 없으면 reservation_number나 bookingNumber 사용
  const localKey = voucher.reservation_number || voucher.bookingNumber;
  if (localKey) {
    const localUrl = getLocalImageUrl(localKey);
    if (localUrl) {
      return localUrl;
    }
  }
  
  // 로컬 이미지가 없으면 원본 URL 사용
  return voucher.image || '';
}

