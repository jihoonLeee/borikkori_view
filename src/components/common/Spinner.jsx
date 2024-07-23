import React from 'react';
import {Background, LoadingText} from '../../modules/Style.js';

const Spinner = () => {
    return (
      <Background>
      <LoadingText><p className='text-4xl font-bold'>로딩...</p></LoadingText>
      <br/>
      {/* <img src={Spinner} alt="로딩중" width="5%" /> */}
    </Background>
    );
  }
  
  export default Spinner;
  