"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { useActiveSection } from "@/hooks/useActiveSection";
import type { NavSectionId } from "@/lib/navigation/PhysicsConfig";

const items: { label: string; href: string; id: NavSectionId }[] = [
  { label: "Home", href: "#hero", id: "hero" },
  { label: "About", href: "#about", id: "about" },
  { label: "Services", href: "#services", id: "services" },
  { label: "Projects", href: "#projects", id: "projects" },
];

export function NavigationItems() {
  const activeSection = useActiveSection(["hero", "about", "services", "projects", "contact"]);

  return (
    <div className="flex items-center gap-1 px-4">
      {items.map((item) => {
        const isActive = activeSection === item.id;
        
        return (
          <Link
            key={item.id}
            href={item.href}
            className={cn(
              "relative rounded-full px-4 py-2 text-sm font-medium z-10",
              "transition-colors duration-300",
              isActive 
                ? "text-neutral-900 dark:text-white" 
                : "text-neutral-600 dark:text-neutral-300 hover:text-neutral-900 dark:hover:text-white"
            )}
          >
            {isActive && (
              <motion.div
                layoutId="active-nav-indicator"
                className="absolute inset-0 z-[-1] rounded-full bg-white/20 shadow-[0_2px_8px_rgba(0,0,0,0.1)] backdrop-blur-md"
                transition={{ type: "spring", stiffness: 350, damping: 30 }}
              />
            )}
            {item.label}
          </Link>
        );
      })}
    </div>
  );
}
