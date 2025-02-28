import React from 'react';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import UserLoginContainer from '../../containers/user/UserLoginContainer';

const defaultTheme = createTheme();

const LoginPage = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <UserLoginContainer />
    </ThemeProvider>
  );
};

export default LoginPage;
