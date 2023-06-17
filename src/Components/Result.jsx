import React, { useState, useEffect } from 'react';
import Loading from './Loading';
import html2canvas from 'html2canvas';
import {FaSave,FaLink} from 'react-icons/fa';
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
      if(copied){
        
      }
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
          <img className='m-auto block w-80' alt="charactor" src={process.env.PUBLIC_URL +`/images/gifs/${resultName}.gif`} />
          <img id="result" className='m-auto block pb-10' alt="result" src={process.env.PUBLIC_URL +`/images/results/${resultName}_result.png`} />
          <button onClick={onCapture}> 
            <FaSave size="24"/>
            <span className='pr-10 pl-2 font-bold'>결과 저장하기</span>
          </button>
          <button onClick={onCopyLink}>
            <FaLink size="24"/>
            <span className='pr-10 pl-2 font-bold' >링크 복사하기 </span>
          </button>
       </div>
      );
  }
 
  function getMBTI(data){
    let e = 0;
    let i = 0;
    let n = 0;
    let s = 0;
    let f = 0;
    let t = 0;
    let j = 0;
    let p = 0;
    for(var k =0;k<data.length;k++){
      switch(k){
        case 0: case 1: case 2: {
          if(data[k]==='a'){
            e++;
          }else{
            i++;
          }
          break;
        }
        case 3: case 4 : case 5 : {
          if(data[k]==='a'){
            n++;
          }else{
            s++;
          }
          break;
        }
        case 6 : case 7: case 8: {
          if(data[k]==='a'){
            f++;
          }else{
            t++;
          }
          break;
        }
        case 9: case 10: case 11: {
          if(data[k]==='a'){
            j++;
          }else{
            p++;
          }
          break;
        }
        default: break;
      }
    }
    
    var result ="";
    if(i>e){
      result+="i";
    }else{
      result+="e";
    }
    if(n>s){
      result+="n";
    }else{
      result+="s";
    }
    if(f>t){
      result+="f";
    }else{
      result+="t";
    }
    if(j>p){
      result+="j";
    }else{
      result+="p";
    }
    console.log(result);
    return result;
  }