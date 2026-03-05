import React from 'react';
import { DOGS } from '../Dogs';

/**
 * 게임오버 오버레이
 * alert() 대신 세련된 모달 오버레이
 */
export default function GameOverOverlay({ score, bestScore, isNewBest, onRestart, onShare }) {
  return (
    <div className="absolute inset-0 z-30 flex items-center justify-center bg-black/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-surface dark:bg-dark-surface2 rounded-2xl shadow-modal p-6 mx-4 w-full max-w-xs text-center">
        {/* 보리 이미지 */}
        <div className="w-20 h-20 mx-auto mb-3 rounded-full bg-surface-2 dark:bg-dark-surface3 flex items-center justify-center overflow-hidden">
          <img
            src={`${DOGS[DOGS.length - 1].name}.png`}
            alt="보리"
            className="w-16 h-16 object-contain"
          />
        </div>

        <h2 className="text-xl font-bold text-content-primary dark:text-white mb-1">
          게임 오버!
        </h2>

        {/* 최종 점수 */}
        <div className="bg-primary/10 dark:bg-primary/20 rounded-xl py-4 px-3 mb-3">
          <p className="text-sm text-content-secondary dark:text-gray-400 mb-1">최종 점수</p>
          <p className="text-4xl font-bold text-primary dark:text-primary-light">
            {score.toLocaleString()}
          </p>
        </div>

        {/* 최고 점수 */}
        <div className="mb-4">
          {isNewBest ? (
            <div className="flex items-center justify-center gap-2">
              <span className="inline-block px-2 py-0.5 bg-accent text-white text-xs font-bold rounded-full animate-bounce">
                NEW!
              </span>
              <span className="text-sm font-medium text-accent dark:text-accent-light">
                최고 기록 갱신!
              </span>
            </div>
          ) : (
            <p className="text-sm text-content-secondary dark:text-gray-400">
              최고 기록: <span className="font-bold text-content-primary dark:text-white">{bestScore.toLocaleString()}</span>점
            </p>
          )}
        </div>

        {/* 버튼 */}
        <div className="flex flex-col gap-2">
          <button
            onClick={onRestart}
            className="btn btn-primary w-full py-3 text-base font-bold"
          >
            🔄 다시 하기
          </button>
          <button
            onClick={onShare}
            className="btn btn-secondary w-full py-2.5 text-sm"
          >
            📤 점수 공유
          </button>
        </div>
      </div>
    </div>
  );
}
