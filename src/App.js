import './App.css';
import Header from './Pages/Layout/header';
import Footer from "./Pages/Layout/footer";
import React, { useState } from 'react';
import Question from "./Components/Questions/Question";
import Result from "./Components/Result";
import ProgressBar from './Components/ProgressBar';
import Main from './Components/Main';
import { BrowserRouter as Router, Route, Navigate, Routes } from "react-router-dom";
import GetMBTI from './Components/GetMBTI';

function QuestionHandler({ setCurrent, setResult, current, max_question_id, result }) {
  const handleClick = (data) => {
    setCurrent(current + 1);
    result.push(data);
    setResult((result) => result);
  };

  if (current === max_question_id) {
    return <Navigate to={`/result?result=${GetMBTI(result)}`} replace />;
  }

  return (
    <div className='w-auto h-auto' >
      <ProgressBar  value={current/max_question_id * 100} />
      <div className='h-auto my-20' ></div>
      <Question current = {current} onClick={(data) => handleClick(data)} />
    </div>
  );
}

export default function App() {
  const [current, setCurrent] = useState(0);
  const max_question_id = 12;
  const [result, setResult] = useState([]);

  return (
    <div className='App'>
      <Header />
      <Router>
        <Routes>
          <Route path="/my-dog/" element={current === 0 
            ? <Main onClick={() => setCurrent(1)} /> 
            : <QuestionHandler
                setCurrent={setCurrent}
                setResult={setResult}
                current={current}
                max_question_id={max_question_id}
                result={result}
              />
          } />
          <Route path="/result" element={<Result result_data={result} />} />
        </Routes>
      </Router>
      <Footer />
    </div>
  );
}
