import React, { useState, useRef, useCallback } from 'react';
import { CATEGORY_EMOJI_MAP } from '../../utils/mapConstants';

/**
 * 장소 목록 패널
 * 데스크톱: 우측 사이드 패널 (w-80)
 * 모바일: 바텀시트 (peek → half → full) — 구글맵/네이버맵 스타일
 */
export default function PlaceListPanel({
  locations,
  selectedPlace,
  onPlaceClick,
  isFavorite,
  onToggleFavorite,
  showFavorites,
  favorites,
  onToggleShowFavorites,
  sortBy = 'distance',
  onSortChange,
}) {
  const [sheetState, setSheetState] = useState('collapsed');
  const dragStartRef = useRef(null);

  const displayList = showFavorites ? favorites : locations;

  // 터치 드래그
  const handleTouchStart = useCallback((e) => {
    dragStartRef.current = e.touches[0].clientY;
  }, []);

  const handleTouchEnd = useCallback((e) => {
    if (dragStartRef.current === null) return;
    const delta = dragStartRef.current - e.changedTouches[0].clientY;
    dragStartRef.current = null;
    if (delta > 40) setSheetState(prev => prev === 'collapsed' ? 'half' : 'full');
    else if (delta < -40) setSheetState(prev => prev === 'full' ? 'half' : 'collapsed');
  }, []);

  const sheetHeightClass = {
    collapsed: 'h-[4.5rem]',
    half: 'h-[45vh]',
    full: 'h-[85vh]',
  }[sheetState];

  const getEmoji = (place) => {
    const key = Object.keys(CATEGORY_EMOJI_MAP).find(k => place.category_name?.includes(k));
    return CATEGORY_EMOJI_MAP[key] || '📍';
  };

  // 거리 표시 (m → km)
  const formatDistance = (d) => {
    if (!d) return '';
    const m = Number(d);
    return m >= 1000 ? `${(m / 1000).toFixed(1)}km` : `${m}m`;
  };

  // ── 장소 카드 ──
  const PlaceCard = ({ place }) => {
    const isActive = selectedPlace?.id === place.id;
    const fav = typeof isFavorite === 'function' ? isFavorite(place.id) : false;

    return (
      <button
        onClick={() => onPlaceClick(place)}
        className={`w-full text-left p-3 rounded-2xl transition-all duration-200 group
                    ${isActive
                      ? 'bg-primary/8 dark:bg-accent/10 ring-1 ring-primary/20 dark:ring-accent/20'
                      : 'hover:bg-gray-50 dark:hover:bg-dark-surface3'
                    }`}
      >
        <div className="flex items-start gap-3">
          {/* 이모지 아이콘 */}
          <div className={`w-11 h-11 rounded-xl flex items-center justify-center text-lg flex-shrink-0
                          ${isActive
                            ? 'bg-primary/15 dark:bg-accent/15'
                            : 'bg-gray-100 dark:bg-dark-surface3 group-hover:bg-gray-200 dark:group-hover:bg-dark-border'
                          } transition-colors`}>
            {getEmoji(place)}
          </div>

          <div className="flex-1 min-w-0">
            <div className="flex items-center gap-1.5">
              <h3 className="text-sm font-bold text-content-primary dark:text-white truncate">
                {place.place_name}
              </h3>
              {place.distance && (
                <span className="text-[11px] text-primary dark:text-accent font-medium flex-shrink-0">
                  {formatDistance(place.distance)}
                </span>
              )}
            </div>

            {/* 카테고리 + 별점 인라인 */}
            <div className="flex items-center gap-1.5 mt-0.5">
              {place.category_name && (
                <span className="text-[11px] text-content-secondary dark:text-gray-400 truncate">
                  {place.category_name.split(' > ').pop()}
                </span>
              )}
              {place.rating && (
                <>
                  <span className="text-content-disabled">·</span>
                  <span className="text-[11px] text-yellow-500 font-medium">
                    ★ {Number(place.rating).toFixed(1)}
                  </span>
                </>
              )}
            </div>

            <p className="text-[11px] text-content-disabled dark:text-gray-500 truncate mt-0.5">
              {place.road_address_name || place.address_name}
            </p>
          </div>

          {/* 즐겨찾기 */}
          <button
            onClick={(e) => { e.stopPropagation(); onToggleFavorite(place); }}
            className="p-1.5 flex-shrink-0 rounded-full hover:bg-gray-100 dark:hover:bg-dark-surface3 transition-colors"
          >
            <span className="text-sm">{fav ? '❤️' : '🤍'}</span>
          </button>
        </div>
      </button>
    );
  };

  // ── 빈 상태 ──
  const EmptyState = () => (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      <div className="w-16 h-16 rounded-full bg-gray-100 dark:bg-dark-surface3 flex items-center justify-center mb-4">
        <span className="text-3xl">{showFavorites ? '💝' : '🐕'}</span>
      </div>
      <p className="text-sm font-bold text-content-primary dark:text-white mb-1">
        {showFavorites ? '즐겨찾기가 없어요' : '주변 장소가 없어요'}
      </p>
      <p className="text-xs text-content-secondary dark:text-gray-400 leading-relaxed">
        {showFavorites ? '마음에 드는 장소를 ❤️ 눌러 저장해보세요' : '카테고리를 선택하거나\n지역을 검색해보세요'}
      </p>
    </div>
  );

  // ── 헤더 ──
  const PanelHeader = ({ className = '' }) => (
    <div className={`flex items-center justify-between px-4 py-3 ${className}`}>
      <div className="flex items-center gap-2">
        <h2 className="text-sm font-bold text-content-primary dark:text-white">
          {showFavorites ? '즐겨찾기' : '주변 장소'}
        </h2>
        <span className="text-xs text-content-secondary dark:text-gray-400 bg-gray-100 dark:bg-dark-surface3 px-2 py-0.5 rounded-full">
          {displayList.length}
        </span>
      </div>
      <div className="flex items-center gap-2">
        {/* 정렬 (거리/이름) */}
        {!showFavorites && onSortChange && locations.length > 0 && (
          <select
            value={sortBy}
            onChange={(e) => onSortChange(e.target.value)}
            className="text-[11px] bg-transparent text-content-secondary dark:text-gray-400
                       border-none focus:outline-none cursor-pointer"
          >
            <option value="distance">거리순</option>
            <option value="name">이름순</option>
          </select>
        )}
        {/* 즐겨찾기 토글 */}
        <button
          onClick={onToggleShowFavorites}
          className={`flex items-center gap-1 text-xs px-2.5 py-1.5 rounded-full transition-all
                      ${showFavorites
                        ? 'bg-red-50 dark:bg-red-900/20 text-red-500 font-medium'
                        : 'text-content-secondary dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-dark-surface3'
                      }`}
        >
          <span className="text-sm">❤️</span>
          <span>{showFavorites ? '목록' : favorites.length}</span>
        </button>
      </div>
    </div>
  );

  return (
    <>
      {/* ═══ 데스크톱: 사이드 패널 ═══ */}
      <div className="hidden md:flex flex-col w-80 h-full
                       bg-white dark:bg-dark-surface2
                       border-l border-gray-100 dark:border-dark-border">
        <PanelHeader className="border-b border-gray-100 dark:border-dark-border" />
        <div className="flex-1 overflow-y-auto p-2 space-y-0.5">
          {displayList.length === 0 ? <EmptyState /> : (
            displayList.map((place) => <PlaceCard key={place.id} place={place} />)
          )}
        </div>
      </div>

      {/* ═══ 모바일: 바텀시트 ═══ */}
      <div
        className={`md:hidden fixed bottom-0 left-0 right-0 z-30
                    bg-white dark:bg-dark-surface2
                    rounded-t-2xl shadow-[0_-4px_20px_rgba(0,0,0,0.1)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)]
                    transition-all duration-300 ease-out
                    ${sheetHeightClass}`}
        style={{ paddingBottom: 'env(safe-area-inset-bottom)' }}
      >
        {/* 드래그 핸들 */}
        <div
          onTouchStart={handleTouchStart}
          onTouchEnd={handleTouchEnd}
          onClick={() => setSheetState(prev => prev === 'collapsed' ? 'half' : 'collapsed')}
          className="cursor-grab active:cursor-grabbing"
        >
          <div className="flex justify-center pt-2.5 pb-1">
            <div className="w-9 h-1 rounded-full bg-gray-300 dark:bg-gray-600" />
          </div>

          {/* peek 상태: 첫 번째 장소 미리보기 (구글맵 스타일) */}
          {sheetState === 'collapsed' ? (
            <div className="px-4 pb-2">
              {displayList.length > 0 ? (
                <div className="flex items-center gap-3">
                  <div className="w-9 h-9 rounded-lg bg-gray-100 dark:bg-dark-surface3 flex items-center justify-center text-base">
                    {getEmoji(displayList[0])}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-content-primary dark:text-white truncate">
                      {displayList[0].place_name}
                    </p>
                    <p className="text-[11px] text-content-secondary dark:text-gray-400">
                      {showFavorites ? `❤️ 즐겨찾기 ${favorites.length}개` : `${locations.length}개 장소`}
                      {displayList[0].distance && ` · ${formatDistance(displayList[0].distance)}`}
                    </p>
                  </div>
                  <svg className="w-4 h-4 text-content-disabled" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
                  </svg>
                </div>
              ) : (
                <div className="flex items-center gap-2">
                  <span className="text-base">🐾</span>
                  <span className="text-sm text-content-secondary dark:text-gray-400">
                    카테고리를 선택하거나 검색해보세요
                  </span>
                </div>
              )}
            </div>
          ) : (
            <PanelHeader />
          )}
        </div>

        {/* 리스트 */}
        {sheetState !== 'collapsed' && (
          <div className="flex-1 overflow-y-auto px-2 pb-3 space-y-0.5">
            {displayList.length === 0 ? <EmptyState /> : (
              displayList.map((place) => <PlaceCard key={place.id} place={place} />)
            )}
          </div>
        )}
      </div>
    </>
  );
}
