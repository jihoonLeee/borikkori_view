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
            <img className='m-auto py-5 block' alt="main_dog" src={'./images/dog_big_logo.jpg'} />
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
      {id:1,title:"집에 낯선 인간(멍멍이)이 나타났다!? ",
            a:"누가 내 구역을 침범한거지..! 일단 경계하면서 멀리서 지켜본다(짖는다)...",
            b:"새로운 친구인가?! 바로 꼬리 프로펠러 작동하고 달려간다"},
      {id:2,title:"오늘 무슨 날인가!? 주인이 날 새로운 애견카페에 데려갔다",
            a:"새로운곳 좋아~ 새로운 친구들아, 나랑 놀자~!",
            b:"낯선곳은 힘들어... 주인... 옆에서 날 지켜줘..."},
      {id:3,title:"오늘 생일인가? ㅎㅎ 주인이 새로운 장난감을 사줬다~ ",
            a:"나의 운동장에 온걸 환영해.. 바로 최애 장난감 등극!!",
            b:"킁킁 뭐지 난 아직 익숙한게 좋아... 천천히 친해지자.."},
      {id:4,title:"갑자기 주인이 신난 노래를 부른다..",
            a:"뭐하는겨..? 조용히 지켜본다",  //n
            b:"뭔진 모르겠지만 나도 신난다~~! 꼬리를 흔들면서 같이 신나한다"}, //s 
      {id:5,title:"주인이 간식을 숨겨놓았다..!!",
            a:"뭐야 손 줄게 그냥 빨리줘~ 찾으려 하지 않고 기다린다",
            b:"어디!어디야!! 내가 다 먹을거야! 여기저기 킁컹거리며 찾아다닌다"},
      {id:6,title:"오늘은 날씨가 좋아서 새로운 곳으로 산책을 나왔다~",
            a:"너무 신난다~! 새로운 재밌는거 주인한테 다 알려줘야지! 여기저기 뛰어다니며 활발하게 움직인다",
            b:"여유롭고 좋다~ 주인이랑 같이 걸어야지! 천천히 새로운 냄새와 풍경을 즐긴다"},
      {id:7,title:"주인이 날 혼자 두고 나갔다...",
            a:"뭐야 어디간거야.. 곧 오겠지? 계속 기다린다",  //f
            b:"ㅋㅋ 내집이다 다 내꺼야~"},  //t
      {id:8,title:"주인을 누가 때리려고한다!",
            a:"장난으로 때리는 척! 하는거잖아~ 별 관심 없다.",
            b:"주인이 위험에 빠졌다! 내가 지켜줄게! 짖으며 달려든다"},
      {id:9,title:"아 졸려~ 벌써 잘 시간이네",
            a:"주인 냄새 좋아ㅎ 착 붙어서 잘래~",
            b:"졸려 내 자리에 가서 자야겠다"},
      {id:10,title:"산책을 하다가 비둘기를 만났다!",
            a:"비둘기 잡아~!! 즉각적으로 비둘기에게 달려든다",  //j
            b:"저게 뭐고! 궁금한데.. 호기심을 가지고 관찰 하다가 어떻게 할지 망설인다.."},  //p
      {id:11,title:"주인이 바쁜가 나를 안봐주네.. 심심한데..",
            a:"기다리면 나랑 놀아주겠지? 그래도 찰싹 붙어서 기다릴거야",
            b:"지금이 기회다ㅎ 조용히 사고를친다"},
      {id:12,title:"주인이 뭘 먹고있네!?",
            a:"낑.. 내가 아끼는 장난감 줄게.. 나도 주라.. 주인옆에서 적극적으로 구애한다",
            b:"난 착하니깐 기다리면 줄거야..! 참을성 있게 기다린다"},
      ]