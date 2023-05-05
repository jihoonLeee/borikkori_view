import React, { useState } from 'react';

export default function Main({onClick}) {
    const [start, setStart] = useState(false);
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center pb-24">
            <span className="py-2">우리 강아지 MBTI 는?</span>
            <button className='rounded-lg bg-green-200 w-56 h-28' 
                onClick={() => { 
                    setStart(!start);
                    onClick();
                }} >테스트 하러 가기~</button>
        </div>
    );
}

