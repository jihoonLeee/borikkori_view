import React, { useState, useEffect } from 'react';
import Loading from './Loading';
import html2canvas from 'html2canvas';
import {FaSave,FaLink} from 'react-icons/fa';
import { useLocation } from "react-router-dom";
import { firestore }  from '../Modules/Firebase.js';


export default function Result(props){
    const [visible, setVisible] = useState(true);
    const [copied, setCopied] = useState(false);
    console.log(props , "프롬");
    const location = useLocation();
    const queryParams = new URLSearchParams(location.search);
    const resultName = queryParams.get("result");
    
    const onCapture= () => {
      console.log("OnCapture");
      html2canvas(document.getElementById("result")).then(canvas=>{
        onSaveAs(canvas.toDataURL('image/png'),'result_image.png')
      })
    };
    const onSaveAs = (uri,fileName) => {
      console.log("저장");
      var link = document.createElement('a');
      document.body.appendChild(link);
      link.href=uri;
      link.download = fileName;
      link.click();
      document.body.removeChild(link);
    };
    const onCopyLink = () => {
      if(copied){
        
      }
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      alert("링크가 복사되었습니다!");
    };

    useEffect(() => {
      console.log('Result component mounted');
      addData(resultName);
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }, []);
      return (
        visible ? <Loading></Loading> :
        <div>
          <br/><br/><br/><p className='uppercase text-4xl font-sans font-bold '>우리 강아지는 {resultName}야~</p><br/><br/><br/>
          <img id="result" className='m-auto block pb-10' alt="result" src={`../images/results/${resultName}_result.png`} />
          <button onClick={onCapture}> 
            <FaSave size="24"/>
            <span className='pr-10 pl-2 font-bold'>결과 저장하기</span>
          </button>
          <button onClick={onCopyLink}>
            <FaLink size="24"/>
            <span className='pr-10 pl-2 font-bold'>링크 복사하기</span>
          </button>
       </div>
      );
  }
 
  const addData = async (result) => {
    
    const data = {
      mbti_result: result
    };
    try {
      const docRef = await firestore.collection('wagwagt').add(data);
      console.log(`Document written with ID: ${docRef.id}`);
    } catch (e) {
      console.error("Error adding document: ", e);
    }
  };