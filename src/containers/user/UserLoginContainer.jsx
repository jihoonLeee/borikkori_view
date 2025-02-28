import React, { useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import LoginForm from '../../components/user/LoginForm';
import { AuthContext } from '../../contexts/AuthProvider';

const UserLoginContainer = () => {
  const navigate = useNavigate();
  const { authenticated } = useContext(AuthContext);

  useEffect(() => {
    if (authenticated) {
      alert("접근할 수 없습니다.");
      navigate('/');
    }
  }, [authenticated, navigate]);

  // 로그인 API 호출
  const loginUser = async (credentials) => {
    try {
      const response = await axios.post(
        `/user/login`, 
        credentials, 
        { withCredentials: true }
      );
      navigate("/");
      window.location.reload();
      return response.data;
    } catch (error) {
      alert("로그인에 실패했습니다");
      throw error;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    await loginUser({
      email: data.get('email'),
      password: data.get('password'),
    });
  };

  return <LoginForm handleSubmit={handleSubmit} />;
};

export default UserLoginContainer;
