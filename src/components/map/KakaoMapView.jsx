import React from 'react';
import MapSearchBar from './MapSearchBar';
import MapCategoryBar from './MapCategoryBar';
import PlaceListPanel from './PlaceListPanel';
import PlaceDetailCard from './PlaceDetailCard';
import MapControls from './MapControls';

/**
 * 카카오맵 View — Tailwind 반응형 UI 셸
 *
 * 데스크톱: [지도 flex-1] + [사이드패널 w-80]
 * 모바일:   [지도 full] + [바텀시트 fixed] or [상세 overlay]
 */
export default function KakaoMapView({
  mapContainerRef,
  locations,
  selectedPlace,
  onCloseDetail,
  selectedCategory,
  onCategoryChange,
  searchQuery,
  setSearchQuery,
  onSearch,
  isSearching,
  onPlaceClick,
  onZoomIn,
  onZoomOut,
  onMyLocation,
  isLoadingLocation,
  reviews,
  favorites,
  isFavorite,
  onToggleFavorite,
  showFavorites,
  onToggleShowFavorites,
  showResearch,
  onResearchArea,
}) {
  return (
    <div className="relative w-full flex overflow-hidden
                    bg-secondary dark:bg-dark-surface transition-colors duration-200"
         style={{ height: 'calc(100vh - var(--header-height, 60px))' }}>

      {/* ============================================================
          지도 영역 (flex-1)
          ============================================================ */}
      <div className="flex-1 relative min-w-0">
        {/* 카카오맵 캔버스 */}
        <div ref={mapContainerRef} className="absolute inset-0" />

        {/* ── 상단 오버레이: 검색 + 카테고리 ── */}
        <div className="absolute top-0 inset-x-0 z-20 p-3 pb-0
                        md:pr-[calc(20rem+0.75rem)]">
          <div className="space-y-2">
            <MapSearchBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              onSearch={onSearch}
              isSearching={isSearching}
            />
            <MapCategoryBar
              selectedCategory={selectedCategory}
              onCategoryChange={onCategoryChange}
              locationCount={locations.length}
            />
          </div>
        </div>

        {/* ── "이 지역 재검색" 플로팅 버튼 (네이버맵 스타일) ── */}
        {showResearch && (
          <div className="absolute top-[6.5rem] left-1/2 -translate-x-1/2 z-20 md:left-1/2">
            <button
              onClick={onResearchArea}
              className="flex items-center gap-2 px-4 py-2.5 rounded-full
                         bg-white/95 dark:bg-dark-surface2/95 backdrop-blur-md
                         shadow-lg border border-white/50 dark:border-dark-border/50
                         text-sm font-semibold text-primary dark:text-accent
                         hover:shadow-xl hover:scale-[1.02]
                         active:scale-95 transition-all duration-200"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                      d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              이 지역 재검색
            </button>
          </div>
        )}

        {/* ── 우하단 컨트롤 ── */}
        <div className="absolute bottom-28 md:bottom-6 right-3 z-20">
          <MapControls
            onZoomIn={onZoomIn}
            onZoomOut={onZoomOut}
            onMyLocation={onMyLocation}
            isLoadingLocation={isLoadingLocation}
          />
        </div>

        {/* ── 모바일: 장소 상세 오버레이 ── */}
        {selectedPlace && (
          <div className="md:hidden fixed inset-0 z-40 flex flex-col">
            <button className="flex-shrink-0 h-12 w-full" onClick={onCloseDetail} aria-label="닫기" />
            <div className="flex-1 rounded-t-2xl overflow-hidden shadow-[0_-8px_30px_rgba(0,0,0,0.15)]">
              <PlaceDetailCard
                place={selectedPlace}
                onClose={onCloseDetail}
                isFavorite={isFavorite(selectedPlace.id)}
                onToggleFavorite={onToggleFavorite}
                reviews={reviews}
              />
            </div>
          </div>
        )}
      </div>

      {/* ============================================================
          사이드 영역
          ============================================================ */}
      {selectedPlace ? (
        <div className="hidden md:flex flex-col w-80 flex-shrink-0 h-full
                        border-l border-gray-100 dark:border-dark-border">
          <PlaceDetailCard
            place={selectedPlace}
            onClose={onCloseDetail}
            isFavorite={isFavorite(selectedPlace.id)}
            onToggleFavorite={onToggleFavorite}
            reviews={reviews}
          />
        </div>
      ) : (
        <PlaceListPanel
          locations={locations}
          selectedPlace={selectedPlace}
          onPlaceClick={onPlaceClick}
          isFavorite={isFavorite}
          onToggleFavorite={onToggleFavorite}
          showFavorites={showFavorites}
          favorites={favorites}
          onToggleShowFavorites={onToggleShowFavorites}
        />
      )}
    </div>
  );
}
