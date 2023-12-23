import './App.css';
import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes } from "react-router-dom"; // Change this line
import ReactGA from "react-ga4";
import DogBTI from './Pages/Dog_Test/dog_mbti';
import DogBTI_Result from './Pages/Dog_Test/dog_mbti_result';
import MainBoard from './Pages/Board/MainBoard';
import DogHouse from './Pages/Home/DogHouse';
import Footer from './Pages/Layout/footer';
import Header from './Pages/Layout/header';
import Join from './Pages/User/join';
import Login from './Pages/User/login';
import BoardWrite from './Pages/Board/BoardWrite';

ReactGA.initialize("G-2G1F6RJ26H");

ReactGA.send({ 
  hitType: "pageview", 
  page: window.location.pathname, 
 });
 
export default function App() {
  const [result, setResult] = useState([]);

  return (
    <div className='App'>
     
      <Router>
        <Header/>
        <Routes>
          <Route path="/" element={<DogHouse />} />
          <Route path="/dogBTI/*" element={<DogBTI />} />
          <Route path="/dogBTI/result" element={<DogBTI_Result result_data={result} />} />
          <Route path="/mainBoard" element={<MainBoard />} />
          <Route path="/join" element={<Join />} />
          <Route path="/login" element={<Login />} />
          <Route path="/boardWrite" element={<BoardWrite />} />  {/**게시판 아이디 넘기기 / 게시판 종류별로 아이디 지정 */}
        </Routes>
        <Footer/>
      </Router>
      
    </div>
  );
}
