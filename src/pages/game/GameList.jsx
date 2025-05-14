import * as React from 'react';
import { useState, useEffect } from 'react';
import Button from '@mui/material/Button';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import CssBaseline from '@mui/material/CssBaseline';
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import { Link } from "react-router-dom";
import useMediaQuery from '@mui/material/useMediaQuery';
import CircularProgress from '@mui/material/CircularProgress';

const defaultTheme = createTheme();

export default function Album() {
  const isMobile = useMediaQuery('(max-width: 768px)');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // 2초 후 로딩 상태 해제
    const timer = setTimeout(() => {
      setLoading(false);
    }, 2000);

    return () => clearTimeout(timer);
  }, []);

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
          width: '100vw',
          backgroundColor: '#FAF8F5',
          position: 'fixed',
          top: 0,
          left: 0,
          zIndex: 9999
        }}
      >
        <img 
          src="/images/borikkori_cartoon_game.png" 
          alt="보리꼬리 게임 로딩" 
          style={{ 
            maxWidth: '350px',
            marginBottom: '20px',
            animation: 'jump 1.2s infinite alternate'
          }} 
        />
        <Typography 
          variant="h5" 
          sx={{ 
            color: '#8B5E3C', 
            fontWeight: 'bold',
            marginTop: '16px',
            textAlign: 'center'
          }}
        >
          게임 목록을 불러오는 중입니다...
        </Typography>
        <CircularProgress 
          size="1.5rem" 
          sx={{ 
            color: '#4caf50', 
            marginTop: '16px' 
          }} 
        />
        
        <style>{`
          @keyframes jump {
            0% { transform: translateY(0) rotate(0deg); }
            50% { transform: translateY(-20px) rotate(5deg); }
            100% { transform: translateY(0) rotate(-5deg); }
          }
        `}</style>
      </Box>
    );
  }

  return (
    <ThemeProvider theme={defaultTheme}>
      <CssBaseline />
      <main>
        {/* Hero unit */}
        <Box
          sx={{
            bgcolor: 'background.paper',
            pt: 8,
            pb: 6,
          }}
        >
          <Container maxWidth="sm">
            <Typography
              component="h1"
              variant="h2"
              align="center"
              color="text.primary"
              gutterBottom
            >
              보리꼬리 게임
            </Typography>
          </Container>
        </Box>
        <Container sx={{ py: 8 }} maxWidth="md">
          <Grid container spacing={4}>
            <Grid item key="boriGame" xs={12} sm={6} md={4}>
              <Link to='/boriGame' style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      pt: '56.25%', // 16:9 비율
                    }}
                    image="/images/game/bori.png"
                  />
                  <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      보리게임
                    </Typography>
                    <Typography>
                      수박게임을 따라한 보리게임입니다 ㅎ ㅎ
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
            <Grid item key="mbti" xs={12} sm={6} md={4}>
              <Link to='/dogBTI' style={{ textDecoration: 'none', display: 'block', height: '100%' }}>
                <Card
                  sx={{
                    height: '100%',
                    display: 'flex',
                    flexDirection: 'column',
                  }}
                >
                  <CardMedia
                    component="div"
                    sx={{
                      pt: '56.25%', // 16:9 비율
                    }}
                    image="/images/dog_big_logo.jpg"
                  />
                  <CardContent sx={{ flexGrow: 1, overflow: 'hidden' }}>
                    <Typography gutterBottom variant="h5" component="h2">
                      댕BTI
                    </Typography>
                    <Typography>
                      우리 강아지가 사람이라면?
                    </Typography>
                  </CardContent>
                </Card>
              </Link>
            </Grid>
          </Grid>
        </Container>
      </main>
      <Box sx={{ bgcolor: 'background.paper', p: 6 }} component="footer">
        <Typography
          variant="subtitle1"
          align="center"
          color="text.secondary"
          component="p"
        >
          Made By Matter.js
        </Typography>
      </Box>
    </ThemeProvider>
  );
}
