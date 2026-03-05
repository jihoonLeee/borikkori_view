import { useRef, useCallback, useEffect } from 'react';
import Matter from 'matter-js';
import { DOGS } from '../Dogs';
import { COLORS, DESKTOP_BREAKPOINT, DIMENSIONS, DROP_DELAY, SCREEN_SHAKE_THRESHOLD } from '../utils/gameConstants';
import { spawnParticles, updateAndDrawParticles, drawGuideLine, clearParticles } from '../utils/gameEffects';

const { Engine, Render, Runner, Bodies, Body, World, Events, Composite } = Matter;

/**
 * Matter.js 엔진 라이프사이클 관리 훅
 */
export default function useGameEngine({
  containerRef,
  canvasRef,
  isDark,
  onMerge,       // (index, x, y) — 합체 콜백
  onGameOver,    // () — 게임오버 콜백
  consumeNextDog, // () => number — 다음 강아지 인덱스
}) {
  const engineRef = useRef(null);
  const renderRef = useRef(null);
  const runnerRef = useRef(null);
  const disableActionRef = useRef(false);
  const currentBodyRef = useRef(null);
  const currentDogRef = useRef(null);
  const dimensionsRef = useRef(null);
  const isDarkRef = useRef(isDark);
  const gameOverFiredRef = useRef(false);

  // isDark 실시간 동기화
  useEffect(() => {
    isDarkRef.current = isDark;
    if (renderRef.current) {
      const colors = isDark ? COLORS.dark : COLORS.light;
      renderRef.current.options.background = colors.background;
      // 벽/바닥 색상 업데이트
      const bodies = Composite.allBodies(engineRef.current.world);
      bodies.forEach(body => {
        if (body.isStatic && body.label !== 'topLine') {
          body.render.fillStyle = colors.wall;
        }
      });
    }
  }, [isDark]);

  /**
   * 현재 화면 크기에 맞는 치수 계산
   */
  const calculateDimensions = useCallback(() => {
    const isDesktop = window.innerWidth >= DESKTOP_BREAKPOINT;
    return isDesktop ? DIMENSIONS.desktop : DIMENSIONS.mobile;
  }, []);

  /**
   * 이미지 프리로드
   */
  const preloadImages = useCallback((callback) => {
    const srcArray = DOGS.map(dog => `${dog.name}.png`);
    let loaded = 0;
    srcArray.forEach(src => {
      const img = new Image();
      img.src = src;
      img.onload = () => {
        loaded++;
        if (loaded === srcArray.length) callback();
      };
      img.onerror = () => {
        loaded++;
        if (loaded === srcArray.length) callback();
      };
    });
  }, []);

  /**
   * 경계(벽, 바닥, 상단 센서) 생성
   */
  const createBoundaries = useCallback((dims) => {
    const colors = isDarkRef.current ? COLORS.dark : COLORS.light;
    const { width, height } = dims;

    const floor = Bodies.rectangle(width / 2, height + 30, width, 60, {
      isStatic: true,
      render: { fillStyle: colors.wall },
    });
    const leftWall = Bodies.rectangle(-30, height / 2, 60, height, {
      isStatic: true,
      render: { fillStyle: colors.wall },
    });
    const rightWall = Bodies.rectangle(width + 30, height / 2, 60, height, {
      isStatic: true,
      render: { fillStyle: colors.wall },
    });
    const topLine = Bodies.rectangle(width / 2, -10, width, 20, {
      isStatic: true,
      isSensor: true,
      label: 'topLine',
      render: { fillStyle: 'transparent' },
    });

    return [floor, leftWall, rightWall, topLine];
  }, []);

  /**
   * 강아지 바디 생성
   */
  const createDogBody = useCallback((dogIndex, x, y, sleeping = true) => {
    const dog = DOGS[dogIndex];
    return Bodies.circle(x, y, dog.radius, {
      index: dogIndex,
      isSleeping: sleeping,
      render: { sprite: { texture: `${dog.name}.png` } },
      restitution: 0.3,
      density: (10 - dogIndex) / 10,
      friction: 0.5,
      frictionAir: 0.01,
      // 게임오버 판정용: 생성 시각 기록
      spawnTime: Date.now(),
    });
  }, []);

  /**
   * 새 강아지 추가 (상단에 sleeping 상태로)
   */
  const addDog = useCallback((engine, dims) => {
    const dogIndex = consumeNextDog();
    const dog = DOGS[dogIndex];
    const body = createDogBody(dogIndex, dims.startX, dims.topSpawn, true);

    currentBodyRef.current = body;
    currentDogRef.current = dog;
    World.add(engine.world, body);
  }, [consumeNextDog, createDogBody]);

  /**
   * 강아지 드롭
   */
  const dropDog = useCallback(() => {
    if (!currentBodyRef.current || disableActionRef.current) return;
    currentBodyRef.current.isSleeping = false;
    currentBodyRef.current.spawnTime = Date.now(); // 드롭 시각 갱신
    disableActionRef.current = true;

    setTimeout(() => {
      if (engineRef.current && dimensionsRef.current) {
        addDog(engineRef.current, dimensionsRef.current);
      }
      disableActionRef.current = false;
    }, DROP_DELAY);
  }, [addDog]);

  /**
   * 좌/우 이동
   */
  const moveLeft = useCallback(() => {
    const body = currentBodyRef.current;
    const dog = currentDogRef.current;
    const dims = dimensionsRef.current;
    if (!body || !dog || !dims || !body.isSleeping) return;
    if (body.position.x - dog.radius > dims.maxL) {
      Body.setPosition(body, { x: body.position.x - 3, y: body.position.y });
    }
  }, []);

  const moveRight = useCallback(() => {
    const body = currentBodyRef.current;
    const dog = currentDogRef.current;
    const dims = dimensionsRef.current;
    if (!body || !dog || !dims || !body.isSleeping) return;
    if (body.position.x + dog.radius < dims.maxR) {
      Body.setPosition(body, { x: body.position.x + 3, y: body.position.y });
    }
  }, []);

  /**
   * 합체 처리
   */
  const mergeDogs = useCallback((collision) => {
    const { bodyA, bodyB } = collision;
    const index = bodyA.index;
    if (index === undefined || index === DOGS.length - 1) return;

    const supports = collision.collision?.supports;
    const mergeX = supports?.[0]?.x ?? (bodyA.position.x + bodyB.position.x) / 2;
    const mergeY = supports?.[0]?.y ?? (bodyA.position.y + bodyB.position.y) / 2;

    World.remove(engineRef.current.world, [bodyA, bodyB]);

    // 파티클 이펙트
    spawnParticles(mergeX, mergeY, index);

    // 새 강아지 생성
    const newDog = DOGS[index + 1];
    const newBody = Bodies.circle(mergeX, mergeY, newDog.radius, {
      render: { sprite: { texture: `${newDog.name}.png` } },
      index: index + 1,
      density: (10 - (index + 1)) / 10,
      friction: 0.05,
      frictionAir: 0.05,
      spawnTime: Date.now(),
    });
    World.add(engineRef.current.world, newBody);

    // 화면 흔들림 (큰 합체)
    if (index >= SCREEN_SHAKE_THRESHOLD && containerRef.current) {
      containerRef.current.style.animation = 'none';
      // reflow 강제
      void containerRef.current.offsetHeight;
      containerRef.current.style.animation = 'shake 0.3s ease-in-out';
    }

    // 상위 콜백
    const baseScore = Math.pow(index + 1, 2);
    onMerge(index, baseScore, mergeX, mergeY);
  }, [onMerge, containerRef]);

  /**
   * 충돌 이벤트 핸들러
   */
  const handleCollision = useCallback((event) => {
    event.pairs.forEach(pair => {
      const { bodyA, bodyB } = pair;

      // 상단 센서 충돌 → 게임오버
      if (bodyA.label === 'topLine' || bodyB.label === 'topLine') {
        const dogBody = bodyA.label === 'topLine' ? bodyB : bodyA;
        // 현재 들고 있는 강아지이거나 방금 드롭한 강아지는 무시
        if (dogBody === currentBodyRef.current) return;
        if (dogBody.isSleeping) return;
        // 드롭 직후 약간의 유예
        if (Date.now() - (dogBody.spawnTime || 0) < DROP_DELAY + 500) return;

        if (!gameOverFiredRef.current) {
          gameOverFiredRef.current = true;
          onGameOver();
        }
        return;
      }

      // 같은 강아지 합체
      if (bodyA.index !== undefined && bodyA.index === bodyB.index) {
        mergeDogs(pair);
      }
    });
  }, [mergeDogs, onGameOver]);

  /**
   * afterRender 콜백 (가이드라인 + 파티클)
   */
  const setupAfterRender = useCallback((render, dims) => {
    Events.on(render, 'afterRender', () => {
      const ctx = render.context;

      // 드롭 가이드라인
      drawGuideLine(
        ctx,
        currentBodyRef.current,
        currentDogRef.current?.radius || 0,
        dims.height,
        isDarkRef.current
      );

      // 파티클
      updateAndDrawParticles(ctx);
    });
  }, []);

  /**
   * 게임 초기화
   */
  const initializeGame = useCallback(() => {
    const dims = calculateDimensions();
    dimensionsRef.current = dims;

    cleanupEngine();
    gameOverFiredRef.current = false;
    clearParticles();

    const engine = Engine.create();
    engineRef.current = engine;

    const render = Render.create({
      element: containerRef.current,
      engine,
      canvas: canvasRef.current,
      options: {
        width: dims.width,
        height: dims.height,
        background: isDarkRef.current ? COLORS.dark.background : COLORS.light.background,
        wireframes: false,
      },
    });
    renderRef.current = render;

    const boundaries = createBoundaries(dims);
    World.add(engine.world, boundaries);

    addDog(engine, dims);

    const runner = Runner.create();
    runnerRef.current = runner;
    Runner.run(runner, engine);
    Render.run(render);

    Events.on(engine, 'collisionStart', handleCollision);
    setupAfterRender(render, dims);

    return dims;
  }, [calculateDimensions, containerRef, canvasRef, createBoundaries, addDog, handleCollision, setupAfterRender]);

  /**
   * 엔진 정리
   */
  const cleanupEngine = useCallback(() => {
    if (renderRef.current) {
      Render.stop(renderRef.current);
      renderRef.current = null;
    }
    if (runnerRef.current) {
      Runner.stop(runnerRef.current);
      runnerRef.current = null;
    }
    if (engineRef.current) {
      Events.off(engineRef.current, 'collisionStart', handleCollision);
      World.clear(engineRef.current.world, false);
      Engine.clear(engineRef.current);
      engineRef.current = null;
    }
    currentBodyRef.current = null;
    currentDogRef.current = null;
  }, [handleCollision]);

  return {
    // refs (컨트롤에서 접근 필요)
    currentBodyRef,
    currentDogRef,
    disableActionRef,
    dimensionsRef,

    // 함수
    preloadImages,
    initializeGame,
    cleanupEngine,
    dropDog,
    moveLeft,
    moveRight,
  };
}
