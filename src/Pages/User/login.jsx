import React, { useContext, useEffect } from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../Modules/AuthProvider';
import LoginForm from '../Forms/LoginForm';
import axios from 'axios';

const defaultTheme = createTheme();

const loginUser = async (credentials, navigate, api_url) => {
  return axios.post(
    `${api_url}/users/login`, 
    credentials, 
    {withCredentials: true}
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

const handleSubmit = (event, loginUser, navigate, api_url) => {
  event.preventDefault();
  const data = new FormData(event.currentTarget);
  loginUser({
    email: data.get('email'),
    password: data.get('password'),
  }, navigate, api_url);
};

export default function SignIn() {
  const navigate = useNavigate();
  const { authenticated } = useContext(AuthContext);
  const api_url = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_PORT;

  useEffect(() => {
    if (authenticated) {
      alert("접근할 수 없습니다.");
      navigate('/');
    }
  }, [authenticated, navigate]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <LoginForm handleSubmit={(event) => handleSubmit(event, loginUser, navigate, api_url)} />
    </ThemeProvider>
  );
}
