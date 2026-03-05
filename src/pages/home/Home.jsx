import React, { useState, useEffect } from 'react';
import axiosInstance from '../../api/axiosInstance';
import { Link } from 'react-router-dom';
import { getCategoryInfo } from '../../utils/categoryUtils';

/* ── 스켈레톤 로더 ──────────────────────────────────────────── */
const PostSkeleton = () => (
  <div className="animate-pulse flex flex-col gap-2 py-3 border-b border-surface-3 dark:border-dark-border last:border-0">
    <div className="h-4 bg-surface-3 dark:bg-dark-surface3 rounded w-4/5" />
    <div className="h-3 bg-surface-3 dark:bg-dark-surface3 rounded w-1/3" />
  </div>
);

const MbtiSkeleton = () => (
  <div className="animate-pulse flex flex-col items-center gap-2">
    <div className="w-16 h-16 bg-surface-3 dark:bg-dark-surface3 rounded-full" />
    <div className="h-3 bg-surface-3 dark:bg-dark-surface3 rounded w-12" />
  </div>
);

/* ── 빠른 메뉴 아이템 ──────────────────────────────────────── */
const quickMenus = [
  { to: '/dogBTI', emoji: '🐶', label: '개BTI 테스트' },
  { to: '/board',  emoji: '📋', label: '게시판' },
  { to: '/map',    emoji: '🗺️', label: '애견맛집' },
  { to: '/chat',   emoji: '💬', label: '채팅' },
  { to: '/games',  emoji: '🎮', label: '개임' },
];

/* ── 게시글 한 줄 컴포넌트 ─────────────────────────────────── */
const PostRow = ({ post }) => {
  const { name: catName, color } = getCategoryInfo(post.categoryType);
  return (
    <Link
      to={`/post/${post.postId}`}
      className="flex items-center gap-3 py-3
                 border-b border-surface-3 dark:border-dark-border last:border-0
                 hover:bg-surface-2 dark:hover:bg-dark-surface3
                 -mx-4 px-4 rounded-lg transition-colors duration-150"
    >
      {/* 카테고리 뱃지 */}
      <span
        className="shrink-0 text-xs font-semibold px-2 py-0.5 rounded-full"
        style={{ color, backgroundColor: `${color}18` }}
      >
        {catName}
      </span>
      {/* 제목 */}
      <span className="flex-1 text-sm font-medium text-content-primary dark:text-white truncate">
        {post.title}
      </span>
      {/* 좋아요 */}
      {post.likeCount > 0 && (
        <span className="shrink-0 text-xs text-red-400 font-medium">
          ♥ {post.likeCount}
        </span>
      )}
    </Link>
  );
};

/* ── 메인 홈 컴포넌트 ─────────────────────────────────────── */
export default function DogHouse() {
  const [mbtiResults, setMbtiResults]   = useState([]);
  const [latestPosts, setLatestPosts]   = useState([]);
  const [popularPosts, setPopularPosts] = useState([]);
  const [isLoading, setIsLoading]       = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const [mbtiRes, latestRes, popularRes] = await Promise.all([
          axiosInstance.get('/mbti'),
          axiosInstance.get('/post/latest'),
          axiosInstance.get('/post/popular'),
        ]);
        setMbtiResults(Array.isArray(mbtiRes.data)     ? mbtiRes.data     : []);
        setLatestPosts(Array.isArray(latestRes.data)   ? latestRes.data   : []);
        setPopularPosts(Array.isArray(popularRes.data) ? popularRes.data  : []);
      } catch (err) {
        console.error('홈 데이터 로딩 실패:', err);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <main className="min-h-screen bg-secondary dark:bg-dark-surface transition-colors duration-200">

      {/* ── Hero 섹션 ────────────────────────────────── */}
      <section className="relative bg-gradient-to-br from-primary/10 via-secondary to-secondary
                          dark:from-dark-surface2 dark:via-dark-surface dark:to-dark-surface
                          py-12 md:py-20 overflow-hidden">
        {/* 배경 장식 */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-accent/5 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-primary/5 rounded-full translate-y-1/2 -translate-x-1/2 blur-2xl" />

        <div className="relative max-w-6xl mx-auto px-4 flex flex-col md:flex-row items-center gap-8">
          {/* 텍스트 */}
          <div className="flex-1 text-center md:text-left animate-fade-in">
            <h1 className="text-3xl md:text-5xl font-bold font-headline text-content-primary dark:text-white leading-tight">
              우리 강아지와 함께하는<br />
              <span className="text-primary dark:text-primary-light">보리꼬리</span>
            </h1>
            <p className="mt-4 text-base md:text-lg text-content-secondary dark:text-gray-400 leading-relaxed">
              개BTI 테스트부터 애견 맛집까지,<br className="hidden md:block" />
              반려견과 함께하는 모든 것을 담았어요 🐾
            </p>
            <div className="mt-8 flex flex-wrap justify-center md:justify-start gap-3">
              <Link to="/dogBTI" className="btn btn-primary shadow-float">
                개BTI 테스트 하기
              </Link>
              <Link to="/board" className="btn btn-secondary">
                게시판 보기
              </Link>
            </div>
          </div>

          {/* 캐릭터 이미지 */}
          <div className="shrink-0 animate-slide-up">
            <img
              src={`${process.env.PUBLIC_URL}/images/borikkori_4cut.png`}
              alt="보리꼬리 캐릭터"
              className="w-48 md:w-72 mx-auto drop-shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* ── 빠른 메뉴 (당근마켓 스타일) ───────────────── */}
      <section className="max-w-6xl mx-auto px-4 py-8">
        <div className="flex justify-around md:justify-start md:gap-8">
          {quickMenus.map(({ to, emoji, label }) => (
            <Link
              key={to}
              to={to}
              className="flex flex-col items-center gap-2 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-surface dark:bg-dark-surface2
                              flex items-center justify-center text-2xl shadow-card
                              group-hover:shadow-float group-hover:-translate-y-0.5
                              transition-all duration-200 border border-surface-3 dark:border-dark-border">
                {emoji}
              </div>
              <span className="text-xs font-medium text-content-secondary dark:text-gray-400
                               group-hover:text-primary dark:group-hover:text-primary-light transition-colors">
                {label}
              </span>
            </Link>
          ))}
        </div>
      </section>

      {/* ── 컨텐츠 그리드 ────────────────────────────── */}
      <section className="max-w-6xl mx-auto px-4 pb-12">
        <div className="grid md:grid-cols-3 gap-4 md:gap-6">

          {/* 개BTI TOP 3 */}
          <div className="bg-surface dark:bg-dark-surface2 rounded-2xl shadow-card p-5
                          border border-surface-3 dark:border-dark-border">
            <h2 className="text-base font-bold text-content-primary dark:text-white mb-4">
              🏆 개BTI TOP 3
            </h2>
            {isLoading ? (
              <div className="flex justify-around">
                {[0, 1, 2].map((i) => <MbtiSkeleton key={i} />)}
              </div>
            ) : mbtiResults.length === 0 ? (
              <p className="text-sm text-content-secondary dark:text-gray-500 text-center py-4">
                데이터가 없습니다
              </p>
            ) : (
              <div className="flex justify-around">
                {mbtiResults.slice(0, 3).map((result, idx) => (
                  <div key={idx} className="flex flex-col items-center gap-1.5">
                    <div className="relative">
                      <img
                        src={`${process.env.PUBLIC_URL}/images/face_results/${result.type}.png`}
                        alt={result.type}
                        className="w-14 h-14 object-contain rounded-full bg-surface-2 dark:bg-dark-surface3 p-1"
                      />
                      {/* 순위 뱃지 */}
                      {idx === 0 && (
                        <span className="absolute -top-1 -right-1 text-xs">👑</span>
                      )}
                    </div>
                    <span className="text-xs font-bold text-primary dark:text-primary-light">
                      {result.type}
                    </span>
                    <span className="text-2xs text-content-secondary dark:text-gray-500">
                      {result.count}명
                    </span>
                  </div>
                ))}
              </div>
            )}
            <Link
              to="/dogBTI"
              className="mt-4 block text-center text-xs text-primary dark:text-primary-light
                         font-medium hover:underline"
            >
              테스트 하러가기 →
            </Link>
          </div>

          {/* 최신 게시글 */}
          <div className="md:col-span-2 bg-surface dark:bg-dark-surface2 rounded-2xl shadow-card p-5
                          border border-surface-3 dark:border-dark-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-content-primary dark:text-white">
                🆕 최신 게시글
              </h2>
              <Link to="/board" className="text-xs text-primary dark:text-primary-light font-medium hover:underline">
                더보기 →
              </Link>
            </div>
            {isLoading ? (
              <div className="divide-y divide-surface-3 dark:divide-dark-border">
                {[0, 1, 2, 3, 4].map((i) => <PostSkeleton key={i} />)}
              </div>
            ) : latestPosts.length === 0 ? (
              <p className="text-sm text-content-secondary dark:text-gray-500 text-center py-8">
                게시글이 없습니다
              </p>
            ) : (
              <div>
                {latestPosts.slice(0, 6).map((post, idx) => (
                  <PostRow key={idx} post={post} />
                ))}
              </div>
            )}
          </div>

          {/* 인기 게시글 */}
          <div className="md:col-span-3 bg-surface dark:bg-dark-surface2 rounded-2xl shadow-card p-5
                          border border-surface-3 dark:border-dark-border">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-base font-bold text-content-primary dark:text-white">
                🔥 인기 게시글
              </h2>
              <Link to="/board" className="text-xs text-primary dark:text-primary-light font-medium hover:underline">
                더보기 →
              </Link>
            </div>
            {isLoading ? (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6">
                {[0, 1, 2].map((i) => <PostSkeleton key={i} />)}
              </div>
            ) : popularPosts.length === 0 ? (
              <p className="text-sm text-content-secondary dark:text-gray-500 text-center py-6">
                인기 게시글이 없습니다
              </p>
            ) : (
              <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-x-6">
                {popularPosts.slice(0, 6).map((post, idx) => (
                  <PostRow key={idx} post={post} />
                ))}
              </div>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}
