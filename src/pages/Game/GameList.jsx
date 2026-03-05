import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

/**
 * 게임 목록 페이지 — MUI 제거, Tailwind 전용
 */

const GAMES = [
  {
    id: 'boriGame',
    path: '/boriGame',
    title: '보리게임',
    description: '같은 강아지끼리 합체! 최종 보리를 만들어보세요 🐕',
    image: '/images/game/bori.png',
    badge: 'HOT',
  },
  {
    id: 'dogBTI',
    path: '/dogBTI',
    title: '댕BTI',
    description: '우리 강아지가 사람이라면? MBTI 테스트 🧪',
    image: '/images/dog_big_logo.jpg',
    badge: null,
  },
];

export default function GameList() {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setLoading(false), 1200);
    return () => clearTimeout(timer);
  }, []);

  // --- 로딩 화면 ---
  if (loading) {
    return (
      <div className="fixed inset-0 z-50 flex flex-col items-center justify-center
                       bg-secondary dark:bg-dark-surface transition-colors duration-200">
        <img
          src="/images/borikkori_cartoon_game.png"
          alt="보리꼬리 게임 로딩"
          className="max-w-[280px] md:max-w-[350px] animate-bounce"
        />
        <p className="mt-4 text-xl font-bold text-primary dark:text-primary-light text-center">
          게임 목록을 불러오는 중...
        </p>
        <div className="mt-4 w-6 h-6 border-2 border-accent border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  // --- 메인 ---
  return (
    <main className="min-h-screen bg-secondary dark:bg-dark-surface transition-colors duration-200">
      {/* 히어로 */}
      <section className="bg-gradient-to-br from-primary/10 via-secondary to-secondary
                          dark:from-dark-surface2 dark:via-dark-surface dark:to-dark-surface
                          pt-10 pb-8 text-center">
        <h1 className="text-3xl md:text-4xl font-bold text-content-primary dark:text-white">
          🎮 보리꼬리 게임
        </h1>
        <p className="mt-2 text-content-secondary dark:text-gray-400">
          재미있는 강아지 게임을 즐겨보세요!
        </p>
      </section>

      {/* 게임 카드 그리드 */}
      <section className="max-w-3xl mx-auto px-4 py-8">
        <div className="grid sm:grid-cols-2 gap-6">
          {GAMES.map(game => (
            <Link
              key={game.id}
              to={game.path}
              className="card overflow-hidden group hover:shadow-float
                         transition-all duration-300 hover:-translate-y-1"
            >
              {/* 이미지 */}
              <div className="relative aspect-video bg-surface-2 dark:bg-dark-surface3 overflow-hidden">
                <img
                  src={game.image}
                  alt={game.title}
                  className="w-full h-full object-cover
                             group-hover:scale-105 transition-transform duration-300"
                />
                {game.badge && (
                  <span className="absolute top-2 right-2 px-2 py-0.5
                                   bg-accent text-white text-xs font-bold rounded-full">
                    {game.badge}
                  </span>
                )}
              </div>

              {/* 텍스트 */}
              <div className="p-4">
                <h2 className="text-lg font-bold text-content-primary dark:text-white
                               group-hover:text-primary dark:group-hover:text-primary-light
                               transition-colors">
                  {game.title}
                </h2>
                <p className="mt-1 text-sm text-content-secondary dark:text-gray-400">
                  {game.description}
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 하단 */}
      <footer className="py-6 text-center text-sm text-content-secondary dark:text-gray-500">
        Powered by Matter.js 🔧
      </footer>
    </main>
  );
}
