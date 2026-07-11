"use client";

import { neckWidth } from "@/lib/navigation/AnimationController";

export interface BridgeSegment {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  h1: number;
  h2: number;
}

interface MorphBridgeProps {
  segments: BridgeSegment[];
  progress: number;
  opacity?: number;
}

/** SVG liquid bridges between separating/merging capsules */
export function MorphBridge({ segments, progress, opacity = 1 }: MorphBridgeProps) {
  if (progress >= 0.995 || segments.length === 0) return null;

  const bridgeOpacity = opacity * (1 - progress * 0.85);

  return (
    <svg
      className="pointer-events-none absolute inset-0 z-[0] overflow-visible"
      aria-hidden="true"
      style={{ opacity: bridgeOpacity }}
    >
      <defs>
        <filter id="liquid-goo" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur in="SourceGraphic" stdDeviation="6" result="blur" />
          <feColorMatrix
            in="blur"
            mode="matrix"
            values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 22 -10"
            result="goo"
          />
          <feComposite in="SourceGraphic" in2="goo" operator="atop" />
        </filter>
        <linearGradient id="bridge-fill" x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="rgba(255,255,255,0.55)" />
          <stop offset="50%" stopColor="rgba(255,255,255,0.38)" />
          <stop offset="100%" stopColor="rgba(255,255,255,0.55)" />
        </linearGradient>
      </defs>

      <g filter="url(#liquid-goo)">
        {segments.map((seg, i) => {
          const midX = (seg.x1 + seg.x2) / 2;
          const midY = (seg.y1 + seg.y2) / 2;
          const dx = seg.x2 - seg.x1;
          const dy = seg.y2 - seg.y1;
          const dist = Math.sqrt(dx * dx + dy * dy) || 1;

          const neck = neckWidth(progress, Math.min(seg.h1, seg.h2) * 0.42);
          const pinch = Math.max(4, neck * (1 - progress * 0.75));

          const nx = (-dy / dist) * pinch;
          const ny = (dx / dist) * pinch;

          const path = `
            M ${seg.x1 - nx} ${seg.y1 - ny}
            C ${seg.x1 + dx * 0.25 - nx * 0.4} ${seg.y1 + dy * 0.25 - ny * 0.4},
              ${midX - nx * 0.15} ${midY - ny * 0.15},
              ${midX} ${midY}
            C ${midX + nx * 0.15} ${midY + ny * 0.15},
              ${seg.x2 - dx * 0.25 + nx * 0.4} ${seg.y2 - dy * 0.25 + ny * 0.4},
              ${seg.x2 + nx} ${seg.y2 + ny}
            L ${seg.x2 - nx} ${seg.y2 + ny}
            C ${seg.x2 - dx * 0.25 + nx * 0.4} ${seg.y2 - dy * 0.25 + ny * 0.4},
              ${midX + nx * 0.15} ${midY + ny * 0.15},
              ${midX} ${midY}
            C ${midX - nx * 0.15} ${midY - ny * 0.15},
              ${seg.x1 + dx * 0.25 - nx * 0.4} ${seg.y1 + dy * 0.25 - ny * 0.4},
              ${seg.x1 + nx} ${seg.y1 + ny}
            Z
          `;

          return (
            <path
              key={i}
              d={path}
              fill="url(#bridge-fill)"
              stroke="rgba(255,255,255,0.65)"
              strokeWidth="0.75"
            />
          );
        })}
      </g>
    </svg>
  );
}
