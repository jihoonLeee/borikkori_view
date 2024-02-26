import React, { useState,useContext, useEffect } from 'react';
import { CssBaseline, Typography, Container, Box, createTheme, ThemeProvider } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../Modules/AuthProvider';
import JoinForm from '../Forms/JoinForm';
import axios from 'axios';
import BasicAlert from '../../Components/BasicAlert';

const defaultTheme = createTheme();

const Join = () => {
  
  const navigate = useNavigate();
  const { authenticated } = useContext(AuthContext);
  const [showAlert, setShowAlert] = useState(false);
 
  const joinUser = async (credentials, navigate) => {
    return axios.post(
      `/user/join`,
      credentials,
      { withCredentials: true }
    )
    .then(response => {
      alert("회원가입이 완료되었습니다.");
      navigate("/login");
      return response.data;
    })
    .catch(error => {
      alert(`회원가입에 실패했습니다: ${error}`);
    });
  };
  const emailVerify = async (email) => {
    console.log(email+  "    이메일");
    try {
      const response = await axios.post(
        `/user/sendEmail`,
        { email },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.status !== 200) throw new Error('Verification failed');
      setShowAlert(true);
      return true;
    } catch (error) {
      alert("인증메일 전송에 실패하였습니다.");
      return false;
    }
  };

  const handleSubmit = (formData) => {
    joinUser(formData, navigate);
  };
  useEffect(() => {
    if (authenticated) {
      alert("접근할 수 없습니다.");
      navigate('/');
    }
  }, [authenticated, navigate]);

  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          {showAlert && <BasicAlert msg="이메일이 전송되었습니다." />} 
          <img className="h-16 w-auto" src={`${process.env.PUBLIC_URL}/images/borikkori_brown.svg`} alt="" />
          <Typography component="h1" variant="h5">회원가입</Typography>
          <JoinForm onSubmit={handleSubmit} onVerify={emailVerify} />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Join;
