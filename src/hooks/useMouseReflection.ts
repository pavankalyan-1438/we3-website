"use client";

import { useEffect, useState } from "react";

export function useMouseReflection(enabled = true) {
  const [mouse, setMouse] = useState({ x: 0.5, y: 0.5, vx: 0, vy: 0 });

  useEffect(() => {
    if (!enabled) return;

    let lastX = 0;
    let lastY = 0;
    let frame = 0;

    const onMove = (e: MouseEvent) => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => {
        const vx = e.clientX - lastX;
        const vy = e.clientY - lastY;
        lastX = e.clientX;
        lastY = e.clientY;
        setMouse({
          x: e.clientX / window.innerWidth,
          y: e.clientY / window.innerHeight,
          vx: vx * 0.08,
          vy: vy * 0.08,
        });
      });
    };

    window.addEventListener("mousemove", onMove, { passive: true });
    return () => {
      window.removeEventListener("mousemove", onMove);
      cancelAnimationFrame(frame);
    };
  }, [enabled]);

  return mouse;
}
