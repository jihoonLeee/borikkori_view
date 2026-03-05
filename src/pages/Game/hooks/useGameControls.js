import { useEffect, useRef, useCallback } from 'react';
import { Body } from 'matter-js';

/**
 * 보리게임 입력 처리 훅
 * 데스크톱: 키보드 A/D/S
 * 모바일: 캔버스 터치 드래그 + 릴리스 드롭
 */
export default function useGameControls({
  canvasRef,
  currentBodyRef,
  currentDogRef,
  disableActionRef,
  dimensionsRef,
  dropDog,
  moveLeft,
  moveRight,
  gameOverFlag, // true면 입력 차단
}) {
  const intervalRef = useRef(null);
  const isMobileRef = useRef(false);

  // 모바일 여부 감지
  useEffect(() => {
    isMobileRef.current = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
  }, []);

  // --- 키보드 (데스크톱) ---

  const startInterval = useCallback((fn) => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(fn, 8);
  }, []);

  const handleKeyDown = useCallback((e) => {
    if (disableActionRef.current || gameOverFlag) return;
    switch (e.code) {
      case 'KeyA':
      case 'ArrowLeft':
        startInterval(moveLeft);
        break;
      case 'KeyD':
      case 'ArrowRight':
        startInterval(moveRight);
        break;
      case 'KeyS':
      case 'ArrowDown':
      case 'Space':
        dropDog();
        break;
      default:
        break;
    }
  }, [disableActionRef, gameOverFlag, startInterval, moveLeft, moveRight, dropDog]);

  const handleKeyUp = useCallback((e) => {
    if (['KeyA', 'KeyD', 'ArrowLeft', 'ArrowRight'].includes(e.code)) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // --- 터치 (모바일) ---

  const touchStateRef = useRef({
    isDragging: false,
    startTouchX: 0,
    startBodyX: 0,
    hasMoved: false,
  });

  const handleTouchStart = useCallback((e) => {
    e.preventDefault();
    if (disableActionRef.current || gameOverFlag) return;

    const touch = e.touches[0];
    const canvas = canvasRef.current;
    if (!canvas || !currentBodyRef.current) return;

    const rect = canvas.getBoundingClientRect();
    const dims = dimensionsRef.current;
    if (!dims) return;

    touchStateRef.current = {
      isDragging: true,
      startTouchX: touch.clientX,
      startBodyX: currentBodyRef.current.position.x,
      hasMoved: false,
    };
  }, [canvasRef, currentBodyRef, disableActionRef, dimensionsRef, gameOverFlag]);

  const handleTouchMove = useCallback((e) => {
    e.preventDefault();
    const state = touchStateRef.current;
    if (!state.isDragging || !currentBodyRef.current) return;
    if (!currentBodyRef.current.isSleeping) return;

    const touch = e.touches[0];
    const canvas = canvasRef.current;
    const dims = dimensionsRef.current;
    if (!canvas || !dims) return;

    const rect = canvas.getBoundingClientRect();
    const scaleX = dims.width / rect.width;
    const deltaX = (touch.clientX - state.startTouchX) * scaleX;

    if (Math.abs(deltaX) > 2) {
      state.hasMoved = true;
    }

    const dog = currentDogRef.current;
    if (!dog) return;

    let newX = state.startBodyX + deltaX;
    // 벽 안쪽으로 제한
    newX = Math.max(dog.radius + 2, Math.min(dims.width - dog.radius - 2, newX));
    Body.setPosition(currentBodyRef.current, {
      x: newX,
      y: currentBodyRef.current.position.y,
    });
  }, [canvasRef, currentBodyRef, currentDogRef, dimensionsRef]);

  const handleTouchEnd = useCallback((e) => {
    e.preventDefault();
    const state = touchStateRef.current;
    if (!state.isDragging) return;
    state.isDragging = false;

    // 드래그 끝 → 드롭
    dropDog();
  }, [dropDog]);

  // --- 이벤트 등록/해제 ---

  useEffect(() => {
    // 키보드
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);

    // 터치
    const canvas = canvasRef.current;
    if (canvas) {
      canvas.addEventListener('touchstart', handleTouchStart, { passive: false });
      canvas.addEventListener('touchmove', handleTouchMove, { passive: false });
      canvas.addEventListener('touchend', handleTouchEnd, { passive: false });
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      document.removeEventListener('keyup', handleKeyUp);
      clearInterval(intervalRef.current);

      if (canvas) {
        canvas.removeEventListener('touchstart', handleTouchStart);
        canvas.removeEventListener('touchmove', handleTouchMove);
        canvas.removeEventListener('touchend', handleTouchEnd);
      }
    };
  }, [canvasRef, handleKeyDown, handleKeyUp, handleTouchStart, handleTouchMove, handleTouchEnd]);

  return { isMobileRef };
}
