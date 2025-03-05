import React, { useState, useCallback } from "react";
import { Navigate } from "react-router-dom";
import GetMBTI from "../../utils/GetMBTI";
import DogMbtiHome from "../../components/dbti/DogMbtiHome";
import DogQuestion from "../../components/dbti/DogQuestion";
import ProgressBar from "../../components/common/ProgressBar";
import { questions } from "../../store/dbti/dogMbtiStore";

const MAX_QUESTION_ID = questions ? questions.length : 0;

const DogMbtiTestContainer = () => {
  const [current, setCurrent] = useState(0);
  const [result, setResult] = useState([]);
  const [showShareModal, setShowShareModal] = useState(false);

  const handleAnswer = useCallback((answer) => {
    setResult((prev) => [...prev, answer]);
    setCurrent((prev) => prev + 1);
  }, []);

  const handleShare = useCallback(async (mbtiResult) => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: '나의 강아지 MBTI 결과',
          text: `내 강아지의 MBTI는 ${mbtiResult}입니다! 당신의 강아지 MBTI도 알아보세요!`,
          url: window.location.href
        });
      } else {
        await navigator.clipboard.writeText(
          `내 강아지의 MBTI는 ${mbtiResult}입니다! 당신의 강아지 MBTI도 알아보세요!\n${window.location.href}`
        );
        setShowShareModal(true);
        setTimeout(() => setShowShareModal(false), 2000);
      }
    } catch (error) {
      console.error('공유하기 실패:', error);
      alert('공유하기에 실패했습니다.');
    }
  }, []);

  if (current === MAX_QUESTION_ID) {
    const param = GetMBTI(result);
    return (
      <>
        <Navigate to={`/dogBTI/result?result=${param}`} replace />
        <button
          onClick={() => handleShare(param)}
          className="fixed bottom-4 right-4 btn btn-primary rounded-full shadow-lg"
        >
          결과 공유하기
        </button>
        {showShareModal && (
          <div className="fixed bottom-20 right-4 bg-text text-white px-4 py-2 rounded-lg shadow-lg animate-fade-in">
            결과가 클립보드에 복사되었습니다!
          </div>
        )}
      </>
    );
  }

  return (
    <div className="min-h-screen bg-secondary py-8 px-4">
      <div className="container mx-auto max-w-4xl">
        {current === 0 ? (
          <div className="card p-8 text-center">
            <DogMbtiHome onStart={() => setCurrent(1)} />
          </div>
        ) : (
          <div className="space-y-8">
            <div className="card p-6">
              <ProgressBar value={(current / MAX_QUESTION_ID) * 100} />
            </div>
            <div className="card p-8">
              <DogQuestion 
                current={current} 
                question={questions[current]} 
                onAnswer={handleAnswer} 
              />
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default DogMbtiTestContainer;
