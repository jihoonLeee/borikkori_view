import React, { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthProvider';
import axios from 'axios';
import UserAvatar from '../common/UserAvatar';
import StyledButton from './StyledButton';
import useMediaQuery from '@mui/material/useMediaQuery';

export default function Header() {
  const { authenticated, userInfo } = useContext(AuthContext);
  const isMobile = useMediaQuery('(max-width: 1024px)');
  const logout = () => {
    axios
      .post('/logout', {}, { withCredentials: true })
      .then(() => {
        alert("로그아웃되었습니다.");
        window.location.reload();
      })
      .catch((error) => console.log(error));
  };

  if (isMobile) {
    // 모바일: 상단에 로고와 로그인/회원가입, 하단에 메뉴 영역 (메뉴는 줄바꿈됨)
    return (
      <header className="bg-primary text-white shadow-lg">
        {/* Top Bar */}
        <div className="flex items-center justify-between p-3">
          {/* 왼쪽: 로고 */}
          <Link to="/" className="flex items-center">
            <span className="sr-only">보리꼬리</span>
            <img
              className="h-12 w-auto"
              src={`${process.env.PUBLIC_URL}/images/borikkori.svg`}
              alt="보리꼬리 로고"
            />
          </Link>
          {/* 오른쪽: 로그인/회원가입 또는 사용자 프로필 */}
          <div className="flex items-center space-x-2">
            {!authenticated ? (
              <>
                <StyledButton to="/login" className="text-white hover:text-accent text-xs px-2 py-1">
                  로그인
                </StyledButton>
                <StyledButton to="/join" className="text-white hover:text-accent text-xs px-2 py-1">
                  회원가입
                </StyledButton>
              </>
            ) : (
              <>
                <UserAvatar userName={userInfo?.name} className="w-8 h-8" />
                <StyledButton onClick={logout} className="text-white hover:text-accent text-xs px-2 py-1">
                  로그아웃
                </StyledButton>
              </>
            )}
          </div>
        </div>
        {/* Bottom Bar: 네비게이션 메뉴 (자동 줄바꿈 적용) */}
        <nav className="bg-primary px-3 py-2">
          <div className="flex flex-wrap justify-center gap-2">
            <StyledButton to="/board" className="text-white hover:text-accent text-xs px-2 py-1">
              게시판
            </StyledButton>
            <StyledButton to="/map" className="text-white hover:text-accent text-xs px-2 py-1">
              애견 맛집
            </StyledButton>
            {/* <StyledButton to="/chat" className="text-white hover:text-accent text-xs px-2 py-1">
              실시간 소통
            </StyledButton> */}
            <StyledButton to="/games" className="text-white hover:text-accent text-xs px-2 py-1">
              개임
            </StyledButton>
          </div>
        </nav>
      </header>
    );
  } else {
    // 데스크톱: 메뉴가 늘어나면 자동 줄바꿈되도록 flex-wrap 적용
    return (
      <header className="bg-primary text-white shadow-lg">
        <nav className="mx-auto flex flex-wrap items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex lg:flex-1">
            <Link to="/" className="-m-1.5 p-1.5">
              <span className="sr-only">보리꼬리</span>
              <img
                className="h-16 w-auto"
                src={`${process.env.PUBLIC_URL}/images/borikkori.svg`}
                alt="보리꼬리 로고"
              />
            </Link>
          </div>
          <div className="flex flex-1 flex-wrap justify-center gap-4">
            <StyledButton to="/board" className="text-white hover:text-accent">
              게시판
            </StyledButton>
            <StyledButton to="/map" className="text-white hover:text-accent">
              애견 맛집
            </StyledButton>
            {/* <StyledButton to="/chat" className="text-white hover:text-accent">
              실시간 소통
            </StyledButton> */}
            <StyledButton to="/games" className="text-white hover:text-accent">
              개임
            </StyledButton>
      
          </div>
          <div className="flex flex-1 flex-wrap justify-end gap-2 mt-2">
            {!authenticated ? (
              <>
                <StyledButton to="/login" className="text-white hover:text-accent">
                  로그인
                </StyledButton>
                <StyledButton to="/join" className="text-white hover:text-accent">
                  회원가입
                </StyledButton>
              </>
            ) : (
              <>
                <UserAvatar userName={userInfo?.name} />
                <StyledButton onClick={logout} className="text-white hover:text-accent">
                  로그아웃
                </StyledButton>
              </>
            )}
          </div>
        </nav>
      </header>
    );
  }
}
