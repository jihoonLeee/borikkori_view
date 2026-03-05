import { useState, useEffect } from 'react';

/**
 * 다크모드 토글 훅
 * - localStorage에 선호도 저장
 * - 초기값: 시스템 prefers-color-scheme 따름
 * - <html> 엘리먼트에 'dark' 클래스 토글
 */
const useDarkMode = () => {
  const [isDark, setIsDark] = useState(() => {
    const stored = localStorage.getItem('theme');
    if (stored) return stored === 'dark';
    return window.matchMedia('(prefers-color-scheme: dark)').matches;
  });

  useEffect(() => {
    const root = document.documentElement;
    if (isDark) {
      root.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      root.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDark]);

  const toggleDark = () => setIsDark((prev) => !prev);

  return [isDark, toggleDark];
};

export default useDarkMode;
