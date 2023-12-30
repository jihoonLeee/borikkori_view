import React from 'react';
import {Background, LoadingText} from '../../Modules/Style.js';
import Spinner from '../../assets/loading.gif';

export default function Loading() {
  return (
    <Background>
      <LoadingText><p className='text-4xl font-bold'>너네 강아지 MBTI 뭐야?</p></LoadingText>
      <br/>
      <img src={Spinner} alt="로딩중" width="5%" />
    </Background>
  );
};