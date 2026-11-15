import React, { useEffect, useRef } from 'react';

export const ParticleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    const mouse = {
      x: width / 2,
      y: height / 3,
      radius: 140
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
    };

    window.addEventListener('mousemove', handleMouseMove);

    // Multi-layer particle system:
    // Layer 1: Ambient micro-dust (100 particles)
    // Layer 2: Main interactive constellation network (110 particles)
    // Layer 3: High-energy neon volt nodes (30 particles)
    const totalCount = Math.min(Math.floor((width * height) / 8000), 220);

    interface Particle {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      layer: 1 | 2 | 3;
      pulseOffset: number;
      isVolt: boolean;
    }

    const particles: Particle[] = [];

    for (let i = 0; i < totalCount; i++) {
      const isVolt = Math.random() < 0.45; // 45% are neon volt colored
      const layerType = isVolt && Math.random() < 0.35 ? 3 : (Math.random() < 0.5 ? 2 : 1);

      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (layerType === 3 ? 0.8 : layerType === 2 ? 0.5 : 0.25),
        vy: (Math.random() - 0.5) * (layerType === 3 ? 0.8 : layerType === 2 ? 0.5 : 0.25),
        radius: layerType === 3 ? Math.random() * 2.5 + 1.8 : layerType === 2 ? Math.random() * 1.8 + 1.2 : Math.random() * 1.2 + 0.6,
        baseAlpha: layerType === 3 ? 0.7 : layerType === 2 ? 0.45 : 0.2,
        layer: layerType as 1 | 2 | 3,
        pulseOffset: Math.random() * Math.PI * 2,
        isVolt
      });
    }

    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick += 0.015;

      // Draw subtle dual radar sweep rings
      ctx.save();
      const sweepRadius = (tick * 45) % (Math.max(width, height) * 0.7);
      ctx.strokeStyle = 'rgba(217, 250, 34, 0.025)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(width / 2, height / 3, sweepRadius, 0, Math.PI * 2);
      ctx.stroke();

      const sweepRadius2 = ((tick + 30) * 40) % (Math.max(width, height) * 0.7);
      ctx.strokeStyle = 'rgba(217, 250, 34, 0.015)';
      ctx.beginPath();
      ctx.arc(width / 2, height / 3, sweepRadius2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Update & render particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Interaction with mouse cursor
        const dx = mouse.x - p.x;
        const dy = mouse.y - p.y;
        const dist = Math.sqrt(dx * dx + dy * dy);
        let alpha = p.baseAlpha + Math.sin(tick * 2 + p.pulseOffset) * 0.15;
        alpha = Math.max(0.1, Math.min(1, alpha));

        if (dist < mouse.radius) {
          const force = (1 - dist / mouse.radius);
          alpha = Math.min(1, alpha + force * 0.5);
          p.x -= (dx / dist) * force * 1.5;
          p.y -= (dy / dist) * force * 1.5;
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.isVolt) {
          ctx.fillStyle = `rgba(217, 250, 34, ${alpha})`;
          // Draw subtle glow halo for high-energy volt nodes
          if (p.layer === 3) {
            ctx.shadowColor = 'rgba(217, 250, 34, 0.6)';
            ctx.shadowBlur = 8;
          } else {
            ctx.shadowBlur = 0;
          }
        } else {
          ctx.fillStyle = `rgba(245, 241, 232, ${alpha * 0.8})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();

        // Connect nearby nodes in Layer 2 and 3
        if (p.layer >= 2) {
          for (let j = i + 1; j < particles.length; j++) {
            const p2 = particles[j];
            if (p2.layer < 2) continue;

            const cdx = p.x - p2.x;
            const cdy = p.y - p2.y;
            const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
            const maxDist = 125;

            if (cdist < maxDist) {
              const lineAlpha = (1 - cdist / maxDist) * 0.16;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);

              if (p.isVolt || p2.isVolt) {
                ctx.strokeStyle = `rgba(217, 250, 34, ${lineAlpha})`;
              } else {
                ctx.strokeStyle = `rgba(136, 155, 184, ${lineAlpha * 0.7})`;
              }
              ctx.lineWidth = 0.8;
              ctx.stroke();
            }
          }
        }
      }

      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-90"
      aria-hidden="true"
    />
  );
};
