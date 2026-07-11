"use client";

import { useRef, useEffect, useState } from "react";
import { motion, useTransform, useMotionValue } from "framer-motion";
import { useScrollContext } from "./ScrollController";
import { useMouseReflection } from "@/hooks/useMouseReflection";
import { useActiveSection } from "@/hooks/useActiveSection";

import { GlassCapsule } from "./GlassCapsule";
import { Logo } from "./Logo";
import { NavigationItems } from "./NavigationItems";
import { ContactButton } from "./ContactButton";
import { MorphBridge } from "./MorphBridge";
import { PhysicsConfig } from "@/lib/navigation/PhysicsConfig";

export function Navbar() {
  const { splitProgress, compressAmount, velocityStretch } = useScrollContext();
  const mouse = useMouseReflection(true);
  const activeSection = useActiveSection(["hero", "about", "services", "projects", "contact"]);

  const navRef = useRef<HTMLElement>(null);
  const [rects, setRects] = useState({ logo: 0, center: 0, cta: 0 });

  // Update rough widths for the liquid bridge
  useEffect(() => {
    // Estimations based on standard paddings, we don't strictly need precise refs for a smooth gooey bridge
    setRects({ logo: 80, center: 320, cta: 110 });
  }, []);

  // Split calculations
  const splitOffset = 180; // How far they separate
  const splitOpacity = splitProgress;
  const unifiedOpacity = 1 - splitProgress;
  
  // Compression calculations
  const verticalScale = 1 - compressAmount;

  // Bridge segments calculation (simplified)
  const segments = [];
  if (splitProgress > 0 && splitProgress < 0.99) {
     const leftX = -splitOffset * splitProgress;
     const rightX = splitOffset * splitProgress;
     segments.push({
       x1: leftX, y1: 0, x2: 0, y2: 0, h1: 44, h2: 44
     });
     segments.push({
       x1: 0, y1: 0, x2: rightX, y2: 0, h1: 44, h2: 44
     });
  }

  return (
    <motion.nav 
      ref={navRef}
      className="fixed left-0 right-0 top-6 z-50 flex justify-center px-4"
      animate={{ scaleY: verticalScale }}
      transition={{ type: "spring", ...PhysicsConfig.springs.liquid }}
    >
      <div className="relative flex items-center justify-center">
        
        {/* Unified Capsule (fades out as we scroll down) */}
        <motion.div
          className="absolute flex items-center justify-center"
          style={{ 
            opacity: unifiedOpacity, 
            pointerEvents: unifiedOpacity > 0.5 ? "auto" : "none" 
          }}
        >
          <GlassCapsule
            mouseX={mouse.x}
            mouseY={mouse.y}
            velocityX={mouse.vx}
            velocityY={mouse.vy}
          >
            <div className="flex items-center gap-2 pr-2">
              <Logo />
              <div className="mx-2 h-4 w-px bg-white/20" />
              <NavigationItems />
              <div className="mx-2 h-4 w-px bg-white/20" />
              <ContactButton />
            </div>
          </GlassCapsule>
        </motion.div>

        {/* MorphBridge (Liquid stretching neck) */}
        <MorphBridge segments={segments} progress={splitProgress} opacity={1} />

        {/* Split Capsules (fade in and pull apart as we scroll down) */}
        <motion.div
          className="flex items-center"
          style={{ 
            opacity: splitOpacity,
            pointerEvents: splitOpacity > 0.5 ? "auto" : "none",
            gap: 16 + (splitProgress * 24)
          }}
        >
          <motion.div
            animate={{ x: -splitOffset * splitOpacity }}
            transition={{ type: "spring", ...PhysicsConfig.springs.liquid }}
          >
            <GlassCapsule
               mouseX={mouse.x}
               mouseY={mouse.y}
               velocityX={mouse.vx}
               velocityY={mouse.vy}
               sectionGlow={activeSection}
            >
              <Logo className="px-3" />
            </GlassCapsule>
          </motion.div>

          <GlassCapsule
             mouseX={mouse.x}
             mouseY={mouse.y}
             velocityX={mouse.vx}
             velocityY={mouse.vy}
             sectionGlow={activeSection !== "hero" && activeSection !== "contact" ? activeSection : null}
          >
             <NavigationItems />
          </GlassCapsule>

          <motion.div
            animate={{ x: splitOffset * splitOpacity }}
            transition={{ type: "spring", ...PhysicsConfig.springs.liquid }}
          >
            <GlassCapsule
               mouseX={mouse.x}
               mouseY={mouse.y}
               velocityX={mouse.vx}
               velocityY={mouse.vy}
               sectionGlow={activeSection === "contact" ? "contact" : null}
               glowIntensity={activeSection === "contact" ? 1.5 : 1}
               elevated={activeSection === "contact"}
            >
              <ContactButton className="px-5 py-2" />
            </GlassCapsule>
          </motion.div>
        </motion.div>

      </div>
    </motion.nav>
  );
}
