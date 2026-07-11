"use client";

import { motion, type HTMLMotionProps } from "framer-motion";
import { PhysicsConfig } from "@/lib/navigation/PhysicsConfig";

interface MouseReflectionProps {
  mouseX: number;
  mouseY: number;
  velocityX?: number;
  velocityY?: number;
  intensity?: number;
}

export function MouseReflection({
  mouseX,
  mouseY,
  velocityX = 0,
  velocityY = 0,
  intensity = 1,
}: MouseReflectionProps) {
  const highlightX = 20 + mouseX * 60 + velocityX * 12;
  const highlightY = 15 + mouseY * 50 + velocityY * 10;
  const streakAngle = Math.atan2(velocityY, velocityX) * (180 / Math.PI);

  return (
    <>
      <div
        className="pointer-events-none absolute inset-0 overflow-hidden rounded-[inherit]"
        aria-hidden="true"
      >
        <div
          className="absolute -inset-[40%] opacity-[0.55] transition-opacity duration-500"
          style={{
            background: `radial-gradient(circle at ${highlightX}% ${highlightY}%, rgba(255,255,255,0.75) 0%, rgba(255,255,255,0.15) 18%, transparent 52%)`,
            transform: `translate(${velocityX * 8}px, ${velocityY * 6}px)`,
            opacity: 0.35 * intensity,
          }}
        />
        <div
          className="absolute inset-0 opacity-30"
          style={{
            background: `linear-gradient(${streakAngle + 135}deg, transparent 42%, rgba(255,255,255,0.55) 50%, transparent 58%)`,
            transform: `translate(${velocityX * 14}px, ${velocityY * 10}px) scale(1.05)`,
          }}
        />
        <div
          className="absolute inset-0"
          style={{
            background:
              "linear-gradient(180deg, rgba(255,255,255,0.55) 0%, rgba(255,255,255,0.08) 28%, transparent 55%)",
          }}
        />
      </div>
    </>
  );
}

interface GlassSurfaceProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  mouseX?: number;
  mouseY?: number;
  velocityX?: number;
  velocityY?: number;
  glowIntensity?: number;
  sectionGlow?: "hero" | "about" | "services" | "projects" | "contact" | null;
  elevated?: boolean;
}

export function GlassSurface({
  children,
  className = "",
  mouseX = 0.5,
  mouseY = 0.5,
  velocityX = 0,
  velocityY = 0,
  glowIntensity = 1,
  sectionGlow = null,
  elevated = false,
  style,
  ...props
}: GlassSurfaceProps) {
  const sectionTint: Record<string, string> = {
    hero: "rgba(0,85,164,0.06)",
    about: "rgba(0,85,164,0.04)",
    services: "rgba(0,85,164,0.05)",
    projects: "rgba(0,85,164,0.08)",
    contact: "rgba(255,255,255,0.12)",
  };

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      style={{
        borderRadius: PhysicsConfig.glass.borderRadius,
        ...style,
      }}
      {...props}
    >
      {/* Depth shadow */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        aria-hidden="true"
        style={{
          boxShadow: elevated
            ? "0 20px 60px rgba(0,0,0,0.14), 0 4px 16px rgba(0,85,164,0.08), inset 0 1px 0 rgba(255,255,255,0.95), inset 0 -1px 0 rgba(255,255,255,0.25)"
            : "0 12px 40px rgba(0,0,0,0.1), 0 2px 8px rgba(0,0,0,0.04), inset 0 1px 0 rgba(255,255,255,0.92), inset 0 -1px 0 rgba(255,255,255,0.2)",
        }}
      />

      {/* Glass body */}
      <div
        className="absolute inset-0 rounded-[inherit] border border-white/70"
        style={{
          background: `linear-gradient(135deg, rgba(255,255,255,0.52) 0%, rgba(255,255,255,0.28) 48%, rgba(255,255,255,0.38) 100%)`,
          backdropFilter: `blur(${PhysicsConfig.glass.blur}px) saturate(${PhysicsConfig.glass.saturation})`,
          WebkitBackdropFilter: `blur(${PhysicsConfig.glass.blur}px) saturate(${PhysicsConfig.glass.saturation})`,
        }}
        aria-hidden="true"
      />

      {/* Section-reactive tint */}
      {sectionGlow && (
        <div
          className="pointer-events-none absolute inset-0 rounded-[inherit] transition-opacity duration-700"
          style={{
            background: `radial-gradient(ellipse 80% 120% at 50% 0%, ${sectionTint[sectionGlow]}, transparent 70%)`,
            opacity: glowIntensity,
          }}
          aria-hidden="true"
        />
      )}

      {/* Refraction noise layer */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit] opacity-[0.035] mix-blend-overlay"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
        }}
        aria-hidden="true"
      />

      <MouseReflection
        mouseX={mouseX}
        mouseY={mouseY}
        velocityX={velocityX}
        velocityY={velocityY}
        intensity={glowIntensity}
      />

      {/* Edge luminance */}
      <div
        className="pointer-events-none absolute inset-0 rounded-[inherit]"
        style={{
          boxShadow: "inset 0 0 0 1px rgba(255,255,255,0.45), inset 0 2px 20px rgba(255,255,255,0.15)",
        }}
        aria-hidden="true"
      />

      <div className="relative z-[1]">{children}</div>
    </motion.div>
  );
}
