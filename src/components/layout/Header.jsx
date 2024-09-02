import React, { useState, useContext } from 'react';
import { Dialog ,Popover} from '@headlessui/react';
import { XMarkIcon, Bars3Icon } from '@heroicons/react/24/outline';
import { Link } from "react-router-dom";
import { AuthContext } from '../../modules/AuthProvider';
import axios from 'axios';
import UserAvatar from '../common/UserAvatar';
import useMediaQuery from '@mui/material/useMediaQuery';
import NavLink from './NavLink';
import StyledButton from './StyledButton';
import DialogPanel from './DialogPanel';

export default function Header() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { authenticated, userInfo } = useContext(AuthContext);
  const isMobile = useMediaQuery('(max-width: 1024px)');

  const logout = () => {
    axios({
      method: 'post',
      url: '/logout',
      withCredentials: true
    })
    .then((response) => {
      alert("로그아웃");
      window.location.reload();
    })
    .catch((error) => {
      console.log(error);
    });
  };

  return (
    <header className="header">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex lg:flex-1">
          <Link to="/" className="-m-1.5 p-1.5">
            <span className="sr-only">WagWagT</span>
            <img className="h-16 w-auto" src={`${process.env.PUBLIC_URL}/images/borikkori_brown.svg`} alt="WagWagT Logo" />
          </Link>
        </div>
        {isMobile ? (
          <div className="flex lg:hidden">
            <button
              type="button"
              className="-m-2.5 inline-flex items-center justify-center rounded-md p-2.5 text-gray-700"
              onClick={() => setMobileMenuOpen(true)}
            >
              <span className="sr-only">Open main menu</span>
              <Bars3Icon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
        ) : (
          <Popover.Group className="hidden lg:flex lg:gap-x-12">
            <StyledButton to="/map">애견동반</StyledButton>
            <StyledButton to="/chat">채팅</StyledButton>
            <StyledButton to="/mainBoard">게시판</StyledButton>
            <StyledButton to="/games">게임</StyledButton>
            <div className="flex flex-1 justify-end">
              { !authenticated ? (
                <>
                  <StyledButton to="/login">로그인</StyledButton>
                  <StyledButton to="/join">회원가입</StyledButton>
                </>
              ) : (
                <>
                  <UserAvatar userName={userInfo.nickName} />
                  <StyledButton onClick={logout}>로그아웃</StyledButton>
                </>
              )}
            </div>
          </Popover.Group>
        )}
      </nav>
      <Dialog as="div" className="lg:hidden" open={mobileMenuOpen} onClose={setMobileMenuOpen}>
        <div className="fixed inset-0 z-10" />
        <DialogPanel>
          <div className="flex items-center justify-between">
            <Link to="/" className="-m-1.5 p-1.5" onClick={() => setMobileMenuOpen(false)}>
              <span className="sr-only">WagWagT</span>
              <img className="h-8 w-auto" src="/images/dog_freinds_logo.png" alt="WagWagT Logo" />
            </Link>
            <button type="button" className="-m-2.5 rounded-md p-2.5 text-gray-700" onClick={() => setMobileMenuOpen(false)}>
              <span className="sr-only">Close menu</span>
              <XMarkIcon className="h-6 w-6" aria-hidden="true" />
            </button>
          </div>
          <div className="mt-6 flow-root">
            <div className="-my-6 divide-y divide-gray-500/10">
              <div className="space-y-2 py-6">
                <StyledButton to="/map" onClick={() => setMobileMenuOpen(false)}>애견동반</StyledButton>
                <StyledButton to="/chat" onClick={() => setMobileMenuOpen(false)}>채팅</StyledButton>
                <StyledButton to="/mainBoard" onClick={() => setMobileMenuOpen(false)}>게시판</StyledButton>
                <StyledButton to="/games" onClick={() => setMobileMenuOpen(false)}>게임</StyledButton>
              </div>
              <div className="py-6 flex flex-col items-start space-y-4">
                {!authenticated ? (
                  <>
                    <Link 
                      to="/login" 
                      className="text-sm font-semibold leading-6 text-gray-900" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      로그인
                    </Link>
                    <Link 
                      to="/join" 
                      className="text-sm font-semibold leading-6 text-gray-900" 
                      onClick={() => setMobileMenuOpen(false)}
                    >
                      회원가입
                    </Link>
                  </>
                ) : (
                  <>
                    <div className="flex items-center space-x-4">
                      <UserAvatar userName={userInfo.nickName} />
                      <button 
                        onClick={logout} 
                        className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 h-10 px-4 py-2 text-rose-600 hover:bg-rose-100 hover:text-rose-900 focus:bg-rose-100 focus:text-rose-900 dark:text-rose-300 dark:hover:bg-rose-800 dark:hover:text-rose-50 text-sm font-semibold leading-6 text-gray-900"
                      >
                        로그아웃
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </DialogPanel>
      </Dialog>

    </header>
  );
}
