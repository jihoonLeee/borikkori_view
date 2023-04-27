import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import ButtonBase from '@mui/material/ButtonBase';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LaptopChromebookIcon from '@mui/icons-material/LaptopChromebook';
import Box from '@mui/material/Box';

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  });

function Footer(){
    return(
    <Paper
      sx={{
        p: 2,
        margin: 'auto',
        maxWidth: '100%',
        flexGrow: 1,
        backgroundColor: (theme) =>
          theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
      }}
    >
      <Grid container spacing={2} sx={{
             display: 'flex',
             justifyContent :"center",
      }}>
          <Grid item alignItems='center'> 
            <ButtonBase sx={{ width: 128, height: 128 }}>
                <Img alt="complex" src="/images/dog_freinds_logo.png" />
            </ButtonBase>
          </Grid>
          <Grid item xs>
            <Box sx={{ display: 'flex', flexDirection: 'column' }}>
              <ButtonBase className='snsLogo' href='https://www.instagram.com/zzzihooon/'><InstagramIcon/>Instagram </ButtonBase> 
              <ButtonBase className='snsLogo'  href='https://www.youtube.com/@jihoon2723'><YouTubeIcon/> YouTube</ButtonBase> 
              <ButtonBase className='snsLogo'  href='https://jihoon2723.tistory.com/'><LaptopChromebookIcon/>Tistory</ButtonBase> 
              <ButtonBase className='snsLogo'  href='https://github.com/jihoonLeee'><GitHubIcon/>GitHub</ButtonBase> 
            </Box>
          </Grid>
        </Grid>
    </Paper>
    );
}

export default Footer;