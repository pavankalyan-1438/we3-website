"use client";

import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
} from "react";
import { motion } from "framer-motion";
import { GlassCapsule } from "./GlassCapsule";
import { LiquidHighlight } from "./LiquidHighlight";
import { MorphBridge } from "./MorphBridge";
import { ProjectsMorphPill } from "./ProjectsMorph";
import { useScrollContext } from "./ScrollController";
import {
  CONTACT_CTA,
  NAV_ITEMS,
  PhysicsConfig,
  type NavSectionId,
} from "@/lib/navigation/PhysicsConfig";
import { clamp, lerp } from "@/lib/navigation/AnimationController";
import {
  useActiveSection,
  useMouseReflection,
  useProjectsMorph,
} from "@/hooks/useNavigationState";

const ALL_SECTIONS: NavSectionId[] = [
  "hero",
  "about",
  "services",
  "projects",
  "contact",
];

const CENTER_ITEMS = NAV_ITEMS.filter((item) => item.id !== "hero");

export function Navbar() {
  const {
    splitProgress,
    compressAmount,
    velocityStretch,
    prefersReducedMotion,
  } = useScrollContext();

  const { activeSection, navigateTo } = useActiveSection(ALL_SECTIONS);
  const { morphProgress, headingRect } = useProjectsMorph();
  const mouse = useMouseReflection(!prefersReducedMotion);

  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const centerRef = useRef<HTMLDivElement>(null);
  const ctaRef = useRef<HTMLDivElement>(null);
  const projectsRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<Map<NavSectionId, HTMLButtonElement>>(new Map());

  const [highlight, setHighlight] = useState({ x: 0, y: 0, w: 0, h: 0 });
  const [isHighlightMoving, setIsHighlightMoving] = useState(false);
  const [bridgeSegments, setBridgeSegments] = useState<
    { x1: number; y1: number; x2: number; y2: number; h1: number; h2: number }[]
  >([]);
  const [isMobile, setIsMobile] = useState(false);
  const [projectsItemRect, setProjectsItemRect] = useState<DOMRect | null>(null);

  const split = clamp(splitProgress, 0, 1);
  const unifiedOpacity = 1 - clamp((split - 0.35) / 0.35, 0, 1);
  const splitOpacity = clamp((split - 0.45) / 0.35, 0, 1);
  const isProjectsDetached = morphProgress > PhysicsConfig.projects.detachThreshold;

  const updateHighlight = useCallback(
    (section: NavSectionId) => {
      if (section === "contact" || isProjectsDetached) {
        setHighlight((h) => ({ ...h, w: 0 }));
        return;
      }

      const el = itemRefs.current.get(section);
      const center = centerRef.current;
      if (!el || !center) return;

      const elRect = el.getBoundingClientRect();
      const centerRect = center.getBoundingClientRect();

      setIsHighlightMoving(true);
      setHighlight({
        x: elRect.left - centerRect.left,
        y: elRect.top - centerRect.top,
        w: elRect.width,
        h: elRect.height,
      });

      window.setTimeout(() => setIsHighlightMoving(false), 420);
    },
    [isProjectsDetached],
  );

  useEffect(() => {
    updateHighlight(activeSection);
  }, [activeSection, updateHighlight, split, isProjectsDetached]);

  useLayoutEffect(() => {
    const updateLayout = () => {
      setIsMobile(window.innerWidth <= PhysicsConfig.breakpoints.tablet);

      const container = containerRef.current;
      const logo = logoRef.current;
      const center = centerRef.current;
      const cta = ctaRef.current;

      if (!container || !logo || !center || !cta) return;

      const cRect = container.getBoundingClientRect();
      const logoRect = logo.getBoundingClientRect();
      const centerRect = center.getBoundingClientRect();
      const ctaRect = cta.getBoundingClientRect();

      if (projectsRef.current) {
        setProjectsItemRect(projectsRef.current.getBoundingClientRect());
      }

      if (split > 0.05 && split < 0.98) {
        setBridgeSegments([
          {
            x1: logoRect.right - cRect.left,
            y1: logoRect.top + logoRect.height / 2 - cRect.top,
            x2: centerRect.left - cRect.left,
            y2: centerRect.top + centerRect.height / 2 - cRect.top,
            h1: logoRect.height,
            h2: centerRect.height,
          },
          {
            x1: centerRect.right - cRect.left,
            y1: centerRect.top + centerRect.height / 2 - cRect.top,
            x2: ctaRect.left - cRect.left,
            y2: ctaRect.top + ctaRect.height / 2 - cRect.top,
            h1: centerRect.height,
            h2: ctaRect.height,
          },
        ]);
      } else {
        setBridgeSegments([]);
      }
    };

    updateLayout();
    window.addEventListener("resize", updateLayout);
    window.addEventListener("scroll", updateLayout, { passive: true });

    const id = requestAnimationFrame(updateLayout);
    return () => {
      cancelAnimationFrame(id);
      window.removeEventListener("resize", updateLayout);
      window.removeEventListener("scroll", updateLayout);
    };
  }, [split, morphProgress]);

  const splitOffset = prefersReducedMotion ? split * 140 : lerp(0, 200, split);
  const innerGap = lerp(4, 32, split);
  const verticalScale = 1 - compressAmount - velocityStretch * 0.35;

  const handleKeyDown = (e: React.KeyboardEvent, id: NavSectionId) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      navigateTo(id);
    }
  };

  if (isMobile) {
    return (
      <nav
        className="fixed bottom-6 left-1/2 z-[200] -translate-x-1/2"
        aria-label="Primary navigation"
      >
        <GlassCapsule
          padding="6px 8px"
          mouseX={mouse.x}
          mouseY={mouse.y}
          velocityX={mouse.vx}
          velocityY={mouse.vy}
          sectionGlow={activeSection}
        >
          <div className="flex flex-wrap items-center justify-center gap-0.5">
            <a
              href="#hero"
              className="flex items-center px-2 py-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
              aria-label="WE3 Home"
            >
              <span className="font-display text-sm font-bold tracking-tight text-accent">
                WE3
              </span>
            </a>
            {NAV_ITEMS.map((item) => (
              <a
                key={item.id}
                href={item.href}
                className={`rounded-full px-3 py-2 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                  activeSection === item.id
                    ? "bg-accent text-white"
                    : "text-gray-700"
                }`}
                aria-current={activeSection === item.id ? "page" : undefined}
              >
                {item.label}
              </a>
            ))}
            <a
              href={CONTACT_CTA.href}
              className={`rounded-full px-3 py-2 text-xs font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
                activeSection === "contact"
                  ? "bg-accent text-white"
                  : "text-accent"
              }`}
            >
              {CONTACT_CTA.label}
            </a>
          </div>
        </GlassCapsule>
      </nav>
    );
  }

  const centerNav = (
    <CenterNav
      centerRef={centerRef}
      itemRefs={itemRefs}
      projectsRef={projectsRef}
      highlight={highlight}
      isHighlightMoving={isHighlightMoving}
      activeSection={activeSection}
      navigateTo={navigateTo}
      handleKeyDown={handleKeyDown}
      morphProgress={morphProgress}
      headingRect={headingRect}
      projectsItemRect={projectsItemRect}
      mouse={mouse}
      showProjectsInline={!isProjectsDetached}
    />
  );

  return (
    <nav
      ref={containerRef}
      className="pointer-events-none fixed left-0 right-0 top-7 z-[200] flex justify-center px-4"
      aria-label="Primary navigation"
    >
      <div className="pointer-events-auto relative">
        <MorphBridge segments={bridgeSegments} progress={split} />

        {/* Unified glass shell */}
        <motion.div
          className="absolute inset-0 flex items-center justify-center"
          style={{ opacity: unifiedOpacity, pointerEvents: unifiedOpacity > 0.1 ? "auto" : "none" }}
          animate={{ scaleY: verticalScale, scaleX: 1 + velocityStretch * 0.2 }}
          transition={{ type: "spring", ...PhysicsConfig.springs.liquid }}
        >
          <GlassCapsule
            padding="6px 10px"
            mouseX={mouse.x}
            mouseY={mouse.y}
            velocityX={mouse.vx}
            velocityY={mouse.vy}
            sectionGlow={activeSection}
            glowIntensity={activeSection === "hero" ? 1.15 : 0.85}
            className="inline-flex"
          >
            <div
              className="flex items-center"
              style={{ gap: innerGap }}
            >
              <div ref={logoRef}>
                <NavLogo onNavigate={() => navigateTo("hero")} />
              </div>
              {centerNav}
              <div ref={ctaRef}>
                <ContactCTA
                  isActive={activeSection === "contact"}
                  onNavigate={() => navigateTo("contact")}
                  enhanced={activeSection === "contact"}
                />
              </div>
            </div>
          </GlassCapsule>
        </motion.div>

        {/* Split glass capsules — crossfade in as unified fades */}
        <motion.div
          className="flex items-center"
          style={{
            opacity: splitOpacity,
            pointerEvents: splitOpacity > 0.1 ? "auto" : "none",
            gap: lerp(8, 36, split),
          }}
          animate={{ scaleY: verticalScale }}
          transition={{ type: "spring", ...PhysicsConfig.springs.liquid }}
        >
          <motion.div
            ref={logoRef}
            animate={{ x: -splitOffset * splitOpacity }}
            transition={{ type: "spring", ...PhysicsConfig.springs.liquid }}
          >
            <GlassCapsule
              padding="6px 14px"
              mouseX={mouse.x}
              mouseY={mouse.y}
              velocityX={mouse.vx}
              velocityY={mouse.vy}
              sectionGlow={activeSection}
            >
              <NavLogo onNavigate={() => navigateTo("hero")} />
            </GlassCapsule>
          </motion.div>

          <GlassCapsule
            padding="6px 8px"
            mouseX={mouse.x}
            mouseY={mouse.y}
            velocityX={mouse.vx}
            velocityY={mouse.vy}
            sectionGlow={
              activeSection === "about"
                ? "about"
                : activeSection === "services"
                  ? "services"
                  : null
            }
            glowIntensity={activeSection === "services" ? 1.1 : 0.9}
          >
            {centerNav}
          </GlassCapsule>

          <motion.div
            ref={ctaRef}
            animate={{ x: splitOffset * splitOpacity }}
            transition={{ type: "spring", ...PhysicsConfig.springs.liquid }}
          >
            <GlassCapsule
              padding="6px 10px"
              mouseX={mouse.x}
              mouseY={mouse.y}
              velocityX={mouse.vx}
              velocityY={mouse.vy}
              sectionGlow={activeSection === "contact" ? "contact" : null}
              glowIntensity={activeSection === "contact" ? 1.35 : 0.8}
              elevated={activeSection === "contact"}
            >
              <ContactCTA
                isActive={activeSection === "contact"}
                onNavigate={() => navigateTo("contact")}
                enhanced={activeSection === "contact"}
              />
            </GlassCapsule>
          </motion.div>
        </motion.div>

        {isProjectsDetached && projectsItemRect && (
          <div
            className="pointer-events-auto fixed"
            style={{
              left: projectsItemRect.left,
              top: projectsItemRect.top,
              width: projectsItemRect.width,
              height: projectsItemRect.height,
            }}
          >
            <ProjectsMorphPill
              progress={morphProgress}
              headingRect={headingRect}
              navItemRect={projectsItemRect}
              isActive={activeSection === "projects"}
              onNavigate={() => navigateTo("projects")}
              mouseX={mouse.x}
              mouseY={mouse.y}
              velocityX={mouse.vx}
              velocityY={mouse.vy}
            >
              Projects
            </ProjectsMorphPill>
          </div>
        )}
      </div>
    </nav>
  );
}

function NavLogo({ onNavigate }: { onNavigate: () => void }) {
  return (
    <button
      type="button"
      onClick={onNavigate}
      className="flex items-center rounded-full px-2 py-1.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent"
      aria-label="WE3 Home"
    >
      <span className="font-display text-lg font-bold tracking-tight text-accent">
        WE3
      </span>
    </button>
  );
}

function ContactCTA({
  isActive,
  onNavigate,
  enhanced = false,
}: {
  isActive: boolean;
  onNavigate: () => void;
  enhanced?: boolean;
}) {
  return (
    <button
      type="button"
      onClick={onNavigate}
      className={`rounded-full px-5 py-2.5 text-sm font-semibold transition-all focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
        isActive || enhanced
          ? "bg-accent text-white shadow-[0_8px_28px_rgba(0,85,164,0.35)]"
          : "text-accent hover:bg-accent/8"
      }`}
      aria-current={isActive ? "page" : undefined}
    >
      {CONTACT_CTA.label}
    </button>
  );
}

interface CenterNavProps {
  centerRef: React.RefObject<HTMLDivElement | null>;
  itemRefs: React.MutableRefObject<Map<NavSectionId, HTMLButtonElement>>;
  projectsRef: React.RefObject<HTMLDivElement | null>;
  highlight: { x: number; y: number; w: number; h: number };
  isHighlightMoving: boolean;
  activeSection: NavSectionId;
  navigateTo: (id: NavSectionId) => void;
  handleKeyDown: (e: React.KeyboardEvent, id: NavSectionId) => void;
  morphProgress: number;
  headingRect: DOMRect | null;
  projectsItemRect: DOMRect | null;
  mouse: { x: number; y: number; vx: number; vy: number };
  showProjectsInline: boolean;
}

function CenterNav({
  centerRef,
  itemRefs,
  projectsRef,
  highlight,
  isHighlightMoving,
  activeSection,
  navigateTo,
  handleKeyDown,
  morphProgress,
  headingRect,
  projectsItemRect,
  mouse,
  showProjectsInline,
}: CenterNavProps) {
  return (
    <div ref={centerRef} className="relative flex items-center gap-0.5">
      <LiquidHighlight
        x={highlight.x}
        y={highlight.y}
        width={highlight.w}
        height={highlight.h}
        isMoving={isHighlightMoving}
        visible={highlight.w > 0 && activeSection !== "contact"}
      />

      {CENTER_ITEMS.map((item) => {
        if (item.id === "projects") {
          if (!showProjectsInline) {
            return (
              <div
                key={item.id}
                ref={projectsRef}
                className="invisible w-[88px] shrink-0 px-5 py-2.5 text-sm"
                aria-hidden="true"
              >
                Projects
              </div>
            );
          }

          return (
            <div key={item.id} ref={projectsRef}>
              <ProjectsMorphPill
                progress={morphProgress}
                headingRect={headingRect}
                navItemRect={projectsItemRect}
                isActive={activeSection === "projects"}
                onNavigate={() => navigateTo("projects")}
                mouseX={mouse.x}
                mouseY={mouse.y}
                velocityX={mouse.vx}
                velocityY={mouse.vy}
              >
                {item.label}
              </ProjectsMorphPill>
            </div>
          );
        }

        const isActive = activeSection === item.id;

        return (
          <button
            key={item.id}
            ref={(el) => {
              if (el) itemRefs.current.set(item.id, el);
            }}
            type="button"
            onClick={() => navigateTo(item.id)}
            onKeyDown={(e) => handleKeyDown(e, item.id)}
            className={`relative z-[2] rounded-full px-5 py-2.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-accent ${
              isActive ? "text-white" : "text-gray-800 hover:text-accent"
            } ${item.id === "services" ? "nav-ripple" : ""} ${item.id === "about" && isActive ? "nav-bulge" : ""}`}
            aria-current={isActive ? "page" : undefined}
          >
            {item.label}
          </button>
        );
      })}
    </div>
  );
}
