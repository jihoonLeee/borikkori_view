import './App.css';
// import Router from "./Components/Router";
import Header from './Pages/Layout/header';
import Footer from "./Pages/Layout/footer";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React, { useState } from 'react';
import Q from "./Components/Questions/Question"
import Result from "./Components/Result"

import LinearProgressWithLabel from './Components/LinearProgressWithLabel'

export default function App (){
    //초기화  [state]
    const [current,setCurrent] = useState(0);
    const max_question_id = 12;
   
// api 호출 시 로딩 뜨게하기
// https://anerim.tistory.com/221

    let _body;
    const handleClick = () => setCurrent(current + 1);
    if(current===max_question_id){
      _body = <Result ></Result>;
    }else{
      _body = <Q current = {current} onClick={handleClick}></Q>;
    }
    return (
      <div className='App'>
        <React.Fragment>
          <CssBaseline />
          <Container maxWidth="100%" sx={{ padding: '0px !important'}}>
            <Box sx={{ bgcolor: 'white', height: '100vh' }} >
            <Header />
              <LinearProgressWithLabel value={current/max_question_id*100} />
              <Box sx={{ bgcolor: 'white', height: '5vh' }} ></Box>
              {/* <Router />   */}
              {_body}
              {/* <Q question = {_question} next = {this.next} ></Q> */}
            <Footer />
            </Box>
          </Container>
      </React.Fragment>
    </div>
    );
}

