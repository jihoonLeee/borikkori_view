import React from 'react';
import { DOGS } from '../Dogs';

/**
 * 게임 HUD — 점수, 최고 점수, 콤보 카운터, 다음 강아지 미리보기
 * 캔버스 위에 absolute로 오버레이
 */
export default function GameHUD({ score, bestScore, comboCount, nextDogIndex }) {
  const nextDog = DOGS[nextDogIndex];

  // 강아지 이름 (경로에서 마지막 부분 추출)
  const dogDisplayName = nextDog?.name?.split('/').pop() || '';

  return (
    <>
      {/* 상단 바: 점수 + 최고 점수 */}
      <div className="absolute top-0 left-0 right-0 z-10 flex items-center justify-between px-3 py-2
                       bg-gradient-to-b from-black/40 to-transparent pointer-events-none">
        <div className="text-white">
          <p className="text-xs opacity-75">점수</p>
          <p className="text-xl font-bold tabular-nums">{score.toLocaleString()}</p>
        </div>
        <div className="text-white text-right">
          <p className="text-xs opacity-75">최고</p>
          <p className="text-base font-semibold tabular-nums opacity-90">{bestScore.toLocaleString()}</p>
        </div>
      </div>

      {/* 다음 강아지 미리보기 (우상단) */}
      <div className="absolute top-12 right-2 z-10 flex flex-col items-center
                       bg-surface/90 dark:bg-dark-surface2/90 backdrop-blur-sm
                       rounded-xl p-2 shadow-card min-w-[52px]">
        <p className="text-[10px] text-content-secondary dark:text-gray-400 mb-1 font-medium">
          다음
        </p>
        <div className="w-10 h-10 flex items-center justify-center">
          {nextDog && (
            <img
              src={`${nextDog.name}.png`}
              alt={dogDisplayName}
              className="w-9 h-9 object-contain"
            />
          )}
        </div>
      </div>

      {/* 콤보 카운터 */}
      {comboCount > 1 && (
        <div
          key={comboCount}
          className="absolute top-1/4 left-1/2 -translate-x-1/2 z-20 pointer-events-none"
          style={{ animation: 'combo-pop 0.4s ease-out' }}
        >
          <div className="text-center">
            <p className="text-3xl font-black text-transparent bg-clip-text
                          bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500
                          drop-shadow-lg"
               style={{ WebkitTextStroke: '1px rgba(0,0,0,0.2)' }}>
              x{comboCount}
            </p>
            <p className="text-xs font-bold text-white drop-shadow-md mt-0.5">
              COMBO!
            </p>
          </div>
        </div>
      )}
    </>
  );
}

/**
 * 점수 팝업 컴포넌트 — 합체 시 +점수 표시
 * scorePopups 배열을 받아 렌더링
 */
export function ScorePopups({ popups, canvasRect, dims }) {
  if (!canvasRect || !dims) return null;

  const scaleX = canvasRect.width / dims.width;
  const scaleY = canvasRect.height / dims.height;

  return (
    <>
      {popups.map(popup => {
        const left = popup.x * scaleX;
        const top = popup.y * scaleY;

        return (
          <div
            key={popup.id}
            className="absolute z-20 pointer-events-none"
            style={{
              left: `${left}px`,
              top: `${top}px`,
              transform: 'translate(-50%, -50%)',
              animation: 'float-up 0.8s ease-out forwards',
            }}
          >
            <span className={`text-lg font-black drop-shadow-md ${
              popup.combo > 1
                ? 'text-transparent bg-clip-text bg-gradient-to-r from-yellow-400 to-orange-500'
                : 'text-white'
            }`}>
              +{popup.score}
            </span>
          </div>
        );
      })}
    </>
  );
}
