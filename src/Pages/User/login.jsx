import * as React from 'react';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import axios from 'axios';
import { useNavigate } from "react-router-dom";

// TODO remove, this demo shouldn't need to reset the theme.

const defaultTheme = createTheme();

export default function SignIn() {
  const navigate = useNavigate();

  const loginUser = async (credentials) => {
    const api_url = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_PORT;

    return axios.post(
      'http://localhost:8080/users/login', 
      credentials, 
      {withCredentials: true}
    )
    .then(response => {
      navigate("/");
      window.location.reload();
      return response.data;
    })
    .catch(error => console.error(`Error: ${error}`));
  }

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    loginUser({
      email: data.get('email'),
      password: data.get('password'),
    }).then(data => console.log(data));
  };
  
  return (
    <ThemeProvider theme={defaultTheme}>
      <Container component="main" maxWidth="xs">
        <CssBaseline />
        <Box
          sx={{
            marginTop: 8,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
          }}
        >
          <img className="h-16 w-auto" src={`${process.env.PUBLIC_URL}/images/wagwagt_logo.png`} alt="" />
          <Typography component="h1" variant="h5">
            로그인
          </Typography>
          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="email"
              label="이메일"
              name="email"
              autoComplete="email"
              autoFocus
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="password"
              label="비밀번호"
              type="password"
              id="password"
              autoComplete="current-password"
            />
            <FormControlLabel
              control={<Checkbox value="remember" color="primary" />}
              label="암호 저장하기"
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2, backgroundColor: '#fa7477', '&:hover': { backgroundColor: '#a52921' } }}
            >
              로그인
            </Button>
            <Grid container>
              {/* <Grid item xs>
                <Link href="#" variant="body2">
                  Forgot password?
                </Link>
              </Grid> */}
              <Grid container justifyContent="flex-end">
                <Link href="/join" variant="body2">
                  {"계정이 없으신가요?"}
                </Link>
              </Grid>
            </Grid>
          </Box>
        </Box>
      </Container>
    </ThemeProvider>
  );
}
// async function loginUser(credentials) {
//   const api_url = process.env.REACT_APP_API_URL + process.env.REACT_APP_API_PORT;
//   const history = useHistory();
//   return axios.post(
//       'http://localhost:8080/users/login', 
//       credentials, 
//       {withCredentials: true}
//         )
//         .then(response => {
//           history.push("/");
//           return response.data;
//         })
//         .catch(error => console.error(`Error: ${error}`));
// }