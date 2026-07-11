"use client";

import { useEffect, useState } from "react";
import Lenis from "lenis";
import { PhysicsConfig } from "@/lib/navigation/PhysicsConfig";
import {
  clamp,
  getAnimationController,
  smoothstep,
  SpringValue,
} from "@/lib/navigation/AnimationController";

export interface ScrollState {
  scrollY: number;
  velocity: number;
  splitProgress: number;
  compressAmount: number;
  velocityStretch: number;
}

const defaultState: ScrollState = {
  scrollY: 0,
  velocity: 0,
  splitProgress: 0,
  compressAmount: 0,
  velocityStretch: 0,
};

export function useScrollController() {
  const [state, setState] = useState<ScrollState>(defaultState);
  const [prefersReducedMotion, setPrefersReducedMotion] = useState(false);

  useEffect(() => {
    const media = window.matchMedia("(prefers-reduced-motion: reduce)");
    const updateMotion = () => setPrefersReducedMotion(media.matches);
    updateMotion();
    media.addEventListener("change", updateMotion);

    const reduced = media.matches;

    const lenis = new Lenis({
      duration: reduced ? 0.6 : 1.15,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: !reduced,
      touchMultiplier: 1.4,
    });

    const splitSpring = new SpringValue(0);
    const compressSpring = new SpringValue(0);
    const velocitySpring = new SpringValue(0);

    let lastScrollY = 0;

    lenis.on("scroll", ({ scroll, velocity }) => {
      lastScrollY = scroll;

      const {
        splitStart,
        splitEnd,
        compressStart,
        compressMax,
        velocityStretchFactor,
        maxVelocityStretch,
      } = PhysicsConfig.scroll;

      const rawSplit = smoothstep(splitStart, splitEnd, scroll);
      splitSpring.setTarget(reduced ? (scroll > 120 ? 1 : 0) : rawSplit);

      const rawCompress = clamp((scroll - compressStart) / 180, 0, compressMax);
      compressSpring.setTarget(rawCompress);

      const velStretch = clamp(
        Math.abs(velocity) * velocityStretchFactor,
        0,
        maxVelocityStretch,
      );
      velocitySpring.setTarget(velStretch);
    });

    const controller = getAnimationController();
    const unsubscribe = controller.subscribe((deltaMs) => {
      splitSpring.step(PhysicsConfig.springs.liquid, deltaMs);
      compressSpring.step(PhysicsConfig.springs.gentle, deltaMs);
      velocitySpring.step(PhysicsConfig.springs.snappy, deltaMs);

      setState({
        scrollY: lastScrollY,
        velocity: lenis.velocity,
        splitProgress: splitSpring.current,
        compressAmount: compressSpring.current,
        velocityStretch: velocitySpring.current,
      });
    });

    function raf(time: number) {
      lenis.raf(time);
      requestAnimationFrame(raf);
    }

    const rafId = requestAnimationFrame(raf);

    return () => {
      cancelAnimationFrame(rafId);
      unsubscribe();
      lenis.destroy();
      media.removeEventListener("change", updateMotion);
    };
  }, []);

  return { ...state, prefersReducedMotion };
}
