import './App.css';
// import Router from "./Components/Router";
import Header from './Pages/Layout/header';
import Footer from "./Pages/Layout/footer";
import CssBaseline from '@mui/material/CssBaseline';
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import React,{ Component } from 'react';
import Q from "./Components/Questions/Question"


class App extends Component{
  constructor(props){
    super(props);
    //초기화  [state]
    this.max_question_id = 10;
    this.state={
      mode:"welcome",
      current_question_id:1,
      questions : [
        {id:1,title:"강아지가 다른 강아지나 사람을 만났을 때 어떤 반응을 보이나요?",
              a:"a) 즉각적으로 다가가며 친근하게 인사한다.",
              b:"b) 거리를 두며 조용히 지켜본다."},
        {id:2,title:"강아지가 새로운 장소를 방문했을 때 어떤 모습을 보이나요?",
              a:"a) 호기심이 많아 새로운 것을 탐험하며 즐긴다.",
              b:"b) 새로운 것을 보는 것을 좋아하지만, 불안해한다."},
        {id:3,title:"강아지가 다른 강아지나 사람과 함께 놀이를 할 때, 어떤 행동을 보이나요?",
              a:"a) 자유롭게 뛰어다니며 장난감을 물고 놀이를 즐긴다.",
              b:"b) 장난감을 가지고 멀리서 살피는 것을 좋아한다."},
      ]
    }
  }

  getQuestion(){
    var i = 0;
      while(i< this.state.questions.length){
        var data = this.state.questions[i];
        if(data.id ===this.state.current_question_id){
          return data;
        }
        i=i+1;
      }
  }


  render(){
    var _question = this.getQuestion();
    return (
      <div className='App'>
        <React.Fragment>
          <CssBaseline />
          <Container maxWidth="100%" sx={{ padding: '0px !important'}}>
            <Box sx={{ bgcolor: 'white', height: '100vh' }} >
            <Header />
              {/* <Router />   */}
              <Q question = {_question} ></Q>
            <Footer />
            </Box>
          </Container>
      </React.Fragment>
      </div>
    );
  }
}

export default App;
