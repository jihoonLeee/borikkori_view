import React from 'react';

/**
 * 지도 컨트롤 버튼 — 나침반 스타일 원형 FAB
 * (구글맵/네이버맵 스타일)
 */
export default function MapControls({ onZoomIn, onZoomOut, onMyLocation, isLoadingLocation }) {
  const btnClass = `w-11 h-11 rounded-full flex items-center justify-center
                    bg-white/90 dark:bg-dark-surface2/90 backdrop-blur-sm
                    shadow-lg border border-white/50 dark:border-dark-border/50
                    text-content-primary dark:text-white
                    hover:bg-white dark:hover:bg-dark-surface3
                    active:scale-90 transition-all duration-150`;

  return (
    <div className="flex flex-col gap-2.5">
      {/* 내 위치 — 상단에 분리 (구글맵 스타일) */}
      <button onClick={onMyLocation} className={btnClass} aria-label="내 위치" disabled={isLoadingLocation}>
        {isLoadingLocation ? (
          <div className="w-5 h-5 border-2 border-primary/30 border-t-primary dark:border-accent/30 dark:border-t-accent rounded-full animate-spin" />
        ) : (
          <svg className="w-5 h-5 text-primary dark:text-accent" viewBox="0 0 24 24" fill="none" stroke="currentColor">
            <circle cx="12" cy="12" r="3" strokeWidth={2} />
            <path strokeLinecap="round" strokeWidth={2} d="M12 2v4M12 18v4M2 12h4M18 12h4" />
          </svg>
        )}
      </button>

      {/* 줌 그룹 — 하나로 묶기 */}
      <div className="rounded-full overflow-hidden shadow-lg border border-white/50 dark:border-dark-border/50">
        <button onClick={onZoomIn} aria-label="확대"
          className="w-11 h-10 flex items-center justify-center
                     bg-white/90 dark:bg-dark-surface2/90 backdrop-blur-sm
                     text-content-primary dark:text-white
                     hover:bg-gray-50 dark:hover:bg-dark-surface3
                     active:bg-gray-100 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v12M6 12h12" />
          </svg>
        </button>
        <div className="h-px bg-gray-200 dark:bg-dark-border" />
        <button onClick={onZoomOut} aria-label="축소"
          className="w-11 h-10 flex items-center justify-center
                     bg-white/90 dark:bg-dark-surface2/90 backdrop-blur-sm
                     text-content-primary dark:text-white
                     hover:bg-gray-50 dark:hover:bg-dark-surface3
                     active:bg-gray-100 transition-all">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 12h12" />
          </svg>
        </button>
      </div>
    </div>
  );
}
