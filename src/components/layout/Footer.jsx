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
    <footer className="footer pt-10 sm:mt-10 pt-10">
      <Container component="main" maxWidth="lg">
        <div className="max-w-6xl m-auto text-gray-900 flex flex-wrap justify-left">
          {/* 왼쪽 컬럼 */}
          <div className={`p-5 ${isMobile ? 'w-full' : 'w-1/2 sm:w-4/12 md:w-3/12'}`}>
            {/* 로고 */}
            <div className="text-white-900 hover:text-white-700 flex items-center">
              <a href="/" className="text-xl font-bold mx-auto">
                <img className="h-16 w-auto" src={`/images/borikkori_brown.svg`} alt="" />
              </a>
            </div>
            <div className="mt-4 flex items-center justify-center">
              <span className="text-white-900 mx-3 hover:text-white-700">
                <a href="https://www.youtube.com/@jihoon2723">
                  <FaYoutube size="24" />
                </a>
              </span>
              <span className="text-white-900 mx-3 hover:text-white-700">
                <a href="https://www.instagram.com/zzzihooon/">
                  <FaInstagram size="24" />
                </a>
              </span>
              <span className="text-white-900 mx-3 hover:text-white-700">
                <a href="https://jihoon2723.tistory.com/">
                  <SiTistory size="24" />
                </a>
              </span>
              <span className="text-white-900 mx-3 hover:text-white-700">
                <a href="https://github.com/jihoonLeee">
                  <FaGithub size="24" />
                </a>
              </span>
            </div>
          </div>

          {/* 중앙 컬럼 */}
          <div className={`p-5 ${isMobile ? 'w-full' : 'w-1/2 sm:w-4/12 md:w-3/12'}`}>
            <div className="text-white-900 hover:text-white-700 mt-2">
              <h3 className="text-xl mb-2 font-bold">Support</h3>
              <ul className="list-none">
                <li className="mb-2">
                  <a href="mailto:ljh2723@gmail.com" className="text-white-600 hover:text-white-700">
                    문의
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="pt-4">
          <div className="flex pb-5 px-3 m-auto pt-5 border-t border-gray-500 text-gray-400 text-sm flex-col md:flex-row max ">
          </div>
          <div className="flex justify-center">
            <a href="!#" className="w-6 mx-1">
              <i className="fab fa-twitter text-white"></i>
            </a>
            <a href="!#" className="w-6 mx-1">
              <i className="fab fa-instagram text-white"></i>
            </a>
            <a href="!#" className="w-6 mx-1">
              <i className="fab fa-linkedin text-white"></i>
            </a>
            <a href="!#" className="w-6 mx-1">
              <i className="fab fa-github text-white"></i>
            </a>
          </div>
          <div className="pt-2">
            <Copyright sx={{ mt: 8, mb: 4 }} />
          </div>
        </div>
      </Container>
    </footer>
  );
}

export default Footer;
