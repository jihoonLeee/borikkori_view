import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import DateFormat from '../../utils/DateFormat';
import { BOARD_CATEGORIES } from '../../constants/boardCategory';
import { getCategoryInfo } from '../../utils/categoryUtils';

/* ── 카테고리 뱃지 ────────────────────────────────────────────── */
const CategoryBadge = ({ categoryKey, small = false }) => {
  const { name, color, isNotice } = getCategoryInfo(categoryKey);
  return (
    <span
      className={`inline-flex items-center rounded-full font-semibold shrink-0
                  ${small ? 'text-2xs px-1.5 py-0.5' : 'text-xs px-2 py-0.5'}`}
      style={{ color, backgroundColor: `${color}18`, fontWeight: isNotice ? 700 : 600 }}
    >
      {name}
    </span>
  );
};

/* ── 페이지네이션 ──────────────────────────────────────────────── */
const Pagination = ({ page, totalPages, onPageChange }) => {
  if (totalPages <= 1) return null;
  const pages = Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
    if (totalPages <= 7) return i + 1;
    if (page <= 4) return i + 1;
    if (page >= totalPages - 3) return totalPages - 6 + i;
    return page - 3 + i;
  });

  return (
    <div className="flex items-center justify-center gap-1 mt-6">
      <button
        onClick={() => onPageChange(Math.max(1, page - 1))}
        disabled={page === 1}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm
                   text-content-secondary dark:text-gray-400
                   hover:bg-surface-2 dark:hover:bg-dark-surface3
                   disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ‹
      </button>
      {pages.map((p) => (
        <button
          key={p}
          onClick={() => onPageChange(p)}
          className={`w-8 h-8 rounded-lg flex items-center justify-center text-sm font-medium transition-colors
            ${p === page
              ? 'bg-primary text-white dark:bg-primary-light'
              : 'text-content-secondary dark:text-gray-400 hover:bg-surface-2 dark:hover:bg-dark-surface3'
            }`}
        >
          {p}
        </button>
      ))}
      <button
        onClick={() => onPageChange(Math.min(totalPages, page + 1))}
        disabled={page === totalPages}
        className="w-8 h-8 rounded-lg flex items-center justify-center text-sm
                   text-content-secondary dark:text-gray-400
                   hover:bg-surface-2 dark:hover:bg-dark-surface3
                   disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
      >
        ›
      </button>
    </div>
  );
};

/* ── 검색바 ──────────────────────────────────────────────────── */
const SearchBar = ({ searchQuery, setSearchQuery, searchType, setSearchType, onSearch, recentSearches, onSelectRecent, onDeleteRecent }) => {
  const [focused, setFocused] = useState(false);

  return (
    <div className="relative w-full max-w-lg mx-auto">
      <div className="flex rounded-xl overflow-hidden border border-surface-3 dark:border-dark-border
                      bg-surface dark:bg-dark-surface3
                      focus-within:ring-2 focus-within:ring-primary/30 transition-all">
        {/* 검색 유형 선택 */}
        <select
          value={searchType}
          onChange={(e) => setSearchType(e.target.value)}
          className="px-3 py-2.5 text-sm bg-surface-2 dark:bg-dark-surface3
                     border-r border-surface-3 dark:border-dark-border
                     text-content-primary dark:text-white focus:outline-none shrink-0"
        >
          <option value="title">제목</option>
          <option value="content">내용</option>
          <option value="writer">작성자</option>
        </select>
        {/* 검색어 입력 */}
        <input
          type="text"
          placeholder="검색어를 입력하세요"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setTimeout(() => setFocused(false), 150)}
          onKeyDown={(e) => e.key === 'Enter' && onSearch()}
          className="flex-1 px-4 py-2.5 text-sm bg-transparent
                     text-content-primary dark:text-white
                     placeholder-content-disabled dark:placeholder-gray-500
                     focus:outline-none"
        />
        {/* 검색 버튼 */}
        <button
          onClick={onSearch}
          className="px-4 py-2 text-sm font-semibold
                     bg-primary hover:bg-primary-dark text-white
                     transition-colors duration-150 shrink-0"
        >
          검색
        </button>
      </div>

      {/* 최근 검색어 드롭다운 */}
      {focused && recentSearches.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 z-20
                        bg-surface dark:bg-dark-surface2
                        border border-surface-3 dark:border-dark-border
                        rounded-xl shadow-modal overflow-hidden">
          <div className="px-4 py-2 text-xs text-content-secondary dark:text-gray-500 border-b border-surface-3 dark:border-dark-border">
            최근 검색어
          </div>
          {recentSearches.map((s, i) => (
            <div
              key={i}
              className="flex items-center justify-between px-4 py-2.5
                         hover:bg-surface-2 dark:hover:bg-dark-surface3
                         cursor-pointer"
              onClick={() => onSelectRecent(s)}
            >
              <span className="text-sm text-content-primary dark:text-white">🕐 {s}</span>
              <button
                className="text-content-disabled dark:text-gray-500 hover:text-red-400 text-base leading-none"
                onClick={(e) => { e.stopPropagation(); onDeleteRecent(i); }}
              >
                ×
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── 카테고리 필터 드롭다운 ─────────────────────────────────── */
const CategoryFilter = ({ selectedCategory, onSelect }) => {
  const [open, setOpen] = useState(false);
  const { name } = selectedCategory ? getCategoryInfo(selectedCategory) : { name: '전체' };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="flex items-center gap-1.5 text-sm font-medium
                   px-3 py-1.5 rounded-lg border border-surface-3 dark:border-dark-border
                   bg-surface dark:bg-dark-surface3
                   text-content-primary dark:text-white
                   hover:bg-surface-2 dark:hover:bg-dark-surface2
                   transition-colors duration-150"
      >
        <span>🏷</span>
        {name}
        <svg xmlns="http://www.w3.org/2000/svg" className={`w-3.5 h-3.5 transition-transform ${open ? 'rotate-180' : ''}`} viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
        </svg>
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-1 z-20 w-40
                        bg-surface dark:bg-dark-surface2
                        border border-surface-3 dark:border-dark-border
                        rounded-xl shadow-modal overflow-hidden">
          <button
            onClick={() => { onSelect(''); setOpen(false); }}
            className={`w-full text-left px-4 py-2.5 text-sm transition-colors
              ${!selectedCategory ? 'bg-primary/10 text-primary dark:text-primary-light font-semibold' : 'text-content-primary dark:text-white hover:bg-surface-2 dark:hover:bg-dark-surface3'}`}
          >
            전체 보기
          </button>
          {Object.values(BOARD_CATEGORIES).map((cat) => (
            <button
              key={cat.key}
              onClick={() => { onSelect(cat.key); setOpen(false); }}
              className={`w-full text-left px-4 py-2.5 text-sm transition-colors
                ${selectedCategory === cat.key ? 'bg-primary/10 text-primary dark:text-primary-light font-semibold' : 'text-content-primary dark:text-white hover:bg-surface-2 dark:hover:bg-dark-surface3'}`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── 메인 BoardList 컴포넌트 ────────────────────────────────── */
const BoardList = ({
  posts,
  searchQuery,
  setSearchQuery,
  handleSearch,
  totalPosts,
  page,
  onPageChange,
  selectedCategoryFilter,
  onCategoryFilterChange,
}) => {
  const totalPages = Math.ceil(totalPosts / 10);
  const [searchType, setSearchType] = useState('title');
  const [sortColumn, setSortColumn] = useState('latest');
  const [recentSearches, setRecentSearches] = useState(
    JSON.parse(localStorage.getItem('recentSearches') || '[]')
  );

  const saveSearchHistory = (query) => {
    if (!query.trim()) return;
    const list = [query, ...recentSearches.filter((s) => s !== query)].slice(0, 5);
    setRecentSearches(list);
    localStorage.setItem('recentSearches', JSON.stringify(list));
  };

  const executeSearch = () => {
    saveSearchHistory(searchQuery);
    handleSearch(searchType, sortColumn);
  };

  const handleToggleSort = () =>
    setSortColumn((prev) => (prev === 'likes' ? 'latest' : 'likes'));

  return (
    <main className="min-h-screen bg-secondary dark:bg-dark-surface transition-colors px-4 py-8">
      <div className="max-w-6xl mx-auto">

        {/* ── 헤더 ──────────────────────────────────── */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <h1 className="text-xl font-bold text-content-primary dark:text-white">게시판</h1>
            <CategoryFilter
              selectedCategory={selectedCategoryFilter}
              onSelect={onCategoryFilterChange}
            />
          </div>
          <Link
            to="/boardWrite"
            className="btn btn-primary text-sm"
          >
            ✏️ 글쓰기
          </Link>
        </div>

        {/* ── PC: 테이블, 모바일: 카드 ─────────────── */}

        {/* 테이블 (md 이상) */}
        <div className="hidden md:block bg-surface dark:bg-dark-surface2
                        rounded-2xl shadow-card border border-surface-3 dark:border-dark-border overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-surface-2 dark:bg-dark-surface3 border-b border-surface-3 dark:border-dark-border">
                <th className="text-left px-4 py-3 font-semibold text-content-secondary dark:text-gray-400 w-[55%]">제목</th>
                <th className="text-center px-3 py-3 font-semibold text-content-secondary dark:text-gray-400 w-[12%]">닉네임</th>
                <th className="text-center px-3 py-3 font-semibold text-content-secondary dark:text-gray-400 w-[13%]">날짜</th>
                <th className="text-center px-3 py-3 font-semibold text-content-secondary dark:text-gray-400 w-[8%]">조회</th>
                <th
                  className="text-center px-3 py-3 font-semibold text-content-secondary dark:text-gray-400 w-[8%] cursor-pointer hover:text-primary dark:hover:text-primary-light"
                  onClick={handleToggleSort}
                  title="클릭하여 좋아요 순 정렬"
                >
                  따봉 {sortColumn === 'likes' ? '▼' : ''}
                </th>
              </tr>
            </thead>
            <tbody>
              {posts.map((post) => (
                  <tr
                    key={post.postId}
                    className="border-b border-surface-3 dark:border-dark-border last:border-0
                               hover:bg-surface-2 dark:hover:bg-dark-surface3 transition-colors"
                  >
                    {/* 제목 */}
                    <td className="px-4 py-3">
                      <div className="flex items-center gap-2">
                        <CategoryBadge categoryKey={post.category} small />
                        <Link
                          to={`/post/${post.postId}`}
                          className="text-content-primary dark:text-white hover:text-primary dark:hover:text-primary-light
                                     truncate transition-colors font-medium"
                        >
                          {post.title}
                        </Link>
                        {post.commentCount > 0 && (
                          <span className="text-xs text-accent font-medium shrink-0">
                            [{post.commentCount}]
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-3 py-3 text-center text-content-secondary dark:text-gray-400 truncate">
                      {post.name}
                    </td>
                    <td className="px-3 py-3 text-center text-content-secondary dark:text-gray-400 text-xs">
                      {DateFormat(post.regDate)}
                    </td>
                    <td className="px-3 py-3 text-center text-content-secondary dark:text-gray-400">
                      {post.visitCount}
                    </td>
                    <td className="px-3 py-3 text-center font-medium">
                      {post.likeCount > 0 ? (
                        <span className="text-red-400">♥ {post.likeCount}</span>
                      ) : (
                        <span className="text-content-disabled dark:text-gray-600">-</span>
                      )}
                    </td>
                  </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 카드 목록 (모바일) */}
        <div className="md:hidden flex flex-col gap-3">
          {posts.map((post) => (
              <Link
                key={post.postId}
                to={`/post/${post.postId}`}
                className="bg-surface dark:bg-dark-surface2
                           rounded-2xl shadow-card p-4
                           border border-surface-3 dark:border-dark-border
                           active:scale-[0.99] transition-all duration-150"
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <CategoryBadge categoryKey={post.category} />
                  <span className="text-xs text-content-disabled dark:text-gray-500">
                    {DateFormat(post.regDate)}
                  </span>
                </div>
                <h3 className="text-sm font-semibold text-content-primary dark:text-white line-clamp-2 mb-2">
                  {post.title}
                </h3>
                <div className="flex items-center gap-2 text-xs text-content-secondary dark:text-gray-400">
                  <span>{post.name}</span>
                  <span>·</span>
                  <span>조회 {post.visitCount}</span>
                  {post.likeCount > 0 && (
                    <>
                      <span>·</span>
                      <span className="text-red-400 font-medium">♥ {post.likeCount}</span>
                    </>
                  )}
                  {post.commentCount > 0 && (
                    <>
                      <span>·</span>
                      <span className="text-accent font-medium">💬 {post.commentCount}</span>
                    </>
                  )}
                </div>
              </Link>
          ))}
        </div>

        {/* ── 검색 + 페이지네이션 ───────────────────── */}
        <div className="mt-6 flex flex-col items-center gap-4">
          <SearchBar
            searchQuery={searchQuery}
            setSearchQuery={setSearchQuery}
            searchType={searchType}
            setSearchType={setSearchType}
            onSearch={executeSearch}
            recentSearches={recentSearches}
            onSelectRecent={(s) => { setSearchQuery(s); }}
            onDeleteRecent={(i) => {
              const next = recentSearches.filter((_, idx) => idx !== i);
              setRecentSearches(next);
              localStorage.setItem('recentSearches', JSON.stringify(next));
            }}
          />
          <Pagination page={page} totalPages={totalPages} onPageChange={onPageChange} />
        </div>
      </div>
    </main>
  );
};

export default BoardList;
