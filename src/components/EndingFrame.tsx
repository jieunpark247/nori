import { motion } from 'motion/react';
import { Button } from './ui/button';
import { Sparkles } from 'lucide-react';

interface EndingFrameProps {
  onRestart: () => void;
}

export function EndingFrame({ onRestart }: EndingFrameProps) {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 1 }}
      className="size-full flex items-center justify-center bg-gradient-modern px-5 py-8"
    >
      <div className="w-full text-center space-y-6">
        {/* Success Icon */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.5, duration: 0.6, type: 'spring' }}
          className="flex justify-center"
        >
          <div className="relative">
            <div className="absolute inset-0 bg-indigo-200/50 rounded-full blur-3xl" />
            <div className="relative card-accent p-8">
              <Sparkles className="size-16 text-white" strokeWidth={1.5} />
            </div>
          </div>
        </motion.div>

        {/* Title */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1, duration: 0.6 }}
          className="space-y-3 px-4"
        >
          <h1 className="text-gray-900 text-3xl">
            여행 준비 완료!
          </h1>
          
          <p className="text-gray-600 leading-relaxed">
            모든 일정이 정리되었습니다.<br />
            즐거운 여행 되세요! ✈️
          </p>
        </motion.div>

        {/* Restart Button */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.5, duration: 0.6 }}
          className="pt-4"
        >
          <Button
            onClick={onRestart}
            className="btn-primary-modern text-white px-6 py-5 border-0 w-full max-w-[340px]"
          >
            처음으로 돌아가기
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
}
