import React from 'react';
import ButtonGroup from '@mui/material/ButtonGroup';

export default function Question(props){
      
      const buttons = [
      <button className='button text-gray-950 h-20 font-bold' key="one" name="a">{questions[props.current].a}</button>,
      <button className='button text-gray-950 h-20 font-bold' key="two" name="b">{questions[props.current].b}</button>,
      ];
      return(
            <div>
            {/* <button className='float-left absolute left-0 sm:pl-20 lg:pl-48' onClick={() => {}}>뒤로</button> */}
            <div className='question'>
            <div className = 'q_content'>
            <span className="font-bold">{questions[props.current].title}</span>
            <img className='m-auto py-5 block' alt="main_dog" src="/images/dog_big_logo.jpg" />
                  <ButtonGroup
                        orientation="horizontal"
                        aria-label="horizontal outlined button group"
                        onClick={ (e) => {
                              props.onClick(e.target.name);
                              console.log(e.target.name);
                        }}
                        >
                        {buttons}
                  </ButtonGroup>
            </div>
            </div>
            </div>
      );
      }
      const questions = [
      {id:1,title:"집에 낯선 인간(멍멍이)이 나타났다!? 이때 강아지의 반응은?! ",
            a:"누가 내 구역을 침범한거지..! 일단 경계하면서 멀리서 지켜본다...",
            b:"새로운 친구인가?! 바로 꼬리 프로펠러 작동하고 달려간다"},
      {id:2,title:"오늘 무슨 날인가!? 주인이 날 새로운 애견카페에 데려갔다. 이때 강아지는?",
            a:"새로운곳 좋아~ 새로운 친구들아, 나랑 놀자~!",
            b:"낯선곳은 힘들어... 주인... 옆에서 날 지켜줘..."},
      {id:3,title:"오늘 생일인가? ㅎㅎ 주인이 새로운 장난감을 사줬다~ 강아지의 반응은?",
            a:"새로운 장난감은 물고 뜯고 씹고 즐겨야 제맛! 바로 가지고 놀아야지~ ",
            b:"난 아직 익숙한게 좋아... 천천히 친해지자~"},
      {id:4,title:"네번째 질문",
            a:"멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍",
            b:"멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍"},
      {id:5,title:"다섯번째 질문",
            a:"멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍",
            b:"멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍"},
      {id:6,title:"여섯번째 질문",
            a:"멍멍멍멍멍멍멍멍멍멍멍멍",
            b:"멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍"},
      {id:7,title:"일곱번째 질문",
            a:"멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍",
            b:"멍멍멍멍멍멍멍멍멍멍멍멍"},
      {id:8,title:"여덟번째 질문",
            a:"멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍",
            b:"멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍"},
      {id:9,title:"아홉번째 질문",
            a:"멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍",
            b:"멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍"},
      {id:10,title:"열번째 질문",
            a:"멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍",
            b:"멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍"},
      {id:11,title:"열한번째 질문",
            a:"멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍",
            b:"멍멍멍멍멍멍멍멍"},
      {id:12,title:"마지막 질문",
            a:"멍멍멍멍",
            b:"멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍멍"},
      ]