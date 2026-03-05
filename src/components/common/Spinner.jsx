import React from 'react';

/**
 * 전체화면 로딩 스피너 (styled-components 제거, 순수 Tailwind)
 * Suspense fallback 및 페이지 전환 로딩에 사용
 */
const Spinner = () => {
  return (
    <div className="fixed inset-0 z-50 flex flex-col items-center justify-center
                    bg-secondary dark:bg-dark-surface">
      <img
        src={`${process.env.PUBLIC_URL}/images/borikkori_loading_spinner.gif`}
        alt="로딩중"
        className="w-20 h-20"
      />
      <p className="mt-4 text-base font-semibold text-primary dark:text-primary-light">
        로딩중...
      </p>
    </div>
  );
};

export default Spinner;
