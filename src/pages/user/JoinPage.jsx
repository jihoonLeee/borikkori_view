import React from 'react';
import { CssBaseline, Typography, Container, Box, createTheme, ThemeProvider } from '@mui/material';
import UserJoinContainer from '../../containers/user/UserJoinContainer';

const defaultTheme = createTheme();

const JoinPage = () => {
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box sx={{ marginTop: 8, display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
          <img className="h-16 w-auto" src={`${process.env.PUBLIC_URL}/images/borikkori_brown.svg`} alt="Borikkori Logo" />
          <Typography component="h1" variant="h5">회원가입</Typography>
          <UserJoinContainer />
        </Box>
      </Container>
    </ThemeProvider>
  );
};

export default JoinPage;
