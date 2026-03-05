import React from 'react';
import { Link } from 'react-router-dom';

/** 입력 필드 공통 컴포넌트 */
const InputField = ({ id, label, type = 'text', autoComplete, autoFocus }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-medium text-content-primary dark:text-white">
      {label}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      autoComplete={autoComplete}
      autoFocus={autoFocus}
      required
      className="input"
      placeholder={label}
    />
  </div>
);

const LoginForm = ({ handleSubmit }) => {
  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-secondary dark:bg-dark-surface px-4 py-12">
      <div className="w-full max-w-sm bg-surface dark:bg-dark-surface2
                      rounded-2xl shadow-modal p-8
                      border border-surface-3 dark:border-dark-border
                      animate-fade-in">

        {/* 로고 + 제목 */}
        <div className="flex flex-col items-center mb-8">
          <img
            className="h-16 w-auto mb-4"
            src="/images/borikkori_brown.svg"
            alt="보리꼬리 로고"
          />
          <h1 className="text-xl font-bold text-content-primary dark:text-white">
            로그인
          </h1>
          <p className="mt-1 text-sm text-content-secondary dark:text-gray-400">
            보리꼬리에 오신 것을 환영해요 🐾
          </p>
        </div>

        {/* 폼 */}
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-4">
          <InputField
            id="email"
            label="이메일"
            type="email"
            autoComplete="email"
            autoFocus
          />
          <InputField
            id="password"
            label="비밀번호"
            type="password"
            autoComplete="current-password"
          />

          {/* 암호 저장 체크박스 */}
          <label className="flex items-center gap-2 text-sm text-content-secondary dark:text-gray-400 cursor-pointer">
            <input
              type="checkbox"
              name="remember"
              className="w-4 h-4 rounded border-surface-3 text-primary
                         focus:ring-primary/50 focus:ring-2"
            />
            암호 저장하기
          </label>

          <button type="submit" className="btn btn-accent w-full mt-2">
            로그인
          </button>
        </form>

        {/* 회원가입 링크 */}
        <p className="mt-6 text-center text-sm text-content-secondary dark:text-gray-400">
          아직 계정이 없으신가요?{' '}
          <Link to="/join" className="text-primary dark:text-primary-light font-semibold hover:underline">
            회원가입
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
