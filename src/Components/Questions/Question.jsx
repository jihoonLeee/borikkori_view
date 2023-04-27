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
    maxWidth: '100%',
    maxHeight: '100%',
  });
var temp =[];
export default function Question(props){
  //  const chooseButton = () => {
  //     props.next();
  //   }
    const buttons = [
      <Button key="one" name="a">{props.question.a}</Button>,
      <Button key="two" name="b">{props.question.b}</Button>,
    ];
    return(
        <Container>
            <Box
            sx={{
            display: 'flex',
            justifyContent :"center",
            '& > *': {
                m: 1,
            },
            }}
        >
            <ButtonGroup
            orientation="vertical"
            aria-label="vertical outlined button group"
            // onClick={
            //     (e)=>{
            //       e.preventDefault();
            //       this.chooseButton;
            //       temp.push(e.target.name);
            //       console.log(temp);
            //     }
            //     // 배열에 뭐뭐 눌렀는지 저장 
            //   }
            >
                <Typography>{props.question.title}</Typography>
                <Img alt="complex" src="/images/dog_big_logo.jpg" />
                {buttons}
            </ButtonGroup>
        </Box>
        
       </Container>

      );
    }