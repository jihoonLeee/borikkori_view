/**
 * 보리게임 시각 효과 — 파티클, 점수 팝업 유틸
 */

// === 파티클 시스템 ===
const particles = [];

const PARTICLE_COLORS = ['#FFB74D', '#FF9800', '#8B5E3C', '#4CAF50', '#FFFFFF', '#FF5722'];

/**
 * 합체 지점에 파티클 생성
 * @param {number} x
 * @param {number} y
 * @param {number} dogIndex — 강아지 레벨 (클수록 더 많은 파티클)
 */
export function spawnParticles(x, y, dogIndex) {
  const count = 8 + dogIndex * 2;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.6;
    const speed = 2 + Math.random() * (3 + dogIndex * 0.3);
    const maxLife = 25 + Math.random() * 20;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed - 1, // 약간 위로
      life: maxLife,
      maxLife,
      color: PARTICLE_COLORS[Math.floor(Math.random() * PARTICLE_COLORS.length)],
      size: 2 + Math.random() * (3 + dogIndex * 0.5),
    });
  }
}

/**
 * afterRender 콜백에서 호출 — 파티클 업데이트 & 그리기
 * @param {CanvasRenderingContext2D} ctx
 */
export function updateAndDrawParticles(ctx) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.12; // 중력
    p.vx *= 0.98; // 감속
    p.life--;

    if (p.life <= 0) {
      particles.splice(i, 1);
      continue;
    }

    const alpha = p.life / p.maxLife;
    const scale = 0.5 + alpha * 0.5;

    ctx.save();
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size * scale, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
}

/**
 * 파티클 전부 제거 (리셋 시)
 */
export function clearParticles() {
  particles.length = 0;
}

/**
 * 활성 파티클 존재 여부
 */
export function hasActiveParticles() {
  return particles.length > 0;
}

// === 드롭 가이드라인 ===

/**
 * 현재 강아지 위치에서 바닥까지 점선 가이드 그리기
 * @param {CanvasRenderingContext2D} ctx
 * @param {object} body — Matter.js body (현재 강아지)
 * @param {number} radius — 강아지 반지름
 * @param {number} floorY — 바닥 Y 좌표 (renderHeight)
 * @param {boolean} isDark — 다크모드 여부
 */
export function drawGuideLine(ctx, body, radius, floorY, isDark) {
  if (!body || !body.isSleeping) return;

  ctx.save();
  ctx.beginPath();
  ctx.setLineDash([6, 6]);
  ctx.strokeStyle = isDark
    ? 'rgba(255, 255, 255, 0.2)'
    : 'rgba(139, 94, 60, 0.25)';
  ctx.lineWidth = 1.5;
  ctx.moveTo(body.position.x, body.position.y + radius);
  ctx.lineTo(body.position.x, floorY);
  ctx.stroke();
  ctx.setLineDash([]);
  ctx.restore();
}
