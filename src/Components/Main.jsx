import React, { useState } from 'react';

export default function Main({onClick}) {
    const [start, setStart] = useState(false);
    return (
        <div className="w-full h-screen flex flex-col justify-center items-center pb-24">
            {/* <label>우리 강아지 이름을 적어주세요~</label><input value=""/> */}
            <img className="h-auto w-96 mb-10" src={`${process.env.PUBLIC_URL}/images/main_text.png`} alt="main_button" />
            <button className='rounded-lg bg-green-200 w-56 h-28' 
            onClick={() => { 
                setStart(!start);
                onClick();
            }} ><img className="h-auto w-full" src={`${process.env.PUBLIC_URL}/images/main_button.png`} alt="main_button" /></button>
        </div>
    );
}

