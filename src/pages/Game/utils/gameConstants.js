/**
 * 보리게임 상수값
 */

// 강아지 드롭 후 다음 강아지 생성 대기 시간 (ms)
export const DROP_DELAY = 700;

// 콤보 판정 시간 (ms) — 이 시간 내 연속 합체 시 콤보 증가
export const COMBO_WINDOW_MS = 2000;

// 최대 콤보 배율
export const MAX_COMBO = 10;

// 이 레벨 이상 합체 시 화면 흔들림 발동
export const SCREEN_SHAKE_THRESHOLD = 6;

// 게임 상태 enum
export const GAME_STATUS = Object.freeze({
  READY: 'ready',
  PLAYING: 'playing',
  GAME_OVER: 'gameOver',
});

// 화면 크기별 게임 치수
export const DIMENSIONS = {
  desktop: {
    width: 600,
    height: 800,
    startX: 280,
    maxR: 550,    // 오른쪽 이동 한계 (벽 안쪽)
    maxL: 50,     // 왼쪽 이동 한계
    topSpawn: 50, // 강아지 생성 Y 좌표
  },
  mobile: {
    width: 380,
    height: 550,
    startX: 190,
    maxR: 350,
    maxL: 30,
    topSpawn: 50,
  },
};

// 화면 크기 판별 기준
export const DESKTOP_BREAKPOINT = 1024;

// localStorage 키
export const BEST_SCORE_KEY = 'boriGame_bestScore';

// 색상 (다크/라이트)
export const COLORS = {
  light: {
    background: '#FAF8F5',
    wall: '#8B5E3C',
    guideLine: 'rgba(139, 94, 60, 0.3)',
  },
  dark: {
    background: '#1A1A1A',
    wall: '#4A3728',
    guideLine: 'rgba(255, 255, 255, 0.25)',
  },
};
