import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useTheme } from '../../contexts/ThemeProvider';
import { GAME_STATUS } from './utils/gameConstants';
import useGameState from './hooks/useGameState';
import useGameEngine from './hooks/useGameEngine';
import useGameControls from './hooks/useGameControls';
import GameOverOverlay from './components/GameOverOverlay';
import GameHUD, { ScorePopups } from './components/GameHUD';
import { DOGS } from './Dogs';

/**
 * 보리게임 — 수박게임 스타일 강아지 합체 퍼즐
 */
export default function Game() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const gameAreaRef = useRef(null);
  const { isDark } = useTheme();

  // --- 게임 상태 ---
  const {
    score, bestScore, addScore,
    gameStatus, gameOver, resetGame, startGame,
    comboCount, updateCombo,
    nextDogIndex, consumeNextDog,
    scorePopups,
  } = useGameState();

  // 캔버스 DOM rect (점수 팝업 좌표 변환용)
  const [canvasRect, setCanvasRect] = useState(null);

  // 조작 힌트 표시
  const [showHint, setShowHint] = useState(true);

  // 신기록 여부
  const isNewBest = gameStatus === GAME_STATUS.GAME_OVER && score === bestScore && score > 0;

  // --- 합체 콜백 ---
  const handleMerge = useCallback((index, baseScore, x, y) => {
    updateCombo();
    addScore(baseScore, x, y);
  }, [updateCombo, addScore]);

  // --- 게임오버 콜백 ---
  const handleGameOver = useCallback(() => {
    gameOver();
  }, [gameOver]);

  // --- Matter.js 엔진 ---
  const engine = useGameEngine({
    containerRef,
    canvasRef,
    isDark,
    onMerge: handleMerge,
    onGameOver: handleGameOver,
    consumeNextDog,
  });

  // --- 입력 컨트롤 ---
  useGameControls({
    canvasRef,
    currentBodyRef: engine.currentBodyRef,
    currentDogRef: engine.currentDogRef,
    disableActionRef: engine.disableActionRef,
    dimensionsRef: engine.dimensionsRef,
    dropDog: engine.dropDog,
    moveLeft: engine.moveLeft,
    moveRight: engine.moveRight,
    gameOverFlag: gameStatus === GAME_STATUS.GAME_OVER,
  });

  // --- 초기화 ---
  useEffect(() => {
    engine.preloadImages(() => {
      const dims = engine.initializeGame();
      startGame();

      // 캔버스 rect 업데이트
      if (canvasRef.current) {
        setCanvasRect(canvasRef.current.getBoundingClientRect());
      }
    });

    // 조작 힌트 3초 후 숨김
    const hintTimer = setTimeout(() => setShowHint(false), 3000);

    return () => {
      engine.cleanupEngine();
      clearTimeout(hintTimer);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // canvasRect 주기적 업데이트 (리사이즈 대응)
  useEffect(() => {
    const updateRect = () => {
      if (canvasRef.current) {
        setCanvasRect(canvasRef.current.getBoundingClientRect());
      }
    };
    window.addEventListener('resize', updateRect);
    return () => window.removeEventListener('resize', updateRect);
  }, []);

  // --- 재시작 ---
  const handleRestart = useCallback(() => {
    resetGame();
    engine.preloadImages(() => {
      engine.initializeGame();
      if (canvasRef.current) {
        setCanvasRect(canvasRef.current.getBoundingClientRect());
      }
    });
    setShowHint(true);
    setTimeout(() => setShowHint(false), 3000);
  }, [resetGame, engine]);

  // --- 점수 공유 ---
  const handleShare = useCallback(async () => {
    const text = `🐕 보리게임에서 ${score.toLocaleString()}점을 기록했어요!`;
    if (navigator.share) {
      try {
        await navigator.share({ title: '보리게임', text });
      } catch (e) {
        // 사용자 취소
      }
    } else {
      try {
        await navigator.clipboard.writeText(text);
        alert('점수가 클립보드에 복사되었습니다!');
      } catch (e) {
        // 복사 실패
      }
    }
  }, [score]);

  // 모바일 감지
  const isMobile = typeof window !== 'undefined' &&
    ('ontouchstart' in window || navigator.maxTouchPoints > 0);

  return (
    <div className="w-full min-h-screen bg-secondary dark:bg-dark-surface flex flex-col transition-colors duration-200">
      {/* 게임 영역 */}
      <div className="flex-grow flex flex-col items-center justify-center px-2 py-4 md:py-6">
        {/* 게임 제목 */}
        <h1 className="text-lg md:text-xl font-bold text-content-primary dark:text-white mb-3
                       flex items-center gap-2">
          <span>🐕</span>
          <span>보리게임</span>
        </h1>

        {/* 캔버스 컨테이너 */}
        <div
          ref={containerRef}
          className="relative w-full rounded-2xl overflow-hidden shadow-modal"
          style={{ maxWidth: engine.dimensionsRef.current?.width || 600 }}
        >
          {/* 게임 영역 (상대 위치 기준) */}
          <div ref={gameAreaRef} className="relative">
            <canvas
              ref={canvasRef}
              className="w-full block rounded-2xl"
              style={{ touchAction: 'none' }}
            />

            {/* HUD 오버레이 */}
            <GameHUD
              score={score}
              bestScore={bestScore}
              comboCount={comboCount}
              nextDogIndex={nextDogIndex}
            />

            {/* 점수 팝업 */}
            <ScorePopups
              popups={scorePopups}
              canvasRect={canvasRect}
              dims={engine.dimensionsRef.current}
            />

            {/* 게임오버 오버레이 */}
            {gameStatus === GAME_STATUS.GAME_OVER && (
              <GameOverOverlay
                score={score}
                bestScore={bestScore}
                isNewBest={isNewBest}
                onRestart={handleRestart}
                onShare={handleShare}
              />
            )}

            {/* 조작 힌트 */}
            {showHint && gameStatus === GAME_STATUS.PLAYING && (
              <div className="absolute bottom-4 left-1/2 -translate-x-1/2 z-10
                              bg-black/60 backdrop-blur-sm text-white text-xs
                              px-4 py-2 rounded-full whitespace-nowrap
                              transition-opacity duration-500"
                   style={{ opacity: showHint ? 1 : 0 }}>
                {isMobile
                  ? '👆 드래그하여 이동 · 놓으면 내려'
                  : '⌨️ A/D 이동 · S/Space 내려'}
              </div>
            )}
          </div>
        </div>

        {/* 강아지 합체 가이드 (하단) */}
        <div className="mt-4 w-full overflow-x-auto" style={{ maxWidth: engine.dimensionsRef.current?.width || 600 }}>
          <div className="flex items-center justify-center gap-1 px-2 py-2
                          bg-surface dark:bg-dark-surface2 rounded-xl">
            {DOGS.map((dog, i) => {
              const name = dog.name.split('/').pop();
              return (
                <div key={i} className="flex flex-col items-center flex-shrink-0">
                  <img
                    src={`${dog.name}.png`}
                    alt={name}
                    className="w-5 h-5 md:w-6 md:h-6 object-contain"
                  />
                  {i < 11 && (
                    <span className="text-[8px] text-content-secondary dark:text-gray-500">→</span>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
