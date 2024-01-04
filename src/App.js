import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes } from "react-router-dom";
import ReactGA from "react-ga4";
import DogMbtiTest from './Pages/DogTest/DogMbtiTest';
import DogMbtiResult from './Pages/DogTest/DogMbtiResult';
import MainBoard from './Pages/Board/MainBoard';
import DogHouse from './Pages/Home/DogHouse';
import Footer from './Pages/Layout/Footer';
import Header from './Pages/Layout/Header';
import Join from './Pages/User/Join';
import Login from './Pages/User/Login';
import BoardWrite from './Pages/Board/BoardWrite';

import { AuthProvider } from './Modules/AuthProvider';

import './App.css';

const trackingId = "G-2G1F6RJ26H"; // Google Analytics tracking ID
ReactGA.initialize(trackingId);
ReactGA.send({ hitType: "pageview", page: window.location.pathname });

export default function App() {
  const [result, setResult] = useState([]);

  return (
    <AuthProvider>
      <div className='App'>
        <Router>
          <Header />
          <Routes>
            <Route path="/" element={<DogHouse />} />
            <Route path="/dogBTI/*" element={<DogMbtiTest />} />
            <Route path="/dogBTI/result" element={<DogMbtiResult result_data={result} />} />
            <Route path="/mainBoard" element={<MainBoard />} />
            <Route path="/join" element={<Join />} />
            <Route path="/login" element={<Login />} />
            <Route path="/boardWrite" element={<BoardWrite />} />  {/**게시판 아이디 넘기기 / 게시판 종류별로 아이디 지정 */}
          </Routes>
          <Footer />
        </Router>
      </div>
    </AuthProvider>
  );
}
