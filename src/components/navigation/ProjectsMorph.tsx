"use client";

import { motion } from "framer-motion";
import { GlassCapsule } from "./GlassCapsule";
import { PhysicsConfig } from "@/lib/navigation/PhysicsConfig";
import { lerp } from "@/lib/navigation/AnimationController";

interface ProjectsMorphProps {
  progress: number;
  headingRect: DOMRect | null;
  navItemRect: DOMRect | null;
  children: React.ReactNode;
  isActive: boolean;
  onNavigate: () => void;
  mouseX: number;
  mouseY: number;
  velocityX: number;
  velocityY: number;
}

export function ProjectsMorphPill({
  progress,
  headingRect,
  navItemRect,
  children,
  isActive,
  onNavigate,
  mouseX,
  mouseY,
  velocityX,
  velocityY,
}: ProjectsMorphProps) {
  const isDetached = progress > PhysicsConfig.projects.detachThreshold;

  let x = 0;
  let y = 0;
  let scale = 1;

  if (isDetached && headingRect && navItemRect) {
    const targetX = headingRect.left + headingRect.width / 2 - (navItemRect.left + navItemRect.width / 2);
    const targetY = headingRect.top + headingRect.height / 2 - (navItemRect.top + navItemRect.height / 2);
    const t = Math.min(1, (progress - PhysicsConfig.projects.detachThreshold) / (1 - PhysicsConfig.projects.detachThreshold));

    x = lerp(0, targetX, t);
    y = lerp(0, targetY, t);
    scale = lerp(1, PhysicsConfig.projects.expandScale, t);
  }

  return (
    <motion.div
      className="relative"
      animate={{ x, y, scale }}
      transition={{ type: "spring", ...PhysicsConfig.projects.travelSpring }}
      style={{ zIndex: isDetached ? 120 : 1 }}
    >
      <GlassCapsule
        padding={isDetached ? "10px 22px" : "0"}
        mouseX={mouseX}
        mouseY={mouseY}
        velocityX={velocityX}
        velocityY={velocityY}
        sectionGlow={isDetached ? "projects" : null}
        glowIntensity={isDetached ? 1.2 : 0.6}
        elevated={isDetached}
        className={isDetached ? "shadow-2xl" : ""}
      >
        <button
          type="button"
          onClick={onNavigate}
          className={`relative z-[2] whitespace-nowrap rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
            isActive ? "text-white" : "text-gray-800 hover:text-accent"
          }`}
          aria-current={isActive ? "page" : undefined}
        >
          {children}
        </button>
      </GlassCapsule>
    </motion.div>
  );
}
