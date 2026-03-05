import React from 'react';
import { Link } from 'react-router-dom';

/**
 * 공통 버튼 컴포넌트
 * - to: React Router Link (내부 이동)
 * - href: 일반 <a> 링크 (외부)
 * - onClick: 버튼 클릭 핸들러
 * - variant: 'primary'|'secondary'|'ghost'|'accent'|'danger' (기본: 'ghost')
 * - size: 'sm'|'md'|'lg' (기본: 'md')
 */

const BASE =
  'inline-flex items-center justify-center font-semibold rounded-lg transition-all duration-150 ' +
  'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 ' +
  'disabled:opacity-50 disabled:pointer-events-none active:scale-95';

const VARIANTS = {
  primary:   'bg-primary text-white hover:bg-primary-dark',
  secondary: 'border border-primary text-primary hover:bg-primary/10 dark:border-primary-light dark:text-primary-light',
  ghost:     'text-primary hover:bg-primary/10 dark:text-primary-light',
  accent:    'bg-accent text-white hover:bg-accent-dark',
  danger:    'bg-red-500 text-white hover:bg-red-600',
  white:     'text-white/80 hover:text-white hover:bg-white/10',
};

const SIZES = {
  sm: 'text-xs px-3 py-1.5',
  md: 'text-sm px-4 py-2',
  lg: 'text-base px-5 py-2.5',
};

const StyledButton = ({
  to,
  href,
  onClick,
  children,
  variant = 'ghost',
  size = 'md',
  className = '',
  type = 'button',
  disabled = false,
  ...rest
}) => {
  const classes = `${BASE} ${VARIANTS[variant] ?? VARIANTS.ghost} ${SIZES[size]} ${className}`;

  // React Router 내부 링크
  if (to) {
    return (
      <Link to={to} className={classes} {...rest}>
        {children}
      </Link>
    );
  }
  // 외부 링크
  if (href) {
    return (
      <a href={href} className={classes} target="_blank" rel="noopener noreferrer" {...rest}>
        {children}
      </a>
    );
  }
  // 버튼
  return (
    <button type={type} onClick={onClick} className={classes} disabled={disabled} {...rest}>
      {children}
    </button>
  );
};

export default StyledButton;
