"use client";

import { motion } from "framer-motion";
import { PhysicsConfig } from "@/lib/navigation/PhysicsConfig";

interface LiquidHighlightProps {
  x: number;
  y: number;
  width: number;
  height: number;
  isMoving?: boolean;
  visible?: boolean;
}

export function LiquidHighlight({
  x,
  y,
  width,
  height,
  isMoving = false,
  visible = true,
}: LiquidHighlightProps) {
  const stretchX = isMoving ? 1.18 : 1;
  const stretchY = isMoving ? 0.88 : 1;

  return (
    <motion.div
      className="pointer-events-none absolute z-[0] rounded-full"
      aria-hidden="true"
      animate={{
        x,
        y,
        width: width * stretchX,
        height: height * stretchY,
        opacity: visible ? 1 : 0,
      }}
      transition={{
        type: "spring",
        ...PhysicsConfig.springs.highlight,
      }}
      style={{
        background:
          "linear-gradient(145deg, rgba(0,85,164,0.95) 0%, rgba(0,68,130,0.88) 55%, rgba(0,85,164,0.92) 100%)",
        boxShadow:
          "0 6px 24px rgba(0,85,164,0.35), inset 0 1px 0 rgba(255,255,255,0.35), inset 0 -2px 8px rgba(0,0,0,0.12)",
        transformOrigin: "center center",
      }}
    >
      {/* Liquid gloss */}
      <div
        className="absolute inset-0 rounded-full opacity-60"
        style={{
          background:
            "linear-gradient(180deg, rgba(255,255,255,0.45) 0%, transparent 45%, rgba(255,255,255,0.08) 100%)",
        }}
      />
      <motion.div
        className="absolute inset-x-[15%] top-[12%] h-[35%] rounded-full bg-white/30 blur-[2px]"
        animate={{ scaleX: isMoving ? 1.35 : 1, opacity: isMoving ? 0.7 : 0.45 }}
        transition={{ type: "spring", ...PhysicsConfig.springs.liquid }}
      />
    </motion.div>
  );
}
