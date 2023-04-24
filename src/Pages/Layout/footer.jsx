import * as React from 'react';
import { styled } from '@mui/material/styles';
import Grid from '@mui/material/Grid';
import Paper from '@mui/material/Paper';
import Typography from '@mui/material/Typography';
import ButtonBase from '@mui/material/ButtonBase';
import InstagramIcon from '@mui/icons-material/Instagram';
import GitHubIcon from '@mui/icons-material/GitHub';
import YouTubeIcon from '@mui/icons-material/YouTube';
import LaptopChromebookIcon from '@mui/icons-material/LaptopChromebook';

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  });

function Footer(){
    return(
    // <footer id="footer">
    //     <ul class="icons">
    //         <li><a href="https://github.com/jihoonLeee" class="icon brands fa-twitter"><span class="label">Github</span></a></li>
    //         <li><a href="https://jihoon2723.tistory.com/" class="icon brands fa-facebook-f"><span class="label">Tistory</span></a></li>
    //         <li><a href="https://www.instagram.com/zzzihooon/" class="icon brands fa-instagram"><span class="label">Instagram</span></a></li>
    //         <li><a href="ljh2723@gmail.com" class="icon solid fa-envelope"><span class="label">Email</span></a></li>
    //     </ul>
    //     <ul class="copyright">
    //         <li>&copy; Happy Dog</li>
    //     </ul>
    // </footer>
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
      
        <Grid item xs={'auto'} sm container>
          <Grid item xs >
            <Grid item  > 
            <ButtonBase sx={{ width: 128, height: 128 }}>
                <Img alt="complex" src="/images/dog_freinds_logo.png" />
            </ButtonBase>
            </Grid>
            <Grid item xs>
              <Typography variant="body2" color="text.secondary">
              <ButtonBase href='https://www.instagram.com/zzzihooon/'><InstagramIcon/></ButtonBase> 
              <ButtonBase href='https://www.youtube.com/@jihoon2723'><YouTubeIcon/></ButtonBase> 
              <ButtonBase href='https://jihoon2723.tistory.com/'><LaptopChromebookIcon/></ButtonBase> 
              <ButtonBase href='https://github.com/jihoonLeee'><GitHubIcon/></ButtonBase> 
              </Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Paper>
    );
}

export default Footer;