import React from 'react';

/**
 * 사용자 아바타 컴포넌트 (MUI 제거, 순수 Tailwind)
 * - 이미지가 없으면 이름 첫 글자 이니셜 표시
 * - size: 'sm'|'md' (기본: 'md')
 */
export default function UserAvatar({ userName, size = 'md' }) {
  const initial = userName ? userName.charAt(0).toUpperCase() : '?';

  const sizeClasses = {
    sm: 'w-7 h-7 text-xs',
    md: 'w-9 h-9 text-sm',
  };

  return (
    <div
      title={userName}
      className={`
        ${sizeClasses[size] ?? sizeClasses.md}
        flex items-center justify-center rounded-full shrink-0
        bg-white/20 border border-white/30
        font-bold text-white select-none
      `}
    >
      {initial}
    </div>
  );
}
