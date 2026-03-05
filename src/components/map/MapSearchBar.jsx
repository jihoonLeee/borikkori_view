import React, { useState, useRef, useEffect } from 'react';
import { LS_KEYS } from '../../utils/mapConstants';

/**
 * 지도 검색창 — 글래스모피즘, 최근 검색어, X 지우기
 * (구글맵/네이버맵 스타일)
 */
export default function MapSearchBar({ searchQuery, setSearchQuery, onSearch, isSearching }) {
  const [showRecent, setShowRecent] = useState(false);
  const [recentSearches, setRecentSearches] = useState(() => {
    try { return JSON.parse(localStorage.getItem(LS_KEYS.RECENT_SEARCHES) || '[]'); }
    catch { return []; }
  });
  const inputRef = useRef(null);
  const wrapperRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) setShowRecent(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const saveRecent = (q) => {
    if (!q.trim()) return;
    const next = [q, ...recentSearches.filter(s => s !== q)].slice(0, 8);
    setRecentSearches(next);
    localStorage.setItem(LS_KEYS.RECENT_SEARCHES, JSON.stringify(next));
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) return;
    saveRecent(searchQuery.trim());
    setShowRecent(false);
    onSearch();
  };

  const handleRecentClick = (q) => {
    setSearchQuery(q);
    setShowRecent(false);
    saveRecent(q);
    setTimeout(() => onSearch(q), 50);
  };

  const removeRecent = (e, q) => {
    e.stopPropagation();
    const next = recentSearches.filter(s => s !== q);
    setRecentSearches(next);
    localStorage.setItem(LS_KEYS.RECENT_SEARCHES, JSON.stringify(next));
  };

  const clearAll = (e) => {
    e.stopPropagation();
    setRecentSearches([]);
    localStorage.removeItem(LS_KEYS.RECENT_SEARCHES);
  };

  return (
    <div ref={wrapperRef} className="relative">
      {/* 검색 입력 — 글래스모피즘 */}
      <div className="flex items-center
                      bg-white/80 dark:bg-dark-surface2/80
                      backdrop-blur-md rounded-2xl shadow-lg
                      border border-white/50 dark:border-dark-border/50
                      overflow-hidden
                      focus-within:ring-2 focus-within:ring-primary/40 dark:focus-within:ring-accent/40
                      transition-all duration-200">
        {/* 돋보기 */}
        <div className="pl-3.5 flex-shrink-0">
          {isSearching ? (
            <div className="w-5 h-5 border-2 border-primary/30 border-t-primary dark:border-accent/30 dark:border-t-accent rounded-full animate-spin" />
          ) : (
            <svg className="w-5 h-5 text-content-secondary dark:text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          )}
        </div>

        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => recentSearches.length > 0 && setShowRecent(true)}
          onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
          placeholder="장소·주소·키워드 검색"
          className="flex-1 bg-transparent px-3 py-3 text-sm
                     text-content-primary dark:text-white
                     placeholder:text-content-disabled dark:placeholder:text-gray-500
                     focus:outline-none"
        />

        {/* X 지우기 */}
        {searchQuery && (
          <button
            onClick={() => { setSearchQuery(''); inputRef.current?.focus(); }}
            className="p-2 mr-0.5 text-content-disabled hover:text-content-secondary
                       dark:text-gray-500 dark:hover:text-gray-300 transition-colors"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        )}

        {/* 검색 버튼 */}
        <button
          onClick={handleSearch}
          disabled={isSearching || !searchQuery.trim()}
          className="px-4 py-3 text-sm font-semibold
                     bg-primary dark:bg-accent text-white
                     hover:bg-primary-dark dark:hover:bg-accent-dark
                     disabled:opacity-40 transition-colors"
        >
          검색
        </button>
      </div>

      {/* 최근 검색어 드롭다운 */}
      {showRecent && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-2 z-50
                        bg-white/95 dark:bg-dark-surface2/95 backdrop-blur-lg
                        rounded-2xl shadow-lg
                        border border-gray-100 dark:border-dark-border overflow-hidden">
          <div className="flex items-center justify-between px-4 py-2.5
                          border-b border-gray-100 dark:border-dark-border">
            <span className="text-xs font-medium text-content-secondary dark:text-gray-400">최근 검색</span>
            <button onClick={clearAll} className="text-xs text-content-disabled hover:text-red-500 transition-colors">
              전체 삭제
            </button>
          </div>
          {recentSearches.map((q, i) => (
            <button
              key={i}
              onClick={() => handleRecentClick(q)}
              className="w-full flex items-center justify-between px-4 py-2.5 text-sm
                         text-content-primary dark:text-white
                         hover:bg-gray-50 dark:hover:bg-dark-surface3 transition-colors"
            >
              <div className="flex items-center gap-2.5">
                <svg className="w-4 h-4 text-content-disabled" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
                        d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{q}</span>
              </div>
              <span onClick={(e) => removeRecent(e, q)}
                    className="text-content-disabled hover:text-red-500 p-1 rounded-full
                               hover:bg-red-50 dark:hover:bg-red-900/20 transition-all">
                <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}
