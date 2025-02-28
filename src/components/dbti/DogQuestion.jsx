import React from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';

const DogQuestion = ({ current, question, onAnswer }) => {
  if (!question) {
    return <div>질문 데이터가 준비되지 않았습니다.</div>;
  }
  return (
    <div className="question">
      <div className="q_content">
        <span className="font-bold">{question.title}</span>
        <img
          className='m-auto py-5 block'
          alt="main_dog"
          src={`${process.env.PUBLIC_URL}/images/borikkori_logo.png`}
        />
        <ButtonGroup
          orientation="horizontal"
          aria-label="horizontal outlined button group"
          onClick={(e) => onAnswer(e.target.name)}
        >
          <button className='button text-gray-950 h-20 font-bold' name="a">
            {question.a}
          </button>
          <button className='button text-gray-950 h-20 font-bold' name="b">
            {question.b}
          </button>
        </ButtonGroup>
      </div>
    </div>
  );
};

export default DogQuestion;
