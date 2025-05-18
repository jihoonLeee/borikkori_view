import React, { useState, useEffect, useRef } from 'react';
import Matter, { Engine, Render, Runner, Bodies, Body, World, Events } from 'matter-js';
import { DOGS } from './Dogs';
import Button from '@mui/material/Button';
import Stack from '@mui/material/Stack';

const DROP_DELAY = 700;

export default function Game() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);

  // Matter.js 관련 상태는 useRef로 관리
  const engineRef = useRef(null);
  const disableActionRef = useRef(false);
  const intervalRef = useRef(null);
  const currentBodyRef = useRef(null);
  const currentDogRef = useRef(null);

  // 초기 치수는 한 번만 계산합니다.
  const [dimensions, setDimensions] = useState(null);

  // 점수 관리
  const scoreRef = useRef(0);
  const [score, setScore] = useState(0);

  // 순위 예시
  const [rankings] = useState([
    { name: '지훈', score: 100 },
    { name: '짱', score: 80 },
    { name: '보리', score: 70 },
  ]);

  // 컴포넌트 마운트 시 한 번 초기화
  useEffect(() => {
    // 처음 계산한 치수를 사용
    const dims = calculateDimensions();
    setDimensions(dims);
    const imagePaths = DOGS.map(dog => `${dog.name}.png`);
    preloadImages(imagePaths, () => {
      initializeGame(dims);
    });
    document.addEventListener('keydown', handleKeyDown);
    document.addEventListener('keyup', handleKeyUp);
    return () => {
        document.removeEventListener('keydown', handleKeyDown);
        document.removeEventListener('keyup', handleKeyUp);
      cleanupEngine();
    };
  }, []);

  // 이미지 프리로드 함수
  const preloadImages = (srcArray, callback) => {
    let loaded = 0;
    srcArray.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        if (loaded === srcArray.length) callback();
      };
      img.onerror = err => console.error(`Error loading ${src}`, err);
    });
  };

  // 창 크기에 따른 초기 치수 계산 (리사이즈 이벤트 제거)
  const calculateDimensions = () => {
    const isDesktop = window.innerWidth >= 1024;
    const renderWidth = isDesktop ? 600 : 380;
    const renderHeight = isDesktop ? 800 : 550;
    const startDog = isDesktop ? 280 : 190;
    const maxR = isDesktop ? 800 : 400;
    const maxL = isDesktop ? 50 : 20;
    return { renderWidth, renderHeight, startDog, maxR, maxL };
  };

  // 기존 엔진 정리
  const cleanupEngine = () => {
    if (engineRef.current) {
      World.clear(engineRef.current.world, false);
      Engine.clear(engineRef.current);
      engineRef.current = null;
    }
  };

  // dims를 인자로 받아 게임 초기화 (한 번만 호출)
  const initializeGame = (dims) => {
    if (!dims || !dims.renderWidth) return;
    cleanupEngine();
    const engine = Engine.create();
    engineRef.current = engine;

    const render = Render.create({
      element: containerRef.current,
      engine: engine,
      canvas: canvasRef.current,
      options: {
        width: dims.renderWidth,
        height: dims.renderHeight,
        background: '#FAF8F5', // Secondary 색상
        wireframes: false,
      },
    });

    // 경계 생성 및 추가
    const boundaries = createBoundaries(dims);
    World.add(engine.world, boundaries);

    // 첫 강아지 추가
    addDog(engine, dims);

    Runner.run(engine);
    Render.run(render);

    // 충돌 이벤트 등록
    Events.on(engine, 'collisionStart', handleCollision);
  };

  // dims를 받아 경계 바디 생성
  const createBoundaries = (dims) => {
    const { renderWidth, renderHeight } = dims;
    const floor = Bodies.rectangle(renderWidth / 2, renderHeight + 30, renderWidth, 60, { 
      isStatic: true, render: { fillStyle: '#8B5E3C' } 
    });
    const leftWall = Bodies.rectangle(-30, renderHeight / 2, 60, renderHeight, { 
      isStatic: true, render: { fillStyle: '#8B5E3C' } 
    });
    const rightWall = Bodies.rectangle(renderWidth + 30, renderHeight / 2, 60, renderHeight, { 
      isStatic: true, render: { fillStyle: '#8B5E3C' } 
    });
    const topLine = Bodies.rectangle(renderWidth / 2, -10, renderWidth, 20, { 
      isStatic: true, isSensor: true, label: 'topLine', render: { fillStyle: 'transparent' } 
    });
    return [floor, leftWall, rightWall, topLine];
  };

  // 키 이벤트 핸들러
  const handleKeyDown = (event) => {
    if (disableActionRef.current) return;
    switch (event.code) {
      case 'KeyA':
        startInterval(moveLeft);
        break;
      case 'KeyD':
        startInterval(moveRight);
        break;
      case 'KeyS':
        dropDog();
        break;
      default:
        break;
    }
  };

  const handleKeyUp = (event) => {
    if (event.code === 'KeyA' || event.code === 'KeyD') {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  };

  const startInterval = (moveFunction) => {
    if (intervalRef.current) return;
    intervalRef.current = setInterval(moveFunction, 8);
  };

  const moveLeft = () => {
    const body = currentBodyRef.current;
    const dog = currentDogRef.current;
    if (!body || !dog || !dimensions) return;
    if (body.position.x - dog.radius > dimensions.maxL) {
      Body.setPosition(body, { x: body.position.x - 3, y: body.position.y });
    }
  };

  const moveRight = () => {
    const body = currentBodyRef.current;
    const dog = currentDogRef.current;
    if (!body || !dog || !dimensions) return;
    if (body.position.x + dog.radius < dimensions.maxR) {
      Body.setPosition(body, { x: body.position.x + 3, y: body.position.y });
    }
  };

  const dropDog = () => {
    if (!currentBodyRef.current) return;
    currentBodyRef.current.isSleeping = false;
    disableActionRef.current = true;
    setTimeout(() => {
      if (engineRef.current && dimensions) {
        addDog(engineRef.current, dimensions);
      }
      disableActionRef.current = false;
    }, DROP_DELAY);
  };

  // 충돌 이벤트 처리: 상단 센서와 강아지 합체
  const handleCollision = (event) => {
    event.pairs.forEach(pair => {
      const { bodyA, bodyB, collision } = pair;
      if (bodyA.label === 'topLine' || bodyB.label === 'topLine') {
        alert(`게임오버\n${scoreRef.current}점 입니다!`);
        window.location.reload();
      }
      if (bodyA.index !== undefined && bodyA.index === bodyB.index) {
        const inc = mergeDogs(pair);
        scoreRef.current += inc;
        setScore(scoreRef.current);
      }
    });
  };

  // 같은 강아지끼리 충돌 시 합성
  const mergeDogs = (collision) => {
    const { bodyA, bodyB, collision: { supports } } = collision;
    const index = bodyA.index;
    if (index === DOGS.length - 1) return 0;
    World.remove(engineRef.current.world, [bodyA, bodyB]);
    addMergeEffect(supports[0].x, supports[0].y);
    const newDog = DOGS[index + 1];
    const newBody = Bodies.circle(supports[0].x, supports[0].y, newDog.radius, {
      render: { sprite: { texture: `${newDog.name}.png` } },
      index: index + 1,
      density: (10 - index) / 10,
      friction: 0.05,
      frictionAir: 0.05,
    });
    World.add(engineRef.current.world, newBody);
    return Math.pow(index + 1, 2);
  };

  // 새로운 강아지 추가
  const addDog = (engine, dims) => {
    const randomIndex = Math.floor(Math.random() * 5);
    const dog = DOGS[randomIndex];
    const body = Bodies.circle(dims.startDog, 50, dog.radius, {
      index: randomIndex,
      isSleeping: true,
      render: { sprite: { texture: `${dog.name}.png` } },
      restitution: 0.3,
      density: (10 - randomIndex) / 10,
      friction: 0.5,
      frictionAir: 0.01,
    });
    currentBodyRef.current = body;
    currentDogRef.current = dog;
    World.add(engine.world, body);
  };

  // 폭발 이펙트 추가 후 제거
  const addMergeEffect = (x, y) => {
    const explosion = Bodies.circle(x, y, 50, {
      render: {
        fillStyle: 'orange',
        sprite: {
          texture: 'images/explosion.png',
          xScale: 1.5,
          yScale: 1.5,
        },
      },
      isSensor: true,
    });
    World.add(engineRef.current.world, explosion);
    setTimeout(() => {
      World.remove(engineRef.current.world, explosion);
    }, 500);
  };

  return (
    <div className="game-container w-full h-screen bg-secondary flex flex-col">
      {/* 헤더 */}
      <header className="w-full bg-primary text-white p-4 flex justify-between items-center">
        <h1 className="text-xl font-bold">도그 매치 게임</h1>
        <div className="flex items-center space-x-4">
          <div className="score text-lg">점수: {score}</div>
          <div className="rank text-sm">
            {rankings.map((r, i) => (
              <span key={i}>{i + 1}. {r.name} ({r.score}점) </span>
            ))}
          </div>
        </div>
      </header>
      
      {/* 게임 플레이 영역 */}
      <div className="flex-grow flex flex-col items-center justify-center p-4">
        <div ref={containerRef} className="gameplay-container w-full max-w-lg relative">
          <canvas ref={canvasRef} className="w-full rounded-lg shadow-lg" />
        </div>
      </div>

      {/* 컨트롤 버튼 */}
      <div className="controls p-4 flex justify-center">
        <Stack direction="row" spacing={2}>
          <Button variant="contained" size="large"
            onTouchStart={() => handleKeyDown({ code: 'KeyA' })}
            onTouchEnd={() => handleKeyUp({ code: 'KeyA' })}
            onMouseDown={() => handleKeyDown({ code: 'KeyA' })}
            onMouseUp={() => handleKeyUp({ code: 'KeyA' })}
            style={{ backgroundColor: '#8B5E3C' }}
          >
            왼쪽
          </Button>
          <Button variant="contained" size="large"
            onTouchStart={() => handleKeyDown({ code: 'KeyS' })}
            onMouseDown={() => handleKeyDown({ code: 'KeyS' })}
            style={{ backgroundColor: '#4caf50' }}
          >
            내려
          </Button>
          <Button variant="contained" size="large"
            onTouchStart={() => handleKeyDown({ code: 'KeyD' })}
            onTouchEnd={() => handleKeyUp({ code: 'KeyD' })}
            onMouseDown={() => handleKeyDown({ code: 'KeyD' })}
            onMouseUp={() => handleKeyUp({ code: 'KeyD' })}
            style={{ backgroundColor: '#8B5E3C' }}
          >
            오른쪽
          </Button>
        </Stack>
      </div>
    </div>
  );
}
