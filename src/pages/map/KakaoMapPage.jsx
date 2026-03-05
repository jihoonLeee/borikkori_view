import React, { useState, useEffect } from 'react';
import KakaoMapContainer from '../../containers/map/KakaoMapContainer';

/**
 * 지도 페이지 — MUI 완전 제거, Tailwind 로딩
 */
const KakaoMapPage = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center
                       bg-secondary dark:bg-dark-surface transition-colors duration-200">
        <img
          src="/images/borikkori_cartoon_1.png"
          alt="보리꼬리 로딩"
          className="max-w-[250px] md:max-w-[300px] animate-bounce"
        />
        <p className="mt-4 text-lg font-bold text-primary dark:text-primary-light text-center">
          지도를 불러오는 중...
        </p>
        <div className="mt-3 w-6 h-6 border-2 border-primary dark:border-accent
                        border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return <KakaoMapContainer />;
};

export default KakaoMapPage;
