"use client";

import { useEffect, useState } from "react";
import type { NavSectionId } from "@/lib/navigation/PhysicsConfig";

export function useActiveSection(sectionIds: NavSectionId[]) {
  const [activeSection, setActiveSection] = useState<NavSectionId>("hero");

  useEffect(() => {
    const sections = sectionIds
      .map((id) => document.getElementById(id))
      .filter(Boolean) as HTMLElement[];

    if (!sections.length) return;

    const observer = new IntersectionObserver(
      (entries) => {
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
  }, [sectionIds]);

  return activeSection;
}
