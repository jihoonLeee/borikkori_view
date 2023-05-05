import React, { useState, useEffect } from 'react';
import Loading from './Loading';
import html2canvas from 'html2canvas';

export default function Result(props){
    const [visible, setVisible] = useState(true);
    const [copied, setCopied] = useState(false);
    const resultName = getMBTI(props.result_data);

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
      
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
      alert("링크가 복사되었습니다!");
    };

    useEffect(() => {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }, []);
      return (
        visible ? <Loading></Loading> :
        <div>
            <img id="result" className='m-auto block pb-10' alt="main_dog" src={`/images/results/${resultName}_result.png`} />
            <button onClick={onCapture}> <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M11.5 8h1v7.826l2.5-3.076.753.665-3.753 4.585-3.737-4.559.737-.677 2.5 3.064v-7.828zm7 12h-13c-2.481 0-4.5-2.019-4.5-4.5 0-2.178 1.555-4.038 3.698-4.424l.779-.14.043-.79c.185-3.447 3.031-6.146 6.48-6.146 3.449 0 6.295 2.699 6.479 6.146l.043.79.78.14c2.142.386 3.698 2.246 3.698 4.424 0 2.481-2.019 4.5-4.5 4.5m.979-9.908c-.212-3.951-3.473-7.092-7.479-7.092s-7.267 3.141-7.479 7.092c-2.57.463-4.521 2.706-4.521 5.408 0 3.037 2.463 5.5 5.5 5.5h13c3.037 0 5.5-2.463 5.5-5.5 0-2.702-1.951-4.945-4.521-5.408"/></svg> </button>
              <span className='pr-10 pl-2 font-bold'>결과 저장하기</span>
            <button onClick={onCopyLink}>
              <svg width="24" height="24" xmlns="http://www.w3.org/2000/svg" fill-rule="evenodd" clip-rule="evenodd"><path d="M14.851 11.923c-.179-.641-.521-1.246-1.025-1.749-1.562-1.562-4.095-1.563-5.657 0l-4.998 4.998c-1.562 1.563-1.563 4.095 0 5.657 1.562 1.563 4.096 1.561 5.656 0l3.842-3.841.333.009c.404 0 .802-.04 1.189-.117l-4.657 4.656c-.975.976-2.255 1.464-3.535 1.464-1.28 0-2.56-.488-3.535-1.464-1.952-1.951-1.952-5.12 0-7.071l4.998-4.998c.975-.976 2.256-1.464 3.536-1.464 1.279 0 2.56.488 3.535 1.464.493.493.861 1.063 1.105 1.672l-.787.784zm-5.703.147c.178.643.521 1.25 1.026 1.756 1.562 1.563 4.096 1.561 5.656 0l4.999-4.998c1.563-1.562 1.563-4.095 0-5.657-1.562-1.562-4.095-1.563-5.657 0l-3.841 3.841-.333-.009c-.404 0-.802.04-1.189.117l4.656-4.656c.975-.976 2.256-1.464 3.536-1.464 1.279 0 2.56.488 3.535 1.464 1.951 1.951 1.951 5.119 0 7.071l-4.999 4.998c-.975.976-2.255 1.464-3.535 1.464-1.28 0-2.56-.488-3.535-1.464-.494-.495-.863-1.067-1.107-1.678l.788-.785z"/></svg> 
            </button>
            <span className='pr-10 pl-2 font-bold' >링크 복사하기 </span>
          
       </div>
      );
  }
 
  function getMBTI(data){
    console.log(data," 거의 다 왔다!");

    return "test";
  }