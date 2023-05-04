import React,{ Component } from 'react';
import Button from '@mui/material/Button';
import ButtonGroup from '@mui/material/ButtonGroup';
import Box from '@mui/material/Box';
import { Typography } from '@mui/material';
import Container from '@mui/material/Container';
import { styled } from '@mui/material/styles';

const Img = styled('img')({
    margin: 'auto',
    display: 'block',
    maxWidth: '60%',
    maxHeight: '60%',
  });
export default function Question(props){
    const buttons = [
      <Button className='button' key="one" name="a">{questions[props.current].a}</Button>,
      <Button className='button' key="two" name="b">{questions[props.current].b}</Button>,
    ];
    return(
        <Container>
          <div className='question'>
          <Box className = 'q_content'>
          <Typography>{questions[props.current].title}</Typography>
                <Img alt="complex" src="/images/dog_big_logo.jpg" />
            <ButtonGroup
            orientation="horizontal"
            aria-label="horizontal outlined button group"
            onClick={ (e) => {
              props.onClick();
              console.log(e.target.name);
              console.log(props.current);
            }}
            >
              
                {buttons}
            </ButtonGroup>
        </Box>
        </div>
       </Container>

      );
}
    const questions = [
      {id:1,title:"강아지가 다른 강아지나 사람을 만났을 때 어떤 반응을 보이나요?",
            a:"a) 즉각적으로 다가가며 친근하게 인사한다.",
            b:"b) 거리를 두며 조용히 지켜본다."},
      {id:2,title:"강아지가 새로운 장소를 방문했을 때 어떤 모습을 보이나요?",
            a:"a) 호기심이 많아 새로운 것을 탐험하며 즐긴다.",
            b:"b) 새로운 것을 보는 것을 좋아하지만, 불안해한다."},
      {id:3,title:"강아지가 다른 강아지나 사람과 함께 놀이를 할 때, 어떤 행동을 보이나요?",
            a:"a) 자유롭게 뛰어다니며 장난감을 물고 놀이를 즐긴다.",
            b:"b) 장난감을 가지고 멀리서 살피는 것을 좋아한다."},
      {id:4,title:"네번째 질문",
            a:"a) 대답 1",
            b:"b) 대답 2"},
      {id:5,title:"다섯번째 질문",
            a:"a) 대답 1",
            b:"b) 대답 2"},
      {id:6,title:"여섯번째 질문",
            a:"a) 대답 1",
            b:"b) 대답 2"},
      {id:7,title:"일곱번째 질문",
            a:"a) 대답 1",
            b:"b) 대답 2"},
      {id:8,title:"여덟번째 질문",
            a:"a) 대답 1",
            b:"b) 대답 2"},
      {id:9,title:"아홉번째 질문",
            a:"a) 대답 1",
            b:"b) 대답 2"},
      {id:10,title:"열번째 질문",
            a:"a) 대답 1",
            b:"b) 대답 2"},
      {id:11,title:"열한번째 질문",
            a:"a) 대답 1",
            b:"b) 대답 2"},
      {id:12,title:"마지막 질문",
            a:"a) 대답 1",
            b:"b) 대답 2"},
    ]