import React, { useState,useEffect, useRef } from 'react';
import { Engine, Render, Runner ,Bodies,Body,World,Events,Vertices } from 'matter-js';
import { DOGS } from './Dogs';

let disableAction = false;
let interval = null;
let currentBody = null;
let currentDog = null;
let engine = null; 
let startDog = 0;
let maxR = 0;
let maxL=0;
export default function Game() {
    const containerRef = useRef();
    const canvasRef = useRef();
    const scoreRef = useRef(0);
    const [score, setScore] = useState(0);
    useEffect(() => {
        window.addEventListener('resize', handleResize);
        handleResize();  
        return () => window.removeEventListener('resize', handleResize);
    }, []);

    const handleResize = () => {
        let outL,outR,wallLX,wallRX,wallY,floorX,floorY,wallWidth, wallHeight, floorWidth, floorHeight;
        if (window.innerWidth >= 1024) {
            wallLX=150;
            wallRX=950;
            wallY=480;
            floorX=500;
            floorY=700;
            wallWidth = 300;
            wallHeight = 1200; 
            floorWidth = 1200; 
            floorHeight = 60;
            outL=400;
            outR=400;
        } else {
            wallLX=60;
            wallRX=580;
            wallY=560;
            floorX=400;
            floorY=750;
            wallWidth = 130;
            wallHeight = 900; 
            floorWidth = 900; 
            floorHeight = 30;
            outL=40;
            outR=1240;
            
        }
        initializeGame(outL,outR,wallLX,wallRX,wallY,floorX,floorY,wallWidth, wallHeight, floorWidth, floorHeight);
    }
    const initializeGame = (outL,outR,wallLX,wallRX,wallY,floorX,floorY,wallWidth, wallHeight, floorWidth, floorHeight) => {
        engine = Engine.create(); 
        const render = createRender(engine);
        const {floor, leftWall, rightWall, outLineLeft,outLineRight} = createBoundaries(outL,outR,wallLX,wallRX,wallY,floorX,floorY,wallWidth, wallHeight, floorWidth, floorHeight);
        addDog(engine);
        World.add(engine.world, [floor, leftWall,rightWall,outLineLeft,outLineRight]);
        Runner.run(engine);
        Render.run(render);
        handleEventListeners(engine);
    }

    const createRender = (engine) => {
        let width, height;

        if (window.innerWidth >= 1024) {
            startDog = 550;
            width = 1100;
            height = 700;
            maxR = 1050;
            maxL =50;
        } else {
            startDog = 300;
            width = window.innerWidth-50;
            height = window.innerHeight-250;
            maxR = 570;
            maxL = 20;
        }
        return Render.create({
            element: containerRef.current,
            engine: engine,
            canvas: canvasRef.current,
            options: {
                width: width,
                height: height,
                background: '#D9EDBF',
                wireframes: false
            }
        });
    }
    const createCurvedWall = (centerX, centerY, width, height, direction) => {
        let path = "";
    
        if (direction === 'left') {
            for (let i = 0; i <= width; i++) {
                const y = height - (height/2 * Math.sin((Math.PI * i) / width));
                path += `L ${i} ${y} `;
            }
        } else {
            for (let i = 0; i <= width; i++) {
                const y = height - (height/2 * Math.sin((Math.PI * i) / width));
                path += `L ${i} ${y} `;
            }
        }
    
        path = path.trim();
        const vertices = Vertices.fromPath(path);
        return Bodies.fromVertices(centerX, centerY, vertices, createWallOptions(), true);
    }
    
    
    const createBoundaries = (outL,outR,wallLX,wallRX,wallY,floorX,floorY,wallWidth, wallHeight, floorWidth, floorHeight) => {
        const leftWall = createCurvedWall(wallLX, wallY, wallWidth, wallHeight, 'left', 30);
        const rightWall = createCurvedWall(wallRX, wallY, wallWidth, wallHeight, 'right', 30);
        const floor = Bodies.rectangle(floorX, floorY, floorWidth, floorHeight, createFloorOptions());
        const outLineLeft = Bodies.rectangle(0,500,outL,1, createOutLineOptions());
        const outLineRight = Bodies.rectangle(1200,500,outR,1, createOutLineOptions());
        return {floor, leftWall, rightWall, outLineLeft,outLineRight};
    }

    const createWallOptions = () => {
        return {
            isStatic:true,
            render:{fillStyle:"#FFCF81"}
        }
    }

    const createFloorOptions = () => {
        return {
            isStatic: true,
            render: {
                fillStyle: '#FFCF81'
            }
        }
    }

    const createOutLineOptions = () => {
        return {
            name:"topLine",
            isStatic: true,
            isSensor: true,
            render: {
                fillStyle: 'transparent'
            }
        }
    }

    const handleEventListeners = (engine) => {
        window.onkeydown = handleKeyDown;
        window.onkeyup = handleKeyUp;
        Events.on(engine,"collisionStart",handleCollisionStart);
    }

    const handleKeyDown = (event) => {
        if(disableAction){
            return;
        }
        switch(event.code){
            case "KeyA":
                startInterval(moveLeft);
                break;
            case "KeyD":
                startInterval(moveRight);
                break;
            case "KeyS":
                dropDog(engine);
                break;
        }
    }

    const handleKeyUp = (event) => {
        switch(event.code){
            case "KeyA":
            case "KeyD":
                clearInterval(interval);
                interval = null;
        }
    }

    const startInterval = (moveFunction) => {
        if(interval) return;
        interval = setInterval(moveFunction,7);
    }

    const moveLeft = () => {
        if(currentBody.position.x - currentDog.radius>maxL){
            Body.setPosition(currentBody,{
                x:currentBody.position.x -2,
                y:currentBody.position.y,
            });
        }
    }

    const moveRight = () => {
        if(currentBody.position.x + currentDog.radius<maxR){
            Body.setPosition(currentBody,{
                x:currentBody.position.x + 2,
                y:currentBody.position.y,
            });
        }
    }

    const dropDog = (engine) => {
        currentBody.isSleeping = false;
        disableAction = true;
        setTimeout(()=>{
            addDog(engine);
            disableAction = false;
        },700);
    }

    const handleCollisionStart = (event) => {
        event.pairs.forEach((collision) => {
            let scoreIncrement = 0;
            if(collision.bodyA.index === collision.bodyB.index){
                scoreIncrement = handleSameDogCollision(collision, engine);
                scoreRef.current += scoreIncrement;
                setScore(scoreRef.current);
            }
            if(!disableAction&&
                (collision.bodyA.name ==="topLine" || collision.bodyB.name==="topLine")){
                alert("게임오버"+"\n" + scoreRef.current +"점 입니다!");
                window.location.reload();
            }
        });
    }

    const handleSameDogCollision = (collision, engine) => {
        const index = collision.bodyA.index;
        if(index === DOGS.length-1){
            return; // 마지막이라서 진행 안함
        }
        World.remove(engine.world,[collision.bodyA,collision.bodyB]);
        const newDog = DOGS[index+1];
        const newBody = Bodies.circle(
            collision.collision.supports[0].x,
            collision.collision.supports[0].y,
            newDog.radius,
            {
                render:{sprite:{texture:`${newDog.name}.png`}},
                index : index+1,
                density:(index+2)/100
            }
            
        );
        World.add(engine.world,newBody);

        
        return  Math.pow(index+1, 2);
    }

    const addDog = (engine) => {
        const index = Math.floor(Math.random()*5);
        const dog = DOGS[index];

        const body = Bodies.circle(startDog,50,dog.radius,{
            index : index,
            isSleeping : true, // 준비상태
            render:{
                sprite:{texture:`${dog.name}.png`}
            },
            restitution:0.6,  //통통 튀는 정도
            density:(index+1)/100
        });
        currentBody=body;
        currentDog=dog;
        World.add(engine.world,body);
    }
    const [rankings, setRankings] = useState([
        {nickname: '지훈', score: 100},
        {nickname: '짱', score: 80},
        {nickname: '보리', score: 70},
      ]);
      
    return (
    <div className="flex flex-col lg:flex-row justify-center lg:mt-0 lg:mb-0 mt-44 mb-44 items-center h-screen">
        <div className="flex flex-col w-full lg:w-1/4 xl:w-1/6 lg:ml-20 mt-20 justify-center bg-gray-200 rounded-lg p-5 mb-4 lg:mb-0">
            <div className="flex flex-col items-center justify-center mb-4">
            <h2 className="text-lg font-bold mb-4">점수판</h2>
            <p className="text-2xl">{score}</p>
            </div>
            
            <div className="flex flex-col items-center justify-center bg-gray-300 rounded-lg p-5">
            <h3 className="text-lg font-bold mb-2">순위판</h3>
            <ul>
                {rankings.slice(0, 5).map((ranking, index) => (
                <li key={index}>
                    {index + 1}등: {ranking.nickname}, {ranking.score}점
                </li>
                ))}
            </ul>
            </div>
        </div>
        
        <div ref={containerRef} className="w-full ml-12 lg:w-3/4 xl:w-1/2 mx-5 lg:mx-0 lg:ml-20 flex-grow rounded-lg">
            <canvas ref={canvasRef} className="rounded-lg"/>
        </div>
        <div className="flex justify-center mt-4">
            <button className="btn" 
                    onTouchStart={() => handleKeyDown({ code: 'KeyA' })} 
                    onTouchEnd={() => handleKeyUp({ code: 'KeyA' })}
                    onMouseDown={() => handleKeyDown({ code: 'KeyA' })} 
                    onMouseUp={() => handleKeyUp({ code: 'KeyA' })}>
                왼쪽
            </button>
            <button className="btn" 
                    onTouchStart={() => handleKeyDown({ code: 'KeyD' })} 
                    onTouchEnd={() => handleKeyUp({ code: 'KeyD' })}
                    onMouseDown={() => handleKeyDown({ code: 'KeyD' })} 
                    onMouseUp={() => handleKeyUp({ code: 'KeyD' })}>
                오른쪽
            </button>
            <button className="btn" 
                    onTouchStart={() => handleKeyDown({ code: 'KeyS' })}
                    onMouseDown={() => handleKeyDown({ code: 'KeyS' })}>
                Drop
            </button>
        </div>
    </div>
      
    )
}
