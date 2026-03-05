import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { loginUser } from '../../api/userApi';
import LoginForm from '../../components/user/LoginForm';
import { AuthContext } from '../../contexts/AuthProvider';

const UserLoginContainer = () => {
  const navigate = useNavigate();
  const { authenticated } = useContext(AuthContext);

  useEffect(() => {
    if (authenticated) {
      alert('접근할 수 없습니다.');
      navigate('/');
    }
  }, [authenticated, navigate]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    try {
      await loginUser({
        email: data.get('email'),
        password: data.get('password'),
      });
      navigate('/');
      window.location.reload();
    } catch (error) {
      alert('로그인에 실패했습니다');
    }
  };

  return <LoginForm handleSubmit={handleSubmit} />;
};

export default UserLoginContainer;
