import './App.css';
import React, { useState } from 'react';
import { HashRouter as Router, Route, Routes } from "react-router-dom"; // Change this line
import ReactGA from "react-ga4";
import DogBTI from './Pages/Dog_Test/dog_mbti';
import DogBTI_Result from './Pages/Dog_Test/dog_mbti_result';
import DogBoard from './Pages/Board/DogBoard';
import DogHouse from './Pages/Home/DogHouse';
import Footer from './Pages/Layout/footer';
import Header from './Pages/Layout/header';

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
          <Route path="/dogBoard" element={<DogBoard />} />
        </Routes>
        <Footer/>
      </Router>
      
    </div>
  );
}
