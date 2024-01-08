import React, { useState,useEffect, useRef } from 'react';
import { Engine, Render, Runner ,Bodies,Body,World,Events,Vertices } from 'matter-js';
import { DOGS } from './Dogs';

let disableAction = false;
let interval = null;
let currentBody = null;
let currentDog = null;
let engine = null; 

export default function Game() {
    const containerRef = useRef();
    const canvasRef = useRef();
    const [score, setScore] = useState(0);
    useEffect(() => {
        initializeGame();
    }, []);

    const initializeGame = () => {
        engine = Engine.create(); 
        const render = createRender(engine);
        const {floor, leftWall, rightWall, outLineLeft,outLineRight} = createBoundaries();
        addDog(engine);
        World.add(engine.world, [floor, leftWall,rightWall,outLineLeft,outLineRight]);
        Runner.run(engine);
        Render.run(render);
        handleEventListeners(engine);
    }

    const createRender = (engine) => {
        return Render.create({
            element: containerRef.current,
            engine: engine,
            canvas: canvasRef.current,
            options: {
                width: 1200,
                height: 850,
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
    
    
    const createBoundaries = () => {
        const leftWall = createCurvedWall(200, 540, 300, 1300, 'left', 30);
        const rightWall = createCurvedWall(1000, 540, 300, 1300, 'right', 30);
        const floor = Bodies.rectangle(600, 820, 1100, 60, createFloorOptions());
        const outLineLeft = Bodies.rectangle(0,600,400,1, createOutLineOptions());
        const outLineRight = Bodies.rectangle(1200,600,400,1, createOutLineOptions());
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
        if(currentBody.position.x - currentDog.radius>30){
            Body.setPosition(currentBody,{
                x:currentBody.position.x -2,
                y:currentBody.position.y,
            });
        }
    }

    const moveRight = () => {
        if(currentBody.position.x + currentDog.radius<1150){
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
        },1000);
    }

    const handleCollisionStart = (event) => {
        event.pairs.forEach((collision) => {
            if(collision.bodyA.index === collision.bodyB.index){
                handleSameDogCollision(collision, engine);
            }
            console.log(collision.bodyA.name +" "+disableAction);
            if(!disableAction&&
                (collision.bodyA.name ==="topLine" || collision.bodyB.name==="topLine")){
                alert("게임오버");
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
            }
        );
        World.add(engine.world,newBody);

        const scoreIncrement = Math.pow(index+1, 2);
        setScore(prevScore => prevScore + scoreIncrement);
    }

    const addDog = (engine) => {
        const index = Math.floor(Math.random()*5);
        const dog = DOGS[index];

        const body = Bodies.circle(600,50,dog.radius,{
            index : index,
            isSleeping : true, // 준비상태
            render:{
                sprite:{texture:`${dog.name}.png`}
            },
            restitution:0.7  //통통 튀는 정도
        });
        currentBody=body;
        currentDog=dog;
        World.add(engine.world,body);
    }

    return (
        <div className="flex justify-center mt-5">
           <div className="w-1/4 lg:w-1/5 xl:w-1/6 flex flex-col items-center justify-center bg-gray-200 rounded-lg p-5">
                <h2 className="text-lg font-bold mb-4">점수판</h2>
                <p className="text-2xl">{score}</p>
            </div>
            <div ref={containerRef} className="w-full lg:w-3/4 xl:w-1/2 mx-5 flex-grow rounded-lg">
                <canvas ref={canvasRef} className="rounded-lg"/>
            </div>
        </div>
    )
}
