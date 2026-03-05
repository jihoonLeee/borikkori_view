import React from 'react';
import { FaYoutube, FaInstagram, FaGithub } from 'react-icons/fa';
import { SiTistory } from 'react-icons/si';

/** 소셜 링크 아이콘 */
const SocialLink = ({ href, children }) => (
  <a
    href={href}
    target="_blank"
    rel="noopener noreferrer"
    className="text-white/60 hover:text-accent transition-colors duration-150"
  >
    {children}
  </a>
);

/** 데스크톱에서만 표시 (모바일은 BottomNavBar가 대체) */
function Footer() {
  return (
    <footer className="hidden md:block bg-primary dark:bg-dark-surface2 text-white border-t border-primary-dark/30 dark:border-dark-border">
      <div className="max-w-6xl mx-auto px-6 py-8">
        <div className="flex flex-wrap gap-8 justify-between">

          {/* 브랜드 + 소셜 */}
          <div className="flex flex-col gap-4">
            <a href="/" className="flex items-center gap-2">
              <img
                className="h-10 w-auto"
                src="/images/bokko_pixel.svg"
                alt="보리꼬리 로고"
              />
              <span className="font-headline font-bold text-lg">보리꼬리</span>
            </a>
            <div className="flex items-center gap-4">
              <SocialLink href="https://www.youtube.com/@jihoon2723">
                <FaYoutube size={20} />
              </SocialLink>
              <SocialLink href="https://www.instagram.com/zzzihooon/">
                <FaInstagram size={20} />
              </SocialLink>
              <SocialLink href="https://jihoon2723.tistory.com/">
                <SiTistory size={20} />
              </SocialLink>
              <SocialLink href="https://github.com/jihoonLeee">
                <FaGithub size={20} />
              </SocialLink>
            </div>
          </div>

          {/* Support 링크 */}
          <div>
            <h3 className="text-sm font-semibold text-white/90 mb-3">Support</h3>
            <ul className="space-y-2 text-sm text-white/60">
              <li>
                <a href="mailto:ljh2723@gmail.com" className="hover:text-accent transition-colors">
                  문의하기
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* 카피라이트 */}
        <div className="mt-8 pt-4 border-t border-white/10 text-center text-xs text-white/40">
          Copyright © 보리꼬리 {new Date().getFullYear()}. All rights reserved.
        </div>
      </div>
    </footer>
  );
}

export default Footer;
