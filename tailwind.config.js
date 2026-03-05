/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  darkMode: 'class', // 다크모드: <html class="dark"> 토글 방식
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // ── Primary (따뜻한 갈색 - 로고 기반) ──────────────────
        primary: {
          DEFAULT: '#8B5E3C',
          dark:    '#6F4B30',
          light:   '#A57850',
        },
        // ── Secondary (크림 배경) ────────────────────────────
        secondary: {
          DEFAULT: '#FAF8F5',
          dark:    '#F0ECE6',
        },
        // ── Accent (포인트 초록 - 픽셀아트 강아지 색상) ─────────
        accent: {
          DEFAULT: '#4CAF50',
          dark:    '#388E3C',
          light:   '#66BB6A',
        },
        // ── Surface (카드/배경 계층) ─────────────────────────
        surface: {
          DEFAULT: '#FFFFFF',
          2:       '#F7F4F0',
          3:       '#EDEBE7',
        },
        // ── Dark Surface (다크모드 전용) ─────────────────────
        dark: {
          surface:  '#1A1A1A',
          surface2: '#252525',
          surface3: '#303030',
          border:   '#3A3A3A',
        },
        // ── 텍스트 ─────────────────────────────────────────
        content: {
          primary:   '#1C1B1F',
          secondary: '#49454F',
          disabled:  '#9E9E9E',
        },
      },

      // ── 타이포그래피 ────────────────────────────────────────
      fontFamily: {
        sans:     ['Noto Sans KR', 'sans-serif'],
        headline: ['Poppins', 'sans-serif'],
      },

      // ── 그림자 계층 ────────────────────────────────────────
      boxShadow: {
        card:   '0 1px 4px rgba(0,0,0,0.08), 0 2px 8px rgba(0,0,0,0.04)',
        modal:  '0 8px 32px rgba(0,0,0,0.16)',
        float:  '0 4px 16px rgba(139,94,60,0.16)',
        bottom: '0 -1px 8px rgba(0,0,0,0.08)',
      },

      // ── Border Radius ──────────────────────────────────────
      borderRadius: {
        '4xl': '2rem',
        pill:  '9999px',
      },

      // ── 애니메이션 ─────────────────────────────────────────
      animation: {
        spin:        'spin 1s linear infinite',
        'fade-in':   'fadeIn 0.2s ease-out',
        'slide-up':  'slideUp 0.3s ease-out',
        'pulse-slow':'pulse 2s cubic-bezier(0.4,0,0.6,1) infinite',
        'combo-pop': 'comboPop 0.4s ease-out',
        'float-up':  'floatUp 0.8s ease-out forwards',
        shake:       'shake 0.3s ease-in-out',
      },
      keyframes: {
        spin: {
          '0%':   { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
        fadeIn: {
          '0%':   { opacity: '0' },
          '100%': { opacity: '1' },
        },
        slideUp: {
          '0%':   { opacity: '0', transform: 'translateY(8px)' },
          '100%': { opacity: '1', transform: 'translateY(0)' },
        },
        comboPop: {
          '0%':   { transform: 'scale(0.5)', opacity: '0' },
          '50%':  { transform: 'scale(1.3)', opacity: '1' },
          '100%': { transform: 'scale(1)', opacity: '1' },
        },
        floatUp: {
          '0%':   { transform: 'translate(-50%, -50%)', opacity: '1' },
          '100%': { transform: 'translate(-50%, calc(-50% - 40px))', opacity: '0' },
        },
        shake: {
          '0%, 100%': { transform: 'translateX(0)' },
          '20%':      { transform: 'translateX(-4px)' },
          '40%':      { transform: 'translateX(4px)' },
          '60%':      { transform: 'translateX(-3px)' },
          '80%':      { transform: 'translateX(2px)' },
        },
      },

      // ── 여백/간격 ──────────────────────────────────────────
      spacing: {
        safe:          'env(safe-area-inset-bottom)', // iOS 홈버튼 안전 여백
        'nav-height':  '56px',                        // 하단 탭바 높이
        'header-h':    '60px',                        // 상단 헤더 높이
      },
    },
  },
  variants: {},
  plugins: [],
};
