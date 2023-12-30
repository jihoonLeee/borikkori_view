import React, { useContext, useEffect } from 'react';
import { CssBaseline, Typography, Container, Box, createTheme, ThemeProvider } from '@mui/material';
import { useNavigate } from "react-router-dom";
import { AuthContext } from '../../Modules/AuthProvider';
import JoinForm from '../Forms/JoinForm';

const defaultTheme = createTheme();

const Join = () => {
  const navigate = useNavigate();
  const { authenticated } = useContext(AuthContext);

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    console.log({
      email: data.get('email'),
      password: data.get('password'),
    });
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
          <img className="h-16 w-auto" src={`${process.env.PUBLIC_URL}/images/wagwagt_logo.png`} alt="" />
          <Typography component="h1" variant="h5">회원가입</Typography>
          <JoinForm onSubmit={handleSubmit} />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default Join;
