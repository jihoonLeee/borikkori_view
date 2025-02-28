import React, { useState, useEffect } from 'react';
import { useDogMbtiQuery } from '../../queries/dbti/useDogMbtiQuery';
import DogResult from '../../components/dbti/DogResult';
import Loading from '../../components/common/Loading';
import html2canvas from 'html2canvas';
import { useLocation } from "react-router-dom";

const DogMbtiResultContainer = () => {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const resultName = queryParams.get("result");

  const { isLoading, error } = useDogMbtiQuery(resultName);
  const [copied, setCopied] = useState(false);

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

  if (isLoading) return <Loading />;
  if (error) return <div>에러 발생!</div>;

  return (
    <DogResult 
      resultName={resultName} 
      onCapture={onCapture} 
      onCopyLink={onCopyLink} 
      copied={copied} 
    />
  );
};

export default DogMbtiResultContainer;
