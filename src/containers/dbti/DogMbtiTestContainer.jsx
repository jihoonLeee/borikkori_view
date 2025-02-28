import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import GetMBTI from "../../utils/GetMBTI"; // default export 사용
import DogMbtiHome from "../../components/dbti/DogMbtiHome";
import DogQuestion from "../../components/dbti/DogQuestion";
import ProgressBar from "../../components/common/ProgressBar";
import { questions } from "../../store/dbti/dogMbtiStore";

const MAX_QUESTION_ID = questions ? questions.length : 0;

const DogMbtiTestContainer = () => {
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState([]);

  const handleAnswer = (answer) => {
    setResult((prev) => [...prev, answer]);
    setCurrent((prev) => prev + 1);
  };

  useEffect(() => {
    if (current === MAX_QUESTION_ID) {
      // GetMBTI는 result 배열을 기반으로 최종 MBTI 값을 도출합니다.
      const param = GetMBTI(result);
    }
  }, [current, result]);

  if (current === MAX_QUESTION_ID) {
    const param = GetMBTI(result);
    return <Navigate to={`/dogBTI/result?result=${param}`} replace />;
  }

  return (
    <div>
      {current === 0 ? (
        <DogMbtiHome onStart={() => setCurrent(1)} />
      ) : (
        <div className='w-auto h-auto'>
          <ProgressBar value={(current / MAX_QUESTION_ID) * 100} />
          <div className='h-auto my-20'></div>
          {/* 질문 배열의 current 인덱스가 undefined가 아니어야 합니다. */}
          <DogQuestion current={current} question={questions[current]} onAnswer={handleAnswer} />
        </div>
      )}
    </div>
  );
};

export default DogMbtiTestContainer;
