import React, { useState } from 'react';

export default function Main({onClick}) {
    const [start, setStart] = useState(false);
    return (
        <div className="w-full h-screen flex justify-center items-center pb-24">
            <button className='rounded-lg bg-green-200 w-64 h-32' 
                onClick={() => { 
                    setStart(!start);
                    onClick();
                }} >우리 강아지 MBTI 는?</button>
        </div>
    );
}

