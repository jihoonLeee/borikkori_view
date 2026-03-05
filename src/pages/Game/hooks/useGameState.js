import { useState, useRef, useCallback } from 'react';
import {
  COMBO_WINDOW_MS,
  GAME_STATUS,
  BEST_SCORE_KEY,
} from '../utils/gameConstants';

/**
 * 보리게임 핵심 상태 관리 훅
 * score, bestScore, combo, gameStatus, nextDogIndex 등
 */
export default function useGameState() {
  // --- 점수 ---
  const scoreRef = useRef(0);
  const [score, setScore] = useState(0);

  // --- 최고 점수 (localStorage) ---
  const [bestScore, setBestScore] = useState(() => {
    return parseInt(localStorage.getItem(BEST_SCORE_KEY) || '0', 10);
  });

  // --- 게임 상태 ---
  const [gameStatus, setGameStatus] = useState(GAME_STATUS.READY);

  // --- 콤보 ---
  const comboCountRef = useRef(0);
  const [comboCount, setComboCount] = useState(0);
  const comboTimerRef = useRef(null);
  const lastMergeTimeRef = useRef(0);

  // --- 다음 강아지 미리보기 ---
  const nextDogIndexRef = useRef(Math.floor(Math.random() * 5));
  const [nextDogIndex, setNextDogIndex] = useState(nextDogIndexRef.current);

  // --- 점수 팝업 ---
  const [scorePopups, setScorePopups] = useState([]);
  const popupIdRef = useRef(0);

  /**
   * 다음 강아지 인덱스 소비 → 새 인덱스 생성
   * @returns {number} 현재 nextDogIndex (이번에 사용할 강아지)
   */
  const consumeNextDog = useCallback(() => {
    const current = nextDogIndexRef.current;
    const next = Math.floor(Math.random() * 5);
    nextDogIndexRef.current = next;
    setNextDogIndex(next);
    return current;
  }, []);

  /**
   * 콤보 업데이트 — 합체 시 호출
   * @returns {number} 현재 콤보 배율 (1 이상)
   */
  const updateCombo = useCallback(() => {
    const now = Date.now();
    if (now - lastMergeTimeRef.current < COMBO_WINDOW_MS) {
      comboCountRef.current += 1;
    } else {
      comboCountRef.current = 1;
    }
    setComboCount(comboCountRef.current);
    lastMergeTimeRef.current = now;

    // COMBO_WINDOW_MS 후 콤보 리셋
    clearTimeout(comboTimerRef.current);
    comboTimerRef.current = setTimeout(() => {
      comboCountRef.current = 0;
      setComboCount(0);
    }, COMBO_WINDOW_MS);

    return comboCountRef.current;
  }, []);

  /**
   * 점수 추가
   * @param {number} baseScore — 기본 점수
   * @param {number} x — 합체 x 좌표 (팝업용)
   * @param {number} y — 합체 y 좌표 (팝업용)
   */
  const addScore = useCallback((baseScore, x, y) => {
    const multiplier = Math.max(1, comboCountRef.current);
    const gained = baseScore * multiplier;
    scoreRef.current += gained;
    setScore(scoreRef.current);

    // 점수 팝업 추가
    const id = ++popupIdRef.current;
    setScorePopups(prev => [
      ...prev,
      { id, score: gained, combo: multiplier, x, y, createdAt: Date.now() },
    ]);
    // 800ms 후 팝업 제거
    setTimeout(() => {
      setScorePopups(prev => prev.filter(p => p.id !== id));
    }, 800);
  }, []);

  /**
   * 게임오버 처리
   */
  const gameOver = useCallback(() => {
    setGameStatus(GAME_STATUS.GAME_OVER);
    clearTimeout(comboTimerRef.current);

    if (scoreRef.current > parseInt(localStorage.getItem(BEST_SCORE_KEY) || '0', 10)) {
      const newBest = scoreRef.current;
      setBestScore(newBest);
      localStorage.setItem(BEST_SCORE_KEY, String(newBest));
    }
  }, []);

  /**
   * 게임 리셋 (재시작)
   */
  const resetGame = useCallback(() => {
    scoreRef.current = 0;
    setScore(0);
    comboCountRef.current = 0;
    setComboCount(0);
    clearTimeout(comboTimerRef.current);
    lastMergeTimeRef.current = 0;
    setScorePopups([]);

    const next = Math.floor(Math.random() * 5);
    nextDogIndexRef.current = next;
    setNextDogIndex(next);

    setGameStatus(GAME_STATUS.PLAYING);
  }, []);

  /**
   * 게임 시작 (READY → PLAYING)
   */
  const startGame = useCallback(() => {
    setGameStatus(GAME_STATUS.PLAYING);
  }, []);

  return {
    // 점수
    score,
    scoreRef,
    bestScore,
    addScore,

    // 상태
    gameStatus,
    gameOver,
    resetGame,
    startGame,

    // 콤보
    comboCount,
    updateCombo,

    // 다음 강아지
    nextDogIndex,
    consumeNextDog,

    // 점수 팝업
    scorePopups,
  };
}
