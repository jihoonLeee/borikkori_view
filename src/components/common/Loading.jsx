import React from 'react';
import loadingGif from '../../assets/loading.gif';

/**
 * DBTI 전용 로딩 컴포넌트 (styled-components 제거, 순수 Tailwind)
 */
export default function Loading() {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center
                    bg-secondary dark:bg-dark-surface">
      <p className="text-2xl font-bold text-primary dark:text-primary-light mb-6">
        너네 강아지 MBTI 뭐야?
      </p>
      <img src={loadingGif} alt="로딩중" className="w-20 h-20" />
    </div>
  );
}
