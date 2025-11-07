import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Upload, FileText, UserCircle } from 'lucide-react';
import { Button } from './components/ui/button';
import { ProcessingFrame } from './components/ProcessingFrame';
import { ScheduleFrame } from './components/ScheduleFrame';
import { TripListFrame } from './components/TripListFrame';
import { TripDetailFrame } from './components/TripDetailFrame';
import { EndingFrame } from './components/EndingFrame';
import aiCharacter from 'figma:asset/65dd9771af232d56db3bd1ba688bda30b432490b.png';
import { convertPdfToImage, convertImageFile, isPdfFile, isImageFile, type ConvertedImage } from './utils/pdfToImage';
import axios from 'axios';

type FrameType = 'frame_01' | 'frame_02' | 'frame_03' | 'frame_04' | 'frame_05' | 'frame_06' | 'ending';

// API URL 설정 (환경변수 또는 기본값)
const API_URL =  'https://trang-monopodial-lynwood.ngrok-free.dev';

export default function Nori() {
  const [currentFrame, setCurrentFrame] = useState<FrameType>('frame_01');
  const [isDragging, setIsDragging] = useState(false);
  const [selectedFiles, setSelectedFiles] = useState<File[]>([]);
  const [convertedImages, setConvertedImages] = useState<ConvertedImage[]>([]);
  const [imageUrlMap, setImageUrlMap] = useState<Map<string, string>>(new Map()); // API 응답과 로컬 이미지 URL 매핑
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const [isConverting, setIsConverting] = useState(false);
  const [selectedTripIndex, setSelectedTripIndex] = useState<number | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const analyzingTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    setIsVisible(true);
  }, [currentFrame]);

  // localStorage에서 이미지 URL 매핑 복원
  useEffect(() => {
    const restoredMap = new Map<string, string>();
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith('voucher_image_')) {
        const voucherKey = key.replace('voucher_image_', '');
        const imageUrl = localStorage.getItem(key);
        if (imageUrl) {
          restoredMap.set(voucherKey, imageUrl);
        }
      }
    }
    if (restoredMap.size > 0) {
      setImageUrlMap(restoredMap);
    }
  }, []);

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

  // 이전 프레임으로 이동하는 함수
  const goToPreviousFrame = () => {
    const frameOrder: FrameType[] = ['frame_01', 'frame_02', 'frame_03', 'frame_04', 'frame_05', 'frame_06', 'ending'];
    const currentIndex = frameOrder.indexOf(currentFrame);
    
    if (currentIndex > 0) {
      setCurrentFrame(frameOrder[currentIndex - 1]);
    } else {
      // currentFrame이 없거나 첫 번째 프레임이면 history.back()
      if (window.history.length > 1) {
        window.history.back();
      }
    }
  };

  // 마이페이지로 이동하는 함수
  const goToMyPage = () => {
    // display-site의 mypage로 이동
    window.location.href = '/mypage';
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = Array.from(e.dataTransfer.files);
    if (files.length > 0) {
      await processFiles(files);
    }
  };

  const handleFileSelect = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      await processFiles(Array.from(files));
    }
  };

  // 파일을 이미지로 변환하는 함수
  const processFiles = async (files: File[]) => {
    setIsConverting(true);
    setSelectedFiles(files);
    
    try {
      const converted: ConvertedImage[] = [];
      
      for (const file of files) {
        if (isPdfFile(file)) {
          // PDF를 이미지로 변환
          const images = await convertPdfToImage(file);
          converted.push(...images);
        } else if (isImageFile(file)) {
          // 이미지 파일은 그대로 사용
          const image = await convertImageFile(file);
          converted.push(image);
        } else {
          console.warn(`지원하지 않는 파일 형식: ${file.name}`);
        }
      }
      
      // 이미지를 변환한 직후 localStorage에 저장
      converted.forEach((image, index) => {
        const key = `voucher_image_${index}`;
        localStorage.setItem(key, image.url);
      });
      
      setConvertedImages(converted);
    } catch (error) {
      console.error('파일 변환 오류:', error);
      alert(`파일 변환 중 오류가 발생했습니다: ${error instanceof Error ? error.message : String(error)}`);
    } finally {
      setIsConverting(false);
    }
  };

  // API 호출 함수
  // const uploadToApi = async (image: ConvertedImage, index: number): Promise<any> => {
  //   try {
  //     const key = `voucher_image_${index}`;
      
  //     // FormData를 사용하여 실제 파일과 key를 함께 전송
  //     const formData = new FormData();
  //     formData.append('key', key);
  //     formData.append('file', image.blob, image.filename);

  //     const response = await axios.post(`${API_URL}/extract`, formData, {
  //       headers: {
  //         'Content-Type': 'multipart/form-data',
  //       },
  //       timeout: 60000, // 60초 타임아웃
  //     });

  //     return response.data;
  //   } catch (error) {
  //     console.error('API 호출 오류:', error);
  //     throw error;
  //   }
  // };

  // 여러 파일을 한 번에 API로 전송하는 함수
  const uploadMultipleFilesToApi = async (images: ConvertedImage[]): Promise<any> => {
    try {
      const formData = new FormData();
      
      // keys 배열을 모아서 JSON.stringify 형태로 전송
      const keys: string[] = [];
      
      // 이미지가 여러 개인 경우: 배열 형태로 전송
      images.forEach((image, index) => {
        const storageKey = `voucher_image_${index}`;
        // localStorage에서 blob URL 가져오기
        const blobUrl = localStorage.getItem(storageKey);
        if (blobUrl) {
          keys.push(blobUrl); // localStorage의 blob URL을 배열에 추가
        }
        formData.append('files', image.blob, image.filename); // 파일 추가
      });
      
      // keys를 JSON.stringify 형태로 전송
      if (keys.length > 0) {
        formData.append('keys', JSON.stringify(keys));
      }

      // ngrok을 사용하는 경우 필요한 헤더 추가
      const headers: Record<string, string> = {};
      
      // ngrok URL인 경우 브라우저 경고 스킵 헤더 추가
      if (API_URL.includes('ngrok-free.dev') || API_URL.includes('ngrok.io')) {
        headers['ngrok-skip-browser-warning'] = 'true';
      }

      // multipart/form-data는 axios가 자동으로 설정하므로 Content-Type을 명시하지 않음
      const response = await axios.post(`${API_URL}/extract`, formData, {
        headers,
        timeout: 600000, // 60초 타임아웃
        withCredentials: false, // CORS 문제 방지를 위해 false로 설정
      });

      return response.data;
    } catch (error: any) {
      console.error('API 호출 오류:', error);
      
      // CORS 오류인 경우
      if (error.code === 'ERR_NETWORK' || error.message?.includes('CORS') || error.message?.includes('Access-Control-Allow-Origin')) {
        const errorMessage = `CORS 오류가 발생했습니다.\n\nAPI URL: ${API_URL}\n\n서버 측에서 다음 CORS 헤더를 추가해야 합니다:\n- Access-Control-Allow-Origin: *\n- Access-Control-Allow-Methods: POST, OPTIONS\n- Access-Control-Allow-Headers: Content-Type, ngrok-skip-browser-warning`;
        throw new Error(errorMessage);
      }
      
      // 404 오류인 경우
      if (error.response?.status === 404) {
        const errorMessage = `API 엔드포인트를 찾을 수 없습니다.\n\n요청 URL: ${API_URL}/extract\n\n서버에서 해당 엔드포인트(/extract)가 존재하는지 확인해주세요.`;
        throw new Error(errorMessage);
      }
      
      // 기타 오류
      const errorMessage = error.response?.data?.message || error.message || '알 수 없는 오류가 발생했습니다.';
      throw new Error(`API 호출 중 오류가 발생했습니다: ${errorMessage}`);
    }
  };

  const handleUploadClick = async () => {
    if (convertedImages.length === 0) {
      alert('변환된 이미지가 없습니다.');
      return;
    }

    setIsAnalyzing(true);
    
    // 10초 타이머 설정: 10초 후에도 isAnalyzing이 true면 frame_03으로 이동
    analyzingTimeoutRef.current = setTimeout(() => {
      // 10초가 지났지만 아직 분석 중이면 frame_03으로 이동 (isAnalyzing은 true 유지)
      setCurrentFrame('frame_03');
    }, 10000);
    
    try {
      // 모든 이미지를 한 번에 API로 전송
      const result = await uploadMultipleFilesToApi(convertedImages);
      
      console.log('API 응답 결과:', result);
      
      // API 응답 처리
      // 새로운 구조: { summary: {}, details: [...] }
      const responseData = result.data || result;
      
      console.log('처리된 API 응답 결과:', responseData);
      
      // details 배열을 voucher_api_results에 저장
      if (responseData.details && Array.isArray(responseData.details)) {
        localStorage.setItem('voucher_api_results', JSON.stringify(responseData.details));
      }
      
      // summary를 voucher_api_summary에 저장
      if (responseData.summary) {
        localStorage.setItem('voucher_api_summary', JSON.stringify(responseData.summary));
        
        // sessionStorage에도 순차적으로 저장
        let sessionIndex = 1;
        while (sessionStorage.getItem(`voucher_api_summary_${sessionIndex}`)) {
          sessionIndex++;
        }
        sessionStorage.setItem(`voucher_api_summary_${sessionIndex}`, JSON.stringify(responseData.summary));
      }
      
      // API 응답의 id를 key로 사용하여 이미지 URL 매핑 생성
      const newImageUrlMap = new Map<string, string>();
      const apiResponseMap = new Map<string, any>(); // id를 key로 하는 API 응답 저장
      
      // details 배열에서 각 항목 처리
      if (responseData.details && Array.isArray(responseData.details)) {
        responseData.details.forEach((detail: any, index: number) => {
          if (detail && detail.voucher) {
            const tempKey = `voucher_image_${index}`;
            const imageUrl = localStorage.getItem(tempKey);
            
            // voucher.image가 이미 blob URL인 경우 그대로 사용
            const finalImageUrl = detail.voucher.image || imageUrl;
            
            if (finalImageUrl && detail.id) {
              // id를 key로 하여 이미지 URL 저장
              localStorage.setItem(`voucher_image_${detail.id}`, finalImageUrl);
              newImageUrlMap.set(detail.id, finalImageUrl);
              apiResponseMap.set(detail.id, detail);
              
              console.log(`이미지 매핑 저장: id=${detail.id}, url=${finalImageUrl}`);
            }
          }
        });
      }
      
      // API 응답 데이터를 localStorage에 저장 (다른 컴포넌트에서 사용하기 위해)
      localStorage.setItem('voucher_api_responses', JSON.stringify(Array.from(apiResponseMap.entries())));
      
      setImageUrlMap(newImageUrlMap);
      
      // API가 완료되면 타이머 클리어하고 즉시 frame_03으로 이동
      if (analyzingTimeoutRef.current) {
        clearTimeout(analyzingTimeoutRef.current);
        analyzingTimeoutRef.current = null;
      }
      
      setIsAnalyzing(false);
      setCurrentFrame('frame_03');
    } catch (error: any) {
      console.error('업로드 오류:', error);
      
      // 오류 발생 시 타이머 클리어
      if (analyzingTimeoutRef.current) {
        clearTimeout(analyzingTimeoutRef.current);
        analyzingTimeoutRef.current = null;
      }
      
      // 사용자에게 친화적인 오류 메시지 표시
      const errorMessage = error.message || '알 수 없는 오류가 발생했습니다.';
      alert(`파일 업로드 중 오류가 발생했습니다:\n\n${errorMessage}`);
      setIsAnalyzing(false);
    }
  };

  if (currentFrame === 'ending') {
    return <EndingFrame onRestart={() => setCurrentFrame('frame_01')} />;
  }

  if (currentFrame === 'frame_06') {
    return (
      <div
        className={`transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'
        }`}
        style={{ height: '100vh', width: '100%' }}
      >
        <TripDetailFrame 
          onBack={() => setCurrentFrame('frame_05')} 
          tripIndex={selectedTripIndex}
          initialTab="wallet"
        />
      </div>
    );
  }

  if (currentFrame === 'frame_05') {
    return (
      <div
        className={`transition-all duration-300 ${
          isVisible ? 'opacity-100 translate-x-0' : 'opacity-0 translate-x-5'
        }`}
        style={{ height: '100vh', width: '100%' }}
      >
        <TripListFrame 
          onNavigate={(tripIndex) => {
            setSelectedTripIndex(tripIndex);
            setCurrentFrame('frame_06');
          }} 
          onCreateNew={() => setCurrentFrame('frame_02')}
          onBack={goToPreviousFrame}
          onMyPage={goToMyPage}
        />
      </div>
    );
  }

  if (currentFrame === 'frame_04') {
    return (
      <div
        className={`transition-all duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ height: '100vh', width: '100%' }}
      >
        <ScheduleFrame 
          onNavigate={() => setCurrentFrame('frame_05')} 
          onNavigateToWallet={() => {
            // 가장 최근 세션 인덱스를 설정
            const latestIndex = getLatestSessionIndex();
            setSelectedTripIndex(latestIndex);
            setCurrentFrame('frame_06');
          }}
          onBack={() => setCurrentFrame('frame_02')}
        />
      </div>
    );
  }

  if (currentFrame === 'frame_03') {
    return (
      <ProcessingFrame
        onComplete={() => setCurrentFrame('frame_04')}
        onBack={() => setCurrentFrame('frame_02')}
        isAnalyzing={isAnalyzing}
        onAnalyzingComplete={() => setIsAnalyzing(false)}
      />
    );
  }

  if (currentFrame === 'frame_02') {
    return (
      <div
        className={`size-full bg-gradient-modern px-5 py-6 transition-opacity duration-300 ${
          isVisible ? 'opacity-100' : 'opacity-0'
        }`}
        style={{ height: '100vh', width: '100%' }}
      >
        <div className="w-full space-y-6">
          {/* Header */}
          <div className="flex items-center gap-3">
            <Button
              onClick={goToPreviousFrame}
              variant="ghost"
              className="text-gray-700 hover:bg-white/60 rounded-xl p-2"
            >
              <ArrowLeft className="size-5 mr-1" />
            </Button>
            <h1 className="text-gray-900">AI 여행 바우처 업로드</h1>
          </div>

          {/* Upload Zone */}
          <div className="card-modern p-5">
            {!isAnalyzing ? (
              <>
                <div
                  onDragOver={handleDragOver}
                  onDragLeave={handleDragLeave}
                  onDrop={handleDrop}
                  className={`h-[100vh] border-2 border-dashed rounded-2xl p-8 transition-all duration-300 ${
                    isDragging
                      ? 'border-indigo-500 bg-indigo-50'
                      : 'border-gray-300 bg-gray-50/50'
                  }`}
                >
                  <div className="flex flex-col items-center gap-3 text-center">
                    {/* File Icon */}
                    <div className="text-5xl">📄</div>
                    
                    {/* Text */}
                    <div className="space-y-1">
                      <p className="text-gray-900">
                        파일을 선택하거나 드래그하세요
                      </p>
                      <p className="text-gray-500 text-sm">
                        PDF, PNG, JPG 형식 지원
                      </p>
                    </div>

                    {/* Selected Files */}
                    {selectedFiles.length > 0 && (
                      <div className="mt-3 space-y-2 w-full">
                        {selectedFiles.map((file, index) => (
                          <div key={index} className="flex items-center gap-2 bg-indigo-100 px-3 py-2 rounded-xl text-sm">
                            <FileText className="size-4 text-indigo-600 shrink-0" />
                            <span className="text-indigo-900 truncate">{file.name}</span>
                            {isPdfFile(file) && (
                              <span className="text-xs text-indigo-600">(PDF → 이미지 변환됨)</span>
                            )}
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Converted Images Preview */}
                    {convertedImages.length > 0 && (
                      <div className="mt-3 space-y-2 w-full">
                        <p className="text-xs text-gray-600">변환된 이미지 ({convertedImages.length}개):</p>
                        <div className="grid grid-cols-2 gap-2">
                          {convertedImages.map((image, index) => (
                            <div key={index} className="relative">
                              <img
                                src={image.url}
                                alt={image.filename}
                                className="w-full h-24 object-cover rounded-lg border border-gray-200"
                              />
                              <p className="text-xs text-gray-600 truncate mt-1">{image.filename}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Converting Status */}
                    {isConverting && (
                      <div className="mt-3 text-center text-sm text-gray-600">
                        파일을 변환하는 중...
                      </div>
                    )}
                  </div>
                </div>

                {/* Upload Button */}
                <div className="mt-5 flex justify-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept=".pdf,.png,.jpg,.jpeg"
                    onChange={handleFileSelect}
                    className="hidden"
                    multiple
                  />
                  <Button
                    onClick={() => {
                      if (selectedFiles.length > 0 && convertedImages.length > 0) {
                        handleUploadClick();
                      } else if (selectedFiles.length > 0 && !isConverting) {
                        // 파일은 선택되었지만 변환이 아직 안 된 경우
                        alert('파일 변환이 완료될 때까지 기다려주세요.');
                      } else {
                        fileInputRef.current?.click();
                      }
                    }}
                    disabled={isConverting || (selectedFiles.length > 0 && convertedImages.length === 0)}
                    className="btn-primary-modern text-white px-6 py-5 border-0 gap-2 w-full disabled:opacity-50 disabled:cursor-not-allowed"
                  >
                    <Upload className="size-5" />
                    {isConverting
                      ? '변환 중...'
                      : selectedFiles.length > 0 && convertedImages.length > 0
                      ? `${convertedImages.length}개 이미지 업로드하기`
                      : selectedFiles.length > 0
                      ? '변환 대기 중...'
                      : '파일 선택하기'}
                  </Button>
                </div>
              </>
            ) : (
              <div
                className="flex flex-col items-center gap-6 py-8 transition-opacity duration-500"
                // style={{ height: '100vh', width: '100%' }}
              >
                {/* AI Logo */}
                <div
                  className="flex items-center gap-3 transition-all duration-600"
                  style={{ transitionDelay: '300ms' }}
                >
                  <div className="card-accent p-3">
                    <svg className="size-10 text-white" viewBox="0 0 24 24" fill="none">
                      <path d="M12 2L2 7L12 12L22 7L12 2Z" fill="currentColor" opacity="0.3"/>
                      <path d="M2 17L12 22L22 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                      <path d="M2 12L12 17L22 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    </svg>
                  </div>
                  <div className="text-gray-900">
                    <div className="text-xs text-gray-600">Powered by</div>
                    <div>AI Nori</div>
                  </div>
                </div>

                {/* Analyzing Text */}
                <div
                  className="text-center space-y-1 transition-all duration-500"
                  style={{ transitionDelay: '500ms' }}
                >
                  <p className="text-gray-900 text-xl">
                    AI가 바우처를 분석 중입니다…
                  </p>
                  <p className="text-gray-600 text-sm">
                    잠시만 기다려주세요
                  </p>
                </div>

                {/* Loading Animation */}
                <div
                  className="flex gap-2 transition-opacity duration-500"
                  style={{ transitionDelay: '700ms' }}
                >
                  {[0, 1, 2].map((i) => (
                    <div
                      key={i}
                      className="size-3 bg-indigo-500 rounded-full"
                      style={{
                        animation: `dotBounce 1.4s infinite ease-in-out`,
                        animationDelay: `${i * 0.16}s`,
                      }}
                    />
                  ))}
                </div>
                <style>{`
                  @keyframes dotBounce {
                    0%, 60%, 100% {
                      transform: translateY(0);
                      opacity: 0.4;
                    }
                    30% {
                      transform: translateY(-10px);
                      opacity: 1;
                    }
                  }
                `}</style>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div
      className={`size-full flex flex-col bg-gradient-modern transition-opacity duration-300 ${
        isVisible ? 'opacity-100' : 'opacity-0'
      }`}
      style={{ height: '100vh', width: '100%' }}
    >
      {/* Header */}
      <div className="px-5 pt-6 pb-4 flex items-center justify-between">
        <Button
          onClick={goToPreviousFrame}
          variant="ghost"
          className="text-gray-700 hover:bg-white/60 rounded-xl p-2 -ml-2"
        >
          <ArrowLeft className="size-5 mr-1" />
          뒤로
        </Button>
        <Button
          onClick={goToMyPage}
          variant="ghost"
          className="text-gray-700 hover:bg-white/60 rounded-xl p-2"
        >
          <UserCircle className="size-5" />
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center px-5 py-8">
        <div className="w-full text-center space-y-6">
          {/* AI Character Icon */}
          <div className="flex justify-center">
            <div 
              className="relative" 
              style={{ 
                animation: 'dynamicBounce 3.5s cubic-bezier(0.68, -0.55, 0.265, 1.35) infinite'
              }}
            >
              <img src={aiCharacter} alt="AI Character" className="w-24 h-24" />
            </div>
          </div>

        {/* Title Text */}
        <div
          className={`space-y-3 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: '200ms' }}
        >
          <h1 className="text-gray-900 font-[Pretendard] text-[36px] leading-tight font-normal">
            내 여행<br />
            이제  <span className="font-bold">AI 노리</span>가<br />
            챙겨줍니다
          </h1>
          
          {/* Sub Text */}
          <p className="text-gray-600 leading-relaxed text-[16px] px-4">
          클룩, 트리플, 이메일 어디서 결제했든,

          <br />
          AI 노리가 자동으로 정리해드립니다.
          </p>
        </div>

        {/* Primary Button */}
        <div
          className={`pt-4 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-5'
          }`}
          style={{ transitionDelay: '400ms' }}
        >
          <Button
            onClick={() => {
              
              setCurrentFrame('frame_02')
            }}
            className="btn-primary-modern text-white px-8 py-6 border-0 w-full max-w-[340px]"
          >
            여행 바우처 불러오기
          </Button>
        </div>
        </div>
      </div>
    </div>
  );
}
