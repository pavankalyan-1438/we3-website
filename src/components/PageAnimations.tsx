"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function PageAnimations() {
  useEffect(() => {
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTl
      .from("#word-build-container", { y: 60, opacity: 0, duration: 1, delay: 0.2 })
      .to(".outline-text", { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }, "-=0.6")
      .from("#word-deliver-container", { y: 60, opacity: 0, duration: 1 }, "-=0.8")
      .to(".hero-ctas", { y: 0, opacity: 1, duration: 0.8 }, "-=0.8");

    gsap.utils.toArray<HTMLElement>(".grid-3, .grid-2").forEach((grid) => {
      gsap.from(grid.children, {
        scrollTrigger: { trigger: grid, start: "top 85%" },
        y: 50,
        opacity: 0,
        duration: 0.8,
        stagger: 0.15,
        ease: "power2.out",
      });
    });

    gsap.utils.toArray<HTMLElement>(".case-study-card").forEach((card) => {
      gsap.from(card, {
        scrollTrigger: { trigger: card, start: "top 85%" },
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: "power2.out",
      });
    });

    const timeline = document.querySelector(".timeline-container");
    if (timeline) {
      ScrollTrigger.create({
        trigger: timeline,
        start: "top center",
        end: "bottom center",
        onUpdate: (self) => {
          gsap.to(".timeline-progress", {
            height: `${self.progress * 100}%`,
            duration: 0.1,
          });
          document.querySelectorAll(".timeline-item").forEach((item) => {
            const dot = item.querySelector(".timeline-dot");
            const rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight / 2) {
              dot?.classList.add("active");
            } else {
              dot?.classList.remove("active");
            }
          });
        },
      });
    }

    return () => {
      ScrollTrigger.getAll().forEach((t) => t.kill());
    };
  }, []);

  return null;
}
