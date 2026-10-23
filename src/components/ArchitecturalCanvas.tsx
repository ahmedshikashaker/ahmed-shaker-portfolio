"use client";

import React, { useEffect, useRef } from "react";
import { useReducedMotion } from "framer-motion";

interface NodePoint {
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  vx: number;
  vy: number;
  radius: number;
  isHub: boolean;
}

export default function ArchitecturalCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const prefersReducedMotion = useReducedMotion();

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = canvas.offsetWidth);
    let height = (canvas.height = canvas.offsetHeight);

    const pointer = { x: width * 0.72, y: height * 0.42, active: false };

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = canvas.offsetWidth;
      height = canvas.height = canvas.offsetHeight;
    };

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect();
      pointer.x = e.clientX - rect.left;
      pointer.y = e.clientY - rect.top;
      pointer.active = true;
    };

    window.addEventListener("resize", handleResize);
    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Create architectural topology nodes
    const count = 34;
    const nodes: NodePoint[] = [];
    for (let i = 0; i < count; i++) {
      const x = Math.random() * width;
      const y = Math.random() * height;
      nodes.push({
        x,
        y,
        baseX: x,
        baseY: y,
        vx: (Math.random() - 0.5) * 0.28,
        vy: (Math.random() - 0.5) * 0.28,
        radius: i % 6 === 0 ? 2.6 : 1.3,
        isHub: i % 6 === 0,
      });
    }

    let tick = 0;
    const render = () => {
      tick += 0.008;
      ctx.clearRect(0, 0, width, height);

      // Subtle radial bronze atmospheric wash on right side
      const grad = ctx.createRadialGradient(
        pointer.x,
        pointer.y,
        10,
        pointer.x,
        pointer.y,
        Math.max(width, height) * 0.52
      );
      grad.addColorStop(0, "rgba(200, 164, 100, 0.075)");
      grad.addColorStop(0.5, "rgba(200, 164, 100, 0.02)");
      grad.addColorStop(1, "rgba(8, 8, 7, 0)");
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, width, height);

      // Update & draw nodes and architectural connections
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        if (!prefersReducedMotion) {
          n.x += n.vx;
          n.y += n.vy;

          if (n.x < 0 || n.x > width) n.vx *= -1;
          if (n.y < 0 || n.y > height) n.vy *= -1;

          // Subtle magnetic pull toward cursor
          const dx = pointer.x - n.x;
          const dy = pointer.y - n.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 240 && dist > 1) {
            n.x += (dx / dist) * 0.18;
            n.y += (dy / dist) * 0.18;
          }
        }

        // Connect nearby nodes with fine architectural hairlines
        for (let j = i + 1; j < nodes.length; j++) {
          const m = nodes[j];
          const dx = n.x - m.x;
          const dy = n.y - m.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 175) {
            const alpha = (1 - dist / 175) * 0.15;
            ctx.strokeStyle =
              n.isHub || m.isHub
                ? `rgba(200, 164, 100, ${alpha * 1.4})`
                : `rgba(244, 240, 232, ${alpha * 0.7})`;
            ctx.lineWidth = 0.75;
            ctx.beginPath();
            ctx.moveTo(n.x, n.y);
            ctx.lineTo(m.x, m.y);
            ctx.stroke();
          }
        }

        // Draw node
        ctx.beginPath();
        ctx.arc(n.x, n.y, n.radius, 0, Math.PI * 2);
        ctx.fillStyle = n.isHub
          ? "rgba(200, 164, 100, 0.75)"
          : "rgba(244, 240, 232, 0.28)";
        ctx.fill();

        if (n.isHub) {
          ctx.beginPath();
          ctx.arc(
            n.x,
            n.y,
            6 + Math.sin(tick * 2 + i) * 2,
            0,
            Math.PI * 2
          );
          ctx.strokeStyle = "rgba(200, 164, 100, 0.2)";
          ctx.lineWidth = 0.8;
          ctx.stroke();
        }
      }

      if (!prefersReducedMotion) {
        animationFrameId = requestAnimationFrame(render);
      }
    };

    render();

    return () => {
      cancelAnimationFrame(animationFrameId);
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, [prefersReducedMotion]);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      className="pointer-events-none absolute inset-0 w-full h-full z-0"
    />
  );
}
