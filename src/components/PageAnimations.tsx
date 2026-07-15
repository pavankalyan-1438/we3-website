"use client";

import { useEffect } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

gsap.registerPlugin(ScrollTrigger);

export function PageAnimations() {
  useEffect(() => {
    if (typeof window === "undefined") return;

    // --- Custom Magnetic Cursor ---
    const cursorDot = document.getElementById('cursor-dot');
    const cursorHalo = document.getElementById('cursor-halo');
    const cursorGlass = document.getElementById('cursor-glass');
    let mouseX = window.innerWidth / 2;
    let mouseY = window.innerHeight / 2;
    let isCursorInNav = false;

    const onMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      if (cursorDot) gsap.to(cursorDot, { x: mouseX, y: mouseY, duration: 0.1, ease: "power2.out" });
      if (cursorHalo) gsap.to(cursorHalo, { x: mouseX, y: mouseY, duration: 0.5, ease: "power2.out" });
      if (cursorGlass) gsap.to(cursorGlass, { x: mouseX, y: mouseY, duration: 0.15, ease: "power2.out" });
      document.documentElement.style.setProperty('--mouse-x', `${mouseX}px`);
      document.documentElement.style.setProperty('--mouse-y', `${mouseY}px`);
    };

    window.addEventListener('mousemove', onMouseMove);

    const magneticElements = document.querySelectorAll('.btn-magnetic');
    magneticElements.forEach(el => {
      const isMagnetic = !el.closest('.liquid-nav');
      el.addEventListener('mousemove', (e) => {
        const mouseEvent = e as MouseEvent;
        if(isMagnetic && window.innerWidth > 900) {
          const rect = el.getBoundingClientRect();
          const x = (mouseEvent.clientX - rect.left) - rect.width / 2;
          const y = (mouseEvent.clientY - rect.top) - rect.height / 2;
          gsap.to(el, { x: x * 0.3, y: y * 0.3, duration: 0.4, ease: "power2.out" });
        }
        if (!el.closest('.liquid-nav') && cursorGlass && cursorDot) {
          cursorGlass.style.width = '64px';
          cursorGlass.style.height = '64px';
          cursorDot.style.transform = 'translate(-50%, -50%) scale(0)';
        }
      });
      
      el.addEventListener('mouseleave', () => {
        if(isMagnetic && window.innerWidth > 900) {
          gsap.to(el, { x: 0, y: 0, duration: 0.6, ease: "elastic.out(1, 0.3)" });
        }
        if (!el.closest('.liquid-nav') && cursorGlass && cursorDot) {
          cursorGlass.style.width = '42px';
          cursorGlass.style.height = '42px';
          cursorDot.style.transform = 'translate(-50%, -50%) scale(1)';
        }
      });

      el.addEventListener('click', () => {
        if (!cursorGlass) return;
        const tempRipple = cursorGlass.cloneNode() as HTMLElement;
        tempRipple.style.position = 'fixed';
        tempRipple.style.left = `${mouseX}px`;
        tempRipple.style.top = `${mouseY}px`;
        tempRipple.style.borderColor = 'var(--accent-color)';
        document.body.appendChild(tempRipple);
        gsap.fromTo(tempRipple, 
          { scale: 1, opacity: 1 }, 
          { scale: 3, opacity: 0, duration: 0.6, ease: "power2.out", onComplete: () => tempRipple.remove() }
        );
      });
    });

    // --- VisionOS Nav Engine ---
    const navItems = document.querySelectorAll('#nav-container .nav-item');
    const indicator = document.querySelector('.nav-active-indicator') as HTMLElement;
    const navContainer = document.getElementById('nav-container');
    const liquidNav = document.querySelector('.liquid-nav');
    let isNavClicking = false;

    if (liquidNav) {
      liquidNav.addEventListener('mouseenter', () => {
        isCursorInNav = true;
        if (cursorHalo) gsap.to(cursorHalo, { opacity: 1, duration: 0.3, ease: "power2.out" });
        if (cursorDot) gsap.to(cursorDot, { opacity: 0, scale: 0, duration: 0.2, ease: "power2.out" });
      });
      liquidNav.addEventListener('mouseleave', () => {
        isCursorInNav = false;
        if (cursorHalo) gsap.to(cursorHalo, { opacity: 0, duration: 0.3, ease: "power2.out" });
        if (cursorDot) gsap.to(cursorDot, { opacity: 1, scale: 1, duration: 0.2, ease: "power2.out" });
      });
    }

    function updateIndicator(targetEl: Element | null, initial = false) {
      if (!targetEl || window.innerWidth <= 900 || !liquidNav || !indicator) return;
      const rect = targetEl.getBoundingClientRect();
      const navRect = liquidNav.getBoundingClientRect();
      const xPos = rect.left - navRect.left; 
      const yPos = rect.top - navRect.top; 
      
      if (initial) {
        gsap.set(indicator, { x: xPos, y: yPos, width: rect.width, height: rect.height });
      } else {
        gsap.killTweensOf(indicator);
        gsap.to(indicator, { x: xPos, y: yPos, width: rect.width, height: rect.height, duration: 0.5, ease: "elastic.out(1, 0.75)", force3D: true });
      }
      navItems.forEach(item => item.classList.remove('active'));
      targetEl.classList.add('active');
    }

    setTimeout(() => updateIndicator(document.querySelector('.nav-item.active'), true), 200);

    navItems.forEach(item => {
      item.addEventListener('mouseenter', () => {
        if (window.innerWidth > 900) {
          gsap.to(item, { scale: 1.04, filter: 'brightness(1.15) saturate(1.2)', duration: 0.3, ease: "power2.out", overwrite: "auto" });
        }
      });
      item.addEventListener('mouseleave', () => {
        if (window.innerWidth > 900) {
          gsap.to(item, { scale: 1, filter: 'brightness(1) saturate(1)', duration: 0.4, ease: "power2.out", overwrite: "auto" });
        }
      });
      item.addEventListener('click', (e) => {
        isNavClicking = true;
        updateIndicator(e.target as Element);
        setTimeout(() => isNavClicking = false, 800);
      });
    });

    const sections = document.querySelectorAll('section');
    let currentSectionId = '';
    const observerOptions = { root: null, rootMargin: '-50% 0px -50% 0px', threshold: 0 };
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          currentSectionId = entry.target.getAttribute('id') || '';
          if (!isNavClicking) {
            navItems.forEach(item => {
              if ((item as HTMLElement).dataset.target === currentSectionId && !item.classList.contains('active')) {
                updateIndicator(item);
              }
            });
          }
        }
      });
    }, observerOptions);

    sections.forEach(section => sectionObserver.observe(section));

    // --- 3D Tilt Cards ---
    const tiltCards = document.querySelectorAll('.tilt-card');
    tiltCards.forEach(card => {
      const htmlCard = card as HTMLElement;
      card.addEventListener('mousemove', (e) => {
        const mouseEvent = e as MouseEvent;
        if (window.innerWidth < 900) return; 
        const rect = htmlCard.getBoundingClientRect();
        const x = mouseEvent.clientX - rect.left; 
        const y = mouseEvent.clientY - rect.top;  
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        const rotateX = ((y - centerY) / centerY) * -3; 
        const rotateY = ((x - centerX) / centerX) * 3;
        
        htmlCard.style.setProperty('--mouse-x', `${x}px`);
        htmlCard.style.setProperty('--mouse-y', `${y}px`);
        
        const innerContent = card.querySelector('.card-content, .service-icon, .quote');
        if(innerContent) {
           gsap.to(innerContent, { x: rotateY * 1.5, y: -rotateX * 1.5, duration: 0.5, ease: "power2.out" });
        }
        gsap.to(card, { rotateX: rotateX, rotateY: rotateY, duration: 0.5, ease: "power2.out", transformPerspective: 1000 });
      });
      
      card.addEventListener('mouseleave', () => {
        const innerContent = card.querySelector('.card-content, .service-icon, .quote');
        if(innerContent) {
          gsap.to(innerContent, { x: 0, y: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
        }
        gsap.to(card, { rotateX: 0, rotateY: 0, duration: 1, ease: "elastic.out(1, 0.3)" });
      });
    });

    gsap.to('.glow-2', {
      yPercent: -20,
      ease: "none",
      scrollTrigger: { trigger: document.body, start: "top top", end: "bottom bottom", scrub: true }
    });

    // --- Hero Typography Animation ---
    const heroTl = gsap.timeline({ defaults: { ease: "power3.out" } });
    heroTl.from('#word-build-container', { y: 60, opacity: 0, duration: 1, delay: 0.2 })
          .to('.outline-text', { strokeDashoffset: 0, duration: 1.5, ease: "power2.inOut" }, "-=0.6")
          .from('#word-deliver-container', { y: 60, opacity: 0, duration: 1 }, "-=0.8")
          .to('.hero-ctas', { y: 0, opacity: 1, duration: 0.8 }, "-=0.8");

    gsap.utils.toArray('.grid-3, .grid-2').forEach(grid => {
      gsap.from((grid as HTMLElement).children, { scrollTrigger: { trigger: grid as HTMLElement, start: "top 85%" }, y: 50, opacity: 0, duration: 0.8, stagger: 0.15, ease: "power2.out" });
    });

    let mm = gsap.matchMedia();

    mm.add("(min-width: 768px)", () => {
      const wrapper = document.querySelector('.projects-scroll-wrapper');
      const track = document.querySelector('.projects-horizontal-track');
      const cards = gsap.utils.toArray('.case-study-card');
      
      if (wrapper && track && cards.length > 0) {
        const getScrollAmount = () => -(track.scrollWidth - window.innerWidth);
        
        const tween = gsap.to(track, {
          x: getScrollAmount,
          ease: "none"
        });

        ScrollTrigger.create({
          trigger: wrapper,
          start: "center center",
          end: () => `+=${track.scrollWidth - window.innerWidth}`,
          pin: true,
          pinSpacing: true,
          animation: tween,
          scrub: 1,
          invalidateOnRefresh: true
        });

        cards.forEach((card) => {
          const img = (card as HTMLElement).querySelector('.case-hero');
          if (img) {
            gsap.to(img, {
              backgroundPosition: `50% 100%`,
              ease: "none",
              scrollTrigger: {
                trigger: card as HTMLElement,
                containerAnimation: tween,
                start: "left right",
                end: "right left",
                scrub: true
              }
            });
          }

          const tl = gsap.timeline({
            scrollTrigger: {
              trigger: card as HTMLElement,
              containerAnimation: tween,
              start: "left right",
              end: "right left",
              scrub: true,
            }
          });
          
          tl.fromTo(card as HTMLElement, 
              { scale: 0.9, opacity: 0.75 }, 
              { scale: 1, opacity: 1, duration: 0.5, ease: "power1.inOut" }
            )
            .to(card as HTMLElement, { scale: 0.9, opacity: 0.75, duration: 0.5, ease: "power1.inOut" });

          // Mouse tracking for glass reflection
          const handleMouseMove = (e: Event) => {
            const mouseEvent = e as MouseEvent;
            const rect = (card as HTMLElement).getBoundingClientRect();
            const x = mouseEvent.clientX - rect.left;
            const y = mouseEvent.clientY - rect.top;
            (card as HTMLElement).style.setProperty('--x', `${x}px`);
            (card as HTMLElement).style.setProperty('--y', `${y}px`);
          };
          (card as HTMLElement).addEventListener('mousemove', handleMouseMove);
        });
      }
    });

    mm.add("(max-width: 767px)", () => {
      gsap.utils.toArray('.case-study-card').forEach(card => {
        gsap.from(card as HTMLElement, { scrollTrigger: { trigger: card as HTMLElement, start: "top 85%" }, y: 50, opacity: 0, duration: 0.8, ease: "power2.out" });
        const img = (card as HTMLElement).querySelector('.case-hero');
        if (img) {
          gsap.to(img, { backgroundPosition: `50% 100%`, ease: "none", scrollTrigger: { trigger: card as HTMLElement, start: "top bottom", end: "bottom top", scrub: true }});
        }
      });
    });

    if (document.querySelector(".timeline-container")) {
      ScrollTrigger.create({
        trigger: ".timeline-container",
        start: "top center",
        end: "bottom center",
        onUpdate: self => {
          gsap.to('.timeline-progress', { height: `${self.progress * 100}%`, duration: 0.1 });
          document.querySelectorAll('.timeline-item').forEach((item) => {
            const dot = item.querySelector('.timeline-dot');
            const rect = item.getBoundingClientRect();
            if (rect.top < window.innerHeight / 2) {
              dot?.classList.add('active');
            } else {
              dot?.classList.remove('active');
            }
          });
        }
      });
    }

    return () => {
      window.removeEventListener('mousemove', onMouseMove);
      sectionObserver.disconnect();
      ScrollTrigger.getAll().forEach(t => t.kill());
    };
  }, []);

  return null;
}
