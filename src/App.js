import './App.css';
// import Router from "./Components/Router";
import Header from './Pages/Layout/header';
import Footer from "./Pages/Layout/footer";
import React, { useState } from 'react';
import Q from "./Components/Questions/Question";
import Result from "./Components/Result";
import ProgressBar from './Components/ProgressBar';
import Main from './Components/Main';
// import { RouterProvider, createBrowserRouter } from 'react-router-dom';

// const router = createBrowserRouter([{
//   path:'/result',
//   element:<Result></Result>,
//   errorElement:<p>에러여 에러~ 🤯🤯🤯</p>
// }]);

export default function App (){
    //초기화  [state]
    const [current,setCurrent] = useState(0);
    const max_question_id = 12;
    const [start, setStart] = useState(false);
    const [result, setResult] = useState([]);

// api 호출 시 로딩 뜨게하기
// https://anerim.tistory.com/221

    let _body;
    let _progress;
    let _container;

    const startClick = () => setStart((prev) => !prev);
    const handleClick = (data) => {
      setCurrent(current + 1);
      result.push(data);
      setResult((result) => result);
    };
    // const handleBack = () => setCurrent(current - 1);

    if(current===max_question_id){
      _body = <Result result_data = {result}></Result>;
    }else{
      _body = <Q current = {current} onClick={(data) => {
        handleClick(data);
        // handleBack();
      }}></Q>;
      _progress = <ProgressBar  value={current/max_question_id*100} />;
    }

    if(start === false){
      _container = readyTest();
    }else{
      _container = startTest();
    }
    
    function readyTest(){
      return (
        <Main onClick = {startClick}></Main>
      );
    }

    function startTest(){
      return (
        <div className='w-auto h-auto' >
          {_progress}
          <div className='h-auto my-20' ></div>
          {_body}
        </div>
      );
    }

    return (
     <div className='App'>
        <Header />
          {_container}
        <Footer />
      </div>

    );
}

