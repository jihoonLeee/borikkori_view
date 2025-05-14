import React from 'react';
import { FaYoutube, FaInstagram, FaGithub } from 'react-icons/fa';
import { SiTistory } from 'react-icons/si'; 
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import useMediaQuery from '@mui/material/useMediaQuery';

function Copyright(props) {
  return (
    <Typography variant="body2" color="text.secondary" align="center" {...props}>
      {'Copyright © '}
      <Link color="inherit" href="https://mui.com/">
        보리꼬리
      </Link>{' '}
      {new Date().getFullYear()}
      {'.'}
    </Typography>
  );
}

function Footer() {
  const isMobile = useMediaQuery('(max-width: 768px)');

  return (
    <footer className="bg-primary text-white pt-10 sm:mt-10">
      <Container component="main" maxWidth="lg">
        <div className="max-w-6xl m-auto flex flex-wrap justify-left">
          
          {/* 왼쪽 컬럼 */}
          <div className={`p-5 ${isMobile ? 'w-full' : 'w-1/2 sm:w-4/12 md:w-3/12'}`}>
            {/* 로고 */}
            <div className="hover:text-accent flex items-center">
              <a href="/" className="text-xl font-bold mx-auto">
                <img
                  className="h-16 w-auto"
                  src="/images/bokko_pixel.svg"
                  alt="보리꼬리 로고"
                />
              </a>
            </div>

            {/* 소셜 아이콘 */}
            <div className="mt-4 flex items-center justify-center">
              <span className="mx-3 hover:text-accent">
                <a href="https://www.youtube.com/@jihoon2723">
                  <FaYoutube size="24" />
                </a>
              </span>
              <span className="mx-3 hover:text-accent">
                <a href="https://www.instagram.com/zzzihooon/">
                  <FaInstagram size="24" />
                </a>
              </span>
              <span className="mx-3 hover:text-accent">
                <a href="https://jihoon2723.tistory.com/">
                  <SiTistory size="24" />
                </a>
              </span>
              <span className="mx-3 hover:text-accent">
                <a href="https://github.com/jihoonLeee">
                  <FaGithub size="24" />
                </a>
              </span>
            </div>
          </div>

          {/* 중앙 컬럼 */}
          <div className={`p-5 ${isMobile ? 'w-full' : 'w-1/2 sm:w-4/12 md:w-3/12'}`}>
            <div className="mt-2">
              <h3 className="text-xl mb-2 font-bold">Support</h3>
              <ul className="list-none">
                <li className="mb-2">
                  <a
                    href="mailto:ljh2723@gmail.com"
                    className="hover:text-accent"
                  >
                    문의
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        {/* 하단 카피라이트 영역 */}
        <div className="pt-4 border-t border-gray-500 text-sm flex flex-col items-center md:flex-row">
          <div className="pt-2">
            <Copyright />
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
