import React from 'react';
import { Background, LoadingText } from '../../utils/Style.js';

const Spinner = () => {
  return (
    <Background>
      <LoadingText>
        <p className="text-4xl font-bold">로딩...</p>
      </LoadingText>
      <br />
      <img src={`${process.env.PUBLIC_URL}/images/borikkori_loading_spinner.gif`} alt="로딩중" width="80px" />
    </Background>
  );
};

export default Spinner;
