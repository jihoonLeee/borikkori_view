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

class Question extends Component{
    render(){
      const buttons = [
        <Button key="one" name="a">{this.props.question.a}</Button>,
        <Button key="two" name="b">{this.props.question.b}</Button>,
        <Button key="three" name="c">{this.props.question.c}</Button>,
        <Button key="four" name="d">{this.props.question.d}</Button>,
      ];
      return (
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
            onClick={function(e){
                console.log(e.target.name);
              }}
            >
                <Typography>{this.props.question.title}</Typography>
                <Img alt="complex" src="/images/dog_big_logo.jpg" />
                {buttons}
            </ButtonGroup>
        </Box>
       </Container>

      );
      
    }
  }
export default Question;  