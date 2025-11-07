/**
 * PDF를 이미지로 변환하는 유틸리티 함수
 */

import * as pdfjsLib from 'pdfjs-dist';
// @ts-ignore - worker 파일 import
import workerUrl from 'pdfjs-dist/build/pdf.worker.min.mjs?url';

// PDF.js worker 설정 - 로컬에 설치된 worker 파일 사용
pdfjsLib.GlobalWorkerOptions.workerSrc = workerUrl;

export interface ConvertedImage {
  blob: Blob;
  url: string;
  filename: string;
}

/**
 * PDF 파일을 이미지로 변환
 * 여러 페이지가 있으면 하나의 긴 이미지로 합침
 * @param file PDF 파일
 * @param scale 이미지 스케일 (기본값: 2.0)
 * @returns 변환된 이미지 Blob과 URL
 */
export async function convertPdfToImage(
  file: File,
  scale: number = 2.0
): Promise<ConvertedImage[]> {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
    
    // 모든 페이지의 viewport 정보를 먼저 가져와서 전체 크기 계산
    const pageViewports: any[] = [];
    let totalHeight = 0;
    let maxWidth = 0;

    for (let pageNum = 1; pageNum <= pdf.numPages; pageNum++) {
      const page = await pdf.getPage(pageNum);
      const viewport = page.getViewport({ scale });
      pageViewports.push({ page, viewport });
      totalHeight += viewport.height;
      maxWidth = Math.max(maxWidth, viewport.width);
    }

    // 하나의 큰 Canvas 생성
    const mergedCanvas = document.createElement('canvas');
    const mergedContext = mergedCanvas.getContext('2d');
    if (!mergedContext) {
      throw new Error('Canvas context를 가져올 수 없습니다.');
    }

    mergedCanvas.width = maxWidth;
    mergedCanvas.height = totalHeight;

    // 배경을 흰색으로 설정
    mergedContext.fillStyle = '#FFFFFF';
    mergedContext.fillRect(0, 0, maxWidth, totalHeight);

    // 각 페이지를 순서대로 그려넣기
    let currentY = 0;
    for (const { page, viewport } of pageViewports) {
      // 각 페이지를 임시 canvas에 렌더링
      const tempCanvas = document.createElement('canvas');
      const tempContext = tempCanvas.getContext('2d');
      if (!tempContext) {
        throw new Error('임시 Canvas context를 가져올 수 없습니다.');
      }

      tempCanvas.width = viewport.width;
      tempCanvas.height = viewport.height;

      await page.render({
        canvasContext: tempContext,
        viewport: viewport,
        canvas: tempCanvas,
      }).promise;

      // 임시 canvas를 큰 canvas에 그리기
      mergedContext.drawImage(tempCanvas, 0, currentY);
      currentY += viewport.height;
    }

    // 합쳐진 Canvas를 Blob으로 변환
    const blob = await new Promise<Blob>((resolve, reject) => {
      mergedCanvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Blob 변환 실패'));
          }
        },
        'image/png',
        0.95
      );
    });

    // Blob URL 생성
    const url = URL.createObjectURL(blob);
    const filename = `${file.name.replace(/\.pdf$/i, '')}.png`;

    return [{
      blob,
      url,
      filename,
    }];
  } catch (error) {
    console.error('PDF 변환 오류:', error);
    throw new Error(`PDF를 이미지로 변환하는 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`);
  }
}

/**
 * 이미지 파일을 그대로 반환 (이미지 파일인 경우)
 * @param file 이미지 파일
 * @returns 이미지 Blob과 URL
 */
export async function convertImageFile(file: File): Promise<ConvertedImage> {
  const blob = new Blob([file], { type: file.type });
  const url = URL.createObjectURL(blob);

  return {
    blob,
    url,
    filename: file.name,
  };
}

/**
 * 파일이 PDF인지 확인
 */
export function isPdfFile(file: File): boolean {
  return file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf');
}

/**
 * 파일이 이미지인지 확인
 */
export function isImageFile(file: File): boolean {
  return file.type.startsWith('image/') || /\.(png|jpg|jpeg|gif|webp)$/i.test(file.name);
}

