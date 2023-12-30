import React, {useState, useEffect} from "react";
import Question from "../../Components/Questions/Question.jsx";
import ProgressBar from '../../Components/ProgressBar.jsx';
import { Navigate  } from "react-router-dom";
import GetMBTI from '../../Modules/GetMBTI.js';
import GbtiHome from "../../Components/GbtiHome.jsx";
import { firestore }  from '../../Modules/Firebase.js';

export default function DogMbtiTest() {
  const [current, setCurrent] = useState(0);
  const max_question_id = 12;
  const [result, setResult] = useState([]);

  const handleClick = (data) => {
    setResult((prevResult) => {
      const updatedResult = [...prevResult, data];
      return updatedResult;
    });
    setCurrent((prevCurrent) => prevCurrent + 1);
  };

  useEffect(() => {
    if (current === max_question_id) {
      const param = GetMBTI(result);
      addData(param);
    }
  }, [current]);

  if (current === max_question_id) {
    const param = GetMBTI(result);
    return <Navigate to={`/dogBTI/result?result=${param}`} replace />;
  }

  return (
    <div>
      {current === 0 
          ? <GbtiHome onClick={() => setCurrent(1)} /> 
          : <div className='w-auto h-auto' >
              <ProgressBar value={current/max_question_id * 100} />
              <div className='h-auto my-20'></div>
              <Question current={current} onClick={(data) => handleClick(data)} />
            </div>
      }
    </div>
  );
}
  const addData = async (result) => {
    const today = new Date();
    const formattedDate = `${today.toLocaleString()}`;
    const data = {
      mbti_result: result,
      date : formattedDate
    };
    try {
      const docRef = await firestore.collection('wagwagt').add(data); // Firestore에 데이터를 저장하는 작업을 기다립니다.
      console.log(`Document written with ID: ${docRef.id}`);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };