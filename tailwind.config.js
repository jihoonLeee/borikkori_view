/** @type {import('tailwindcss').Config} */
module.exports = {
  important: true,
  content: ['./src/**/*.{js,jsx,ts,tsx}'],
  theme: {
    extend: {
      colors: {
        // 로고와 어울리는 갈색(primary), 크림색(secondary), 포인트 초록(accent)
        primary: '#8B5E3C',
        secondary: '#FAF8F5',
        accent: '#4caf50',
      },
      animation: {
        spin: 'spin 1s linear infinite',
      },
      keyframes: {
        spin: {
          '0%': { transform: 'rotate(0deg)' },
          '100%': { transform: 'rotate(360deg)' },
        },
      },
      fontFamily: {
        sans: ['Noto Sans KR', 'sans-serif'], // 기본 폰트로 지정
        headline: ['Poppins', 'sans-serif'],   // 헤드라인 전용
      },
    },
  },
  variants: {},
  plugins: [],
};
