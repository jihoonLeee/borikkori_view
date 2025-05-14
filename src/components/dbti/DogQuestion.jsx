import React from 'react';

const DogQuestion = ({ current, question, onAnswer }) => {
  if (!question) {
    return <div>질문 데이터가 준비되지 않았습니다.</div>;
  }
  return (
    <div className="question">
      <div className="q_content">
        <h2 className="text-xl font-bold text-center mb-4">{question.title}</h2>
        <img
          className='m-auto py-5 block w-32 h-32 object-contain'
          alt="main_dog"
          src={`${process.env.PUBLIC_URL}/images/borikkori_logo.png`}
        />
        <div className="flex flex-col gap-4 mt-4 w-full">
          <button 
            className="w-full px-4 py-3 text-sm md:text-base rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors duration-200 min-h-[80px] flex items-center justify-center shadow-md"
            name="a"
            onClick={() => onAnswer('a')}
          >
            {question.a}
          </button>
          <button 
            className="w-full px-4 py-3 text-sm md:text-base rounded-lg bg-primary hover:bg-primary-dark text-white font-medium transition-colors duration-200 min-h-[80px] flex items-center justify-center shadow-md"
            name="b"
            onClick={() => onAnswer('b')}
          >
            {question.b}
          </button>
        </div>
      </div>
    </div>
  );
};

export default DogQuestion;
