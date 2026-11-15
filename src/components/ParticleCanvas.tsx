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
      radius: 160,
      active: false
    };

    const handleMouseMove = (e: MouseEvent) => {
      mouse.x = e.clientX;
      mouse.y = e.clientY;
      mouse.active = true;
    };

    const handleMouseLeave = () => {
      mouse.active = false;
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseleave', handleMouseLeave);

    // Multi-layer particle network:
    // 1. Ambient Micro Stars & Space Dust (~120 particles)
    // 2. Interactive Cyber Constellation Nodes (~100 particles)
    // 3. High-Voltage Neon Volt Anchor Nodes (~35 particles with glowing halos)
    // 4. Moving Data Packets (energy photons traveling across connection lines)
    const totalCount = Math.min(Math.floor((width * height) / 6500), 260);

    interface Node {
      x: number;
      y: number;
      vx: number;
      vy: number;
      radius: number;
      baseAlpha: number;
      layer: 1 | 2 | 3;
      pulseOffset: number;
      isVolt: boolean;
      neighbors: number[];
    }

    interface Packet {
      fromIndex: number;
      toIndex: number;
      progress: number; // 0 to 1
      speed: number;
    }

    const nodes: Node[] = [];

    for (let i = 0; i < totalCount; i++) {
      const isVolt = Math.random() < 0.45;
      const layerType = isVolt && Math.random() < 0.35 ? 3 : (Math.random() < 0.5 ? 2 : 1);

      nodes.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * (layerType === 3 ? 0.75 : layerType === 2 ? 0.45 : 0.2),
        vy: (Math.random() - 0.5) * (layerType === 3 ? 0.75 : layerType === 2 ? 0.45 : 0.2),
        radius: layerType === 3 ? Math.random() * 2.8 + 2.0 : layerType === 2 ? Math.random() * 1.8 + 1.2 : Math.random() * 1.2 + 0.6,
        baseAlpha: layerType === 3 ? 0.75 : layerType === 2 ? 0.45 : 0.22,
        layer: layerType as 1 | 2 | 3,
        pulseOffset: Math.random() * Math.PI * 2,
        isVolt,
        neighbors: []
      });
    }

    // Data packets traveling between nodes
    const packets: Packet[] = [];
    const maxPackets = 18;

    let tick = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);
      tick += 0.015;

      // 1. Dual Cyber Radar Sweep Waves
      ctx.save();
      const sweepRadius = (tick * 40) % (Math.max(width, height) * 0.75);
      ctx.strokeStyle = 'rgba(217, 250, 34, 0.022)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.arc(width / 2, height / 3, sweepRadius, 0, Math.PI * 2);
      ctx.stroke();

      const sweepRadius2 = ((tick + 35) * 36) % (Math.max(width, height) * 0.75);
      ctx.strokeStyle = 'rgba(217, 250, 34, 0.014)';
      ctx.beginPath();
      ctx.arc(width / 2, height / 3, sweepRadius2, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();

      // Reset neighbors for this frame
      for (let i = 0; i < nodes.length; i++) {
        nodes[i].neighbors = [];
      }

      // 2. Update and Connect Nodes
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0) p.x = width;
        if (p.x > width) p.x = 0;
        if (p.y < 0) p.y = height;
        if (p.y > height) p.y = 0;

        // Interaction with mouse cursor
        if (mouse.active) {
          const dx = mouse.x - p.x;
          const dy = mouse.y - p.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < mouse.radius) {
            const force = (1 - dist / mouse.radius);
            p.x -= (dx / dist) * force * 1.8;
            p.y -= (dy / dist) * force * 1.8;
          }
        }

        // Connect nearby nodes
        if (p.layer >= 2) {
          for (let j = i + 1; j < nodes.length; j++) {
            const p2 = nodes[j];
            if (p2.layer < 2) continue;

            const cdx = p.x - p2.x;
            const cdy = p.y - p2.y;
            const cdist = Math.sqrt(cdx * cdx + cdy * cdy);
            const maxDist = 125;

            if (cdist < maxDist) {
              p.neighbors.push(j);
              const lineAlpha = (1 - cdist / maxDist) * 0.16;
              ctx.beginPath();
              ctx.moveTo(p.x, p.y);
              ctx.lineTo(p2.x, p2.y);

              if (p.isVolt || p2.isVolt) {
                ctx.strokeStyle = `rgba(217, 250, 34, ${lineAlpha})`;
              } else {
                ctx.strokeStyle = `rgba(136, 155, 184, ${lineAlpha * 0.7})`;
              }
              ctx.lineWidth = 0.85;
              ctx.stroke();
            }
          }
        }
      }

      // 3. Spawn & Animate Traveling Data Packets
      if (packets.length < maxPackets && Math.random() < 0.25) {
        // Find a node with neighbors
        const candidates = nodes
          .map((n, idx) => ({ idx, neighbors: n.neighbors }))
          .filter((item) => item.neighbors.length > 0);

        if (candidates.length > 0) {
          const chosen = candidates[Math.floor(Math.random() * candidates.length)];
          const targetIdx = chosen.neighbors[Math.floor(Math.random() * chosen.neighbors.length)];
          packets.push({
            fromIndex: chosen.idx,
            toIndex: targetIdx,
            progress: 0,
            speed: Math.random() * 0.025 + 0.015
          });
        }
      }

      // Render traveling data packets (cyber photon pulses)
      for (let k = packets.length - 1; k >= 0; k--) {
        const pkt = packets[k];
        pkt.progress += pkt.speed;

        if (pkt.progress >= 1) {
          packets.splice(k, 1);
          continue;
        }

        const nodeA = nodes[pkt.fromIndex];
        const nodeB = nodes[pkt.toIndex];
        if (!nodeA || !nodeB) {
          packets.splice(k, 1);
          continue;
        }

        const px = nodeA.x + (nodeB.x - nodeA.x) * pkt.progress;
        const py = nodeA.y + (nodeB.y - nodeA.y) * pkt.progress;

        ctx.save();
        ctx.beginPath();
        ctx.arc(px, py, 2.5, 0, Math.PI * 2);
        ctx.fillStyle = '#ffffff';
        ctx.shadowColor = '#d9fa22';
        ctx.shadowBlur = 10;
        ctx.fill();
        ctx.restore();
      }

      // 4. Draw Nodes with Breathing Pulse
      for (let i = 0; i < nodes.length; i++) {
        const p = nodes[i];
        let alpha = p.baseAlpha + Math.sin(tick * 2.5 + p.pulseOffset) * 0.18;
        alpha = Math.max(0.12, Math.min(1, alpha));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);

        if (p.isVolt) {
          ctx.fillStyle = `rgba(217, 250, 34, ${alpha})`;
          if (p.layer === 3) {
            ctx.shadowColor = 'rgba(217, 250, 34, 0.7)';
            ctx.shadowBlur = 9;
          } else {
            ctx.shadowBlur = 0;
          }
        } else {
          ctx.fillStyle = `rgba(245, 241, 232, ${alpha * 0.8})`;
          ctx.shadowBlur = 0;
        }
        ctx.fill();
      }

      ctx.shadowBlur = 0;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseleave', handleMouseLeave);
      cancelAnimationFrame(animationFrameId);
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-0 opacity-95"
      aria-hidden="true"
    />
  );
};
