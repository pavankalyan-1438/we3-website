import { ReactNode } from "react";
import { cn } from "@/lib/utils";

interface GlassCapsuleProps {
  children: React.ReactNode;

  mouseX: number;
  mouseY: number;
  velocityX: number;
  velocityY: number;

  padding?: string;
}

export function GlassCapsule({ children, className }: GlassCapsuleProps) {
  return (
    <div
      className={cn(
        "relative flex items-center rounded-full p-2",
        // Base glass background
        "bg-white/10 backdrop-blur-xl",
        // Soft border and inner highlight (Apple style)
        "border border-white/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.4)]",
        // Outer glow/shadow
        "shadow-[0_8px_32px_rgba(0,0,0,0.12),0_1px_2px_rgba(0,0,0,0.08)]",
        // Refraction simulated by inner shadow
        "shadow-[inset_0_-1px_2px_rgba(0,0,0,0.05)]",
        // Smooth transition
        "transition-all duration-300",
        className
      )}
    >
      {/* Decorative inner reflection line */}
      <div className="pointer-events-none absolute inset-0 rounded-full border border-white/10" style={{ clipPath: "inset(0 0 80% 0)" }} />
      {children}
    </div>
  );
}
