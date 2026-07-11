export interface SpringConfig {
  stiffness: number;
  damping: number;
  mass: number;
}

export const PhysicsConfig = {
  springs: {
    default: { stiffness: 180, damping: 22, mass: 0.85 } satisfies SpringConfig,
    gentle: { stiffness: 120, damping: 28, mass: 1.1 } satisfies SpringConfig,
    snappy: { stiffness: 260, damping: 30, mass: 0.65 } satisfies SpringConfig,
    liquid: { stiffness: 145, damping: 16, mass: 1.25 } satisfies SpringConfig,
    highlight: { stiffness: 320, damping: 26, mass: 0.55 } satisfies SpringConfig,
    merge: { stiffness: 95, damping: 14, mass: 1.4 } satisfies SpringConfig,
  },

  scroll: {
    splitStart: 40,
    splitEnd: 280,
    compressStart: 20,
    compressMax: 0.18,
    velocityStretchFactor: 0.0008,
    maxVelocityStretch: 0.12,
  },

  projects: {
    detachThreshold: 0.35,
    expandScale: 1.08,
    travelSpring: { stiffness: 110, damping: 20, mass: 1.1 } satisfies SpringConfig,
  },

  glass: {
    borderRadius: 999,
    blur: 40,
    saturation: 1.85,
  },

  breakpoints: {
    tablet: 900,
    mobile: 640,
  },
} as const;

export type NavSectionId = "hero" | "about" | "services" | "projects" | "contact";

export const NAV_ITEMS: { id: NavSectionId; label: string; href: string }[] = [
  { id: "hero", label: "Home", href: "#hero" },
  { id: "about", label: "About", href: "#about" },
  { id: "services", label: "Services", href: "#services" },
  { id: "projects", label: "Projects", href: "#projects" },
];

export const CONTACT_CTA = {
  id: "contact" as NavSectionId,
  label: "Contact",
  href: "#contact",
};
