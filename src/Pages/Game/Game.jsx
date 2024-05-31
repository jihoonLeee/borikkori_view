import React, { useState,useEffect, useRef } from 'react';
import Matter,{ Engine, Render, Runner ,Bodies,Body,World,Events,Vertices} from 'matter-js';
import { DOGS } from './Dogs';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';
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
        handleResize();  
    }, [window.innerWidth]);

    const handleResize = () => {
        let outTop,wallLX,wallRX,wallY,floorX,floorY,wallWidth, wallHeight, floorWidth, floorHeight;
        if (window.innerWidth >= 1024) {
            wallLX=-93;
            wallRX=653;
            wallY=480;
            floorX=500;
            floorY=800;
            wallWidth = 300;
            wallHeight = 1000; 
            floorWidth = 1000; 
            floorHeight = 60;
            outTop= 100;
        } else {
            wallLX=-40;
            wallRX=420;
            wallY=550;
            floorX=200;
            floorY=550;
            wallWidth = 130;
            wallHeight = 1200; 
            floorWidth = 900; 
            floorHeight = 30;
            outTop=100;
            
        }
        initializeGame(outTop,wallLX,wallRX,wallY,floorX,floorY,wallWidth, wallHeight, floorWidth, floorHeight);
    }
    const initializeGame = (outTop,wallLX,wallRX,wallY,floorX,floorY,wallWidth, wallHeight, floorWidth, floorHeight) => {
        engine = Engine.create(); 
        const render = createRender(engine);
        const {floor, leftWall, rightWall, outLine} = createBoundaries(outTop,wallLX,wallRX,wallY,floorX,floorY,wallWidth, wallHeight, floorWidth, floorHeight);
        addDog(engine);
        World.add(engine.world, [floor, leftWall,rightWall,outLine]);
        Runner.run(engine);
        Render.run(render);
        handleEventListeners(engine);
    }

    const createRender = (engine) => {
        let width, height;

        if (window.innerWidth >= 1024) {
            startDog = 280;
            width = 553;
            height = 800;
            maxR = 800;
            maxL =50;
        } else {
            startDog = 190;
            width = 380;
            height = 550;
            maxR = 400;
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
    
    const createBoundaries = (outTop, wallLX, wallRX, wallY, floorX, floorY, wallWidth, wallHeight, floorWidth, floorHeight) => {
        const { Body, Bodies } = Matter;
    
        // 옵션 함수를 통해 옵션 객체 가져오기
        const wallOptions = createWallOptions();
        const floorOptions = createFloorOptions();
        const outlineOptions = createOutLineOptions();
    
        // 바닥 생성, 바닥 옵션 적용
        const floor = Bodies.rectangle(floorX, floorY, floorWidth, floorHeight, floorOptions);
    
        // 왼쪽 벽 생성, 벽 옵션 적용
        const leftWall = Bodies.rectangle(wallLX, wallY, wallWidth, wallHeight, wallOptions);
    
        // 오른쪽 벽 생성, 벽 옵션 적용
        const rightWall = Bodies.rectangle(wallRX, wallY, wallWidth, wallHeight, wallOptions);
    
        // 경계선(바깥쪽) 생성 - 게임 영역 밖으로 나가지 못하게 하는 추가적인 벽, 경계선 옵션 적용
        const outLine = Bodies.rectangle((wallRX+wallLX)/2, outTop, 600, 3, outlineOptions);
    
        return { floor, leftWall, rightWall, outLine };
    };
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
        interval = setInterval(moveFunction,8);
    }

    const moveLeft = () => {
        if(currentBody.position.x - currentDog.radius>maxL){
            Body.setPosition(currentBody,{
                x:currentBody.position.x - 3,
                y:currentBody.position.y,
            });
        }
    }

    const moveRight = () => {
        if(currentBody.position.x + currentDog.radius<maxR){
            Body.setPosition(currentBody,{
                x:currentBody.position.x + 3,
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
                density:(10-index)/10,
                friction: 0.05,
                frictionAir: 0.05,
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
                sprite:{texture:`${dog.name}.png`,}
            },
            restitution:0.3,  //통통 튀는 정도
            density:(10-index)/10,
            friction: 0.5,
            frictionAir: 0.01,
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
        <div className="game-container max-w-8xl mx-auto flex flex-col lg:flex-row items-center h-screen ">
            <div className="gameplay-container flex-grow">
                <div ref={containerRef} className="w-full lg:w-3/4 xl:w-1/2 mx-auto flex flex-col items-center justify-center rounded-lg">
                    <canvas ref={canvasRef} className="rounded-lg"/>
                    {/* 점수판과 점수를 가로로 나란히 배열합니다. */}
                    <div className="flex flex-row justify-center items-center space-x-4 mt-12 mb-3">
                        <div className="rank-panel flex flex-col items-center justify-center bg-gray-300 rounded-lg p-5">
                            <h3 className="text-lg font-bold mb-2">순위판</h3>
                            <ul>
                                {rankings.slice(0, 5).map((ranking, index) => (
                                    <li key={index}>
                                        {index + 1}등: {ranking.nickname}, {ranking.score}점
                                    </li>
                                ))}
                            </ul>
                        </div>
                        {/* 점수 표시 부분 */}
                        <div className="score-display flex flex-col items-center justify-center rounded-lg p-5">
                            <h2 className="text-lg font-bold mb-4">점수</h2>
                            <p className="text-2xl">{score}</p>
                        </div>
                    </div>
                </div>
                {/* 버튼들을 canvas 바로 아래에 위치시킵니다. */}
                <div className="flex justify-center mt-4 mb-4">
                        <Stack direction="row" spacing={3}>
                            <Button variant="contained" className="btn" onTouchStart={() => handleKeyDown({ code: 'KeyA' })} onTouchEnd={() => handleKeyUp({ code: 'KeyA' })} onMouseDown={() => handleKeyDown({ code: 'KeyA' })} onMouseUp={() => handleKeyUp({ code: 'KeyA' })}>왼쪽</Button>
                            <Button variant="contained" className="btn" onTouchStart={() => handleKeyDown({ code: 'KeyS' })} onMouseDown={() => handleKeyDown({ code: 'KeyS' })} style={{ backgroundColor: 'red' }}>내려</Button>
                            <Button variant="contained" className="btn" onTouchStart={() => handleKeyDown({ code: 'KeyD' })} onTouchEnd={() => handleKeyUp({ code: 'KeyD' })} onMouseDown={() => handleKeyDown({ code: 'KeyD' })} onMouseUp={() => handleKeyUp({ code: 'KeyD' })}>오른쪽</Button>
                        </Stack>
                    </div>
            </div>
        </div>
    )
}
