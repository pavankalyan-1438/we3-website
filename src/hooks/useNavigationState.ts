"use client";

import { useCallback, useEffect, useState } from "react";
import type { NavSectionId } from "@/lib/navigation/PhysicsConfig";

export function useActiveSection(sectionIds: NavSectionId[]) {
  const [activeSection, setActiveSection] = useState<NavSectionId>("hero");
  const [isNavigating, setIsNavigating] = useState(false);

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (isNavigating) return;
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveSection(entry.target.id as NavSectionId);
          }
        });
      },
      { rootMargin: "-45% 0px -45% 0px", threshold: 0 },
    );

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [sectionIds, isNavigating]);

  const navigateTo = useCallback((id: NavSectionId) => {
    setIsNavigating(true);
    setActiveSection(id);
    const el = document.getElementById(id);
    el?.scrollIntoView({ behavior: "smooth", block: "start" });
    window.setTimeout(() => setIsNavigating(false), 900);
  }, []);

  return { activeSection, navigateTo, isNavigating };
}

export function useProjectsMorph(projectsSectionId = "projects") {
  const [morphProgress, setMorphProgress] = useState(0);
  const [headingRect, setHeadingRect] = useState<DOMRect | null>(null);

  useEffect(() => {
    const section = document.getElementById(projectsSectionId);
    const heading = section?.querySelector("h2, .section-title");
    if (!section || !heading) return;

    const updateHeading = () => {
      setHeadingRect(heading.getBoundingClientRect());
    };

    const observer = new IntersectionObserver(
      ([entry]) => {
        const ratio = entry.intersectionRatio;
        const visible = entry.isIntersecting;
        const progress = visible
          ? Math.min(1, ratio * 2.2 + (entry.boundingClientRect.top < window.innerHeight * 0.55 ? 0.35 : 0))
          : 0;
        setMorphProgress(progress);
        updateHeading();
      },
      { threshold: [0, 0.15, 0.35, 0.55, 0.75, 1], rootMargin: "-10% 0px -20% 0px" },
    );

    observer.observe(section);
    window.addEventListener("scroll", updateHeading, { passive: true });
    window.addEventListener("resize", updateHeading);

    return () => {
      observer.disconnect();
      window.removeEventListener("scroll", updateHeading);
      window.removeEventListener("resize", updateHeading);
    };
  }, [projectsSectionId]);

  return { morphProgress, headingRect };
}

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
