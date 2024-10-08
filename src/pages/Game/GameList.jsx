import * as React from 'react';
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

const defaultTheme = createTheme();

export default function Album() {
  const isMobile = useMediaQuery('(max-width: 768px)');

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
