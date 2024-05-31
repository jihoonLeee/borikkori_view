import React, { useState, useEffect } from 'react';
import Loading from '../../components/common/Loading';
import html2canvas from 'html2canvas';
import { FaSave, FaLink } from 'react-icons/fa';
import { useLocation } from "react-router-dom";
import axios from 'axios';

const DogMbtiResult = () => {
  const [visible, setVisible] = useState(true);
  const [copied, setCopied] = useState(false);
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const resultName = queryParams.get("result");

  const onCapture = () => {
    html2canvas(document.getElementById("result")).then(canvas => {
      onSaveAs(canvas.toDataURL('image/png'), 'result_image.png');
    });
  };

  const onSaveAs = (uri, fileName) => {
    const link = document.createElement('a');
    document.body.appendChild(link);
    link.href = uri;
    link.download = fileName;
    link.click();
    document.body.removeChild(link);
  };

  const onCopyLink = () => {
    navigator.clipboard.writeText(window.location.href);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    alert("링크가 복사되었습니다!");
  };

  useEffect(() => {
    axios.post('/mbti', { result: resultName.toUpperCase() }, { withCredentials: true })
      .then(response => {
        console.log(response);
      })
      .catch(error => {
        console.error('에러', error);
      });

    const timer = setTimeout(() => {
      setVisible(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, [resultName]);

  return (
    visible ? <Loading /> :
    <div>
      <br /><br /><br />
      <p className='uppercase text-4xl font-sans font-bold'>우리 강아지는 {resultName}야~</p>
      <br /><br /><br />
      <img id="result" className='m-auto block pb-10' alt="result" src={`${process.env.PUBLIC_URL}/images/results/${resultName}_result.png`} />
      <button onClick={onCapture}> 
        <FaSave size="24" />
        <span className='pr-10 pl-2 font-bold'>결과 저장하기</span>
      </button>
      <button onClick={onCopyLink}>
        <FaLink size="24" />
        <span className='pr-10 pl-2 font-bold'>링크 복사하기</span>
      </button>
    </div>
  );
};

export default DogMbtiResult;
