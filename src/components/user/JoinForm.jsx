import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useFormik } from 'formik';
import * as Yup from 'yup';

/** 입력 필드 공통 컴포넌트 */
const Field = ({ id, label, type = 'text', formik, autoComplete }) => (
  <div className="flex flex-col gap-1.5">
    <label htmlFor={id} className="text-sm font-medium text-content-primary dark:text-white">
      {label}
    </label>
    <input
      id={id}
      name={id}
      type={type}
      autoComplete={autoComplete}
      onChange={formik.handleChange}
      onBlur={formik.handleBlur}
      value={formik.values[id]}
      className="input"
      placeholder={label}
    />
    {formik.touched[id] && formik.errors[id] && (
      <p className="text-xs text-red-500">{formik.errors[id]}</p>
    )}
  </div>
);

const JoinForm = ({ onSubmit, onVerify }) => {
  const [isVerified, setIsVerified] = useState(false);
  const [verifyLoading, setVerifyLoading] = useState(false);

  const formik = useFormik({
    initialValues: {
      name: '',
      email: '',
      verificationNumber: '',
      password: '',
      passwordCheck: '',
    },
    validationSchema: Yup.object({
      name:          Yup.string().required('닉네임을 입력해주세요.'),
      email:         Yup.string().email('이메일 형식이 올바르지 않습니다.').required('이메일을 입력해주세요.'),
      password:      Yup.string().min(6, '비밀번호는 6자 이상이어야 합니다.').required('비밀번호를 입력해주세요.'),
      passwordCheck: Yup.string()
        .oneOf([Yup.ref('password'), null], '비밀번호가 일치하지 않습니다.')
        .required('비밀번호 확인을 입력해주세요.'),
    }),
    onSubmit: (values) => {
      if (!isVerified) {
        alert('이메일 인증이 필요합니다.');
        return;
      }
      onSubmit({
        email: values.email,
        password: values.password,
        name: values.name,
        verificationNumber: values.verificationNumber,
      });
    },
  });

  const handleVerify = async () => {
    if (!formik.values.email) {
      formik.setFieldTouched('email', true);
      return;
    }
    setVerifyLoading(true);
    try {
      const result = await onVerify(formik.values.email);
      if (result) setIsVerified(true);
    } finally {
      setVerifyLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center
                    bg-secondary dark:bg-dark-surface px-4 py-12">
      <div className="w-full max-w-sm bg-surface dark:bg-dark-surface2
                      rounded-2xl shadow-modal p-8
                      border border-surface-3 dark:border-dark-border
                      animate-fade-in">

        {/* 로고 + 제목 */}
        <div className="flex flex-col items-center mb-8">
          <img className="h-16 w-auto mb-4" src="/images/borikkori_brown.svg" alt="보리꼬리" />
          <h1 className="text-xl font-bold text-content-primary dark:text-white">회원가입</h1>
          <p className="mt-1 text-sm text-content-secondary dark:text-gray-400">
            함께 해요, 반려견 친구들! 🐾
          </p>
        </div>

        {/* 폼 */}
        <form noValidate onSubmit={formik.handleSubmit} className="flex flex-col gap-4">

          <Field id="name" label="닉네임" formik={formik} autoComplete="family-name" />

          {/* 이메일 + 인증 버튼 */}
          <div className="flex flex-col gap-1.5">
            <label htmlFor="email" className="text-sm font-medium text-content-primary dark:text-white">
              이메일
            </label>
            <div className="flex gap-2">
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                onChange={formik.handleChange}
                onBlur={formik.handleBlur}
                value={formik.values.email}
                className="input flex-1"
                placeholder="이메일"
                disabled={isVerified}
              />
              <button
                type="button"
                onClick={handleVerify}
                disabled={isVerified || verifyLoading}
                className="btn btn-accent shrink-0 text-xs px-3"
              >
                {isVerified ? '인증됨 ✓' : verifyLoading ? '전송중...' : '인증'}
              </button>
            </div>
            {formik.touched.email && formik.errors.email && (
              <p className="text-xs text-red-500">{formik.errors.email}</p>
            )}
          </div>

          {/* 인증번호 입력 (이메일 인증 후 노출) */}
          {isVerified && (
            <div className="flex flex-col gap-1.5 animate-fade-in">
              <label htmlFor="verificationNumber" className="text-sm font-medium text-content-primary dark:text-white">
                인증번호
              </label>
              <input
                id="verificationNumber"
                name="verificationNumber"
                type="text"
                onChange={formik.handleChange}
                value={formik.values.verificationNumber}
                className="input"
                placeholder="인증번호를 입력해주세요"
              />
            </div>
          )}

          <Field id="password"      label="비밀번호"      type="password" formik={formik} autoComplete="new-password" />
          <Field id="passwordCheck" label="비밀번호 확인"  type="password" formik={formik} autoComplete="new-password" />

          <button type="submit" className="btn btn-accent w-full mt-2">
            회원가입
          </button>
        </form>

        {/* 로그인 링크 */}
        <p className="mt-6 text-center text-sm text-content-secondary dark:text-gray-400">
          이미 계정이 있으신가요?{' '}
          <Link to="/login" className="text-primary dark:text-primary-light font-semibold hover:underline">
            로그인
          </Link>
        </p>
      </div>
    </div>
  );
};

export default JoinForm;
