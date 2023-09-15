import React, {useState, useEffect} from "react";
import Header from '../Layout/header';
import Footer from "../Layout/footer";
import Question from "../../Components/Questions/Question";
import ProgressBar from '../../Components/ProgressBar';
import Main from '../../Components/Main';
import { BrowserRouter as Router, Route, Navigate, Routes } from "react-router-dom";
import GetMBTI from '../../Components/GetMBTI';

export default function DogBTI() {
    function QuestionHandler({ setCurrent, setResult, current, max_question_id, result }) {
        const handleClick = (data) => {
          setCurrent(current + 1);
          result.push(data);
          setResult((result) => result);
        };
      
        if (current === max_question_id) {
          return <Navigate to={`/dogBTI/result?result=${GetMBTI(result)}`} replace />;
        }
      
        return (
          <div className='w-auto h-auto' >
            <ProgressBar  value={current/max_question_id * 100} />
            <div className='h-auto my-20' ></div>
            <Question current = {current} onClick={(data) => handleClick(data)} />
          </div>
        );
      }
      const [current, setCurrent] = useState(0);
      const max_question_id = 12;
      const [result, setResult] = useState([]);
    
  return (
    <div>
        <Header />
        {current === 0 
            ? <Main onClick={() => setCurrent(1)} /> 
            : (current === max_question_id)
            ? <Navigate to={`/dogBTI/result?result=${GetMBTI(result)}`} replace />
            : <QuestionHandler setCurrent={setCurrent} setResult={setResult} current={current} max_question_id={max_question_id} result={result}/>
        }
        <Footer />
    </div>
  );
}