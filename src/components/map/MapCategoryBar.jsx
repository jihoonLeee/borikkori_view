import React from 'react';
import { CATEGORIES } from '../../utils/mapConstants';

/**
 * 카테고리 칩 바 — 결과 카운트 배지 + 스크롤
 * (네이버/구글맵 스타일)
 */
export default function MapCategoryBar({ selectedCategory, onCategoryChange, locationCount = 0 }) {
  return (
    <div className="flex gap-2 overflow-x-auto scrollbar-hide py-0.5 -mx-1 px-1">
      {CATEGORIES.map((cat) => {
        const isSelected = selectedCategory === cat.keyword;
        return (
          <button
            key={cat.key}
            onClick={() => onCategoryChange(cat.keyword)}
            className={`flex items-center gap-1.5 px-3.5 py-2 rounded-full text-[13px] font-medium
                        whitespace-nowrap flex-shrink-0 transition-all duration-200
                        ${isSelected
                          ? 'bg-primary dark:bg-accent text-white shadow-md shadow-primary/25 dark:shadow-accent/25'
                          : 'bg-white/80 dark:bg-dark-surface2/80 backdrop-blur-sm text-content-primary dark:text-gray-300 shadow-sm hover:shadow-md hover:scale-[1.02]'
                        }`}
          >
            <span className="text-base leading-none">{cat.emoji}</span>
            <span>{cat.label}</span>
            {/* 선택된 카테고리에 결과 카운트 표시 */}
            {isSelected && locationCount > 0 && (
              <span className="ml-0.5 bg-white/25 text-[10px] px-1.5 py-0.5 rounded-full font-bold leading-none">
                {locationCount}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}
