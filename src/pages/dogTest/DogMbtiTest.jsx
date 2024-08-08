import React, { useState, useEffect } from "react";
import Question from "../../components/dogTest/Question";
import ProgressBar from '../../components/common/ProgressBar';
import { Navigate } from "react-router-dom";
import GetMBTI from '../../modules/GetMBTI';
import GbtiHome from "../../components/dogTest/GbtiHome";

const MAX_QUESTION_ID = 12;

const DogMbtiTest = () => {
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState([]);

  const handleClick = (data) => {
    setResult((prevResult) => [...prevResult, data]);
    setCurrent((prevCurrent) => prevCurrent + 1);
  };

  useEffect(() => {
    if (current === MAX_QUESTION_ID) {
      const param = GetMBTI(result);
    }
  }, [current, result]);

  if (current === MAX_QUESTION_ID) {
    const param = GetMBTI(result);
    return <Navigate to={`/dogBTI/result?result=${param}`} replace />;
  }

  return (
    <div>
      {current === 0 
        ? <GbtiHome onClick={() => setCurrent(1)} /> 
        : <div className='w-auto h-auto'>
            <ProgressBar value={(current / MAX_QUESTION_ID) * 100} />
            <div className='h-auto my-20'></div>
            <Question current={current} onClick={(data) => handleClick(data)} />
          </div>
      }
    </div>
  );
};

export default DogMbtiTest;
