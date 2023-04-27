import React, { useState, useEffect } from 'react';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';
import Loading from './Loading';

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '100%',
    maxHeight: '100%',
  });
export default function Result(){
    const [visible, setVisible] = useState(true);
    const result = 'istj'
    useEffect(() => {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }, []);
      return (
        visible ? <Loading></Loading> :
        <Container>
            결과 입니다~
            <Img src={`/images/results/${result}_result.png`} />
       </Container>
      );
      
  }