import React, { createContext, useContext, useMemo } from 'react';
import useDarkMode from '../hooks/useDarkMode';

const ThemeContext = createContext(null);

/**
 * 다크모드 Context Provider
 * - isDark: 현재 다크모드 여부
 * - toggleDark: 다크모드 토글 함수
 */
export const ThemeProvider = ({ children }) => {
  const [isDark, toggleDark] = useDarkMode();

  const value = useMemo(() => ({ isDark, toggleDark }), [isDark, toggleDark]);

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
};

/** 다크모드 상태 사용 훅 */
export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) throw new Error('useTheme must be used inside ThemeProvider');
  return ctx;
};

export default ThemeProvider;
