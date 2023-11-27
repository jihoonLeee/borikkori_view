import React, {useState, useEffect} from "react";
import Question from "../../Components/Questions/Question";
import ProgressBar from '../../Components/ProgressBar';
import { BrowserRouter as Router, Route, Navigate, Routes } from "react-router-dom";
import GetMBTI from '../../Components/GetMBTI';
import GbtiHome from "../../Components/GbtiHome";

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
        {current === 0 
            ? <GbtiHome onClick={() => setCurrent(1)} /> 
            : (current === max_question_id)
            ? <Navigate to={`/dogBTI/result?result=${GetMBTI(result)}`} replace />
            : <QuestionHandler setCurrent={setCurrent} setResult={setResult} current={current} max_question_id={max_question_id} result={result}/>
        }
    </div>
  );
}