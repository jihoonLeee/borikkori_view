import React, { useState, useEffect } from 'react';
import Loading from './Loading';

export default function Result(){
    const [visible, setVisible] = useState(true);
    const result = 'istj'
    useEffect(() => {
      const timer = setTimeout(() => {
        setVisible(false);
      }, 2000);
      return () => clearTimeout(timer);
    }, []);
      return (
        visible ? <Loading></Loading> :
        <div>
            <img className='m-auto block' alt="main_dog" src={`/images/results/${result}_result.png`} />
       </div>
      );
      
  }