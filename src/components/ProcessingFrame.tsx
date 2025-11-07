import React, { useState, useEffect, useRef } from 'react';
import { ArrowLeft } from 'lucide-react';
import { Button } from './ui/button';

const processingSteps = [
  '🧠 여행 정보를 읽는 중…',
  '🚆 교통 정보 읽는 중...',
  '🕒 숙소 정보 읽는 중...',
  '✅ 일정에 반영 중…',
];

interface ProcessingFrameProps {
  onComplete: () => void;
  onBack?: () => void;
  isAnalyzing?: boolean;
  onAnalyzingComplete?: () => void;
}

export function ProcessingFrame({ onComplete, onBack, isAnalyzing, onAnalyzingComplete }: ProcessingFrameProps) {
  const [currentStep, setCurrentStep] = useState(0);
  const [isExiting, setIsExiting] = useState(false);
  const [isVisible, setIsVisible] = useState(false);
  const intervalRef = useRef(null as ReturnType<typeof setInterval> | null);
  const timeoutRef = useRef(null as ReturnType<typeof setTimeout> | null);
  const exitTimeoutRef = useRef(null as ReturnType<typeof setTimeout> | null);

  // isAnalyzing이 false가 되면 완료 처리
  useEffect(() => {
    if (isAnalyzing === false && onAnalyzingComplete) {
      // isAnalyzing이 false가 되면 완료 처리
      onAnalyzingComplete();
      
      // 약간의 딜레이 후 다음 프레임으로 이동
      exitTimeoutRef.current = setTimeout(() => {
        setIsExiting(true);
        setTimeout(() => {
          onComplete();
        }, 300);
      }, 500);
    }
  }, [isAnalyzing, onAnalyzingComplete, onComplete]);

  useEffect(() => {
    setIsVisible(true);
    
    // isAnalyzing이 true인 동안만 진행 단계 표시
    if (isAnalyzing) {
      // Change text every 1.5 seconds
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < processingSteps.length - 1) {
            return prev + 1;
          }
          if (intervalRef.current) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
          }
          return prev;
        });
      }, 1500);
    } else {
      // isAnalyzing이 false이면 진행 단계를 계속 순환
      intervalRef.current = setInterval(() => {
        setCurrentStep((prev) => {
          if (prev < processingSteps.length - 1) {
            return prev + 1;
          }
          return 0; // 다시 처음으로
        });
      }, 1500);
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
        timeoutRef.current = null;
      }
      if (exitTimeoutRef.current) {
        clearTimeout(exitTimeoutRef.current);
        exitTimeoutRef.current = null;
      }
    };
  }, [isAnalyzing]);

  const handleBack = () => {
    // 모든 타이머 정리
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
      timeoutRef.current = null;
    }
    if (exitTimeoutRef.current) {
      clearTimeout(exitTimeoutRef.current);
      exitTimeoutRef.current = null;
    }

    // 상태 초기화
    setCurrentStep(0);
    setIsExiting(false);
    setIsVisible(false);

    // 뒤로가기 실행
    if (onBack) {
      onBack();
    }
  };

  return (
    <div
      className={`relative size-full flex flex-col bg-gradient-modern overflow-hidden transition-opacity duration-300 ${
        isExiting ? 'opacity-0' : 'opacity-100'
      }`}
      style={{ height: '100vh', width: '100%' }}
    >
      {/* Header */}
      {onBack && (
        <div
          className={`px-5 pt-6 pb-4 z-20 transition-all duration-500 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-5'
          }`}
        >
          <Button
            onClick={handleBack}
            variant="ghost"
            className="text-gray-700 hover:bg-white/60 rounded-xl p-2 -ml-2"
          >
            <ArrowLeft className="size-5 mr-1" />
            뒤로
          </Button>
        </div>
      )}

      {/* Pulsing Light Effect */}
      <div className="absolute inset-0 flex items-center justify-center">
        <div className="w-[500px] h-[500px] bg-indigo-200 rounded-full blur-[150px] animate-pulse" />
      </div>

      {/* Content */}
      <div className="flex-1 flex items-center justify-center relative z-10">
        {/* Animated Text Sequence */}
        <div className="w-full px-5">
        <div className="card-modern p-6">
          <div className="min-h-[100px] flex items-center justify-center">
            <div
              key={currentStep}
              className="text-gray-900 py-4 px-5 bg-indigo-50 rounded-2xl text-center border border-indigo-100 text-[15px] leading-relaxed transition-all duration-400"
            >
              {processingSteps[currentStep]}
            </div>
          </div>

          {/* Loading Indicator */}
          <div
            className={`mt-5 flex justify-center transition-all duration-500 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '300ms' }}
          >
            <div className="flex gap-2">
              {[0, 1, 2].map((i) => (
                <div
                  key={i}
                  className="w-2 h-2 bg-indigo-500 rounded-full"
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
                  transform: translateY(-6px);
                  opacity: 1;
                }
              }
            `}</style>
          </div>

          {/* Progress Indicator */}
          <div
            className={`mt-4 flex justify-center gap-1.5 transition-all duration-500 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: '500ms' }}
          >
            {processingSteps.map((_, index) => (
              <div
                key={index}
                className={`h-1 w-6 rounded-full transition-all duration-500 ${
                  index <= currentStep ? 'bg-indigo-500' : 'bg-gray-300'
                }`}
                style={{
                  animation: index <= currentStep 
                    ? `progressBarPulse 1.5s infinite ease-in-out`
                    : 'none',
                  animationDelay: `${index * 0.1}s`,
                }}
              />
            ))}
            <style>{`
              @keyframes progressBarPulse {
                0%, 100% {
                  opacity: 1;
                  transform: scaleX(1);
                }
                50% {
                  opacity: 0.7;
                  transform: scaleX(1.1);
                }
              }
            `}</style>
          </div>
        </div>
        </div>
      </div>
    </div>
  );
}
