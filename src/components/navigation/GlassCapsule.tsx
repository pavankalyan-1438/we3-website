"use client";

import { ReactNode } from "react";
import { motion, useTransform, useMotionTemplate, useSpring } from "framer-motion";
import { cn } from "@/lib/utils";
import type { NavSectionId } from "@/lib/navigation/PhysicsConfig";

interface GlassCapsuleProps {
  children: ReactNode;
  className?: string;
  padding?: string;
  mouseX?: number;
  mouseY?: number;
  velocityX?: number;
  velocityY?: number;
  sectionGlow?: NavSectionId | null;
  glowIntensity?: number;
  elevated?: boolean;
}

export function GlassCapsule({
  children,
  className,
  padding = "0.5rem",
  mouseX = 0.5,
  mouseY = 0.5,
  velocityX = 0,
  velocityY = 0,
  sectionGlow = null,
  glowIntensity = 1,
  elevated = false,
}: GlassCapsuleProps) {
  // Spring smooth the mouse inputs for the reflection
  const springConfig = { stiffness: 150, damping: 20, mass: 0.5 };
  const smoothX = useSpring(mouseX * 100, springConfig);
  const smoothY = useSpring(mouseY * 100, springConfig);
  
  const reflectionBg = useMotionTemplate`radial-gradient(120px circle at ${smoothX}% ${smoothY}%, rgba(255,255,255,0.15), transparent 40%)`;

  return (
    <motion.div
      className={cn(
        "relative flex items-center rounded-full overflow-hidden",
        "bg-white/10 backdrop-blur-xl",
        "border border-white/20",
        elevated 
          ? "shadow-[0_8px_32px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08)]"
          : "shadow-[0_4px_16px_rgba(0,0,0,0.06)]",
        "transition-all duration-300",
        className
      )}
      style={{ padding }}
      whileHover={{ scale: 1.02 }}
      transition={{ type: "spring", stiffness: 400, damping: 30 }}
    >
      {/* Dynamic Cursor Reflection */}
      <motion.div
        className="pointer-events-none absolute inset-0 rounded-full mix-blend-overlay"
        style={{ background: reflectionBg }}
      />
      
      {/* Decorative inner reflection line (Apple style) */}
      <div 
        className="pointer-events-none absolute inset-0 rounded-full border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]" 
        style={{ clipPath: "inset(0 0 80% 0)" }} 
      />
      
      {/* Inner refraction shadow */}
      <div className="pointer-events-none absolute inset-0 rounded-full shadow-[inset_0_-1px_2px_rgba(0,0,0,0.05)]" />

      {/* Section Glow (optional colored underglow) */}
      {sectionGlow && (
        <div 
          className="pointer-events-none absolute inset-0 rounded-full opacity-30 mix-blend-color-dodge transition-opacity duration-500"
          style={{
             background: `radial-gradient(circle at 50% 100%, var(--${sectionGlow}-color, rgba(255,255,255,0.5)), transparent 60%)`,
             opacity: glowIntensity * 0.4
          }}
        />
      )}

      <div className="relative z-10">{children}</div>
    </motion.div>
  );
}
