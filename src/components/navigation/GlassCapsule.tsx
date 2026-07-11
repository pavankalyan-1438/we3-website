"use client";

import { motion } from "framer-motion";
import { GlassSurface } from "./MouseReflection";
import { PhysicsConfig } from "@/lib/navigation/PhysicsConfig";

interface GlassCapsuleProps {
  children: React.ReactNode;
  className?: string;
  padding?: string;
  scaleY?: number;
  scaleX?: number;
  mouseX?: number;
  mouseY?: number;
  velocityX?: number;
  velocityY?: number;
  sectionGlow?: "hero" | "about" | "services" | "projects" | "contact" | null;
  glowIntensity?: number;
  elevated?: boolean;
  layoutId?: string;
  style?: React.CSSProperties;
  role?: string;
  "aria-label"?: string;
}

export function GlassCapsule({
  children,
  className = "",
  padding = "6px 8px",
  scaleY = 1,
  scaleX = 1,
  mouseX = 0.5,
  mouseY = 0.5,
  velocityX = 0,
  velocityY = 0,
  sectionGlow = null,
  glowIntensity = 1,
  elevated = false,
  layoutId,
  style,
  role,
  "aria-label": ariaLabel,
}: GlassCapsuleProps) {
  return (
    <motion.div
      layout={layoutId ? true : false}
      layoutId={layoutId}
      className={`will-change-transform ${className}`}
      style={{
        transformOrigin: "center center",
        scaleX,
        scaleY,
        ...style,
      }}
      transition={{
        type: "spring",
        ...PhysicsConfig.springs.liquid,
      }}
      role={role}
      aria-label={ariaLabel}
    >
      <GlassSurface
        mouseX={mouseX}
        mouseY={mouseY}
        velocityX={velocityX}
        velocityY={velocityY}
        sectionGlow={sectionGlow}
        glowIntensity={glowIntensity}
        elevated={elevated}
        style={{ padding }}
      >
        {children}
      </GlassSurface>
    </motion.div>
  );
}
