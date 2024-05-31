import React, { useContext, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../modules/AuthProvider';
import LoginForm from '../../components/user/LoginForm';
import axios from 'axios';

const defaultTheme = createTheme();

const loginUser = async (credentials, navigate) => {
  return axios.post(
    `/user/login`, 
    credentials, 
    { withCredentials: true }
  )
  .then(response => {
    navigate("/");
    window.location.reload();
    return response.data;
  })
  .catch(error => {
    alert(`로그인에 실패했습니다`);
  });
}

const handleSubmit = (event, loginUser, navigate) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  loginUser({
    email: data.get('email'),
    password: data.get('password'),
  }, navigate);
};

export default function LoginPage() {
  const navigate = useNavigate();
  const { authenticated } = useContext(AuthContext);

  useEffect(() => {
    if (authenticated) {
      alert("접근할 수 없습니다.");
      navigate('/');
    }
  }, [authenticated, navigate]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <LoginForm handleSubmit={(event) => handleSubmit(event, loginUser, navigate)} />
    </ThemeProvider>
  );
}
