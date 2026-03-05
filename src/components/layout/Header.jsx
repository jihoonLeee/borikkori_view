import React, { useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthProvider';
import { useTheme } from '../../contexts/ThemeProvider';
import axiosInstance from '../../api/axiosInstance';
import UserAvatar from '../common/UserAvatar';

/** 데스크톱 네비게이션 링크 */
const NavItem = ({ to, children }) => (
  <Link
    to={to}
    className="text-sm font-medium text-white/80 hover:text-white
               transition-colors duration-150 px-1 py-0.5
               hover:underline underline-offset-4 decoration-accent/70"
  >
    {children}
  </Link>
);

export default function Header() {
  const { authenticated, userInfo } = useContext(AuthContext);
  const { isDark, toggleDark } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    axiosInstance
      .post('/logout', {})
      .then(() => {
        alert('로그아웃되었습니다.');
        window.location.reload();
      })
      .catch(console.error);
  };

  return (
    <header
      className="sticky top-0 z-40
                 bg-primary/95 dark:bg-dark-surface/95
                 backdrop-blur-sm shadow-sm
                 border-b border-primary-dark/30 dark:border-dark-border"
    >
      <div className="max-w-6xl mx-auto px-4 h-header-h flex items-center justify-between gap-4">

        {/* ── 로고 ────────────────────────────────────── */}
        <Link to="/" className="flex items-center gap-2 shrink-0">
          <img
            src={`${process.env.PUBLIC_URL}/images/bokko_pixel.svg`}
            alt="보리꼬리 로고"
            className="h-9 w-auto"
          />
          {/* 데스크톱에서만 서비스명 표시 */}
          <span className="hidden md:block font-headline font-bold text-lg text-white tracking-tight">
            보리꼬리
          </span>
        </Link>

        {/* ── 데스크톱 네비게이션 (md 이상에서만 표시) ── */}
        <nav className="hidden md:flex items-center gap-6">
          <NavItem to="/">홈</NavItem>
          <NavItem to="/board">게시판</NavItem>
          <NavItem to="/chat">채팅</NavItem>
          <NavItem to="/map">애견맛집</NavItem>
          <NavItem to="/games">개임</NavItem>
          <NavItem to="/dogBTI">DBTI</NavItem>
        </nav>

        {/* ── 우측: 다크모드 토글 + 인증 버튼 ──────── */}
        <div className="flex items-center gap-2 shrink-0">

          {/* 다크모드 토글 */}
          <button
            onClick={toggleDark}
            aria-label={isDark ? '라이트 모드로 전환' : '다크 모드로 전환'}
            className="w-9 h-9 rounded-full flex items-center justify-center
                       text-white/80 hover:text-white hover:bg-white/10
                       transition-all duration-150"
          >
            {isDark ? (
              /* 해 아이콘 - 라이트모드로 전환 */
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path d="M12 2.25a.75.75 0 01.75.75v2.25a.75.75 0 01-1.5 0V3a.75.75 0 01.75-.75zM7.5 12a4.5 4.5 0 119 0 4.5 4.5 0 01-9 0zM18.894 6.166a.75.75 0 00-1.06-1.06l-1.591 1.59a.75.75 0 101.06 1.061l1.591-1.59zM21.75 12a.75.75 0 01-.75.75h-2.25a.75.75 0 010-1.5H21a.75.75 0 01.75.75zM17.834 18.894a.75.75 0 001.06-1.06l-1.59-1.591a.75.75 0 10-1.061 1.06l1.59 1.591zM12 18a.75.75 0 01.75.75V21a.75.75 0 01-1.5 0v-2.25A.75.75 0 0112 18zM7.166 17.834a.75.75 0 00-1.06 1.06l1.59 1.591a.75.75 0 001.061-1.06l-1.59-1.591zM6 12a.75.75 0 01-.75.75H3a.75.75 0 010-1.5h2.25A.75.75 0 016 12zM6.166 7.166a.75.75 0 001.06-1.06L5.634 4.515a.75.75 0 00-1.06 1.06l1.59 1.591z" />
              </svg>
            ) : (
              /* 달 아이콘 - 다크모드로 전환 */
              <svg xmlns="http://www.w3.org/2000/svg" className="w-5 h-5" viewBox="0 0 24 24" fill="currentColor">
                <path fillRule="evenodd" d="M9.528 1.718a.75.75 0 01.162.819A8.97 8.97 0 009 6a9 9 0 009 9 8.97 8.97 0 003.463-.69.75.75 0 01.981.98 10.503 10.503 0 01-9.694 6.46c-5.799 0-10.5-4.701-10.5-10.5 0-4.368 2.667-8.112 6.46-9.694a.75.75 0 01.818.162z" clipRule="evenodd" />
              </svg>
            )}
          </button>

          {/* 인증 버튼 (데스크톱) */}
          <div className="hidden md:flex items-center gap-2">
            {!authenticated ? (
              <>
                <button
                  onClick={() => navigate('/login')}
                  className="text-sm font-medium text-white/80 hover:text-white transition-colors"
                >
                  로그인
                </button>
                <button
                  onClick={() => navigate('/join')}
                  className="text-sm font-semibold bg-white/15 hover:bg-white/25
                             text-white px-3 py-1.5 rounded-lg transition-all duration-150"
                >
                  회원가입
                </button>
              </>
            ) : (
              <>
                <UserAvatar userName={userInfo?.name} />
                <button
                  onClick={handleLogout}
                  className="text-sm font-medium text-white/70 hover:text-white transition-colors"
                >
                  로그아웃
                </button>
              </>
            )}
          </div>

          {/* 모바일: 아바타 또는 로그인 아이콘 */}
          <div className="flex md:hidden items-center">
            {authenticated ? (
              <UserAvatar userName={userInfo?.name} size="sm" />
            ) : (
              <button
                onClick={() => navigate('/login')}
                className="text-sm font-medium text-white/80 hover:text-white"
              >
                로그인
              </button>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
